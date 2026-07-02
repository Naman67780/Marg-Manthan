import { Train } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#080b12] py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2 text-gray-500">
            <Train className="h-5 w-5 text-blue-500/50" />
            <span className="text-sm font-semibold tracking-wider uppercase text-gray-400">
              Marg-Manthan
            </span>
          </div>
          <p className="text-xs text-gray-500 max-w-md">
            An intelligent route search and planning engine for the Indian Railways network. Finds direct and connecting journeys using optimized graph pathfinding.
          </p>
          <p className="text-[11px] text-gray-600 mt-2">
            &copy; {new Date().getFullYear()} Marg-Manthan. Developed for high-performance transit routing.
          </p>
        </div>
      </div>
    </footer>
  );
}
