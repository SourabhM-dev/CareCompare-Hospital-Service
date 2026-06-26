/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Hospital, ServicePrice } from "./types";

// Dynamic search phrases matched to categories/services
export const SERVICE_ALIASES: Record<string, { serviceName: string; category: string }> = {
  "mri": { serviceName: "MRI Brain Contrast", category: "Radiology" },
  "mri price": { serviceName: "MRI Brain Contrast", category: "Radiology" },
  "xray": { serviceName: "X-Ray Chest PA View", category: "Radiology" },
  "x-ray": { serviceName: "X-Ray Chest PA View", category: "Radiology" },
  "blood test": { serviceName: "Blood Lipids Profile", category: "Pathology" },
  "lipid": { serviceName: "Blood Lipids Profile", category: "Pathology" },
  "cbc": { serviceName: "Complete Blood Count (CBC)", category: "Pathology" },
  "cholesterol": { serviceName: "Blood Lipids Profile", category: "Pathology" },
  "diabetes": { serviceName: "HbA1c Diabetes Test", category: "Pathology" },
  "thyroid": { serviceName: "Thyroid Stimulating Hormone (TSH)", category: "Pathology" },
  "tsh": { serviceName: "Thyroid Stimulating Hormone (TSH)", category: "Pathology" },
  "ecg": { serviceName: "ECG Cardiac Test", category: "Cardiology" },
  "heart test": { serviceName: "ECG Cardiac Test", category: "Cardiology" },
  "ct scan": { serviceName: "CT Scan Abdomen", category: "Radiology" },
  "scan": { serviceName: "CT Scan Abdomen", category: "Radiology" },
  "ultrasound": { serviceName: "Ultrasound Abdomen & Pelvis", category: "Radiology" },
  "usg": { serviceName: "Ultrasound Abdomen & Pelvis", category: "Radiology" },
  "echo": { serviceName: "Echocardiogram (ECHO)", category: "Cardiology" },
};

// Base details for standard procedures
export const ALL_PROCEDURES = [
  { name: "MRI Brain Contrast", category: "Radiology" as const, avgMarketPrice: 8500 },
  { name: "X-Ray Chest PA View", category: "Radiology" as const, avgMarketPrice: 800 },
  { name: "CT Scan Abdomen", category: "Radiology" as const, avgMarketPrice: 5500 },
  { name: "Ultrasound Abdomen & Pelvis", category: "Radiology" as const, avgMarketPrice: 1800 },
  { name: "Blood Lipids Profile", category: "Pathology" as const, avgMarketPrice: 650 },
  { name: "Complete Blood Count (CBC)", category: "Pathology" as const, avgMarketPrice: 350 },
  { name: "Thyroid Stimulating Hormone (TSH)", category: "Pathology" as const, avgMarketPrice: 400 },
  { name: "HbA1c Diabetes Test", category: "Pathology" as const, avgMarketPrice: 500 },
  { name: "ECG Cardiac Test", category: "Cardiology" as const, avgMarketPrice: 600 },
  { name: "Echocardiogram (ECHO)", category: "Cardiology" as const, avgMarketPrice: 3200 },
];

export const CITY_CENTER_DELHI = { lat: 28.6139, lon: 77.2090 }; // Connaught Place

export const MOCK_HOSPITALS: Hospital[] = [
  {
    id: "hosp-01",
    name: "Apex Diagnostics & Specialty Hospital",
    address: "A-24, Barakhamba Road, Connaught Place, New Delhi",
    latitude: 28.6185,
    longitude: 77.2245,
    rating: 4.8,
    ratingCount: 512,
    phone: "+91 11 4355 9000",
    email: "info@apexdiagnostics.in",
    tier: "Premium",
    type: "Diagnostic Center & Imaging",
    accreditation: "JCI Accredited",
    hasEmergency: true,
    imageSeed: "apex",
    services: [
      { name: "MRI Brain Contrast", price: 11500, avgMarketPrice: 8500, category: "Radiology", equipmentGrade: "State-of-the-Art" },
      { name: "X-Ray Chest PA View", price: 1400, avgMarketPrice: 800, category: "Radiology", equipmentGrade: "Premium Quality" },
      { name: "CT Scan Abdomen", price: 7800, avgMarketPrice: 5500, category: "Radiology", equipmentGrade: "State-of-the-Art" },
      { name: "Ultrasound Abdomen & Pelvis", price: 2600, avgMarketPrice: 1800, category: "Radiology", equipmentGrade: "Premium Quality" },
      { name: "Blood Lipids Profile", price: 1100, avgMarketPrice: 650, category: "Pathology", equipmentGrade: "Premium Quality" },
      { name: "Complete Blood Count (CBC)", price: 580, avgMarketPrice: 350, category: "Pathology", equipmentGrade: "Standard" },
      { name: "Thyroid Stimulating Hormone (TSH)", price: 750, avgMarketPrice: 400, category: "Pathology", equipmentGrade: "Standard" },
      { name: "HbA1c Diabetes Test", price: 850, avgMarketPrice: 500, category: "Pathology", equipmentGrade: "Standard" },
      { name: "ECG Cardiac Test", price: 950, avgMarketPrice: 600, category: "Cardiology", equipmentGrade: "Premium Quality" },
      { name: "Echocardiogram (ECHO)", price: 4200, avgMarketPrice: 3200, category: "Cardiology", equipmentGrade: "State-of-the-Art" },
    ]
  },
  {
    id: "hosp-02",
    name: "Metro General Healthcare Clinic",
    address: "Block-C, Shanti Path, Chanakyapuri, New Delhi",
    latitude: 28.5980,
    longitude: 77.1950,
    rating: 4.2,
    ratingCount: 320,
    phone: "+91 11 2688 4433",
    email: "contact@metrogeneral.org",
    tier: "General",
    type: "General Hospital",
    accreditation: "NABH Accredited",
    hasEmergency: true,
    imageSeed: "metro",
    services: [
      { name: "MRI Brain Contrast", price: 7900, avgMarketPrice: 8500, category: "Radiology", equipmentGrade: "Standard" },
      { name: "X-Ray Chest PA View", price: 750, avgMarketPrice: 800, category: "Radiology", equipmentGrade: "Standard" },
      { name: "CT Scan Abdomen", price: 5200, avgMarketPrice: 5500, category: "Radiology", equipmentGrade: "Standard" },
      { name: "Ultrasound Abdomen & Pelvis", price: 1650, avgMarketPrice: 1800, category: "Radiology", equipmentGrade: "Standard" },
      { name: "Blood Lipids Profile", price: 600, avgMarketPrice: 650, category: "Pathology", equipmentGrade: "Standard" },
      { name: "Complete Blood Count (CBC)", price: 320, avgMarketPrice: 350, category: "Pathology", equipmentGrade: "Standard" },
      { name: "Thyroid Stimulating Hormone (TSH)", price: 380, avgMarketPrice: 400, category: "Pathology", equipmentGrade: "Standard" },
      { name: "HbA1c Diabetes Test", price: 480, avgMarketPrice: 500, category: "Pathology", equipmentGrade: "Standard" },
      { name: "ECG Cardiac Test", price: 550, avgMarketPrice: 600, category: "Cardiology", equipmentGrade: "Standard" },
      { name: "Echocardiogram (ECHO)", price: 3000, avgMarketPrice: 3200, category: "Cardiology", equipmentGrade: "Standard" },
    ]
  },
  {
    id: "hosp-03",
    name: "St. Jude Charitable Wellness Center",
    address: "12, Bhai Vir Singh Marg, Gole Market, New Delhi",
    latitude: 28.6295,
    longitude: 77.2082,
    rating: 4.4,
    ratingCount: 198,
    phone: "+91 11 2336 2929",
    email: "appointments@stjudecharity.in",
    tier: "Charity / Budget",
    type: "Charitable Trust Clinic",
    accreditation: "ISO Certified",
    hasEmergency: false,
    imageSeed: "stjude",
    services: [
      { name: "MRI Brain Contrast", price: 5400, avgMarketPrice: 8500, category: "Radiology", equipmentGrade: "Standard" },
      { name: "X-Ray Chest PA View", price: 380, avgMarketPrice: 800, category: "Radiology", equipmentGrade: "Standard" },
      { name: "CT Scan Abdomen", price: 3600, avgMarketPrice: 5500, category: "Radiology", equipmentGrade: "Standard" },
      { name: "Ultrasound Abdomen & Pelvis", price: 950, avgMarketPrice: 1800, category: "Radiology", equipmentGrade: "Standard" },
      { name: "Blood Lipids Profile", price: 280, avgMarketPrice: 650, category: "Pathology", equipmentGrade: "Standard" },
      { name: "Complete Blood Count (CBC)", price: 160, avgMarketPrice: 350, category: "Pathology", equipmentGrade: "Standard" },
      { name: "Thyroid Stimulating Hormone (TSH)", price: 200, avgMarketPrice: 400, category: "Pathology", equipmentGrade: "Standard" },
      { name: "HbA1c Diabetes Test", price: 220, avgMarketPrice: 500, category: "Pathology", equipmentGrade: "Standard" },
      { name: "ECG Cardiac Test", price: 250, avgMarketPrice: 600, category: "Cardiology", equipmentGrade: "Standard" },
      { name: "Echocardiogram (ECHO)", price: 1800, avgMarketPrice: 3200, category: "Cardiology", equipmentGrade: "Standard" },
    ]
  },
  {
    id: "hosp-04",
    name: "Fortis Scan & Heart Care Diagnostics",
    address: "2, Ring Road, Lajpat Nagar-IV, New Delhi",
    latitude: 28.5682,
    longitude: 77.2450,
    rating: 4.7,
    ratingCount: 642,
    phone: "+91 11 4277 6222",
    email: "lajpat@fortishealth.com",
    tier: "Premium",
    type: "Super-Specialty Hospital Diagnostic Hub",
    accreditation: "JCI Accredited",
    hasEmergency: true,
    imageSeed: "fortis",
    services: [
      { name: "MRI Brain Contrast", price: 12200, avgMarketPrice: 8500, category: "Radiology", equipmentGrade: "State-of-the-Art" },
      { name: "X-Ray Chest PA View", price: 1450, avgMarketPrice: 800, category: "Radiology", equipmentGrade: "Premium Quality" },
      { name: "CT Scan Abdomen", price: 8200, avgMarketPrice: 5500, category: "Radiology", equipmentGrade: "State-of-the-Art" },
      { name: "Ultrasound Abdomen & Pelvis", price: 2750, avgMarketPrice: 1800, category: "Radiology", equipmentGrade: "State-of-the-Art" },
      { name: "Blood Lipids Profile", price: 1150, avgMarketPrice: 650, category: "Pathology", equipmentGrade: "Premium Quality" },
      { name: "Complete Blood Count (CBC)", price: 590, avgMarketPrice: 350, category: "Pathology", equipmentGrade: "Premium Quality" },
      { name: "Thyroid Stimulating Hormone (TSH)", price: 780, avgMarketPrice: 400, category: "Pathology", equipmentGrade: "Standard" },
      { name: "HbA1c Diabetes Test", price: 890, avgMarketPrice: 500, category: "Pathology", equipmentGrade: "Standard" },
      { name: "ECG Cardiac Test", price: 980, avgMarketPrice: 600, category: "Cardiology", equipmentGrade: "State-of-the-Art" },
      { name: "Echocardiogram (ECHO)", price: 4400, avgMarketPrice: 3200, category: "Cardiology", equipmentGrade: "State-of-the-Art" },
    ]
  },
  {
    id: "hosp-05",
    name: "Lifeline Multi-Specialty Hospital",
    address: "E-18, Kirti Nagar, Main Road, New Delhi",
    latitude: 28.6435,
    longitude: 77.1350,
    rating: 4.1,
    ratingCount: 224,
    phone: "+91 11 4141 5566",
    email: "kirtinagar@lifelinehospitals.co.in",
    tier: "General",
    type: "General Multi-Specialty Hospital",
    accreditation: "NABH Accredited",
    hasEmergency: true,
    imageSeed: "lifeline",
    services: [
      { name: "MRI Brain Contrast", price: 8200, avgMarketPrice: 8500, category: "Radiology", equipmentGrade: "Standard" },
      { name: "X-Ray Chest PA View", price: 780, avgMarketPrice: 800, category: "Radiology", equipmentGrade: "Standard" },
      { name: "CT Scan Abdomen", price: 5400, avgMarketPrice: 5500, category: "Radiology", equipmentGrade: "Standard" },
      { name: "Ultrasound Abdomen & Pelvis", price: 1700, avgMarketPrice: 1800, category: "Radiology", equipmentGrade: "Standard" },
      { name: "Blood Lipids Profile", price: 580, avgMarketPrice: 650, category: "Pathology", equipmentGrade: "Standard" },
      { name: "Complete Blood Count (CBC)", price: 290, avgMarketPrice: 350, category: "Pathology", equipmentGrade: "Standard" },
      { name: "Thyroid Stimulating Hormone (TSH)", price: 340, avgMarketPrice: 400, category: "Pathology", equipmentGrade: "Standard" },
      { name: "HbA1c Diabetes Test", price: 420, avgMarketPrice: 500, category: "Pathology", equipmentGrade: "Standard" },
      { name: "ECG Cardiac Test", price: 580, avgMarketPrice: 600, category: "Cardiology", equipmentGrade: "Standard" },
      { name: "Echocardiogram (ECHO)", price: 3100, avgMarketPrice: 3200, category: "Cardiology", equipmentGrade: "Standard" },
    ]
  },
  {
    id: "hosp-06",
    name: "Narayana Scan & Diag Hub",
    address: "Block-F, Ring Road, Safdarjung Enclave, New Delhi",
    latitude: 28.5720,
    longitude: 77.2025,
    rating: 4.5,
    ratingCount: 410,
    phone: "+91 11 2619 8888",
    email: "safdarjung@narayanahealth.com",
    tier: "General",
    type: "Corporate Clinic Branch",
    accreditation: "NABH Accredited",
    hasEmergency: false,
    imageSeed: "narayana",
    services: [
      { name: "MRI Brain Contrast", price: 8100, avgMarketPrice: 8500, category: "Radiology", equipmentGrade: "Premium Quality" },
      { name: "X-Ray Chest PA View", price: 820, avgMarketPrice: 800, category: "Radiology", equipmentGrade: "Standard" },
      { name: "CT Scan Abdomen", price: 5300, avgMarketPrice: 5500, category: "Radiology", equipmentGrade: "Premium Quality" },
      { name: "Ultrasound Abdomen & Pelvis", price: 1750, avgMarketPrice: 1800, category: "Radiology", equipmentGrade: "Premium Quality" },
      { name: "Blood Lipids Profile", price: 620, avgMarketPrice: 650, category: "Pathology", equipmentGrade: "Standard" },
      { name: "Complete Blood Count (CBC)", price: 330, avgMarketPrice: 350, category: "Pathology", equipmentGrade: "Standard" },
      { name: "Thyroid Stimulating Hormone (TSH)", price: 360, avgMarketPrice: 400, category: "Pathology", equipmentGrade: "Standard" },
      { name: "HbA1c Diabetes Test", price: 450, avgMarketPrice: 500, category: "Pathology", equipmentGrade: "Standard" },
      { name: "ECG Cardiac Test", price: 610, avgMarketPrice: 600, category: "Cardiology", equipmentGrade: "Standard" },
      { name: "Echocardiogram (ECHO)", price: 3150, avgMarketPrice: 3200, category: "Cardiology", equipmentGrade: "Premium Quality" },
    ]
  },
  {
    id: "hosp-07",
    name: "Care & Cure Community Diagnostics",
    address: "7A, Pusa Road, Karol Bagh, New Delhi",
    latitude: 28.6410,
    longitude: 77.1850,
    rating: 4.3,
    ratingCount: 165,
    phone: "+91 11 4512 0044",
    email: "karolbagh@carecurelabs.org",
    tier: "Charity / Budget",
    type: "Subsidized Clinic Point",
    accreditation: "ISO Certified",
    hasEmergency: false,
    imageSeed: "carecure",
    services: [
      { name: "MRI Brain Contrast", price: 5100, avgMarketPrice: 8500, category: "Radiology", equipmentGrade: "Standard" },
      { name: "X-Ray Chest PA View", price: 360, avgMarketPrice: 800, category: "Radiology", equipmentGrade: "Standard" },
      { name: "CT Scan Abdomen", price: 3400, avgMarketPrice: 5500, category: "Radiology", equipmentGrade: "Standard" },
      { name: "Ultrasound Abdomen & Pelvis", price: 900, avgMarketPrice: 1800, category: "Radiology", equipmentGrade: "Standard" },
      { name: "Blood Lipids Profile", price: 290, avgMarketPrice: 650, category: "Pathology", equipmentGrade: "Standard" },
      { name: "Complete Blood Count (CBC)", price: 155, avgMarketPrice: 350, category: "Pathology", equipmentGrade: "Standard" },
      { name: "Thyroid Stimulating Hormone (TSH)", price: 190, avgMarketPrice: 400, category: "Pathology", equipmentGrade: "Standard" },
      { name: "HbA1c Diabetes Test", price: 210, avgMarketPrice: 500, category: "Pathology", equipmentGrade: "Standard" },
      { name: "ECG Cardiac Test", price: 260, avgMarketPrice: 600, category: "Cardiology", equipmentGrade: "Standard" },
      { name: "Echocardiogram (ECHO)", price: 1750, avgMarketPrice: 3200, category: "Cardiology", equipmentGrade: "Standard" },
    ]
  },
  {
    id: "hosp-08",
    name: "Maxima Advanced Imaging Center",
    address: "Plot 42, Sector-10, Dwarka, New Delhi",
    latitude: 28.5815,
    longitude: 77.0590,
    rating: 4.9,
    ratingCount: 789,
    phone: "+91 11 4987 1111",
    email: "dwarka@maximaimaging.com",
    tier: "Premium",
    type: "Premium Cancer & Neuro Imaging Hub",
    accreditation: "JCI Accredited",
    hasEmergency: true,
    imageSeed: "maxima",
    services: [
      { name: "MRI Brain Contrast", price: 12500, avgMarketPrice: 8500, category: "Radiology", equipmentGrade: "State-of-the-Art" },
      { name: "X-Ray Chest PA View", price: 1550, avgMarketPrice: 800, category: "Radiology", equipmentGrade: "State-of-the-Art" },
      { name: "CT Scan Abdomen", price: 8400, avgMarketPrice: 5500, category: "Radiology", equipmentGrade: "State-of-the-Art" },
      { name: "Ultrasound Abdomen & Pelvis", price: 2900, avgMarketPrice: 1800, category: "Radiology", equipmentGrade: "State-of-the-Art" },
      { name: "Blood Lipids Profile", price: 1200, avgMarketPrice: 650, category: "Pathology", equipmentGrade: "Premium Quality" },
      { name: "Complete Blood Count (CBC)", price: 620, avgMarketPrice: 350, category: "Pathology", equipmentGrade: "Premium Quality" },
      { name: "Thyroid Stimulating Hormone (TSH)", price: 820, avgMarketPrice: 400, category: "Pathology", equipmentGrade: "Premium Quality" },
      { name: "HbA1c Diabetes Test", price: 920, avgMarketPrice: 500, category: "Pathology", equipmentGrade: "Premium Quality" },
      { name: "ECG Cardiac Test", price: 1100, avgMarketPrice: 600, category: "Cardiology", equipmentGrade: "Premium Quality" },
      { name: "Echocardiogram (ECHO)", price: 4600, avgMarketPrice: 3200, category: "Cardiology", equipmentGrade: "State-of-the-Art" },
    ]
  }
];

/**
 * Calculates geographical distance between two coordinates in kilometers using Haversine formula
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // decimal rounding
}

/**
 * Machine Learning Predictor (Deterministic weights simulating Random Forest Regressor)
 * Features modeled:
 * - Hour of day (Peak load 10:00 - 13:00 has high wait, early morning or late evening has low wait)
 * - Day of week (0-6) (Saturdays/Sundays might be slower or higher emergency, Mondays peak clinical load)
 * - Hospital Tier ("Premium" has higher staffing -> lower wait, "Charity / Budget" has extreme footfall -> higher wait)
 * - Hospital Rating (Better ratings usually have optimized triage -> lower wait)
 * - Active Load Coefficient (Manual tester adjustment to simulate emergency load)
 */
export interface MLWaitTimeResult {
  predictedMinutes: number;
  confidenceMin: number;
  confidenceMax: number;
  factorExplanations: string[];
}

export function predictWaitTime(
  hour: number,
  dayOfWeek: number, // 0 = Mon, 6 = Sun
  tier: "Premium" | "General" | "Charity / Budget",
  rating: number,
  activeLoad: number // 1.0 = Regular, 2.0 = High critical load
): MLWaitTimeResult {
  // Base wait time by tier
  let baseWait = 15; // default Premium
  if (tier === "General") baseWait = 30;
  if (tier === "Charity / Budget") baseWait = 55;

  const factors: string[] = [];

  // 1. Rating contribution (Better rating decreases wait up to 10 mins)
  const ratingDiscount = (rating - 3.0) * 4; // e.g. 4.9 rating gives (1.9 * 4) = 7.6 mins discount.
  let currentWait = baseWait - Math.max(0, ratingDiscount);

  // 2. Hour of day load weights (Peak hospital hour between 10 AM and 2 PM (+22 min wait))
  let hourEffect = 0;
  if (hour >= 10 && hour <= 14) {
    hourEffect = 18;
    factors.push("Peak clinic and outpatient hours (10:00 - 14:00)");
  } else if (hour >= 8 && hour < 10) {
    hourEffect = 8;
    factors.push("Morning registration queue surge");
  } else if (hour >= 17 && hour <= 20) {
    hourEffect = 5;
    factors.push("Evening clinical handoff peak");
  } else {
    hourEffect = -6;
    factors.push("Off-peak clinical period (shorter diagnostics queue)");
  }
  currentWait += hourEffect;

  // 3. Day of week effect
  let dayEffect = 0;
  if (dayOfWeek === 0) { // Monday
    dayEffect = 8;
    factors.push("Monday weekly diagnostic volume spike");
  } else if (dayOfWeek === 5) { // Sat
    dayEffect = -3;
    factors.push("Saturday elective schedule reduction");
  } else if (dayOfWeek === 6) { // Sun
    dayEffect = -8;
    factors.push("Sunday minimal elective queue, emergency focus");
  } else {
    dayEffect = 2; // Midweek
  }
  currentWait += dayEffect;

  // 4. Manual active load coefficient
  if (activeLoad > 1.3) {
    const surge = (activeLoad - 1.0) * 20;
    currentWait += surge;
    factors.push(`Emergency dynamic load surge (${Math.round((activeLoad - 1)*100)}% extra footfall)`);
  }

  // Ensure logical limits
  const predictedMinutes = Math.max(4, Math.round(currentWait));
  const confidenceMin = Math.max(2, Math.round(predictedMinutes * 0.8));
  const confidenceMax = Math.round(predictedMinutes * 1.25);

  if (tier === "Charity / Budget") {
    factors.push("High public subsidy caseload processing");
  } else if (tier === "Premium") {
    factors.push("Dedicated tier concierge support & high staff ratio");
  }

  return {
    predictedMinutes,
    confidenceMin,
    confidenceMax,
    factorExplanations: factors
  };
}

export const TIME_SLOTS = [
  "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM",
  "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM",
  "12:30 PM", "01:00 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM"
];

export const DAYS_OF_WEEK = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];
