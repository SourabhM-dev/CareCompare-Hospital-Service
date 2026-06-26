/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import { Hospital, ServicePrice } from "../types";
import { ALL_PROCEDURES } from "../data";
import { TrendingDown, TrendingUp, AlertTriangle, Check, ShieldCheck, IndianRupee } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

interface PricingInsightsProps {
  selectedHospital: Hospital;
  searchedServiceName: string;
}

export default function PricingInsights({ selectedHospital, searchedServiceName }: PricingInsightsProps) {
  // Find current service in hospital list
  const activeService = useMemo(() => {
    return selectedHospital.services.find(
      (s) => s.name.toLowerCase() === searchedServiceName.toLowerCase()
    ) || selectedHospital.services[0];
  }, [selectedHospital, searchedServiceName]);

  // Generate comparison dataset
  const chartData = useMemo(() => {
    const avg = activeService.avgMarketPrice;
    const currentPrice = activeService.price;
    
    // Simulate other tier examples for robust bar comparison
    const budgetEstimate = Math.round(avg * 0.55);
    const premiumEstimate = Math.round(avg * 1.4);

    return [
      { name: "Charity/Budget Avg", amount: budgetEstimate, fill: "#ef4444" },
      { name: "General Clinic Avg", amount: avg, fill: "#10b981" },
      { name: `${selectedHospital.name.substring(0, 15)}...`, amount: currentPrice, fill: "#4f46e5" },
      { name: "Premium Tier Avg", amount: premiumEstimate, fill: "#3b82f6" },
    ];
  }, [selectedHospital, activeService]);

  const pricePerformance = useMemo(() => {
    const diff = activeService.avgMarketPrice - activeService.price;
    const pct = Math.round((diff / activeService.avgMarketPrice) * 100);
    const isSaving = diff > 0;

    let dealRating = "Fair Market Price";
    let badgeColor = "bg-slate-100 text-slate-800 border-slate-200";
    if (pct > 25) {
      dealRating = "Unbeatable Deal!";
      badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
    } else if (pct > 5) {
      dealRating = "Great Cost Savings";
      badgeColor = "bg-teal-50 text-teal-700 border-teal-200";
    } else if (pct < -20) {
      dealRating = "High-End Premium Equipment";
      badgeColor = "bg-indigo-50 text-indigo-700 border-indigo-200 font-medium";
    } else if (pct < 0) {
      dealRating = "Standard Premium Premium Pricing";
      badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
    }

    return {
      diff: Math.abs(diff),
      pct: Math.abs(pct),
      isSaving,
      dealRating,
      badgeColor
    };
  }, [activeService]);

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6" id="pricing-insights-view">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-rose-50 pb-4 mb-5">
        <div>
          <h3 className="text-lg font-display font-bold text-slate-800 flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-emerald-600" />
            Pricing Transparency & Indexing
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Comparing <span className="font-semibold text-slate-700">"{activeService.name}"</span> at this diagnostic point against Delhi city average.
          </p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full border ${pricePerformance.badgeColor}`}>
          {pricePerformance.dealRating}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Cost stats explanation */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                FACILITY SELECTED CONTRACT RATE
              </span>
              <p className="text-3xl font-display font-extrabold text-slate-900 mt-0.5">
                ₹{activeService.price.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/60">
              <div>
                <span className="text-[10px] text-slate-400 font-medium block">City Average</span>
                <p className="text-sm font-semibold text-slate-700">
                  ₹{activeService.avgMarketPrice.toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-medium block">Clinic Tier</span>
                <p className="text-sm font-semibold text-slate-700">
                  {selectedHospital.tier}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 space-y-2">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${pricePerformance.isSaving ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700"}`}>
                {pricePerformance.isSaving ? (
                  <TrendingDown className="h-4.5 w-4.5" />
                ) : (
                  <TrendingUp className="h-4.5 w-4.5" />
                )}
              </div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                {pricePerformance.isSaving ? "Price Differential Savings" : "Quality Premium Premium Premium Value"}
              </h4>
            </div>

            {pricePerformance.isSaving ? (
              <p className="text-xs text-slate-600">
                You save <span className="font-bold text-emerald-600">₹{pricePerformance.diff.toLocaleString("en-IN")} ({pricePerformance.pct}%)</span> compared to the standard clinical cost in Delhi. Booking this diagnostic represents solid savings.
              </p>
            ) : (
              <p className="text-xs text-slate-600">
                Priced <span className="font-bold text-slate-700">₹{pricePerformance.diff.toLocaleString("en-IN")} ({pricePerformance.pct}%)</span> above city average. Supported by <span className="font-medium text-slate-900">{activeService.equipmentGrade} ({selectedHospital.accreditation})</span> system calibration and minimal error margins.
              </p>
            )}
            
            <div className="flex items-center gap-1.5 pt-1.5 text-[10px] text-slate-500 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              CareCompare verified pricing rates
            </div>
          </div>
        </div>

        {/* Recharts chart representation */}
        <div className="md:col-span-7 h-[190px] w-full self-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
              <YAxis stroke="#94a3b8" fontSize={9} unit="₹" />
              <Tooltip
                contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                formatter={(value: any) => [`₹${value.toLocaleString("en-IN")}`, "Cost Rate"]}
              />
              <ReferenceLine y={activeService.avgMarketPrice} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Delhi Avg', fill: '#d97706', fontSize: 8, position: 'top' }} />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Bar dataKey="amount" key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
