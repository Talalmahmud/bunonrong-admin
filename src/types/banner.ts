export type Banner = {
  id: string;
  title: string;
  redirectUrl?: string;
  slug?: string;
  imageUrl?: string; // Banner image
  isActive: boolean;
  order: number;
};
