import { api } from '@/lib/apiClient';
import type { Vendor, VendorZones } from '@/src/types/vendor';

import type { ApiVendor, ApiVendorZones } from './api.types';

function toVendor(raw: ApiVendor): Vendor {
  const firstName = raw.firstName ?? '';
  const lastName = raw.lastName ?? '';

  // API stores specialization as one comma-joined string inside a single-element array.
  const skills = raw.specialization
    .flatMap((s) => s.split(',').map((x) => x.trim()))
    .filter(Boolean);

  return {
    id: raw.id,
    name: `${firstName} ${lastName}`.trim(),
    email: raw.email,
    phone: raw.phone ?? '',
    skills,
    experience: raw.experience ?? 0,
    status: raw.status,
  };
}

// Token-scoped: returns the logged-in vendor's own profile (identity from the auth token).
export async function fetchVendor(): Promise<Vendor> {
  const res = await api.get<ApiVendor>('/mobile/vendor/profile');
  return toVendor(res);
}

/**
 * The vendor's own zones, grouped by pincode.
 *
 * Read-only by design: FR-VEND-003 — "Vendor cannot modify: commission rates, pincode assignments,
 * rate card". Zone changes are an ops action; the vendor requests expansion rather than making it.
 */
export async function fetchVendorZones(): Promise<VendorZones> {
  const res = await api.get<ApiVendorZones>('/mobile/vendor/zones');
  return {
    pincodes: (res.pincodes ?? []).map((p) => ({
      areaId: p.areaId,
      zipcode: p.zipcode,
      localityName: p.localityName,
      city: p.city,
      areaStatus: p.areaStatus,
      jobCount: p.jobCount ?? 0,
      categories: (p.categories ?? []).map((c) => ({
        categoryId: c.categoryId,
        categoryName: c.categoryName,
        sectionName: c.sectionName,
        commissionType: c.commissionType,
        commissionValue: c.commissionValue,
        commissionMinValue: c.commissionMinValue,
        status: c.status,
        technicianCount: c.technicianCount ?? 0,
      })),
    })),
    totalZones: res.totalZones ?? 0,
    servicedZipCodes: res.servicedZipCodes ?? [],
  };
}
