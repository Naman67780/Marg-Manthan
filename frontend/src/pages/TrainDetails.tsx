import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Clock, Loader2, AlertCircle } from "lucide-react";

interface RouteSegment {
  seq: number;
  station_code: string;
  station_name: string;
  arrival_time: string;
  departure_time: string;
  distance: number;
}

interface TrainData {
  train_no: number;
  train_name: string;
  source_station: string;
  source_station_name: string;
  destination_station: string;
  destination_station_name: string;
  total_stations: number;
  route_segments: RouteSegment[];
}

export default function TrainDetails() {
  const { trainNo } = useParams<{ trainNo: string }>();
  const [data, setData] = useState<TrainData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrainDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:3000/train/${trainNo}`);
        setData(response.data);
      } catch (err: any) {
        console.error("Error fetching train details:", err);
        setError(err.response?.data?.error || "Failed to load train details.");
      } finally {
        setLoading(false);
      }
    };

    if (trainNo) {
      fetchTrainDetails();
    }
  }, [trainNo]);

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-sm text-gray-400">Loading train schedule...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-panel mx-auto max-w-md p-8 rounded-2xl border border-red-500/10 text-center flex flex-col items-center gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h3 className="text-lg font-bold text-white">Error Loading Train</h3>
        <p className="text-sm text-gray-400">{error || "Train timetable not found."}</p>
        <Link
          to="/"
          className="mt-2 inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all duration-200"
        >
          Return Home
        </Link>
      </div>
    );
  }

  // Calculate total travel distance
  const lastSegment = data.route_segments[data.route_segments.length - 1];
  const totalDistance = lastSegment ? lastSegment.distance : 0;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header Info Panel */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-blue-500/5 blur-3xl -translate-y-12 translate-x-12"></div>
        
        <div className="relative space-y-4">
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/10 mb-2">
              Train Timetable
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {data.train_name}
            </h1>
            <p className="text-sm font-bold text-blue-500 mt-1">Train #{data.train_no}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-t border-white/5">
            <div>
              <span className="block text-xs text-gray-500 font-medium">Source</span>
              <Link to={`/station/${data.source_station}`} className="text-sm font-bold text-white hover:text-blue-400 transition-colors">
                {data.source_station_name} ({data.source_station})
              </Link>
            </div>
            <div>
              <span className="block text-xs text-gray-500 font-medium">Destination</span>
              <Link to={`/station/${data.destination_station}`} className="text-sm font-bold text-white hover:text-blue-400 transition-colors">
                {data.destination_station_name} ({data.destination_station})
              </Link>
            </div>
            <div>
              <span className="block text-xs text-gray-500 font-medium">Stops Count</span>
              <span className="text-sm font-bold text-white">{data.total_stations} Stations</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 font-medium">Total Distance</span>
              <span className="text-sm font-bold text-white">{totalDistance} km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline view */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white px-2">Station Stops Sequence</h2>

        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 relative">
          <div className="absolute top-8 bottom-8 left-[23px] sm:left-[35px] w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 opacity-20"></div>

          <div className="space-y-8 relative">
            {data.route_segments.map((stop, idx) => {
              const isSource = idx === 0;
              const isTerminus = idx === data.route_segments.length - 1;

              return (
                <div key={stop.seq} className="flex items-start gap-4 sm:gap-8 group">
                  {/* Stop Marker */}
                  <div className="relative flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border bg-[#0d111c]/90 group-hover:scale-105 transition-all duration-300 z-10
                    ${isSource ? 'border-green-500/30 text-green-400 shadow-md shadow-green-500/5' : 
                      isTerminus ? 'border-red-500/30 text-red-400 shadow-md shadow-red-500/5' : 
                      'border-white/5 text-gray-400 group-hover:border-blue-500/30 group-hover:text-blue-400'}"
                  >
                    <span className="text-xs sm:text-sm font-black tracking-tight">{stop.seq}</span>
                  </div>

                  {/* Stop Info Details */}
                  <div className="flex-1 min-w-0 pt-1.5 sm:pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <Link
                        to={`/station/${stop.station_code}`}
                        className="text-base font-extrabold text-white hover:text-blue-400 transition-colors flex items-center gap-2 group-hover:translate-x-1 transition-transform"
                      >
                        {stop.station_name}
                        <span className="text-xs font-bold text-gray-500 bg-white/5 border border-white/5 px-1.5 py-0.5 rounded-md">
                          {stop.station_code}
                        </span>
                      </Link>
                      <span className="block text-xs text-gray-500 font-medium mt-0.5">{stop.distance} km from source</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>
                          {isSource ? "Starts at" : stop.arrival_time === "00:00:00" ? "Source" : stop.arrival_time.substring(0, 5)}
                        </span>
                      </div>
                      <div className="h-3 w-px bg-white/10"></div>
                      <div>
                        <span>
                          {isTerminus ? "Ends" : stop.departure_time === "00:00:00" ? "Terminus" : `Departs ${stop.departure_time.substring(0, 5)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
