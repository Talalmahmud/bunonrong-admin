"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  X,
  FolderTree,
  Image as ImageIcon,
  Globe,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import api from "@/lib/axiosInterceptor";
import { SubCategory } from "@/types/sub-category";
import { imageLink } from "@/config/cloudinary";

interface Category {
  id: string;
  name: string;
  iconUrl?: string;
}

interface Props {
  subcategory?: SubCategory;
  onSuccess?: () => void;
  children?: React.ReactNode; // Add this line
}

export default function SubCategoryForm({
  subcategory,
  onSuccess,
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [name, setName] = useState(subcategory?.name || "");
  const [categoryId, setCategoryId] = useState(subcategory?.categoryId || "");
  const [sortOrder, setSortOrder] = useState(subcategory?.sortOrder || 0);
  const [isActive, setIsActive] = useState(subcategory?.isActive ?? true);
  const [categories, setCategories] = useState<Category[]>([]);

  // Image states
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(
    imageLink(subcategory?.iconUrl || "") || null,
  );

  const [imagePreview, setImagePreview] = useState<string | null>(
    subcategory?.imageUrl ? imageLink(subcategory.imageUrl) : null,
  );

  const [loading, setLoading] = useState(false);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Generate slug from name

  // Handle name change and auto-generate slug
  const handleNameChange = (value: string) => {
    setName(value);
  };

  // Handle file selection for icons
  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/svg+xml",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        alert("Please select a valid icon file (JPG, PNG, WebP, or SVG)");
        return;
      }

      if (selectedFile.size > 2 * 1024 * 1024) {
        alert("Icon file size must be less than 2MB");
        return;
      }

      setIconFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setIconPreview(objectUrl);
    }
  };

  // Handle file selection for main images
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(selectedFile.type)) {
        alert("Please select a valid image file (JPG, PNG, or WebP)");
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("Image file size must be less than 5MB");
        return;
      }

      setImageFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setImagePreview(objectUrl);
    }
  };

  // Clean up preview URLs
  useEffect(() => {
    return () => {
      [iconPreview, imagePreview].forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [iconPreview, imagePreview]);

  const handleRemoveIcon = () => {
    setIconFile(null);
    if (iconPreview && iconPreview.startsWith("blob:")) {
      URL.revokeObjectURL(iconPreview);
    }
    setIconPreview(subcategory?.iconUrl || null);
    if (iconInputRef.current) {
      iconInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(subcategory?.imageUrl || null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);

      formData.append("categoryId", categoryId);
      // formData.append("sortOrder", sortOrder.toString());
      // formData.append("isActive", isActive.toString());

      if (iconFile) {
        formData.append("icon", iconFile);
      }
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (subcategory) {
        await api.patch(`/subcategories/${subcategory.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/subcategories", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setOpen(false);
      onSuccess?.();
    } catch (err) {
      console.log("Error saving subcategory:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || ( // Use children if provided, otherwise default button
          <Button size="sm" variant={subcategory ? "outline" : "default"}>
            {subcategory ? "Edit Subcategory" : "+ Add Subcategory"}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderTree className="h-5 w-5" />
            {subcategory ? "Edit Subcategory" : "Create New Subcategory"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="details" className="space-y-4 pt-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Subcategory Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter subcategory name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <Label htmlFor="category">Parent Category *</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          {category.iconUrl && (
                            <div className="relative w-4 h-4">
                              <Image
                                src={`${imageLink(category?.iconUrl)}.svg`}
                                alt={category.name}
                                fill
                                className="object-contain"
                                sizes="16px"
                              />
                            </div>
                          )}
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {categories.length === 0 && (
                  <div className="flex items-center gap-2 text-amber-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    No categories found. Please create a category first.
                  </div>
                )}
              </div>

              {/* Sort Order */}
              {/* <div className="space-y-2">
                <Label htmlFor="sortOrder">Display Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                />
                <p className="text-xs text-gray-500">
                  Lower numbers appear first
                </p>
              </div> */}

              {/* Active Status */}
              {/* <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Active Status</Label>
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div> */}
            </TabsContent>

            <TabsContent value="images" className="space-y-6 pt-4">
              {/* Icon Upload */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-lg font-medium">
                      Subcategory Icon
                    </Label>
                    <p className="text-sm text-gray-500">
                      Small icon for navigation and lists
                    </p>
                  </div>
                  {iconPreview && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveIcon}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>

                <div
                  onClick={() => iconInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors min-h-[200px] flex items-center justify-center"
                >
                  <input
                    ref={iconInputRef}
                    type="file"
                    id="icon"
                    accept=".svg,.png,.jpg,.jpeg,.webp,image/svg+xml,image/png,image/jpeg,image/webp"
                    onChange={handleIconChange}
                    className="hidden"
                  />

                  {iconPreview ? (
                    <div className="relative w-full h-full">
                      <div className="relative w-32 h-32 mx-auto rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                        <Image
                          src={iconPreview}
                          alt="Icon preview"
                          width={128}
                          height={128}
                          className="object-contain p-4"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                          <Globe className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">Upload Icon</p>
                        <p className="text-sm text-gray-500">
                          Click or drag and drop
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        SVG, PNG, JPG, WebP up to 2MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Main Image Upload */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-lg font-medium">
                      Subcategory Image
                    </Label>
                    <p className="text-sm text-gray-500">
                      Large banner image for subcategory pages
                    </p>
                  </div>
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>

                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors min-h-[300px] flex items-center justify-center"
                >
                  <input
                    ref={imageInputRef}
                    type="file"
                    id="image"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <div className="relative w-full max-w-md mx-auto aspect-video rounded-lg overflow-hidden bg-gray-50">
                        <Image
                          src={imagePreview}
                          alt="Subcategory image preview"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 500px"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">Upload Subcategory Image</p>
                        <p className="text-sm text-gray-500">
                          Click or drag and drop
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        JPG, PNG, WebP up to 5MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Image Requirements */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <ImageIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          Recommended Specifications
                        </p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          <li>
                            • <strong>Icon:</strong> Square (1:1), transparent
                            background, SVG or PNG recommended
                          </li>
                          <li>
                            • <strong>Image:</strong> Landscape (16:9), high
                            resolution for banner display
                          </li>
                          <li>
                            • <strong>Formats:</strong> JPG, PNG, WebP, SVG (for
                            icons)
                          </li>
                          <li>
                            • <strong>Max Size:</strong> Icon - 2MB, Image - 5MB
                          </li>
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
                  {activeTab === "details" ? (
                    <Button
                      type="button"
                      onClick={() => setActiveTab("images")}
                      disabled={!categoryId || categories.length === 0}
                    >
                      Continue to Images →
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={
                        loading || !categoryId || categories.length === 0
                      }
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span>
                          Saving...
                        </>
                      ) : subcategory ? (
                        "Update Subcategory"
                      ) : (
                        "Create Subcategory"
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
