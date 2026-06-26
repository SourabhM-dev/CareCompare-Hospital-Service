/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ServicePrice {
  name: string;
  price: number;
  avgMarketPrice: number;
  category: "Radiology" | "Pathology" | "Cardiology" | "General";
  equipmentGrade: "Premium Quality" | "Standard" | "State-of-the-Art";
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  ratingCount: number;
  phone: string;
  email: string;
  tier: "Premium" | "General" | "Charity / Budget";
  type: string;
  services: ServicePrice[];
  hasEmergency: boolean;
  accreditation: "JCI Accredited" | "NABH Accredited" | "ISO Certified" | "None";
  imageSeed: string; // for a generated color/icon
}

export interface Appointment {
  id: string;
  hospitalId: string;
  hospitalName: string;
  serviceName: string;
  price: number;
  date: string;
  timeSlot: string;
  patientName: string;
  patientPhone: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  paymentStatus: "Paid" | "Unpaid";
  paymentId?: string;
  createdAt: string;
}

export interface SearchFilters {
  query: string;
  maxDistance: number; // in km
  maxPrice: number;
  sortBy: "price" | "distance" | "rating";
  category: "all" | "Radiology" | "Pathology" | "Cardiology" | "General";
  tier: "all" | "Premium" | "General" | "Charity / Budget";
}
