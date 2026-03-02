// types/order.ts

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export type PaymentMethod = "COD" | "BKASH";
export type ShippingAddress = {
  id: string;
  userId: string;
  name: string;
  phone: string;
  district: string;
  address: string;
  isDefault: boolean;
  createdAt: string;
};
export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;

  imageUrl: string;

  price: number;
  discountPrice?: number | null;
  quantity: number;

  createdAt: string;

  product: {
    id: string;
    name: string;
    slug: string;
    shop: {
      name: string;
      phone: string;
      email: string;
    };
    shopPrice: number;
  };

  size?: {
    id: string;
    name: string;
  } | null;
};
export type Payment = {
  id: string;
  orderId: string;

  method: PaymentMethod;
  status: PaymentStatus;

  amount: number;
  txId?: string | null;
  bkashNumber?: string | null;

  createdAt: string;
  updatedAt: string;
};
export type Order = {
  id: string;
  userId: string;

  status: OrderStatus;

  totalAmount: number;
  deliveryCharge: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;

  shippingAddressId: string;
  shippingAddress: ShippingAddress;

  payment?: Payment | null;
  items: OrderItem[];
};
