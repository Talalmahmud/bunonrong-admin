"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  X,
  Package,
  DollarSign,
  Hash,
  Image as ImageIcon,
  ShoppingBag,
  Ruler,
  Tag,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import Image from "next/image";
import api from "@/lib/axiosInterceptor";
import { cn } from "@/lib/utils";
import { imageLink } from "@/config/cloudinary";
import dynamic from "next/dynamic";

// Sub-types matching the Product interface
type Category = {
  id: string;
  name: string;
};

type Shop = {
  id: string;
  name: string;
};

type Size = {
  id: string;
  name: string;
};

// Form state interface
interface ProductFormState {
  // Basic Information
  name: string;
  slug: string;
  description: string;
  price: number | string;
  discountPrice: number | string;
  shopPrice: number | string;
  shopSellPrice: number | string;
  stock: number | string;
  keywords: string;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  imageUrls: string[];
  categoryId: string;
  subCategoryId: string;
  shopId: string;
  sizes: Size[];
}

interface Props {
  product?: Product;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export default function ProductForm({ product, onSuccess, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [sizePopoverOpen, setSizePopoverOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<ProductFormState>({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    discountPrice: product?.discountPrice?.toString() || "",
    stock: product?.stock?.toString() || "0",
    keywords: product?.keywords || "",
    images: [],
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    shopPrice: product?.shopPrice?.toString() || "0",
    shopSellPrice: product?.shopSellPrice?.toString() || "0",
    imageUrls: product?.imageUrls || [],
    categoryId: product?.categoryId || "",
    subCategoryId: product?.subCategoryId || "",
    shopId: product?.shopId || "",
    sizes: product?.sizes || [],
  });

  // Available options
  const [availableSizes, setAvailableSizes] = useState<Size[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);

  // UI state
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    product?.imageUrls || []
  );
  const [existingImages, setExistingImages] = useState<string[]>(
    product?.imageUrls || []
  );
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch initial data
  const fetchOptions = async () => {
    try {
      const [shopsRes, categoriesRes, sizesRes] = await Promise.all([
        api.get("/shops", { params: { page: 1, limit: 100 } }),
        api.get("/categories"),
        api.get("/sizes", {
          params: {
            page: 1,
            limit: 100,
          },
        }),
      ]);

      setShops(shopsRes.data.data || shopsRes.data);
      setCategories(categoriesRes.data.data || categoriesRes.data);
      setAvailableSizes(sizesRes.data.data || sizesRes.data);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  // Load product data when editing
  const loadProductData = useCallback(async () => {
    if (!product?.id) return;

    try {
      const response = await api.get(`/products/${product.id}`);
      const productData = response.data.data || response.data;

      setFormData({
        name: productData.name || "",
        slug: productData.slug || "",
        description: productData.description || "",
        price: productData.price?.toString() || "",
        discountPrice: productData.discountPrice?.toString() || "",
        shopPrice: product?.shopPrice?.toString() || "0",
        shopSellPrice: product?.shopSellPrice?.toString() || "0",
        stock: productData.stock?.toString() || "0",
        keywords: productData.keywords || "",
        images: productData.images || [],
        isActive: productData.isActive ?? true,
        isFeatured: productData.isFeatured ?? true,
        imageUrls: productData.imageUrls || [],
        categoryId: productData.categoryId || "",
        subCategoryId: productData.subCategoryId || "",
        shopId: productData.shopId || "",
        sizes: productData.sizes || [],
      });

      setExistingImages(productData.imageUrls || []);
      setImagePreviews(productData.imageUrls || []);
    } catch (error) {
      console.error("Error loading product data:", error);
    }
  }, [product]);

  // Generate slug from name
  const generateSlug = useCallback((name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
  }, []);

  // Handle size selection
  const handleSizeSelection = (size: Size) => {
    setFormData((prev) => {
      const isSelected = prev.sizes.some((s) => s.id === size.id);
      if (isSelected) {
        // Remove size if already selected
        return {
          ...prev,
          sizes: prev.sizes.filter((s) => s.id !== size.id),
        };
      } else {
        // Add size if not selected
        return {
          ...prev,
          sizes: [...prev.sizes, size],
        };
      }
    });
  };

  // Remove a selected size
  const removeSize = (sizeId: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s.id !== sizeId),
    }));
  };

  // Image handling
  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);

      if (files.length > 0) {
        const validFiles = files.filter((file) => {
          const validTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
          ];
          const isValidType = validTypes.includes(file.type);
          const isValidSize = file.size <= 5 * 1024 * 1024;

          if (!isValidType) {
            alert(`${file.name}: Invalid file type. Use JPG, PNG, or WebP.`);
            return false;
          }
          if (!isValidSize) {
            alert(`${file.name}: File too large. Max 5MB.`);
            return false;
          }
          return true;
        });

        setImageFiles((prev) => [...prev, ...validFiles]);

        validFiles.forEach((file) => {
          const objectUrl = URL.createObjectURL(file);
          setImagePreviews((prev) => [...prev, objectUrl]);
        });
      }
    },
    []
  );

  const removeImage = useCallback(
    (index: number) => {
      setImagePreviews((prev) => {
        const newPreviews = [...prev];
        const preview = newPreviews[index];

        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
          const fileIndex = prev
            .slice(0, index)
            .filter((p) => p.startsWith("blob:")).length;
          setImageFiles((current) => {
            const newFiles = [...current];
            newFiles.splice(fileIndex, 1);
            return newFiles;
          });
        } else {
          const existingIndex = existingImages.indexOf(preview);
          if (existingIndex >= 0) {
            setExistingImages((current) => {
              const newExisting = [...current];
              newExisting.splice(existingIndex, 1);
              return newExisting;
            });
          }
        }

        newPreviews.splice(index, 1);
        return newPreviews;
      });
    },
    [existingImages]
  );

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Required fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("slug", formData.slug);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("shopPrice", formData.shopPrice.toString());
      formDataToSend.append("shopSellPrice", formData.shopSellPrice.toString());

      formDataToSend.append("stock", formData.stock.toString());
      formDataToSend.append("keywords", formData.keywords);
      formDataToSend.append("isFeatured", formData.isFeatured.toString());

      formDataToSend.append("isActive", formData.isActive.toString());
      formDataToSend.append("categoryId", formData.categoryId);
      formDataToSend.append("shopId", formData.shopId);

      // Optional fields
      if (formData.discountPrice) {
        formDataToSend.append(
          "discountPrice",
          formData.discountPrice.toString()
        );
      }
      if (formData.subCategoryId) {
        formDataToSend.append("subCategoryId", formData.subCategoryId);
      }

      // Sizes - send only size IDs
      const sizeIds = formData.sizes.map((size) => size.id);
      formDataToSend.append("sizeIds", JSON.stringify(sizeIds));

      // Images
      if (product && existingImages.length > 0) {
        formDataToSend.append(
          "existingImageUrls",
          JSON.stringify(existingImages)
        );
      }

      imageFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      // Send request
      if (product) {
        await api.put(`/products/${product.id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/products", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setOpen(false);
      onSuccess?.();
    } catch (err) {
      console.error("Error saving product:", err);
      const errorMessage = err || "Failed to save product. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subcategories when category changes
  useEffect(() => {
    if (formData.categoryId) {
      api
        .get("/subcategories", { params: { categoryId: formData.categoryId } })
        .then((res) => setSubcategories(res.data.data || res.data))
        .catch((err) => console.error("Error fetching subcategories:", err));
    } else {
      setSubcategories([]);
      setFormData((prev) => ({ ...prev, subCategoryId: "" }));
    }
  }, [formData.categoryId]);

  // Load data when dialog opens
  useEffect(() => {
    if (open) {
      fetchOptions();
      if (product) {
        loadProductData();
      } else {
        // Reset form for new product
        setFormData({
          name: "",
          slug: "",
          description: "",
          price: "",
          discountPrice: "",
          shopPrice: "0",
          shopSellPrice: "0",
          stock: "0",
          keywords: "",
          images: [],
          isActive: true,
          isFeatured: true,
          imageUrls: [],
          categoryId: "",
          subCategoryId: "",
          shopId: "",
          sizes: [],
        });
        setImageFiles([]);
        setImagePreviews([]);
        setExistingImages([]);
      }
    }
  }, [open, product, loadProductData]);

  // Clean up blob URLs
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreviews]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant={product ? "outline" : "default"}>
            {product ? "Edit Product" : "+ Add Product"}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {product ? "Edit Product" : "Create New Product"}
          </DialogTitle>
          <DialogDescription>
            {product
              ? "Update product details"
              : "Add a new product to your store"}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details & Sizes</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="basic" className="space-y-4 pt-4">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      name: value,
                      slug:
                        product && prev.slug ? prev.slug : generateSlug(value),
                    }));
                  }}
                  required
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">Product Slug *</Label>
                <Input
                  id="slug"
                  placeholder="product-slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      slug: e.target.value,
                    }))
                  }
                  required
                />
                <p className="text-xs text-gray-500">
                  URL-friendly identifier (auto-generated from name)
                </p>
              </div>

              {/* Description */}

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <ReactQuill
                  theme="snow"
                  value={formData.description} // bind to your form state
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: value, // Quill returns HTML string
                    }))
                  }
                  placeholder="Describe your product..."
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                />
              </div>

              {/* Keywords */}
              <div className="space-y-2">
                <Label htmlFor="keywords">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Keywords
                  </div>
                </Label>
                <Input
                  id="keywords"
                  placeholder="e.g., summer, casual, cotton"
                  value={formData.keywords}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      keywords: e.target.value,
                    }))
                  }
                />
                <p className="text-xs text-gray-500">
                  Comma-separated keywords for better search
                </p>
              </div>

              {/* Price, Discount, Stock */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <div className="relative">
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      className="p-2"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountPrice">Discount Price</Label>
                  <div className="relative">
                    <Input
                      id="discountPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.discountPrice}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          discountPrice: e.target.value,
                        }))
                      }
                      className="p-2"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock *</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          stock: e.target.value,
                        }))
                      }
                      className="p-2"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className=" bg-red-500 p-2 rounded-md grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shopPrice">Shop Price *</Label>
                  <div className="relative">
                    <Input
                      id="shopPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.shopPrice}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          shopPrice: e.target.value,
                        }))
                      }
                      className="p-2"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shopSellPrice">Shop Sell Price</Label>
                  <div className="relative">
                    <Input
                      id="shopSellPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.shopSellPrice}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          shopSellPrice: e.target.value,
                        }))
                      }
                      className="p-2"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6 pt-4">
              {/* Shop */}
              <div className="space-y-2">
                <Label htmlFor="shop">Shop *</Label>
                <Select
                  value={formData.shopId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, shopId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select shop" />
                  </SelectTrigger>
                  <SelectContent>
                    {shops.map((shop) => (
                      <SelectItem key={shop.id} value={shop.id}>
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4" />
                          <span>{shop.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category & Subcategory */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, categoryId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <span>{category.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select
                    value={formData.subCategoryId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, subCategoryId: value }))
                    }
                    disabled={!formData.categoryId}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          formData.categoryId
                            ? "Select subcategory"
                            : "Select category first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sizes Selection - Multi-Select */}
              <div className="space-y-4">
                <div>
                  <Label className="text-lg font-medium flex items-center gap-2">
                    <Ruler className="h-5 w-5" />
                    Available Sizes
                  </Label>
                  <p className="text-sm text-gray-500">
                    Select sizes available for this product (multiple selection)
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Multi-select dropdown */}
                  <Popover
                    open={sizePopoverOpen}
                    onOpenChange={setSizePopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={sizePopoverOpen}
                        className="w-full justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Ruler className="h-4 w-4" />
                          <span>
                            {formData.sizes.length > 0
                              ? `${formData.sizes.length} size(s) selected`
                              : "Select sizes..."}
                          </span>
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search sizes..." />
                        <CommandEmpty>No size found.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-y-auto">
                          {availableSizes.map((size) => {
                            const isSelected = formData.sizes.some(
                              (s) => s.id === size.id
                            );
                            return (
                              <CommandItem
                                key={size.id}
                                onSelect={() => handleSizeSelection(size)}
                              >
                                <div className="flex items-center gap-2 w-full">
                                  <Check
                                    className={cn(
                                      "h-4 w-4",
                                      isSelected ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <span>{size.name}</span>
                                </div>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* Selected sizes badges */}
                  {formData.sizes.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Selected Sizes ({formData.sizes.length})
                      </Label>
                      <div className="flex flex-wrap gap-2 p-3 border rounded-lg min-h-[60px]">
                        {formData.sizes.map((size) => (
                          <Badge
                            key={size.id}
                            variant="secondary"
                            className="gap-1 pl-2 pr-1 py-1"
                          >
                            <Ruler className="h-3 w-3" />
                            {size.name}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-1 hover:bg-transparent"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSize(size.id);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="isActive" className="text-base">
                    Active Status
                  </Label>
                  <p className="text-sm text-gray-500">
                    {formData.isActive
                      ? "Product is visible to customers"
                      : "Product is hidden"}
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isActive: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="isFeatured" className="text-base">
                    Featured Product ?
                  </Label>
                  <p className="text-sm text-gray-500">
                    {formData.isFeatured
                      ? "Product is visible to customers featured"
                      : "Product is hidden from featured"}
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isFeatured: checked }))
                  }
                />
              </div>
            </TabsContent>

            <TabsContent value="images" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-lg font-medium">
                      Product Images
                    </Label>
                    <p className="text-sm text-gray-500">
                      Upload product photos (max 5MB each, JPG, PNG, WebP)
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Add Images
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {/* Image Grid */}
                {imagePreviews.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border">
                          <Image
                            src={imageLink(preview)}
                            alt={`Product image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 200px"
                          />
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                          Image {index + 1}
                          {index === 0 && " (Main)"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">Upload Product Images</p>
                        <p className="text-sm text-gray-500">
                          Click or drag and drop
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        JPG, PNG, WebP up to 5MB each
                      </p>
                    </div>
                  </div>
                )}

                {/* Image Requirements */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <ImageIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Image Guidelines</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          <li>
                            • First image will be used as the main product image
                          </li>
                          <li>• Use high-quality images with good lighting</li>
                          <li>• Recommended: Square or 4:3 aspect ratio</li>
                          <li>• Max file size: 5MB per image</li>
                          <li>• Formats: JPG, PNG, WebP</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <DialogFooter className="mt-6 pt-4 border-t">
              <div className="flex justify-between w-full">
                <div className="flex gap-2">
                  {activeTab === "details" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("basic")}
                    >
                      ← Back to Basic Info
                    </Button>
                  )}
                  {activeTab === "images" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("details")}
                    >
                      ← Back to Details
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  {activeTab === "basic" ? (
                    <Button
                      type="button"
                      onClick={() => setActiveTab("details")}
                      disabled={
                        !formData.name ||
                        !formData.slug ||
                        !formData.description
                      }
                    >
                      Continue to Details →
                    </Button>
                  ) : activeTab === "details" ? (
                    <Button
                      type="button"
                      onClick={() => setActiveTab("images")}
                      disabled={!formData.shopId || !formData.categoryId}
                    >
                      Continue to Images →
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={
                        loading || (imagePreviews.length === 0 && !product)
                      }
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span>
                          Saving...
                        </>
                      ) : product ? (
                        "Update Product"
                      ) : (
                        "Create Product"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
