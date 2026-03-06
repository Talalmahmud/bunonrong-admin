"use client";

import { useState } from "react";
import { Payment, PaymentStatus } from "@/types/payment";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import api from "@/lib/axiosInterceptor";

const STATUSES: PaymentStatus[] = ["PENDING", "SUCCESS", "FAILED"];

export default function PaymentStatusDialog({
  payment,
  onSuccess,
}: {
  payment: Payment;
  onSuccess: () => void;
}) {
  const [status, setStatus] = useState(payment.status);
  const [open, setOpen] = useState(false);

  const update = async () => {
    await api.put(`/payments/${payment.id}`, { status });

    onSuccess();
    setOpen(false); // ✅ CLOSE DIALOG
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Update</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Payment Status</DialogTitle>
        </DialogHeader>

        <select
          className="input"
          value={status}
          onChange={(e) => setStatus(e.target.value as PaymentStatus)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <Button onClick={update}>Save</Button>
      </DialogContent>
    </Dialog>
  );
}
