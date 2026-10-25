import { RefreshCw, Gem } from "lucide-react";

function Header({ onRefresh, loading, updatedAt }) {
  return (
    <header className="sticky top-0 z-20 -mx-4 mb-6 border-b border-amber-100 bg-white/80 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-yellow-600 text-white shadow-lg shadow-amber-500/30">
            <Gem size={20} />
          </div>

          <div className="min-w-0">
            <h1 className="truncate bg-gradient-to-r from-[#E6B422] via-[#B8860B] to-[#7A5200] bg-clip-text text-lg font-extrabold tracking-tight text-transparent sm:text-xl">
              Gold & Silver
            </h1>
            <p className="truncate text-xs text-stone-500 sm:text-sm">
              India market tracker
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {updatedAt && (
            <p className="hidden text-xs text-stone-500 md:block">
              Updated {updatedAt}
            </p>
          )}

          <button
            onClick={onRefresh}
            disabled={loading}
            aria-label="Refresh prices"
            className="group flex items-center gap-2 rounded-xl bg-stone-900 px-3 py-2 text-sm font-medium text-amber-300 shadow-sm transition hover:bg-stone-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
          >
            <RefreshCw
              size={16}
              className={
                loading ? "animate-spin" : "transition group-hover:rotate-90"
              }
            />
            <span className="hidden sm:inline">
              {loading ? "Loading..." : "Refresh"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
