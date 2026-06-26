/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Hospital } from "../types";
import { calculateDistance } from "../data";
import { MapPin, Navigation, ZoomIn, ZoomOut, User, CheckCircle } from "lucide-react";

interface InteractiveMapProps {
  hospitals: Hospital[];
  selectedHospitalId: string | null;
  onSelectHospital: (id: string) => void;
  userLocation: { lat: number; lon: number };
  onUserLocationChange: (lat: number, lon: number) => void;
  maxDistanceFilter: number;
}

export default function InteractiveMap({
  hospitals,
  selectedHospitalId,
  onSelectHospital,
  userLocation,
  onUserLocationChange,
  maxDistanceFilter,
}: InteractiveMapProps) {
  const [hoveredHospital, setHoveredHospital] = useState<Hospital | null>(null);

  // Maps coordinates to SVG percents
  const minLon = 77.00;
  const maxLon = 77.30;
  const minLat = 28.54;
  const maxLat = 28.67;

  const getX = (lon: number) => ((lon - minLon) / (maxLon - minLon)) * 100;
  const getY = (lat: number) => 100 - ((lat - minLat) / (maxLat - minLat)) * 100;

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    // Determine bounds and calculate click coordinate
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const pctX = clickX / rect.width;
    const pctY = 1 - clickY / rect.height; // invert for lat coordinates

    const clickedLon = minLon + pctX * (maxLon - minLon);
    const clickedLat = minLat + pctY * (maxLat - minLat);

    onUserLocationChange(
      Math.round(clickedLat * 10000) / 10000,
      Math.round(clickedLon * 10000) / 10000
    );
  };

  const userX = getX(userLocation.lon);
  const userY = getY(userLocation.lat);

  // Convert km radius to dynamic pixel grid radius estimation for SVG
  const mapWidthDegrees = maxLon - minLon;
  const latDeltaDeg = maxLat - minLat;
  // approx ratio
  const ratioLatLon = latDeltaDeg / mapWidthDegrees;
  // Draw the radius circle around the user. Let's estimate
  // 1 degree longitude in Delhi is approx 100km.
  // Radius in degrees = MaxDistance / 100
  const radiusInDegrees = maxDistanceFilter / 111;
  const radiusPctX = (radiusInDegrees / mapWidthDegrees) * 100;

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-100 p-5" id="interactive-map-container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div>
          <h3 className="text-lg font-display font-bold text-slate-800 flex items-center gap-2">
            <Navigation className="h-5 w-5 text-indigo-600 animate-pulse" />
            Live Geospatial Map Simulator
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Click anywhere on the grid below to relocate your physical position and re-calculate diagnostic flight distance.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
          <span className="text-slate-600 font-mono">
            User Center: {userLocation.lat.toFixed(4)}°N, {userLocation.lon.toFixed(4)}°E
          </span>
        </div>
      </div>

      <div className="relative w-full aspect-[4/3] bg-slate-50 rounded-lg overflow-hidden border border-slate-200 shadow-inner">
        {/* SVG Grid */}
        <svg
          className="absolute inset-0 w-full h-full cursor-crosshair select-none"
          onClick={handleMapClick}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          <line x1="10" y1="0" x2="10" y2="100" stroke="#cbd5e1" strokeDasharray="3,3" strokeWidth="0.1" />
          <line x1="25" y1="0" x2="25" y2="100" stroke="#cbd5e1" strokeDasharray="3,3" strokeWidth="0.1" />
          <line x1="40" y1="0" x2="40" y2="100" stroke="#cbd5e1" strokeDasharray="3,3" strokeWidth="0.1" />
          <line x1="55" y1="0" x2="55" y2="100" stroke="#cbd5e1" strokeDasharray="3,3" strokeWidth="0.1" />
          <line x1="70" y1="0" x2="70" y2="100" stroke="#cbd5e1" strokeDasharray="3,3" strokeWidth="0.1" />
          <line x1="85" y1="0" x2="85" y2="100" stroke="#cbd5e1" strokeDasharray="3,3" strokeWidth="0.1" />

          <line x1="0" y1="15" x2="100" y2="15" stroke="#cbd5e1" strokeDasharray="3,3" strokeWidth="0.1" />
          <line x1="0" y1="30" x2="100" y2="30" stroke="#cbd5e1" strokeDasharray="3,3" strokeWidth="0.1" />
          <line x1="0" y1="45" x2="100" y2="45" stroke="#cbd5e1" strokeDasharray="3,3" strokeWidth="0.1" />
          <line x1="0" y1="60" x2="100" y2="60" stroke="#cbd5e1" strokeDasharray="3,3" strokeWidth="0.1" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="#cbd5e1" strokeDasharray="3,3" strokeWidth="0.1" />
          <line x1="0" y1="90" x2="100" y2="90" stroke="#cbd5e1" strokeDasharray="3,3" strokeWidth="0.1" />

          {/* Delhi simulated landmarks */}
          <text x="50" y="48" fill="#94a3b8" fontSize="2.5" fontWeight="500" textAnchor="middle" opacity="0.7">
            CENTRAL DELHI (CONNAUGHT PLACE)
          </text>
          <text x="18" y="22" fill="#94a3b8" fontSize="2" textAnchor="middle" opacity="0.6">
            DWARKA REGION
          </text>
          <text x="82" y="78" fill="#94a3b8" fontSize="2" textAnchor="middle" opacity="0.6">
            LAJPAT NAGOR & KALKAJI
          </text>
          <text x="45" y="82" fill="#94a3b8" fontSize="2" textAnchor="middle" opacity="0.6">
            CHANAKYAPURI EMBASSIES
          </text>

          {/* User Range Circle / Radius Filter */}
          {userX >= 0 && userX <= 100 && userY >= 0 && userY <= 100 && (
            <circle
              cx={userX}
              cy={userY}
              r={Math.max(1.5, radiusPctX)}
              fill="rgba(79, 70, 229, 0.05)"
              stroke="#6366f1"
              strokeWidth="0.2"
              strokeDasharray="1,1"
            />
          )}

          {/* User Marker */}
          {userX >= 0 && userX <= 100 && userY >= 0 && userY <= 100 && (
            <g>
              <circle cx={userX} cy={userY} r="1.5" fill="#4f46e5" />
              <circle cx={userX} cy={userY} r="3" fill="none" stroke="#4f46e5" strokeWidth="0.3" className="animate-ping" style={{ transformOrigin: `${userX}% ${userY}%` }} />
            </g>
          )}

          {/* Hospital Markers */}
          {hospitals.map((hosp) => {
            const hX = getX(hosp.longitude);
            const hY = getY(hosp.latitude);
            const distance = calculateDistance(
              userLocation.lat,
              userLocation.lon,
              hosp.latitude,
              hosp.longitude
            );
            const isSelected = selectedHospitalId === hosp.id;
            const inRange = distance <= maxDistanceFilter;

            // Pin styling
            let pinColor = "#ef4444"; // Budget = red/orange
            if (hosp.tier === "Premium") pinColor = "#0284c7"; // blue
            if (hosp.tier === "General") pinColor = "#10b981"; // emerald

            return (
              <g
                key={hosp.id}
                className="cursor-pointer transition-transform duration-200 hover:scale-125"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHospital(hosp.id);
                }}
                onMouseEnter={() => setHoveredHospital(hosp)}
                onMouseLeave={() => setHoveredHospital(null)}
              >
                {/* Visual shadow ring */}
                <ellipse
                  cx={hX}
                  cy={hY + 1}
                  rx="1.4"
                  ry="0.5"
                  fill="rgba(0,0,0,0.15)"
                />
                
                {/* Outer halo if selected */}
                {isSelected && (
                  <circle
                    cx={hX}
                    cy={hY}
                    r="3.2"
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="0.4"
                  />
                )}

                {/* Connection line if in-range */}
                {inRange && isSelected && (
                  <line
                    x1={userX}
                    y1={userY}
                    x2={hX}
                    y2={hY}
                    stroke="#cbd5e1"
                    strokeWidth="0.25"
                    strokeDasharray="2,2"
                  />
                )}

                {/* Pin shape */}
                <path
                  d="M0 -2.5 C-1.2 -2.5 -2.2 -1.5 -2.2 -0.3 C-2.2 0.9 -0.6 2.5 0 3 C0.6 2.5 2.2 0.9 2.2 -0.3 C2.2 -1.5 1.2 -2.5 0 -2.5 Z"
                  fill={pinColor}
                  stroke="#ffffff"
                  strokeWidth="0.4"
                  transform={`translate(${hX}, ${hY}) scale(${isSelected ? 1.4 : 1})`}
                />

                {/* Small indicator label for ratings */}
                <text
                  x={hX}
                  y={hY - (isSelected ? 4 : 3)}
                  fill="#1e293b"
                  fontSize="2.2"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="bg-white px-0.5 rounded shadow pointer-events-none"
                >
                  ★{hosp.rating}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200 text-[10px] text-slate-700 space-y-1.5 shadow-sm max-w-[150px]">
          <span className="font-semibold block text-slate-900 border-b border-slate-100 pb-1 mb-1">Clinic Tiers</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0284c7]"></span>
            <span>Premium Tier (High-end)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
            <span>General Hospital</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ef4444]"></span>
            <span>Charity / Subsidized</span>
          </div>
          <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 mt-1">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span className="font-medium text-indigo-700">Your simulated GPS</span>
          </div>
        </div>

        {/* Dynamic Hover Card */}
        {hoveredHospital && (
          <div
            className="absolute bg-white/95 backdrop-blur-md p-3 rounded-lg border border-slate-200 shadow-md text-xs pointer-events-none transition-all"
            style={{
              left: `${Math.min(getX(hoveredHospital.longitude) + 2, 60)}%`,
              top: `${Math.min(getY(hoveredHospital.latitude) - 4, 70)}%`,
              zIndex: 50,
            }}
          >
            <p className="font-display font-semibold text-slate-900">{hoveredHospital.name}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{hoveredHospital.type}</p>
            <div className="flex justify-between gap-4 mt-2 text-[10px] text-slate-700">
              <span>⭐ {hoveredHospital.rating} ({hoveredHospital.ratingCount})</span>
              <span className="text-slate-500">
                {calculateDistance(userLocation.lat, userLocation.lon, hoveredHospital.latitude, hoveredHospital.longitude)} km
              </span>
            </div>
            <p className="text-[9px] text-slate-400 mt-1 italic">{hoveredHospital.accreditation}</p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <CheckCircle className="h-4.5 w-4.5 text-teal-500" />
          Clicking map updates "Near me" metrics
        </span>
        <button
          onClick={() => onUserLocationChange(28.6139, 77.2090)}
          className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition"
        >
          Reset to Delhi Center
        </button>
      </div>
    </div>
  );
}
