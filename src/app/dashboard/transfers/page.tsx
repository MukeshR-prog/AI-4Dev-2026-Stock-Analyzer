"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  Send,
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Plus,
  Filter,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  mockTransferRequests,
  mockBranchContacts,
  mockTransferableProducts,
  formatRelativeTime,
  type TransferableProduct,
} from "@/data/transfers";
import type { StockTransferRequest, TransferStatus } from "@/types";

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS BADGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function StatusBadge({ status }: { status: TransferStatus }) {
  const config = {
    pending: { icon: Clock, color: "bg-yellow-100 text-yellow-700 border-yellow-200", label: "Pending" },
    approved: { icon: CheckCircle2, color: "bg-blue-100 text-blue-700 border-blue-200", label: "Approved" },
    rejected: { icon: XCircle, color: "bg-red-100 text-red-700 border-red-200", label: "Rejected" },
    in_transit: { icon: Truck, color: "bg-purple-100 text-purple-700 border-purple-200", label: "In Transit" },
    completed: { icon: CheckCircle2, color: "bg-green-100 text-green-700 border-green-200", label: "Completed" },
  };

  const { icon: Icon, color, label } = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${color}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSFER REQUEST CARD
// ═══════════════════════════════════════════════════════════════════════════════

interface TransferCardProps {
  transfer: StockTransferRequest;
  type: "incoming" | "outgoing";
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

function TransferCard({ transfer, type, onApprove, onReject }: TransferCardProps) {
  const timeAgo = useMemo(() => {
    return formatRelativeTime(new Date(transfer.requestedAt));
  }, [transfer.requestedAt]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-5 shadow-2xs transition-shadow hover:shadow-xs"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            type === "incoming" ? "bg-green-100" : "bg-blue-100"
          }`}>
            {type === "incoming" ? (
              <Inbox className="h-5 w-5 text-green-600" />
            ) : (
              <Send className="h-5 w-5 text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{transfer.product}</h3>
            <p className="text-sm text-muted-foreground">{transfer.quantity} units</p>
          </div>
        </div>
        <StatusBadge status={transfer.status} />
      </div>

      {/* Transfer Details */}
      <div className="mt-4 flex items-center gap-2 text-sm">
        <span className="font-medium text-foreground">{transfer.fromBranch}</span>
        <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium text-foreground">{transfer.toBranch}</span>
      </div>

      {/* Notes */}
      {transfer.notes && (
        <p className="mt-3 text-sm text-muted-foreground italic">&quot;{transfer.notes}&quot;</p>
      )}

      {/* Rejection Reason */}
      {transfer.status === "rejected" && transfer.rejectionReason && (
        <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <span className="font-medium">Reason:</span> {transfer.rejectionReason}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div className="text-xs text-muted-foreground">
          Requested by <span className="font-medium text-foreground">{transfer.requestedBy}</span>
          <span className="mx-1">•</span>
          {timeAgo}
        </div>

        {/* Action Buttons for Incoming Pending Requests */}
        {type === "incoming" && transfer.status === "pending" && (
          <div className="flex gap-2">
            <button
              onClick={() => onReject?.(transfer.id)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              Reject
            </button>
            <button
              onClick={() => onApprove?.(transfer.id)}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Approve
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NEW TRANSFER REQUEST MODAL
// ═══════════════════════════════════════════════════════════════════════════════

interface NewTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { toBranch: string; product: string; quantity: number; notes: string }) => void;
}

function NewTransferModal({ isOpen, onClose, onSubmit }: NewTransferModalProps) {
  const [toBranch, setToBranch] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toBranch || !product) return;
    onSubmit({ toBranch, product, quantity, notes });
    setToBranch("");
    setProduct("");
    setQuantity(1);
    setNotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl bg-card p-6 shadow-lg"
      >
        <h2 className="text-lg font-semibold text-foreground">Request Stock Transfer</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Request inventory from another branch
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Request From Branch
            </label>
            <select
              value={toBranch}
              onChange={(e) => setToBranch(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            >
              <option value="">Select a branch…</option>
              {mockBranchContacts.filter((b) => b.isActive).map((branch) => (
                <option key={branch.branchId} value={branch.branchName}>
                  {branch.branchName} ({branch.region})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Product
            </label>
            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            >
              <option value="">Select a product…</option>
              {mockTransferableProducts.map((p) => (
                <option key={p.product} value={p.product}>
                  {p.product} ({p.availableStock} available at {p.branch})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Quantity
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a note for the supplier branch…"
              rows={3}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Submit Request
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function TransfersPage() {
  const { profile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TransferStatus | "all">("all");
  const [transfers, setTransfers] = useState(mockTransferRequests);

  const currentBranch = profile?.branch || "Downtown Central";

  const filteredTransfers = useMemo(() => {
    let filtered = transfers.filter(
      (t) => t.fromBranch === currentBranch || t.toBranch === currentBranch
    );
    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }
    return filtered;
  }, [transfers, currentBranch, statusFilter]);

  const incomingRequests = filteredTransfers.filter((t) => t.toBranch === currentBranch);
  const outgoingRequests = filteredTransfers.filter((t) => t.fromBranch === currentBranch);

  const stats = useMemo(() => ({
    pending: transfers.filter((t) => 
      (t.fromBranch === currentBranch || t.toBranch === currentBranch) && t.status === "pending"
    ).length,
    inTransit: transfers.filter((t) => 
      (t.fromBranch === currentBranch || t.toBranch === currentBranch) && t.status === "in_transit"
    ).length,
    completed: transfers.filter((t) => 
      (t.fromBranch === currentBranch || t.toBranch === currentBranch) && t.status === "completed"
    ).length,
  }), [transfers, currentBranch]);

  const handleApprove = (id: string) => {
    setTransfers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: "approved" as TransferStatus, respondedBy: profile?.name, respondedAt: new Date() } : t
      )
    );
  };

  const handleReject = (id: string) => {
    const reason = window.prompt("Please provide a reason for rejection:");
    if (reason) {
      setTransfers((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: "rejected" as TransferStatus, respondedBy: profile?.name, respondedAt: new Date(), rejectionReason: reason } : t
        )
      );
    }
  };

  const handleNewTransfer = (data: { toBranch: string; product: string; quantity: number; notes: string }) => {
    const newTransfer: StockTransferRequest = {
      id: `transfer-${Date.now()}`,
      fromBranch: data.toBranch, // We're requesting FROM this branch
      toBranch: currentBranch, // TO our branch
      product: data.product,
      quantity: data.quantity,
      status: "pending",
      requestedBy: profile?.name || "Unknown",
      requestedAt: new Date(),
      notes: data.notes || undefined,
    };
    setTransfers((prev) => [newTransfer, ...prev]);
  };

  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Stock Transfers
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Request and manage inventory transfers between branches
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Request
        </button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
              <Truck className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.inTransit}</p>
              <p className="text-sm text-muted-foreground">In Transit</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TransferStatus | "all")}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="in_transit">In Transit</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="incoming">
        <TabsList>
          <TabsTrigger value="incoming">
            <Inbox className="h-4 w-4" />
            Incoming
            {incomingRequests.filter((t) => t.status === "pending").length > 0 && (
              <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
                {incomingRequests.filter((t) => t.status === "pending").length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="outgoing">
            <Send className="h-4 w-4" />
            Outgoing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="space-y-4 mt-4">
          {incomingRequests.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {incomingRequests.map((transfer) => (
                <TransferCard
                  key={transfer.id}
                  transfer={transfer}
                  type="incoming"
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <Inbox className="mx-auto h-8 w-8 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">
                No incoming transfer requests
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="outgoing" className="space-y-4 mt-4">
          {outgoingRequests.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {outgoingRequests.map((transfer) => (
                <TransferCard
                  key={transfer.id}
                  transfer={transfer}
                  type="outgoing"
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <Send className="mx-auto h-8 w-8 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">
                No outgoing transfer requests
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* New Transfer Modal */}
      <NewTransferModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewTransfer}
      />
    </div>
  );
}
