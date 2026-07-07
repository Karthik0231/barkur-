"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Download, CheckCircle, XCircle, MessageSquare, Printer, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/admin/status-badge"
import { PageSkeleton } from "@/components/ui/skeleton"
import { formatPrice, formatDateTime } from "@/lib/utils"
import toast from "react-hot-toast"

interface BookingDetail {
  id: string
  bookingId: string
  bookingStatus: string
  paymentStatus: string
  adminApproval: string
  totalAmount: number
  discountAmount: number | null
  finalAmount: number
  quantity: number
  preferredDate: string
  preferredTime: string | null
  remarks: string | null
  specialInstructions: string | null
  cancellationReason: string | null
  createdAt: string
  updatedAt: string
  seva: { name: string; category: string; duration: number | null }
  devotee: { name: string; phone: string; email: string; address: string; gotra: string | null; nakshatra: string | null; rashi: string | null }
  payment: { razorpayPaymentId: string | null; amount: number; status: string; method: string | null; paidAt: string | null }
  certificates: { id: string; certificateNumber: string; type: string; issuedAt: string | null }[]
  auditLogs: { id: string; action: string; createdAt: string; user: string }[]
}

const mockBooking: BookingDetail = {
  id: "1",
  bookingId: "SEVA-2026-0042",
  bookingStatus: "PENDING",
  paymentStatus: "PAID",
  adminApproval: "PENDING",
  totalAmount: 2500,
  discountAmount: null,
  finalAmount: 2500,
  quantity: 2,
  preferredDate: "2026-07-05",
  preferredTime: "09:00 AM",
  remarks: "Family of 4 attending",
  specialInstructions: "Need special prasadam",
  cancellationReason: null,
  createdAt: "2026-07-01T10:30:00Z",
  updatedAt: "2026-07-01T10:30:00Z",
  seva: { name: "Rudra Abhishekam", category: "Abhishekam", duration: 60 },
  devotee: { name: "Ananya Sharma", phone: "+91 98765 43210", email: "ananya@example.com", address: "123, MG Road, Bangalore, Karnataka - 560001", gotra: "Bharadwaja", nakshatra: "Uttara Phalguni", rashi: "Simha" },
  payment: { razorpayPaymentId: "pay_9xH8kM3nR2vL6p", amount: 2500, status: "PAID", method: "UPI", paidAt: "2026-07-01T10:31:00Z" },
  certificates: [{ id: "cert1", certificateNumber: "CERT-2026-0042", type: "SEVA", issuedAt: null }],
  auditLogs: [
    { id: "log1", action: "Booking Created", createdAt: "2026-07-01T10:30:00Z", user: "Ananya Sharma" },
    { id: "log2", action: "Payment Received", createdAt: "2026-07-01T10:31:00Z", user: "System" },
  ],
}

export default function BookingDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [note, setNote] = useState("")
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setBooking(mockBooking)
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [params.id])

  const handleApprove = async () => {
    setProcessing(true)
    await new Promise((r) => setTimeout(r, 1000))
    setBooking((prev) => prev ? { ...prev, adminApproval: "APPROVED", bookingStatus: "CONFIRMED" } : prev)
    toast.success("Booking approved successfully")
    setProcessing(false)
  }

  const handleReject = async () => {
    setProcessing(true)
    await new Promise((r) => setTimeout(r, 1000))
    setBooking((prev) => prev ? { ...prev, adminApproval: "REJECTED", bookingStatus: "CANCELLED" } : prev)
    toast.success("Booking rejected")
    setProcessing(false)
  }

  const handleAddNote = () => {
    if (!note.trim()) return
    toast.success("Note added")
    setNote("")
  }

  if (loading) return <PageSkeleton />
  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-text-primary">Booking Not Found</h2>
        <p className="text-text-muted mt-2">The booking you&apos;re looking for doesn&apos;t exist.</p>
        <Button variant="primary" className="mt-4" onClick={() => router.push("/admin/bookings")}>Back to Bookings</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-all">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-heading text-text-primary">{booking.bookingId}</h1>
              <StatusBadge status={booking.bookingStatus} size="md" />
              <StatusBadge status={booking.adminApproval} variant="approval" size="md" />
            </div>
            <p className="text-sm text-text-muted mt-1">Created {formatDateTime(new Date(booking.createdAt))}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" iconLeft={<Printer className="h-4 w-4" />}>Print</Button>
          <Button variant="outline" size="sm" iconLeft={<Download className="h-4 w-4" />}>Download</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold font-heading text-text-primary mb-4">Booking Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><p className="text-xs text-text-muted uppercase tracking-wider">Seva</p><p className="text-sm font-medium text-text-primary mt-1">{booking.seva.name}</p></div>
              <div><p className="text-xs text-text-muted uppercase tracking-wider">Category</p><p className="text-sm font-medium text-text-primary mt-1">{booking.seva.category}</p></div>
              <div><p className="text-xs text-text-muted uppercase tracking-wider">Preferred Date</p><p className="text-sm font-medium text-text-primary mt-1">{booking.preferredDate}</p></div>
              <div><p className="text-xs text-text-muted uppercase tracking-wider">Preferred Time</p><p className="text-sm font-medium text-text-primary mt-1">{booking.preferredTime || "Not specified"}</p></div>
              <div><p className="text-xs text-text-muted uppercase tracking-wider">Quantity</p><p className="text-sm font-medium text-text-primary mt-1">{booking.quantity} devotee(s)</p></div>
              <div><p className="text-xs text-text-muted uppercase tracking-wider">Duration</p><p className="text-sm font-medium text-text-primary mt-1">{booking.seva.duration ? `${booking.seva.duration} mins` : "N/A"}</p></div>
            </div>
            {booking.remarks && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Remarks</p>
                <p className="text-sm text-text-primary">{booking.remarks}</p>
              </div>
            )}
            {booking.specialInstructions && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Special Instructions</p>
                <p className="text-sm text-text-primary">{booking.specialInstructions}</p>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold font-heading text-text-primary mb-4">Devotee Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><p className="text-xs text-text-muted uppercase tracking-wider">Name</p><p className="text-sm font-medium text-text-primary mt-1">{booking.devotee.name}</p></div>
              <div><p className="text-xs text-text-muted uppercase tracking-wider">Phone</p><p className="text-sm font-medium text-text-primary mt-1">{booking.devotee.phone}</p></div>
              <div><p className="text-xs text-text-muted uppercase tracking-wider">Email</p><p className="text-sm font-medium text-text-primary mt-1">{booking.devotee.email}</p></div>
              <div><p className="text-xs text-text-muted uppercase tracking-wider">Address</p><p className="text-sm text-text-primary mt-1">{booking.devotee.address}</p></div>
              {booking.devotee.gotra && <div><p className="text-xs text-text-muted uppercase tracking-wider">Gotra</p><p className="text-sm font-medium text-text-primary mt-1">{booking.devotee.gotra}</p></div>}
              {booking.devotee.nakshatra && <div><p className="text-xs text-text-muted uppercase tracking-wider">Nakshatra</p><p className="text-sm font-medium text-text-primary mt-1">{booking.devotee.nakshatra}</p></div>}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold font-heading text-text-primary mb-4">Payment Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div><p className="text-xs text-text-muted uppercase tracking-wider">Total Amount</p><p className="text-sm font-medium text-text-primary mt-1">{formatPrice(booking.totalAmount)}</p></div>
              <div><p className="text-xs text-text-muted uppercase tracking-wider">Discount</p><p className="text-sm font-medium text-text-primary mt-1">{booking.discountAmount ? formatPrice(booking.discountAmount) : "None"}</p></div>
              <div><p className="text-xs text-text-muted uppercase tracking-wider">Final Amount</p><p className="text-lg font-bold text-text-primary mt-1">{formatPrice(booking.finalAmount)}</p></div>
              <div><p className="text-xs text-text-muted uppercase tracking-wider">Status</p><div className="mt-1"><StatusBadge status={booking.paymentStatus} variant="payment" size="sm" /></div></div>
            </div>
            {booking.payment.razorpayPaymentId && (
              <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div><p className="text-xs text-text-muted uppercase tracking-wider">Payment ID</p><p className="text-sm font-mono text-text-primary mt-1">{booking.payment.razorpayPaymentId}</p></div>
                <div><p className="text-xs text-text-muted uppercase tracking-wider">Method</p><p className="text-sm text-text-primary mt-1">{booking.payment.method || "N/A"}</p></div>
                <div><p className="text-xs text-text-muted uppercase tracking-wider">Paid At</p><p className="text-sm text-text-primary mt-1">{booking.payment.paidAt ? formatDateTime(new Date(booking.payment.paidAt)) : "N/A"}</p></div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold font-heading text-text-primary mb-4">Certificates</h3>
            {booking.certificates.length === 0 ? (
              <p className="text-sm text-text-muted">No certificates issued yet</p>
            ) : (
              <div className="space-y-3">
                {booking.certificates.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary/50 border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{cert.certificateNumber}</p>
                        <p className="text-xs text-text-muted">{cert.type}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="xs" iconLeft={<Download className="h-3 w-3" />}>
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold font-heading text-text-primary mb-4">Audit Log</h3>
            <div className="space-y-3">
              {booking.auditLogs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-secondary/50" />
                  <span className="text-text-primary">{log.action}</span>
                  <span className="text-text-muted">by {log.user}</span>
                  <span className="text-text-muted ml-auto">{formatDateTime(new Date(log.createdAt))}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {booking.adminApproval === "PENDING" && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold font-heading text-text-primary mb-4">Admin Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full"
                  iconLeft={<CheckCircle className="h-4 w-4" />}
                  onClick={handleApprove}
                  loading={processing}
                >
                  Approve Booking
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  iconLeft={<XCircle className="h-4 w-4" />}
                  onClick={handleReject}
                  loading={processing}
                >
                  Reject Booking
                </Button>
              </div>
            </Card>
          )}

          {booking.adminApproval !== "PENDING" && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold font-heading text-text-primary mb-2">Decision Made</h3>
              <StatusBadge status={booking.adminApproval} variant="approval" size="lg" />
              <p className="text-sm text-text-muted mt-2">
                This booking has been {booking.adminApproval.toLowerCase()}.
              </p>
            </Card>
          )}

          <Card className="p-6">
            <h3 className="text-lg font-semibold font-heading text-text-primary mb-4">Add Note</h3>
            <div className="flex gap-2">
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Internal note..."
                inputSize="sm"
              />
              <Button variant="primary" size="sm" onClick={handleAddNote}>
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold font-heading text-text-primary mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Subtotal</span>
                <span className="text-text-primary font-medium">{formatPrice(booking.totalAmount)}</span>
              </div>
              {booking.discountAmount && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Discount</span>
                  <span className="text-emerald-600 font-medium">-{formatPrice(booking.discountAmount)}</span>
                </div>
              )}
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="text-text-primary font-semibold">Total</span>
                <span className="text-text-primary font-bold text-lg">{formatPrice(booking.finalAmount)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
