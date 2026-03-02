"use client";

import { useState } from "react";
import { Order, OrderStatus } from "@/types/order";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import api from "@/lib/axiosInterceptor";

const STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function OrderStatusDialog({
  order,
  onSuccess,
}: {
  order: Order;
  onSuccess: () => void;
}) {
  const [status, setStatus] = useState<OrderStatus>(order.status);

  const update = async () => {
    await api.patch(`/orders/${order.id}/status`, { status });
    onSuccess();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Update</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
        </DialogHeader>

        <select
          className="input"
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
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
