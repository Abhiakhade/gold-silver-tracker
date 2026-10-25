function PriceCard({
  title,
  subtitle,
  price,
  icon,
  loading = false,
  featured = false,
  accent = "gold",
}) {
  const isSilver = accent === "silver";

  const container = featured
    ? "border-amber-300 bg-gradient-to-br from-amber-100 via-amber-50 to-white shadow-lg shadow-amber-500/10"
    : isSilver
      ? "border-stone-200 bg-gradient-to-br from-stone-100 to-white hover:border-stone-300"
      : "border-amber-100 bg-white hover:border-amber-300";

  const iconStyle = isSilver
    ? "bg-stone-200 text-stone-600"
    : "bg-amber-100 text-amber-700";

  const priceStyle = isSilver
    ? "from-stone-700 to-stone-500"
    : "from-[#D4A017] via-[#B8860B] to-[#7A5200]";

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/10 sm:p-6 ${container}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-stone-700 sm:text-base">
          {title}
        </h3>

        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconStyle}`}
        >
          {icon}
        </span>
      </div>

      {loading ? (
        <div className="mt-6 h-9 w-3/4 animate-pulse rounded-lg bg-stone-200" />
      ) : (
        <p
          className={`mt-6 bg-gradient-to-r bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl ${priceStyle}`}
        >
          {price}
        </p>
      )}

      <p className="mt-2 text-xs text-stone-500 sm:text-sm">{subtitle}</p>

      {featured && (
        <span className="absolute bottom-0 right-0 h-24 w-24 translate-x-8 translate-y-8 rounded-full bg-amber-300/40 blur-2xl" />
      )}
    </div>
  );
}

export default PriceCard;
