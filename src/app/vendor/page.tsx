import CategoryCard from "@/components/shared/category-card";
import HeroSlider from "@/components/shared/hero-slider";
import ProductSection from "@/components/shared/product-section";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
const categories = [
  {
    id: 1,
    title: "Electronics",
    image:
      "  https://images.unsplash.com/photo-1609943180864-aad30e57ce60?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTh8fGNsb3Roc3xlbnwwfHwwfHx8MA%3D%3D",
  },
  { id: 2, title: "Clothing", image: "/images/clothing.jpg" },
  { id: 3, title: "Home & Kitchen", image: "/images/home.jpg" },
  { id: 4, title: "Sports", image: "/images/sports.jpg" },
  { id: 5, title: "Sports", image: "/images/sports.jpg" },
  { id: 6, title: "Sports", image: "/images/sports.jpg" },
];
function page() {
  return (
    <>
      <HeroSlider />
      <ProductSection />
      <ProductSection />
      <section className="container mx-auto px-4 md:px-0 py-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 auto-rows-fr ">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
    </>
  );
}

export default page;
