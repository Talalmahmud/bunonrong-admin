"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, MoreVertical } from "lucide-react";
import Image from "next/image";
import { imageLink } from "@/config/cloudinary";
import api from "@/lib/axiosInterceptor";
import { Order } from "@/types/order";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const statusColor: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const paymentColor: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
};

export default function UserOrdersTable({
  orders,
  onRefresh,
}: {
  orders: Order[];
  onRefresh: () => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const updateOrder = async (
    orderId: string,
    payload: { status?: string; paymentStatus?: string },
  ) => {
    try {
      setLoadingIds((prev) => new Set(prev).add(orderId));

      await api.put(`/orders/${orderId}`, payload);

      toast.success("Order updated successfully");

      onRefresh();
    } catch (err) {
      toast.error(`${err}`);
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });
    }
  };

  const orderStatuses = [
    "PENDING",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];
  const paymentStatuses = ["PENDING", "PAID", "FAILED"];

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>

            <TableHead className="text-right">Total</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order) => (
            <React.Fragment key={order.id}>
              <TableRow>
                <TableCell className="w-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setOpenId(openId === order.id ? null : order.id)
                    }
                  >
                    {openId === order.id ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </Button>
                </TableCell>

                <TableCell className="font-medium">
                  #{order.id.slice(-6)}
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  <Badge className={statusColor[order.status]}>
                    {order.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge
                    className={paymentColor[order.payment?.status || "PENDING"]}
                  >
                    {order.payment?.status || "PENDING"}
                  </Badge>
                </TableCell>

                <TableCell className="text-right font-semibold">
                  ৳{order.totalAmount}
                </TableCell>
                <TableCell className="text-red-700 font-semibold">
                  {order.comment}
                </TableCell>

                {/* ACTION DROPDOWN */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <p className="px-4 py-1 font-semibold text-sm">
                        Order Status
                      </p>
                      {orderStatuses.map((status) => (
                        <DropdownMenuItem
                          key={status}
                          disabled={loadingIds.has(order.id)}
                          onClick={() => updateOrder(order.id, { status })}
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}

                      <hr className="my-1" />

                      <p className="px-4 py-1 font-semibold text-sm">
                        Payment Status
                      </p>
                      {paymentStatuses.map((status) => (
                        <DropdownMenuItem
                          key={status}
                          disabled={loadingIds.has(order.id)}
                          onClick={() =>
                            updateOrder(order.id, { paymentStatus: status })
                          }
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>

              {/* DETAILS ROW */}
              {openId === order.id && (
                <TableRow>
                  <TableCell colSpan={7} className="bg-muted/40">
                    {/* details like items, shipping, payment */}
                    <div className="grid gap-6 md:grid-cols-3 text-sm">
                      {/* ITEMS */}
                      <div>
                        <p className="font-semibold mb-2">Items</p>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex gap-3">
                              <div className="relative h-50 w-50 overflow-hidden rounded-md border">
                                <Image
                                  src={imageLink(item.imageUrl)}
                                  fill
                                  alt={item.product.name}
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  className="object-cover transition-transform duration-300 hover:scale-110"
                                />
                              </div>

                              <div>
                                <p className="font-medium">
                                  {item.product.name}
                                </p>
                                <p className="text-muted-foreground">
                                  Size: {item.size?.name || "N/A"}
                                </p>
                                <p>
                                  ৳{item.price}
                                  {item.discountPrice && (
                                    <span className="text-green-600 ml-1">
                                      (-৳{item.discountPrice})
                                    </span>
                                  )}
                                  × {item.quantity}
                                </p>
                              </div>
                              <div>
                                <p className="font-semibold mb-2">Shop</p>
                                <p>{item.product.shop.name}</p>
                                <p>{item.product.shop.phone}</p>
                                <p>{item.product.shop.email}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* SHIPPING */}
                      <div>
                        <p className="font-semibold mb-2">Shipping Address</p>
                        <p>{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.phone}</p>
                        <p>
                          {order.shippingAddress.address},{" "}
                          {order.shippingAddress.district}
                        </p>
                      </div>
                      {/* SHOP */}

                      {/* PAYMENT + SUMMARY */}
                      <div>
                        <p className="font-semibold mb-2">Payment</p>
                        <p>Method: {order.payment?.method}</p>
                        <p>Status: {order.payment?.status}</p>
                        {order.payment?.txId && (
                          <p>TxID: {order.payment.txId}</p>
                        )}

                        <hr className="my-2" />

                        <p>Delivery: ৳{order.deliveryCharge}</p>
                        <p className="font-medium">
                          Total: ৳{order.totalAmount}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
