/**
 * Standard API Response Envelope matching PHP backend `api_success()` and `api_error()`
 */
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Customer Segments supported by backend auto-segmentation algorithm
 */
export type CustomerSegment = "vip" | "new" | "inactive" | "regular";

/**
 * Customer Data Transfer Object matching database `customers` table & API responses
 */
export interface CustomerDTO {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  notes?: string | null;
  admin_notes?: string | null;
  bookings_count?: number | string | null;
  last_booking_date?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  segment?: CustomerSegment;
}

/**
 * Booking Data Transfer Object matching database `bookings` table & API responses
 */
export interface BookingDTO {
  id: number;
  customer_id: number;
  service: string;
  branch: string;
  date?: string | null;
  notes?: string | null;
  status: "new" | "confirmed" | "completed" | "cancelled" | string;
  service_price?: number | string | null;
  created_at?: string | null;
  updated_at?: string | null;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
}

/**
 * Offer Data Transfer Object matching database `offers` table
 */
export interface OfferDTO {
  id: number;
  title: string;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

/**
 * Audit Log Data Transfer Object matching database `audit_logs` table
 */
export interface AuditLogDTO {
  id: number;
  admin_id: number | null;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string | null;
  ip_address: string;
  created_at: string;
}

/**
 * Customer Segment Data Transfer Object matching database `customer_segments` table
 */
export interface CustomerSegmentDTO {
  id: number;
  customer_id: number;
  segment_type: CustomerSegment;
  score: number;
  updated_at: string;
}

/**
 * Email Event Data Transfer Object matching database `email_events` table
 */
export interface EmailEventDTO {
  id: number;
  customer_id: number;
  event_type: "booking_created" | "vip_upgraded" | "inactive_reminder" | "offer_available";
  status: "pending" | "sent" | "failed";
  payload?: string | null;
  created_at: string;
}

/**
 * Customer Profile API Response structure
 */
export interface CustomerProfileResponse {
  customer: CustomerDTO;
  bookings: BookingDTO[];
  stats: {
    totalBookings: number;
    lastBookingDate: string | null;
    totalSpending: number;
  };
  segment?: CustomerSegment;
}

/**
 * Payload for public booking creation
 */
export interface BookingCreatePayload {
  fullName: string;
  phone: string;
  email?: string;
  serviceTitle: string;
  branchId: string;
  branchTitle: string;
  preferredDate: string;
  notes?: string;
  locale?: string;
  pageUrl?: string;
  hp?: string; // Honeypot field
}

/**
 * Payload for updating customer notes
 */
export interface CustomerNotesUpdatePayload {
  customer_id: number;
  notes: string;
}

/**
 * Payload for admin authentication
 */
export interface AdminLoginPayload {
  email: string;
  password: string;
}

/**
 * Admin Session DTO returned upon successful login/refresh
 */
export interface AdminSessionDTO {
  token: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: "admin" | "staff" | string;
  };
}
