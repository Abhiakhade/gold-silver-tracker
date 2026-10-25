import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "What is the gold rate today in India?",
    a: "The gold rate today in India is shown at the top of this page in Indian rupees per gram for 24K, 22K and 18K gold. The rates are based on the live international spot price converted to INR, and you can refresh them at any time.",
  },
  {
    q: "What is the difference between 24K, 22K and 18K gold?",
    a: "24K gold is about 99.9% pure and is used for coins and bars. 22K gold is about 91.6% pure and is the most common choice for jewellery in India. 18K gold is 75% pure and is often used for diamond and designer jewellery because it is stronger.",
  },
  {
    q: "How do I calculate the price of gold for my weight?",
    a: "Use the price calculator on this page. Choose 24K, 22K, 18K gold or silver, enter the number of grams, and it multiplies your weight by today's rate per gram. Making charges and GST are not included.",
  },
  {
    q: "Why is my jeweller's gold price different from this rate?",
    a: "Jewellers add making charges, GST and their own margin, and local rates can differ from the international spot price. Treat this page as a reference rate and always confirm the final price with your jeweller.",
  },
  {
    q: "What is the silver price today per gram?",
    a: "The current silver price per gram in rupees is shown in the Silver card at the top of the page. You can also use the calculator to find the value of any weight of silver.",
  },
  {
    q: "Where do these gold and silver prices come from?",
    a: "Prices come from goldprice.dev, which provides spot gold and silver data. Historical prices are daily closing spot prices converted to INR, so they may differ slightly from retail rates.",
  },
];

const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

function SeoContent() {
  return (
    <section
      aria-labelledby="seo-heading"
      className="rounded-3xl border border-amber-200/70 bg-white p-5 shadow-xl shadow-amber-900/5 sm:p-7"
    >
      <script type="application/ld+json">{JSON.stringify(schema)}</script>

      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
        Gold &amp; silver guide
      </p>

      <h2
        id="seo-heading"
        className="mt-2 bg-gradient-to-r from-[#E6B422] via-[#B8860B] to-[#7A5200] bg-clip-text text-xl font-extrabold text-transparent sm:text-2xl"
      >
        Gold Rate Today in India
      </h2>

      <p className="mt-3 text-sm leading-6 text-stone-600">
        Track the live gold price in India per gram for 24K, 22K and 18K gold,
        along with today&apos;s silver rate. Use the gold price calculator to
        estimate the value of your gold or silver by weight, and check the 7-day
        gold price history to see how rates have moved.
      </p>

      <div className="mt-5 divide-y divide-amber-100 rounded-2xl border border-amber-100">
        {FAQS.map((item) => (
          <details key={item.q} className="group px-4 py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-stone-800 [&::-webkit-details-marker]:hidden">
              {item.q}
              <ChevronDown
                size={18}
                className="shrink-0 text-amber-600 transition group-open:rotate-180"
              />
            </summary>

            <p className="mt-2 text-sm leading-6 text-stone-600">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export default SeoContent;
