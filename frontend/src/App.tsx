import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Results from "./pages/Results";
import TrainDetails from "./pages/TrainDetails";
import StationDetails from "./pages/StationDetails";
import About from "./pages/About";

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-[#0d111c] text-[#f3f4f6]">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-start">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/train/:trainNo" element={<TrainDetails />} />
            <Route path="/station/:stationCode" element={<StationDetails />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
