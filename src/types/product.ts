// types/product.ts
export interface Product {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  shopPrice:number,
    shopSellPrice: number,
  discountPrice: number;
  stock: number;
  keywords: string;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  imageUrls: string[];
  userId: string;
  categoryId: string;
  subCategoryId?: string;
  shopId: string;
  sizes?: ProductSize[];
}

export interface VendorProduct {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  shopPrice: number;
  shopSellPrice: number;
  stock: number;
  images: string[];
  isActive: boolean;
  imageUrls: string[];
  userId: string;
  categoryId: string;
  subCategoryId?: string;
  shopId: string;
  sizes?: ProductSize[];
}

export interface ProductSize {
  id: string;
  name: string;
}
