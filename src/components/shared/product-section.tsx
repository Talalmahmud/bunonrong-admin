import ProductCard from "./product-card";

const products = [
  {
    id: 1,
    title: "Premium Cotton T-Shirt",
    description: "Soft and comfortable, perfect for everyday wear.",
    price: 40,
    discountPrice: 29,
    rating: 4,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    title: "Casual Denim Jacket",
    description:
      "Stylish and durable jacket for casual outings. Stylish and durable jacket for casual outings.",
    price: 120,
    discountPrice: 89,
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1542060748-10c28b62716e?w=900&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    title: "Classic Leather Shoes",
    description: "Premium leather shoes with elegant design.",
    price: 150,
    discountPrice: 120,
    rating: 4,
    image:
      "https://images.unsplash.com/photo-1528701800489-20be3c8db6d1?w=900&auto=format&fit=crop&q=60",
  },
  {
    id: 4,
    title: "Stylish Backpack",
    description: "Carry your essentials in style and comfort.",
    price: 80,
    discountPrice: 59,
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&auto=format&fit=crop&q=60",
  },
];

export default function ProductSection() {
  return (
    <section className="w-full py-12">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Featured Products
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Limited time discounts available
          </p>
        </div>
        <button className="text-sm font-medium text-indigo-600 hover:underline">
          View all
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
