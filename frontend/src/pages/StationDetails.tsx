import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Train, Network, ArrowRight, Loader2, AlertCircle } from "lucide-react";

interface PassingTrain {
  train_no: number;
  train_name: string;
  seq: number;
  arrival_time: string;
  departure_time: string;
  source_station: string;
  destination_station: string;
}

interface StationConnection {
  train_no: number;
  train_name: string;
  from_station: string;
  to_station: string;
  departure_time: string;
  arrival_time: string;
  distance: number;
  travel_time: number;
}

interface StationData {
  station_code: string;
  station_name: string;
  trains_count: number;
  trains: PassingTrain[];
  connected_stations: number;
  connections: StationConnection[];
}

export default function StationDetails() {
  const { stationCode } = useParams<{ stationCode: string }>();
  const [data, setData] = useState<StationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStationDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:3000/station/${stationCode}`);
        setData(response.data);
      } catch (err: any) {
        console.error("Error fetching station details:", err);
        setError(err.response?.data?.error || "Failed to load station details.");
      } finally {
        setLoading(false);
      }
    };

    if (stationCode) {
      fetchStationDetails();
    }
  }, [stationCode]);

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-sm text-gray-400">Loading station information...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-panel mx-auto max-w-md p-8 rounded-2xl border border-red-500/10 text-center flex flex-col items-center gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h3 className="text-lg font-bold text-white">Error Loading Station</h3>
        <p className="text-sm text-gray-400">{error || "Station not found."}</p>
        <Link
          to="/"
          className="mt-2 inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all duration-200"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold tracking-wider uppercase mb-1">
            <span>Station Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            {data.station_name}
            <span className="rounded-lg bg-blue-500/10 px-2.5 py-1 text-sm font-semibold text-blue-400 border border-blue-500/20">
              {data.station_code}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="block text-2xl font-bold text-white">{data.trains_count}</span>
            <span className="text-xs text-gray-400 font-medium">Passing Trains</span>
          </div>
          <div className="h-8 w-px bg-white/10"></div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-white">{data.connected_stations}</span>
            <span className="text-xs text-gray-400 font-medium">Graph Connections</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Passing Trains List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Train className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Passing Trains Schedule</h2>
          </div>

          <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-white/5 text-xs text-gray-300 font-semibold uppercase tracking-wider border-b border-white/5">
                  <tr>
                    <th className="px-6 py-3">Train</th>
                    <th className="px-6 py-3 text-center">Stop Seq</th>
                    <th className="px-6 py-3">Arrival</th>
                    <th className="px-6 py-3">Departure</th>
                    <th className="px-6 py-3 text-right">Route</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.trains.map((train) => (
                    <tr key={train.train_no} className="hover:bg-white/2 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">
                        <Link to={`/train/${train.train_no}`} className="hover:text-blue-400 transition-colors">
                          <span className="block text-xs font-semibold text-blue-400 mb-0.5">#{train.train_no}</span>
                          {train.train_name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-center">{train.seq}</td>
                      <td className="px-6 py-4">{train.arrival_time === "00:00:00" ? "Source" : train.arrival_time.substring(0, 5)}</td>
                      <td className="px-6 py-4">{train.departure_time === "00:00:00" ? "Terminus" : train.departure_time.substring(0, 5)}</td>
                      <td className="px-6 py-4 text-right text-xs text-gray-500 max-w-[160px] truncate">
                        {train.source_station} &rarr; {train.destination_station}
                      </td>
                    </tr>
                  ))}
                  {data.trains.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No passing trains found for this station.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Network Adjacency / Connected Stations */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Network className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Direct Connections</h2>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <p className="text-xs text-gray-400 leading-relaxed">
              These are the next immediate station connections in the railway network graph reachable directly without switching trains.
            </p>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {data.connections.map((conn, idx) => (
                <div
                  key={`${conn.train_no}-${idx}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/2 hover:bg-white/5 border border-white/5 transition-all group"
                >
                  <div className="min-w-0">
                    <span className="block text-[10px] text-indigo-400 font-semibold mb-0.5">VIA TRAIN #{conn.train_no}</span>
                    <Link to={`/station/${conn.to_station}`} className="flex items-center gap-1 text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                      {conn.to_station}
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0" />
                    </Link>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-semibold text-white">{conn.distance} km</span>
                    <span className="block text-[10px] text-gray-500 font-medium">{(conn.travel_time / 60).toFixed(1)} hrs</span>
                  </div>
                </div>
              ))}
              {data.connections.length === 0 && (
                <div className="text-center py-12 text-gray-500 text-sm">
                  No outgoing direct station connections.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
