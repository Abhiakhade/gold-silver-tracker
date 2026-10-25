require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

// Restrict CORS in production via CLIENT_ORIGIN (comma-separated for several).
// If not set, all origins are allowed (fine for local development).
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim())
  : null;

app.use(cors(allowedOrigins ? { origin: allowedOrigins } : undefined));
app.use(express.json());

// ---------- goldprice.dev client ----------
// A free key (https://goldprice.dev/onboarding) gives you your own quota:
// 5,000 calls/month at 10 req/min. Anonymous use is capped at 100 req/hour per IP.
const GOLD_API_KEY = process.env.GOLD_API_KEY;

const goldApi = axios.create({
  headers: GOLD_API_KEY ? { Authorization: `Bearer ${GOLD_API_KEY}` } : {},
});

if (!GOLD_API_KEY) {
  console.warn(
    "GOLD_API_KEY is not set - using anonymous limits (100 requests/hour per IP).",
  );
}

// ---------- Tiny in-memory cache ----------
const cache = new Map();

// Serves fresh cache within ttlMs. If the upstream call fails (e.g. a 429),
// falls back to the last good value so the UI keeps showing data.
async function cached(key, ttlMs, fetcher) {
  const hit = cache.get(key);

  if (hit && Date.now() - hit.time < ttlMs) {
    return hit.value;
  }

  try {
    const value = await fetcher();
    cache.set(key, { value, time: Date.now() });
    return value;
  } catch (error) {
    if (hit) {
      console.warn(`Serving stale cache for "${key}":`, error.message);
      return hit.value;
    }
    throw error;
  }
}

const PRICES_TTL = 60 * 1000; // 1 minute
const HISTORY_TTL = 5 * 60 * 1000; // 5 minutes

// ---------- Routes ----------
app.get("/", (req, res) => {
  res.send("Gold & Silver API is running");
});

app.get("/api/prices", async (req, res) => {
  try {
    const data = await cached("prices", PRICES_TTL, async () => {
      // allSettled: one failing upstream call should not hide the other metal
      const [goldResult, silverResult] = await Promise.allSettled([
        goldApi.get("https://api.goldprice.dev/v1/carat", {
          params: { currency: "INR" },
          timeout: 10000,
        }),
        goldApi.get("https://api.goldprice.dev/v1/convert", {
          params: { from: "XAG", to: "INR", amount: 1, unit: "gram" },
          timeout: 10000,
        }),
      ]);

      const describe = (reason) => ({
        message: reason.message,
        status: reason.response?.status,
        data: reason.response?.data,
      });

      if (goldResult.status === "rejected") {
        console.error("Gold API error:", describe(goldResult.reason));
      }
      if (silverResult.status === "rejected") {
        console.error("Silver API error:", describe(silverResult.reason));
      }

      if (
        goldResult.status === "rejected" &&
        silverResult.status === "rejected"
      ) {
        const err = new Error("Both price requests failed");
        err.detail = {
          gold: describe(goldResult.reason),
          silver: describe(silverResult.reason),
        };
        throw err;
      }

      return {
        gold: goldResult.status === "fulfilled" ? goldResult.value.data : null,
        silver:
          silverResult.status === "fulfilled" ? silverResult.value.data : null,
        source: "goldprice.dev",
      };
    });

    res.json(data);
  } catch (error) {
    console.error("Price API error:", error.response?.data || error.message);

    res.status(502).json({
      message: "Unable to fetch metal prices. Please try again later.",
      detail: error.detail,
    });
  }
});

app.get("/api/history/gold", async (req, res) => {
  try {
    const data = await cached("history-gold", HISTORY_TTL, async () => {
      const toDate = new Date();
      const fromDate = new Date(toDate);
      // Ask for extra days: today's bar is usually still open and gets
      // filtered out, so we trim back down to the latest 7 closed bars below.
      fromDate.setUTCDate(fromDate.getUTCDate() - 8);

      const formatDate = (date) => date.toISOString().slice(0, 10);

      const [historyResponse, fxResponse] = await Promise.all([
        goldApi.get("https://api.goldprice.dev/v1/bars", {
          params: {
            symbol: "XAU-USD-SPOT",
            interval: "1d",
            from: formatDate(fromDate),
            to: formatDate(toDate),
            limit: 9,
          },
          timeout: 15000,
        }),
        goldApi.get("https://api.goldprice.dev/v1/convert", {
          params: { from: "USD", to: "INR", amount: 1 },
          timeout: 10000,
        }),
      ]);

      const exchangeRate = Number(fxResponse.data.result);
      const bars = historyResponse.data.bars || [];

      const history = bars
        .filter((bar) => bar.close != null && bar.is_closed !== false)
        .map((bar) => {
          const price24K = (Number(bar.close) * exchangeRate) / 31.1034768;

          return {
            date: bar.bar_start.slice(0, 10),
            gold24K: Number(price24K.toFixed(2)),
            gold22K: Number(((price24K * 22) / 24).toFixed(2)),
            gold18K: Number(((price24K * 18) / 24).toFixed(2)),
          };
        })
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-7);

      return {
        source: "goldprice.dev",
        currency: "INR",
        unit: "per gram",
        history,
      };
    });

    res.json(data);
  } catch (error) {
    console.error("History API error:", error.response?.data || error.message);

    res.status(502).json({
      message: "Unable to fetch historical gold prices",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
