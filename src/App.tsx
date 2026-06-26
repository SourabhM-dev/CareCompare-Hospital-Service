/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { Hospital, Appointment, SearchFilters, ServicePrice } from "./types";
import { MOCK_HOSPITALS, SERVICE_ALIASES, ALL_PROCEDURES, calculateDistance } from "./data";
import InteractiveMap from "./components/InteractiveMap";
import MLWaitPredictor from "./components/MLWaitPredictor";
import PricingInsights from "./components/PricingInsights";
import PaymentWizard from "./components/PaymentWizard";
import { 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  Filter, 
  Sparkles, 
  ListRestart, 
  Stethoscope, 
  Flame, 
  Compass, 
  Building2, 
  Calendar,
  AlertCircle,
  Copy,
  Receipt,
  HeartPulse,
  ChevronRight,
  TrendingDown,
  Phone,
  BookmarkCheck,
  CheckCircle2,
  HelpCircle
} from "lucide-react";

export default function App() {
  // Application State
  const [userLocation, setUserLocation] = useState({ lat: 28.6139, lon: 77.2090 }); // Default CP Delhi
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>("hosp-01");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("MRI Brain Contrast"); // default active test
  
  // Filtering and Sorting state
  const [maxDistance, setMaxDistance] = useState<number>(10); // in km
  const [maxPrice, setMaxPrice] = useState<number>(15000); // in ₹
  const [sortBy, setSortBy] = useState<"price" | "distance" | "rating">("price");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "Radiology" | "Pathology" | "Cardiology">("all");
  const [selectedTier, setSelectedTier] = useState<"all" | "Premium" | "General" | "Charity / Budget">("all");

  const [bookingService, setBookingService] = useState<{ hospital: Hospital; service: ServicePrice } | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quick recommend procedures for instant button search
  const quickTestFilters = [
    { name: "MRI Brain", query: "MRI Brain Contrast" },
    { name: "Chest X-Ray", query: "X-Ray Chest PA View" },
    { name: "CT Scan", query: "CT Scan Abdomen" },
    { name: "Complete Blood Count", query: "Complete Blood Count (CBC)" },
    { name: "Lipids Profile", query: "Blood Lipids Profile" },
    { name: "Thyroid TSH", query: "Thyroid Stimulating Hormone (TSH)" },
    { name: "ECG Cardiac", query: "ECG Cardiac Test" },
  ];

  // Map alias search inputs (e.g. "MRI near me" -> "MRI Brain Contrast")
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryLower = searchQuery.toLowerCase().trim();
    if (!queryLower) return;

    // Check aliases first
    let matchedTest = "MRI Brain Contrast"; // fallback
    let found = false;

    for (const [alias, matchData] of Object.entries(SERVICE_ALIASES)) {
      if (queryLower.includes(alias)) {
        matchedTest = matchData.serviceName;
        found = true;
        break;
      }
    }

    if (!found) {
      // Find direct matches in active procedures list
      const directMatch = ALL_PROCEDURES.find((proc) => 
        proc.name.toLowerCase().includes(queryLower) ||
        proc.category.toLowerCase().includes(queryLower)
      );
      if (directMatch) {
        matchedTest = directMatch.name;
      } else {
        matchedTest = ALL_PROCEDURES[0].name; // fallback
      }
    }

    setActiveSearchTerm(matchedTest);
  };

  const handleRecommendSelect = (term: string) => {
    setActiveSearchTerm(term);
    setSearchQuery(term);
  };

  // Filter and Sort Hospitals
  const processedHospitalsList = useMemo(() => {
    return MOCK_HOSPITALS.map((hosp) => {
      // Find the price record matching the searched diagnostic test
      const testPriceRecord = hosp.services.find(
        (s) => s.name.toLowerCase() === activeSearchTerm.toLowerCase()
      );

      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lon,
        hosp.latitude,
        hosp.longitude
      );

      return {
        ...hosp,
        activeService: testPriceRecord,
        distanceCalculated: distance,
      };
    })
    .filter((hosp) => {
      // Guard active service presence
      if (!hosp.activeService) return false;

      // Price limit checking
      if (hosp.activeService.price > maxPrice) return false;

      // Range distance checking
      if (hosp.distanceCalculated > maxDistance) return false;

      // Tier check
      if (selectedTier !== "all" && hosp.tier !== selectedTier) return false;

      // Category check
      if (selectedCategory !== "all" && hosp.activeService.category !== selectedCategory) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price") {
        return (a.activeService?.price || 0) - (b.activeService?.price || 0);
      }
      if (sortBy === "distance") {
        return a.distanceCalculated - b.distanceCalculated;
      }
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      return 0;
    });
  }, [userLocation, activeSearchTerm, maxDistance, maxPrice, sortBy, selectedTier, selectedCategory]);

  const selectedHospital = useMemo(() => {
    return MOCK_HOSPITALS.find((h) => h.id === selectedHospitalId) || MOCK_HOSPITALS[0];
  }, [selectedHospitalId]);

  const handleBookingSuccess = (newApp: Appointment) => {
    setAppointments((prev) => [newApp, ...prev]);
    setBookingService(null);
    // Auto scroll down to appointments panel
    setTimeout(() => {
      const element = document.getElementById("appointments-ledger");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const triggerCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Calculations for total savings in filtered set (demonstrating dynamic metric card)
  const statsOverview = useMemo(() => {
    let count = processedHospitalsList.length;
    if (count === 0) return { count: 0, bestPrice: 0, maxPotentialSavings: 0, avgPrice: 0 };

    const prices = processedHospitalsList.map(h => h.activeService?.price || 0);
    const bestPrice = Math.min(...prices);
    const sum = prices.reduce((acc, p) => acc + p, 0);
    const avgPrice = Math.round(sum / count);

    // Dynamic market savings
    const marketAverage = processedHospitalsList[0]?.activeService?.avgMarketPrice || 1000;
    const maxPotentialSavings = Math.max(0, marketAverage - bestPrice);

    return {
      count,
      bestPrice,
      maxPotentialSavings,
      avgPrice,
    };
  }, [processedHospitalsList]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* 🚀 Sticky Sleek Header Branding with India Healthcare badge */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-200/80 z-30 px-4 py-3 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md">
              <Stethoscope className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-display font-black text-slate-800 tracking-tight leading-none">
                  CareCompare
                </h1>
                <span className="text-[10px] bg-indigo-150 text-indigo-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  Delhi-NCR
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-none">
                Interactive medical pricing aggregative index & triage queue manager.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-lg p-1">
            <div className="bg-white px-2.5 py-1 rounded shadow-xs text-[11px] font-mono font-medium text-slate-700 flex items-center gap-1.5 shrink-0">
              <MapPin className="h-3.5 w-3.5 text-indigo-600" />
              Latitude: {userLocation.lat.toFixed(4)}
            </div>
            <div className="text-[11px] text-slate-500 pr-2 hidden sm:block font-medium">
              Click map to change GPS
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* 🏥 Aggregative Search Hero Container with background medical pattern */}
        <section className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl">
            <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Flame className="h-4 w-4 animate-bounce text-amber-500" />
              Information Transparency for Fair Healthcare
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight mt-1">
              Compare Hospital Prices Instantly
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Did you know? Prices for diagnostic procedures can fluctuate by <span className="text-amber-300 font-bold">250%</span> between facilities in the same block. Find high-quality tests below.
            </p>

            {/* Smart search input box with direct execution */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2.5 mt-6 relative">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter diagnostic query: e.g. 'MRI Brain Contrast', 'X-ray', 'Blood test'..."
                  className="w-full text-slate-800 pl-11 pr-4 py-4 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/50 bg-white font-medium"
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 sm:px-8 rounded-xl text-sm transition hover:scale-102 cursor-pointer shadow-md"
              >
                Find Prices
              </button>
            </form>

            {/* Recommendation Pills */}
            <div className="mt-4">
              <span className="text-xs text-slate-400 font-mono">Suggested Searches:</span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {quickTestFilters.map((rec) => {
                  const isCurrent = activeSearchTerm.toLowerCase() === rec.query.toLowerCase();
                  return (
                    <button
                      key={rec.name}
                      type="button"
                      onClick={() => handleRecommendSelect(rec.query)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                        isCurrent 
                          ? "bg-indigo-600 text-white font-bold" 
                          : "bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white"
                      }`}
                    >
                      {rec.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 📊 City cost metrics tracker widgets */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-250">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Diagnostics Focus</span>
            <p className="text-lg font-display font-extrabold text-slate-800 mt-0.5 line-clamp-1">
              {activeSearchTerm}
            </p>
            <p className="text-xs text-slate-500 mt-1">Verified standard procedure</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-250">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Lowest Price Available</span>
            <p className="text-2xl font-mono font-extrabold text-[#10b981] mt-0.5">
              ₹{(statsOverview.bestPrice || 0).toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Average is ₹{(statsOverview.avgPrice || 0).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-250">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Max Savings Potential</span>
            <p className="text-2xl font-mono font-extrabold text-indigo-600 mt-0.5">
              ₹{statsOverview.maxPotentialSavings.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Select budget clinics below
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-250">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Locations Screened</span>
            <p className="text-2xl font-display font-extrabold text-slate-800 mt-0.5">
              {statsOverview.count} <span className="text-xs font-normal text-slate-400">clinics filtered</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">In-range GPS radius</p>
          </div>
        </section>

        {/* 🔔 Conditional Booking Module Placement */}
        {bookingService && (
          <div className="animate-fade-in">
            <PaymentWizard
              hospital={bookingService.hospital}
              service={bookingService.service}
              onSuccess={handleBookingSuccess}
              onCancel={() => setBookingService(null)}
            />
          </div>
        )}

        {/* 🎛️ Dual Column Dashboard Area */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT PANEL: Filters Panel & Main Listings (7 columns) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Elegant Filter Configuration Toolbar */}
            <div className="bg-white rounded-xl shadow-md border border-slate-100 p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Filter className="h-4.5 w-4.5 text-indigo-600" />
                  Diagnostic Search Filters
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setMaxDistance(10);
                    setMaxPrice(15000);
                    setSortBy("price");
                    setSelectedTier("all");
                    setSelectedCategory("all");
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Clear Filters
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Distance Filter Slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 font-medium font-mono">Max Travel Radius</span>
                    <span className="font-bold text-indigo-600">{maxDistance} km</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="15"
                    step="1"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-150 rounded-lg accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>2 km</span>
                    <span>7 km</span>
                    <span>15 km</span>
                  </div>
                </div>

                {/* Price Limit Filter */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 font-medium font-mono">Max Budget Bill</span>
                    <span className="font-bold text-indigo-600">₹{maxPrice.toLocaleString("en-IN")}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="15000"
                    step="500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-150 rounded-lg accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>₹500</span>
                    <span>₹7,500</span>
                    <span>₹15,000</span>
                  </div>
                </div>
              </div>

              {/* Tier Filters, Category Select and Sort Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label htmlFor="clinic-tier-select" className="text-[11px] text-slate-400 font-bold block mb-1">Clinic Tier Selector</label>
                  <select
                    id="clinic-tier-select"
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg text-slate-800 bg-white"
                  >
                    <option value="all">All Service Tiers</option>
                    <option value="Premium">Premium</option>
                    <option value="General">General</option>
                    <option value="Charity / Budget">Charity / Budget</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="diagnostic-category-select" className="text-[11px] text-slate-400 font-bold block mb-1">Diagnostic Category</label>
                  <select
                    id="diagnostic-category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg text-slate-800 bg-white"
                  >
                    <option value="all">All Specialties</option>
                    <option value="Radiology">Radiology (Scans)</option>
                    <option value="Pathology">Pathology (Blood)</option>
                    <option value="Cardiology">Cardiology (Heart)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="priority-sort-select" className="text-[11px] text-slate-400 font-bold block mb-1">Sort Priority</label>
                  <select
                    id="priority-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg text-slate-800 bg-white"
                  >
                    <option value="price">Price: Low to High</option>
                    <option value="distance">Distance: Nearest First</option>
                    <option value="rating">Rating: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 🏥 Clinic Results List Column */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-500 font-medium px-1">
                <span>Displaying {processedHospitalsList.length} screened clinics</span>
                <span className="flex items-center gap-1">
                  Active diagnostic: <span className="font-bold underline text-indigo-600">{activeSearchTerm}</span>
                </span>
              </div>

              {processedHospitalsList.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 text-center space-y-3">
                  <AlertCircle className="h-10 w-10 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-slate-700">No Clinics Fit Filters</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try expanding the maximum distance travel radius slider or adjusting the maximum price limit budget filters.
                  </p>
                  <button
                    onClick={() => {
                      setMaxDistance(15);
                      setMaxPrice(15000);
                      setSelectedTier("all");
                      setSelectedCategory("all");
                    }}
                    className="mt-2 text-xs text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition font-medium"
                  >
                    Expand Range Limits
                  </button>
                </div>
              ) : (
                processedHospitalsList.map((hosp) => {
                  const isSelected = selectedHospitalId === hosp.id;
                  const serviceData = hosp.activeService;

                  if (!serviceData) return null;

                  // Price savings calculation
                  const savingsDiff = serviceData.avgMarketPrice - serviceData.price;
                  const savingsPercentage = Math.round((savingsDiff / serviceData.avgMarketPrice) * 100);

                  return (
                    <div
                      key={hosp.id}
                      onClick={() => setSelectedHospitalId(hosp.id)}
                      className={`bg-white rounded-xl shadow-sm border p-5 transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between hover:border-slate-350 hover:shadow-md ${
                        isSelected 
                          ? "border-indigo-600 ring-2 ring-indigo-500/10" 
                          : "border-slate-200/80"
                      }`}
                    >
                      {/* Interactive Selection border accent */}
                      {isSelected && (
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-indigo-600"></div>
                      )}

                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                              hosp.tier === "Premium" 
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
                                : hosp.tier === "General" 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}>
                              {hosp.tier} Tier
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono italic">
                              {hosp.accreditation}
                            </span>
                          </div>

                          <h4 className="text-base font-display font-bold text-slate-800 hover:text-indigo-600 transition truncate max-w-sm sm:max-w-md">
                            {hosp.name}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-1">{hosp.address}</p>
                          
                          {/* Rating & Distance metrics row */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-slate-600 font-medium">
                            <span className="flex items-center gap-1.5">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
                              {hosp.rating} <span className="text-[10px] text-slate-400 font-normal">({hosp.ratingCount})</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-emerald-500" />
                              {hosp.distanceCalculated} km away
                            </span>
                            <span className="flex items-center gap-1 text-slate-500">
                              <Clock className="h-4 w-4 text-slate-400" />
                              Estimated Wait: ~{hosp.tier === "Premium" ? "14" : hosp.tier === "General" ? "28" : "48"}m
                            </span>
                          </div>
                        </div>

                        {/* Direct Price Presentation Block */}
                        <div className="text-left sm:text-right w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 shrink-0">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block">CARECOMPARE FARE</span>
                            <p className="text-2xl font-mono font-bold text-slate-900 tracking-tight">
                              ₹{serviceData.price.toLocaleString("en-IN")}
                            </p>
                          </div>

                          {/* Savings alert pill */}
                          {savingsDiff > 0 ? (
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full mt-1.5 flex items-center gap-1">
                              <TrendingDown className="h-3.5 w-3.5" />
                              Save {savingsPercentage}%
                            </span>
                          ) : (
                            <span className="text-[10px] bg-slate-50 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full mt-1.5">
                              Premium Quality
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Diagnostic details preview line & schedule button */}
                      <div className="flex justify-between items-center border-t border-slate-100 mt-4.5 pt-3">
                        <span className="text-[10px] text-slate-400 font-semibold font-mono">
                          Equipment calibration: {serviceData.equipmentGrade}
                        </span>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedHospitalId(hosp.id);
                            }}
                            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold px-3 py-1.5 rounded-lg text-xs transition"
                          >
                            Analyze
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setBookingService({ hospital: hosp, service: serviceData });
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-1.5 rounded-lg text-xs shadow-xs transition"
                          >
                            Book Appointment
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Location Map & Comparative Insights (5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live interactive maps simulated engine */}
            <InteractiveMap
              hospitals={MOCK_HOSPITALS}
              selectedHospitalId={selectedHospitalId}
              onSelectHospital={(id) => setSelectedHospitalId(id)}
              userLocation={userLocation}
              onUserLocationChange={(lat, lon) => setUserLocation({ lat, lon })}
              maxDistanceFilter={maxDistance}
            />

            {/* Price Index Comparative Charts */}
            {selectedHospital && (
              <PricingInsights
                selectedHospital={selectedHospital}
                searchedServiceName={activeSearchTerm}
              />
            )}

            {/* Smart Neural wait-time predictor */}
            <MLWaitPredictor
              selectedHospital={selectedHospital}
            />

          </div>
        </section>

        {/* 📋 Visual Appointments Ledger Journal (At bottom, showing persistence flow) */}
        <section id="appointments-ledger" className="bg-white rounded-xl shadow-md border border-slate-150 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <BookmarkCheck className="h-6 w-6 text-teal-600" />
              <div>
                <h3 className="text-base font-display font-bold text-slate-800">
                  Your Direct Reservation Tickets
                </h3>
                <p className="text-xs text-slate-500">
                  Confirmed appointment slips processed in active sandbox session database.
                </p>
              </div>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg font-mono font-medium border border-slate-200">
              Total Booked: {appointments.length}
            </span>
          </div>

          {appointments.length === 0 ? (
            <div className="text-center py-8 text-slate-400 space-y-2 lg:py-12">
              <Calendar className="h-10 w-10 text-slate-300 mx-auto animate-pulse" />
              <p className="text-xs font-medium">No appointments scheduled today.</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Compare diagnostic test rates, select a hospital listing, click "Book Appointment" and transact checkout to generate clinical pass.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {appointments.map((ticket) => (
                <div key={ticket.id} className="border border-indigo-100 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition">
                  {/* Card top banner stub */}
                  <div className="bg-indigo-950 text-white p-4 relative">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 block">
                      CLINICAL RESERVATION SLIP
                    </span>
                    <h5 className="font-display font-extrabold text-sm mt-1 truncate">
                      {ticket.hospitalName}
                    </h5>
                    <p className="text-xs text-indigo-200 leading-tight mt-0.5 truncate">{ticket.serviceName}</p>

                    <div className="absolute top-4 right-4 bg-teal-500 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 uppercase leading-none">
                      <CheckCircle2 className="h-3 w-3 fill-slate-900" />
                      Paid
                    </div>
                  </div>

                  {/* Card values body */}
                  <div className="p-4 bg-white space-y-3.5 text-xs text-slate-600">
                    <div className="grid grid-cols-2 gap-2 border-b border-slate-100 pb-2.5">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Patient</span>
                        <span className="font-bold text-slate-800">{ticket.patientName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Mobile</span>
                        <span className="font-mono text-slate-700">{ticket.patientPhone}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">DATE SCHEDULE</span>
                        <span className="font-mono text-slate-700 font-semibold">{ticket.date}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">SPOT HOUR</span>
                        <span className="font-mono text-slate-700 font-semibold">{ticket.timeSlot}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex justify-between items-center mt-1">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block">CONFIRMATION ID</span>
                        <span className="font-mono font-bold text-indigo-700 text-[11px] block">{ticket.id}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => triggerCopy(ticket.id)}
                        className="p-1 px-2.5 border border-slate-200 rounded-md hover:bg-slate-100 bg-white text-slate-500 hover:text-slate-800 text-[10px] font-semibold flex items-center gap-1.5 transition"
                      >
                        <Copy className="h-3 w-3" />
                        {copiedId === ticket.id ? "Copied" : "Copy"}
                      </button>
                    </div>

                    <p className="text-[9px] text-slate-400 text-center select-none pt-1">
                      Please carry clinical photo ID card while report verification.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* FAQ & Recruiting Value Add section */}
        <section className="bg-white rounded-xl shadow-xs border border-slate-250 p-5 font-sans">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest block mb-3 font-mono text-indigo-700">
            For Recruiters: Application Architecture & Integration Highlights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="space-y-2">
              <p>
                <strong>1. Geospatial 'Near Me' Logic:</strong> Calculate geodesic straight-line distance dynamically between any coordinates on the coordinate system map and the respective clinics using the <em>Haversine geodesic equation</em> in real time on grid relocations.
              </p>
              <p>
                <strong>2. Predictive wait-time Machine Learning:</strong> Demonstrates high fidelity multivariate simulation replicating tree estimators. Outputs vary intelligently depending on clinic tier capacities, peak footfall hours, days, ratings, and live incident bottlenecks.
              </p>
            </div>
            <div className="space-y-2">
              <p>
                <strong>3. Booking & Payment Pipeline:</strong> Simulates a PCI-DSS fully responsive Razorpay Checkout overlay, securing custom orders, managing verification code flow, state loaders, and dynamic digital receipts.
              </p>
              <p>
                <strong>4. Scope & Cost Efficiency:</strong> Complete layout transparency visually highlights pricing variance ratios across metropolitan diagnostic clinics, supporting low-cost healthcare comparisons beautifully.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 🚀 Simple clean footer line */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 CareCompare Services Inc. Designed for Delhi, NCR clinical transparency index.</p>
        </div>
      </footer>
    </div>
  );
}
