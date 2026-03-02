"use client";

import Image from "next/image";
import { ShoppingCart, CreditCard, Heart, Star } from "lucide-react";
import { useState } from "react";

type Product = {
  id: number;
  title: string;
  description?: string;
  price: number;
  discountPrice: number;
  rating: number; // 0-5
  image: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const discountPercent = Math.round(
    ((product.price - product.discountPrice) / product.price) * 100
  );

  return (
    <div className="group relative flex flex-col h-full overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <span className="absolute left-3 top-3 z-10 rounded-lg bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-md">
          -{discountPercent}%
        </span>
      )}

      {/* Wishlist Button */}
      <button
        onClick={() => setWishlisted(!wishlisted)}
        className={`absolute right-3 top-3 z-10 rounded-full p-2 text-white shadow-lg transition-all duration-300 ${
          wishlisted
            ? "bg-red-500 scale-110"
            : "bg-red-800 text-red-500 hover:bg-red-500 hover:text-white"
        }`}
      >
        <Heart className="h-5 w-5" />
      </button>

      {/* Product Image */}
      <div className="relative h-56 w-full overflow-hidden rounded-t-2xl">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Product Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title */}
        <h3 className="line-clamp-2 text-base font-semibold text-slate-900">
          {product.title}
        </h3>

        {/* Optional Description */}
        {product.description && (
          <p className="mt-1 line-clamp-3 text-sm text-slate-500">
            {product.description}
          </p>
        )}

        {/* Rating */}
        {product.rating && (
          <div className="mt-2 flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < product.rating ? "text-yellow-400" : "text-slate-300"
                }`}
              />
            ))}
          </div>
        )}

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-indigo-600">
            ${product.discountPrice}
          </span>
          {discountPercent > 0 && (
            <span className="text-sm text-slate-400 line-through">
              ${product.price}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex justify-between gap-3">
          <button className=" flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-indigo-700 transition-transform duration-200 hover:-translate-y-0.5">
            <ShoppingCart className="h-4 w-4" />
          </button>

          <button className=" flex items-center justify-center gap-2 rounded-xl border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 hover:scale-105 transition-transform duration-200">
            <CreditCard className="h-4 w-4" />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
