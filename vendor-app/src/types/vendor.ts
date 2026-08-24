export type Vendor = {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: number;
  status: string;
};

/**
 * A vendor's coverage: the (pincode × service category) pairs they are contracted for.
 *
 * This is a list of PAIRS grouped by pincode, not a pincode list plus a category list — a vendor can
 * serve Electrical in one pincode, AC in another, and both in a third, and commission is set per
 * pair (Admin SRS §6.3.2, FR-COMM-001).
 */
export type VendorZoneCategory = {
  categoryId: number;
  categoryName: string;
  sectionName: string | null;
  commissionType: 'fixed' | 'percentage' | 'hybrid';
  commissionValue: number | null;
  commissionMinValue: number | null;
  status: 'active' | 'pending' | 'suspended';
  technicianCount: number;
};

export type VendorZonePincode = {
  areaId: number;
  zipcode: string;
  localityName: string | null;
  city: string | null;
  areaStatus: 'active' | 'inactive' | 'coming_soon';
  jobCount: number;
  categories: VendorZoneCategory[];
};

export type VendorZones = {
  pincodes: VendorZonePincode[];
  totalZones: number;
  servicedZipCodes: string[];
};
