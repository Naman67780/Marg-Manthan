import { Cpu, Network, Database, Zap } from "lucide-react";

export default function About() {
  return (
    <div className="mx-auto max-w-4xl py-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent">
          About Marg-Manthan
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
          Intelligent railway route planning and pathfinding engine built for the massive Indian Railways network.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Zap className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white">⚡ Sub-50ms Routing</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            By indexing the railway schedules into high-speed memory graphs, our routing algorithm calculates connecting routes across 8,000+ stations in milliseconds.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
          <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Network className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white">🔗 Smart Connection Logic</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Modified Dijkstra algorithm optimizes search across multiple trains, calculating wait times, avoiding overnight bottlenecks, and minimizing transfer penalties.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Database className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white">🗄️ Hybrid Fullstack</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Utilizes Express Gateway for metadata query caching, PostgreSQL for static timetables, and FastAPI for real-time NetworkX path calculations.
          </p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-white/5 mb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Cpu className="h-5 w-5 text-blue-400" />
          Algorithm & Data Pipeline
        </h2>
        <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
          <p>
            The timetable dataset consists of over 186,000 station stops. During the preprocessing phase, stations are cleaned, names normalized (e.g. merging spelling variants like <code className="text-blue-400">C.S.T.</code> and <code className="text-blue-400">CST</code>), and trains mapped into sequential nodes.
          </p>
          <p>
            Instead of standard hop-by-hop traversal which treats every stop as a train change, Marg-Manthan models connections on <strong>train segments</strong>. This ensures that riding a train for multiple stops registers as 0 transfers, and transfer calculations occur only when the passenger exits one train and boards another at a shared station.
          </p>
        </div>
      </div>
    </div>
  );
}
