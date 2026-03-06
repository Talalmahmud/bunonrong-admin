// types/payment.ts
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";
export type PaymentType = "USER_PAYMENT" | "VENDOR_PAYOUT";

export interface Payment {
  id: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  type: PaymentType;
  txId: string;
  createdAt: string;

  user?: {
    id: string;
    name: string;
    email: string;
  };

  vendor?: {
    id: string;
    shopName: string;
  };

  order?: {
    id: string;
    totalAmount: number;
  };
}
