// types/subcategory.ts
export interface SubCategory {
  id: string;
  name: string;
  iconUrl: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    iconUrl?: string;
    imageUrl?: string;
  };
}
