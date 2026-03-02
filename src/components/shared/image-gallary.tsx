"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

type ImageGalleryProps = {
  images: string[];
};

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Thumbnails */}
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
          {images.map((img, idx) => (
            <div
              key={img}
              className={`relative h-20 w-20 cursor-pointer overflow-hidden rounded-lg border-2 transition-transform duration-300 ${
                idx === selectedIndex
                  ? "border-indigo-600 scale-105"
                  : "border-transparent hover:scale-105 hover:border-slate-300"
              }`}
              onClick={() => setSelectedIndex(idx)}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Main Image */}
        <div
          className="relative flex-1 h-80 md:h-[500px] rounded-lg overflow-hidden border cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <Image
            src={images[selectedIndex]}
            alt={`Product ${selectedIndex + 1}`}
            fill
            className="object-contain transition-all duration-300"
          />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative max-w-3xl w-full h-full">
            <button
              className="absolute top-3 right-3 z-50 rounded-full bg-white p-2 shadow-md"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-5 w-5 text-slate-700" />
            </button>
            <Image
              src={images[selectedIndex]}
              alt={`Product ${selectedIndex + 1}`}
              fill
              className="object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}
