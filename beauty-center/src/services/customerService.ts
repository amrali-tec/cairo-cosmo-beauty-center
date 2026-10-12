import { apiRequest } from "@/services/apiClient";
import type {
  CustomerSegment,
  CustomerDTO,
  BookingDTO,
  CustomerProfileResponse,
  CustomerNotesUpdatePayload,
} from "@/types/api";

export type { CustomerSegment, CustomerDTO, BookingDTO, CustomerProfileResponse };
export type CustomerRecord = CustomerDTO;
export type BookingRecord = BookingDTO;


function toDate(value?: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function computeCustomerSegment(input: {
  bookingsCount: number;
  lastBookingDate?: string | null;
  createdAt?: string | null;
}) {
  const bookingsCount = input.bookingsCount;
  const lastBookingDate = toDate(input.lastBookingDate);
  const createdAt = toDate(input.createdAt);
  const now = new Date();

  if (bookingsCount >= 5) {
    return "vip" as const;
  }

  if (lastBookingDate) {
    const diffDays = (now.getTime() - lastBookingDate.getTime()) / 86400000;
    if (diffDays >= 60) {
      return "inactive" as const;
    }
  }

  const referenceDate = lastBookingDate || createdAt;
  if (bookingsCount <= 1 && referenceDate) {
    const diffDays = (now.getTime() - referenceDate.getTime()) / 86400000;
    if (diffDays <= 7) {
      return "new" as const;
    }
  }

  return "regular" as const;
}

export async function getCustomers() {
  let apiCustomers: CustomerRecord[] = [];
  try {
    apiCustomers = await apiRequest<CustomerRecord[]>("/customer-list.php", {
      method: "GET",
    });
  } catch (e) {
    apiCustomers = [];
  }

  // Merge with local storage bookings if API returns empty
  const localBookingsRaw = typeof window !== "undefined" ? localStorage.getItem("admin_bookings_master_v1") : null;
  const localBookings = localBookingsRaw ? JSON.parse(localBookingsRaw) : [];

  const customerMap = new Map<string, any>();

  // Populate from API
  apiCustomers.forEach((c, idx) => {
    customerMap.set(c.phone || `c-${idx}`, {
      id: c.id,
      name: c.name,
      phone: c.phone,
      email: c.email,
      admin_notes: c.admin_notes || "",
      created_at: c.created_at,
      bookingsCount: Number(c.bookings_count || 1),
      last_booking_date: c.last_booking_date,
      segment: c.segment || computeCustomerSegment({ bookingsCount: Number(c.bookings_count || 1), lastBookingDate: c.last_booking_date, createdAt: c.created_at }),
    });
  });

  // Populate from local bookings
  localBookings.forEach((b: any, idx: number) => {
    const key = b.phone || b.email || `lb-${idx}`;
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        id: idx + 100,
        name: b.customerName,
        phone: b.phone,
        email: b.email,
        admin_notes: b.notes || "",
        created_at: b.createdAt,
        bookingsCount: 1,
        last_booking_date: b.preferredDate,
        segment: b.segment || "new",
      });
    }
  });

  return Array.from(customerMap.values());
}

export async function getCustomerById(id: number) {
  const data = await apiRequest<CustomerProfileResponse & { segment?: CustomerSegment }>(`/customer-profile.php?id=${id}`, {
    method: "GET",
  });

  return {
    ...data,
    segment:
      data.segment ||
      (computeCustomerSegment({
        bookingsCount: data.stats.totalBookings,
        lastBookingDate: data.stats.lastBookingDate,
        createdAt: data.customer.created_at,
      }) as CustomerSegment),
  };
}

export async function updateCustomerNotes(id: number, notes: string) {
  return apiRequest<{ updated: boolean; id: number }>("/customer-notes-update.php", {
    method: "POST",
    body: JSON.stringify({
      customer_id: id,
      notes,
    }),
  });
}
