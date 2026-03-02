"use client";

import { useState } from "react";
import CartItem from "./cart-item";
import CartSummary from "./cart-summary";


const initialCart = [
  {
    id: 1,
    title: "Wireless Headphones",
    price: 120,
    quantity: 1,
    image: "/images/electronics.jpg",
  },
  {
    id: 2,
    title: "Running Shoes",
    price: 90,
    quantity: 2,
    image: "/images/sports.jpg",
  },
];

export default function CartPage() {
  const [cart, setCart] = useState(initialCart);

  const updateQty = (id: number, type: "inc" | "dec") => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                type === "inc"
                  ? item.quantity + 1
                  : Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  const removeItem = (id: number) =>
    setCart((prev) => prev.filter((i) => i.id !== id));

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <section className="container mx-auto grid gap-6 px-4 py-8 md:grid-cols-3">
      {/* Cart items */}
      <div className="space-y-4 md:col-span-2">
        <h2 className="text-xl font-semibold">Shopping Cart</h2>

        {cart.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onIncrease={() => updateQty(item.id, "inc")}
            onDecrease={() => updateQty(item.id, "dec")}
            onRemove={() => removeItem(item.id)}
          />
        ))}
      </div>

      {/* Summary */}
      <CartSummary subtotal={subtotal} />
    </section>
  );
}
