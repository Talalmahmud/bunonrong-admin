"use client";

import { useCallback, useEffect, useState } from "react";
import { Payment } from "@/types/payment";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaymentDetails from "../shared/PaymentDetails";
import PaymentStatusDialog from "../shared/PaymentStatusDialog";
import api from "@/lib/axiosInterceptor";

export default function VendorPaymentTable() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const load = useCallback(async () => {
    const res = await api.get("/payments", {
      params: { status, type },
    });
    setPayments(res.data.data);
  }, [status, type]);

  useEffect(() => {
    const loadData = async () => load();
    loadData();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <select
          className="input"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILED">Failed</option>
        </select>

        <select
          className="input"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="USER_PAYMENT">User Payment</option>
          <option value="VENDOR_PAYOUT">Vendor Payout</option>
        </select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {payments.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.id.slice(0, 8)}</TableCell>
              <TableCell>
                {p.amount} <span className=" text-red-700"> BDT</span>
              </TableCell>
              <TableCell>{p.status}</TableCell>
              <TableCell>{p.type}</TableCell>
              <TableCell>{p.method}</TableCell>
              <TableCell>
                {new Date(p.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <PaymentDetails payment={p} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
