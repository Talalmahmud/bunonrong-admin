"use client";

import { Payment } from "@/types/payment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function PaymentDetails({ payment }: { payment: Payment }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          View
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Payment #{payment.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <p><strong>Amount:</strong> ${payment.amount}</p>
          <p><strong>Status:</strong> {payment.status}</p>
          <p><strong>Type:</strong> {payment.type}</p>
          <p><strong>Method:</strong> {payment.method}</p>
          <p><strong>Transaction ID:</strong> {payment.txId}</p>

          {payment.user && (
            <p>
              <strong>User:</strong> {payment.user.name} ({payment.user.email})
            </p>
          )}

          {payment.vendor && (
            <p>
              <strong>Vendor:</strong> {payment.vendor.shopName}
            </p>
          )}

          {payment.order && (
            <p>
              <strong>Order:</strong> #{payment.order.id} — $
              {payment.order.totalAmount}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
