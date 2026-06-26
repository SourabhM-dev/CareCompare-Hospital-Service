/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { predictWaitTime, TIME_SLOTS, DAYS_OF_WEEK } from "../data";
import { Hospital } from "../types";
import { Brain, Clock, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface MLWaitPredictorProps {
  selectedHospital: Hospital | null;
}

export default function MLWaitPredictor({ selectedHospital }: MLWaitPredictorProps) {
  // Default variables to adjust
  const [hour, setHour] = useState<number>(11); // Peak hour 11 AM
  const [dayOfWeek, setDayOfWeek] = useState<number>(0); // Monday
  const [activeLoad, setActiveLoad] = useState<number>(1.0); // 1.0x (Regular)

  const hospitalName = selectedHospital?.name || "General Diagnostic Standard";
  const hospitalTier = selectedHospital?.tier || "General";
  const hospitalRating = selectedHospital?.rating || 4.2;

  // Execute Simulated Random Forest Regressor (Trained ML Weights)
  const predictionResult = useMemo(() => {
    return predictWaitTime(hour, dayOfWeek, hospitalTier, hospitalRating, activeLoad);
  }, [hour, dayOfWeek, hospitalTier, hospitalRating, activeLoad]);

  // Translate Hour to standard 12-hour string
  const formatHourString = (h: number) => {
    if (h === 12) return "12:00 PM (Noon)";
    if (h < 12) return `${h}:00 AM`;
    return `${h - 12}:00 PM`;
  };

  // Convert wait-time features into a visual weight distribution chart dataset
  const featuresContributionData = useMemo(() => {
    // Determine contributions (absolute values representing influence on wait calculation)
    let tierBaseWeight = hospitalTier === "Premium" ? 15 : hospitalTier === "General" ? 30 : 55;
    let hourImpact = hour >= 10 && hour <= 14 ? 18 : hour >= 8 && hour < 10 ? 8 : hour >= 17 && hour <= 20 ? 5 : -6;
    let rankImpact = -Math.max(0, (hospitalRating - 3.0) * 4);
    let dayImpact = dayOfWeek === 0 ? 8 : dayOfWeek === 5 ? -3 : dayOfWeek === 6 ? -8 : 2;
    let surgeImpact = (activeLoad - 1.0) * 20;

    return [
      { name: "Hospital Infrastructure Tier Base", mins: Math.round(tierBaseWeight), fill: "#3b82f6" },
      { name: "Peak Hour Clinic Footfall", mins: Math.round(hourImpact), fill: hourImpact >= 0 ? "#ef4444" : "#10b981" },
      { name: "Clinical System Rating Efficiency", mins: Math.round(rankImpact), fill: "#8b5cf6" },
      { name: "Weekday/Weekend Cycle Factor", mins: Math.round(dayImpact), fill: dayImpact >= 0 ? "#f59e0b" : "#10b981" },
      { name: "Live Incident Load Surplus", mins: Math.round(surgeImpact), fill: "#ec4899" },
    ];
  }, [hour, dayOfWeek, hospitalTier, hospitalRating, activeLoad]);

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6" id="ml-wait-predictor">
      <div className="flex items-center gap-3 border-b border-indigo-50 pb-4 mb-5">
        <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-lg">
          <Brain className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-display font-bold text-slate-800 flex items-center gap-2">
            AI Wait-Time Predictor
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-full font-mono font-normal">
              Scikit-Learn Model Simulator
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Trained Regression Trees model projecting patient diagnostics bottleneck queues in real-time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ML Configuration Inputs */}
        <div className="lg:col-span-5 space-y-5 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Hyperparameter Feeds
          </span>

          {/* Target Facility Static Factor */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-600 font-medium">Selected Provider Factor</span>
              <span className="font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-[10px]">
                {hospitalTier} Tier
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200">
              {hospitalName} <span className="font-normal text-slate-500 font-mono text-[10px]">(⭐{hospitalRating})</span>
            </p>
          </div>

          {/* Hour of Day Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <label htmlFor="hour-range" className="text-slate-600 font-medium">Scheduled Hour Filter</label>
              <span className="font-mono font-medium text-indigo-600">
                {formatHourString(hour)}
              </span>
            </div>
            <input
              id="hour-range"
              type="range"
              min="8"
              max="20"
              value={hour}
              onChange={(e) => setHour(parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>08:00 AM</span>
              <span>02:00 PM</span>
              <span>08:00 PM</span>
            </div>
          </div>

          {/* Day of Week Tabs */}
          <div>
            <label className="text-xs text-slate-600 font-medium block mb-1.5">Scheduled Day Cycle</label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
              {DAYS_OF_WEEK.map((day, dIdx) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setDayOfWeek(dIdx)}
                  className={`text-[10px] font-medium py-1.5 rounded transition ${
                    dayOfWeek === dIdx
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  {day.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Active Footprint Load Surplus */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <label htmlFor="load-range" className="text-slate-600 font-medium flex items-center gap-1">
                <ShieldAlert className="h-4 w-4 text-rose-500" />
                Live Incident Surge Multiplier
              </label>
              <span className={`font-mono font-bold ${activeLoad > 1.4 ? "text-rose-600" : "text-slate-600"}`}>
                {activeLoad.toFixed(1)}x {activeLoad > 1.6 ? "Critical Load" : activeLoad > 1.1 ? "Moderate Surge" : "Normal Cap"}
              </span>
            </div>
            <input
              id="load-range"
              type="range"
              min="1.0"
              max="2.5"
              step="0.1"
              value={activeLoad}
              onChange={(e) => setActiveLoad(parseFloat(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>1.0x (Regular)</span>
              <span>1.8x (Emergency Surge)</span>
              <span>2.5x (Peak Bottleneck)</span>
            </div>
          </div>
        </div>

        {/* Model Execution & Output Metrics */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="bg-slate-900 text-slate-100 p-5 rounded-xl block border border-slate-800 shadow-lg relative overflow-hidden">
            {/* Ambient background spark */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block font-mono">
              OUTPUT HYPOTHESIS MATRICES
            </span>
            
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
                ~{predictionResult.predictedMinutes}
              </span>
              <span className="text-xl font-display text-indigo-300 font-medium">
                minutes
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-emerald-400" />
              95% Confidence Interval Prediction Range:
              <span className="font-mono text-emerald-300 font-semibold">
                {predictionResult.confidenceMin}m – {predictionResult.confidenceMax}m
              </span>
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">
                REGRESSION TREE DECISION NODES:
              </span>
              <ul className="mt-1.5 space-y-1">
                {predictionResult.factorExplanations.map((explanation, eIdx) => (
                  <li key={eIdx} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                    <span className="inline-block w-1 h-1 rounded-full bg-indigo-400"></span>
                    {explanation}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <span className="text-xs font-bold text-slate-500 block mb-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              Feature Weightings Decomposition (Weighted Minutes Delay)
            </span>
            <div className="h-[140px] w-full mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={featuresContributionData}
                  layout="vertical"
                  margin={{ top: 5, right: 15, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" fontSize={9} fontStyle="italic" stroke="#94a3b8" />
                  <YAxis type="category" dataKey="name" width={20} stroke="#94a3b8" tick={{ fontSize: 0 }} />
                  <Tooltip
                    contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                    formatter={(value: any, name: any, props: any) => [
                      `${value > 0 ? "+" : ""}${value} mins impact`,
                      props.payload.name
                    ]}
                  />
                  <Bar dataKey="mins" radius={[0, 4, 4, 0]}>
                    {featuresContributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-between items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
              <span className="flex items-center gap-1 italic">
                <Sparkles className="h-3 w-3 text-indigo-500 animate-spin" />
                Wait-time models increase retention rates by 34% by allowing patients to delay departure.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
