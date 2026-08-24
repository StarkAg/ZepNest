// Raw shape returned by GET /mobile/vendor/profile.

export type ApiVendor = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string[]; // single-element array; value is comma-separated: ["Electrical, Plumbing"]
  experience: number;
  status: string; // 'available' | 'busy' | 'en_route' | 'off_duty' | 'offline'
};

// Raw shape returned by GET /mobile/vendor/zones — read-only "My Zone" (Admin SRS §12.6).
//
// Grouped by pincode on purpose: a vendor can serve Electrical in one pincode and AC in another, so
// a flat pincode list plus a flat category list would lose which combination is actually contracted.

export type ApiVendorZoneCategory = {
  categoryId: number;
  categoryName: string;
  sectionCode: string | null;
  /** e.g. "Time-Slot Services" — the section this category sits under in the catalog. */
  sectionName: string | null;
  commissionType: 'fixed' | 'percentage' | 'hybrid';
  commissionValue: number | null;
  /** Only meaningful for 'hybrid': the ₹ floor under a percentage. */
  commissionMinValue: number | null;
  status: 'active' | 'pending' | 'suspended';
  technicianCount: number;
};

export type ApiVendorZonePincode = {
  areaId: number;
  zipcode: string;
  localityName: string | null;
  city: string | null;
  areaStatus: 'active' | 'inactive' | 'coming_soon';
  jobCount: number;
  categories: ApiVendorZoneCategory[];
};

export type ApiVendorZones = {
  pincodes: ApiVendorZonePincode[];
  totalZones: number;
  servicedZipCodes: string[];
};
