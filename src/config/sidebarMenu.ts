import { BadgeCentIcon, ShoppingBasket, User } from "lucide-react";
import { ComponentType, SVGProps } from "react";

export type SidebarItem = {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  href?: string;
  children?: {
    label: string;
    href: string;
  }[];
};

export const sidebarMenu: SidebarItem[] = [
  {
    label: "Users",
    icon: User,
    href: "/admin/user",
  },
  {
    label: "Shops",
    icon: ShoppingBasket,
    href: "/admin/shop",
  },
  {
    label: "Banners",
    icon: BadgeCentIcon,
    href: "/admin/banner",
  },
  {
    label: "Category",
    icon: BadgeCentIcon,
    href: "/admin/category",
  },
  {
    label: "Sub-Category",
    icon: BadgeCentIcon,
    href: "/admin/sub-category",
  },
  {
    label: "Sizes",
    icon: BadgeCentIcon,
    href: "/admin/size",
  },
  {
    label: "Product",
    icon: BadgeCentIcon,
    href: "/admin/product",
  },
  {
    label: "Order",
    icon: BadgeCentIcon,
    href: "/admin/order",
  },
  {
    label: "Payment",
    icon: BadgeCentIcon,
    href: "/admin/payment",
  },
  // {
  //   label: "Products",
  //   icon: ShoppingBagIcon,
  //   children: [
  //     { label: "All Products", href: "/products" },
  //     {
  //       label: "Categories Categories Categories Categories Categories",
  //       href: "/products/categories",
  //     },
  //   ],
  // },
];

export const vendorSidebarMenu: SidebarItem[] = [
  {
    label: "Shops",
    icon: ShoppingBasket,
    href: "/vendor/shop",
  },

  {
    label: "Product",
    icon: BadgeCentIcon,
    href: "/vendor/product",
  },
  {
    label: "Order",
    icon: BadgeCentIcon,
    href: "/vendor/order",
  },
  {
    label: "Payment",
    icon: BadgeCentIcon,
    href: "/vendor/payment",
  },
  // {
  //   label: "Products",
  //   icon: ShoppingBagIcon,
  //   children: [
  //     { label: "All Products", href: "/products" },
  //     {
  //       label: "Categories Categories Categories Categories Categories",
  //       href: "/products/categories",
  //     },
  //   ],
  // },
];
