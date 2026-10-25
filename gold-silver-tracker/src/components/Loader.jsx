import { Gem } from "lucide-react";

function Loader({ message = "Fetching live prices" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFFCF5] px-6"
    >
      <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-amber-200/60 blur-3xl sm:h-96 sm:w-96" />

      <div className="relative flex h-24 w-24 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-4 border-amber-100" />
        <span className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-amber-500 border-r-yellow-600" />

        <span className="flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-yellow-600 text-white shadow-lg shadow-amber-500/40">
          <Gem size={26} />
        </span>
      </div>

      <h2 className="relative mt-8 bg-gradient-to-r from-[#E6B422] via-[#B8860B] to-[#7A5200] bg-clip-text text-xl font-extrabold tracking-tight text-transparent sm:text-2xl">
        Gold & Silver
      </h2>

      <p className="relative mt-2 flex items-center gap-1 text-sm text-stone-500">
        {message}
        <span className="inline-flex gap-0.5">
          <span className="h-1 w-1 animate-bounce rounded-full bg-amber-500" />
          <span className="h-1 w-1 animate-bounce rounded-full bg-amber-500 [animation-delay:150ms]" />
          <span className="h-1 w-1 animate-bounce rounded-full bg-amber-500 [animation-delay:300ms]" />
        </span>
      </p>

      <span className="sr-only">Loading</span>
    </div>
  );
}

export default Loader;
