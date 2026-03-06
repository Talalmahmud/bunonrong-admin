"use client";

import Image from "next/image";

type Category = {
  id: number;
  title: string;
  image: string;
};

type CategoryCardProps = {
  category: Category;
};

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition cursor-pointer">
      {/* Image */}
      <div className="relative h-48 w-full">
        <Image
          src={category.image}
          alt={category.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/25 transition group-hover:bg-black/30"></div>

      {/* Title */}
      <h3 className="absolute bottom-4 left-4 text-white text-lg font-bold z-10 drop-shadow-lg">
        {category.title}
      </h3>
    </div>
  );
}
