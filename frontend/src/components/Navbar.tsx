import { Link, useLocation } from "react-router-dom";
import { Train, Info, Search } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path
      ? "text-blue-400 bg-blue-500/10 border-blue-500/30"
      : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border-transparent";
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0d111c]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all duration-300">
                <Train className="h-5 w-5 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                  Marg-Manthan
                </span>
                <span className="text-[10px] text-blue-400 font-medium tracking-widest uppercase -mt-1">
                  Indian Railways Router
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${isActive(
                "/"
              )}`}
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </Link>
            <Link
              to="/about"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${isActive(
                "/about"
              )}`}
            >
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">About</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
