export interface Shop {
  id: string;
  name: string;
  phone: string;
  email: string;
  imageUrl?: string;
  address?: string;
  emailVerified: boolean;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  owner?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export interface ShopFormData {
  name: string;
  phone: string;
  email: string;
  imageUrl?: string;
  address?: string;
  ownerId?: string;
}
