// types/category.ts
export interface Category {
  id: string;
  name: string;
  slug: string;
  iconUrl: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
}
