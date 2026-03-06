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
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, Upload, X, Globe, Image as ImageIcon2 } from "lucide-react";
import Image from "next/image";
import api from "@/lib/axiosInterceptor";
import { imageLink } from "@/config/cloudinary";

export interface Category {
  id: string;
  name: string;
  // slug: string;
  iconUrl: string;
  imageUrl: string;
  // sortOrder: number;
  // isActive: boolean;
}

interface Props {
  category?: Category;
  onSuccess?: () => void;
}

const CategoryForm = ({ category, onSuccess }: Props) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [name, setName] = useState(category?.name || "");

  // const [isActive, setIsActive] = useState(category?.isActive ?? true);

  // Image states
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(
    category?.iconUrl ? `${imageLink(category.iconUrl)}.svg` : null,
  );

  const [imagePreview, setImagePreview] = useState<string | null>(
    category?.imageUrl ? imageLink(category.imageUrl) : null,
  );

  const [uploading, setUploading] = useState(false);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
  };

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
        alert(
          "Please select a valid image file (JPG, JPEG, PNG, WebP, or SVG)",
        );
        return;
      }

      if (selectedFile.size > 2 * 1024 * 1024) {
        // 2MB for icons
        alert("Icon file size must be less than 2MB");
        return;
      }

      setIconFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setIconPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  // Handle file selection for main images
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(selectedFile.type)) {
        alert("Please select a valid image file (JPG, JPEG, PNG, or WebP)");
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        // 5MB for main images
        alert("Image file size must be less than 5MB");
        return;
      }

      setImageFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setImagePreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
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
    setIconPreview(category?.iconUrl || null);
    if (iconInputRef.current) {
      iconInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(category?.imageUrl || null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      // formData.append("slug", slug);
      // formData.append("sortOrder", sortOrder.toString());
      // formData.append("isActive", isActive.toString());

      if (iconFile) {
        formData.append("icon", iconFile);
      }
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (category) {
        await api.put(`/categories/${category.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/categories", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setOpen(false);
      onSuccess?.();
    } catch (err) {
      console.error("Error saving category:", err);
      alert("Failed to save category. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={category ? "outline" : "default"}>
          {category ? "Edit Category" : "Add Category"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Create New Category"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Category Details</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="details" className="space-y-4 pt-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter category name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />
              </div>

              {/* Slug */}
              {/* <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  placeholder="category-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  URL-friendly identifier (auto-generated from name)
                </p>
              </div> */}

              {/* Sort Order */}
              {/* <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order *</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  required
                />
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
                  <Label className="text-lg font-medium">
                    Category Icon
                    <span className="text-xs text-gray-500 ml-2">
                      (SVG, PNG, max 2MB)
                    </span>
                  </Label>
                  {iconPreview && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveIcon}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove Icon
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
                  <Label className="text-lg font-medium">
                    Category Image
                    <span className="text-xs text-gray-500 ml-2">
                      (JPG, PNG, WebP, max 5MB)
                    </span>
                  </Label>
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove Image
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
                          alt="Category image preview"
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
                          <ImageIcon2 className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">Upload Category Image</p>
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
                        <p className="text-sm font-medium">Image Guidelines</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          <li>
                            • <strong>Icon:</strong> Square format (1:1),
                            transparent background recommended, SVG preferred
                          </li>
                          <li>
                            • <strong>Category Image:</strong> Landscape format
                            (16:9), high resolution for best display
                          </li>
                          <li>
                            • <strong>File sizes:</strong> Icon (max 2MB), Main
                            image (max 5MB)
                          </li>
                          <li>
                            • <strong>Formats:</strong> SVG, PNG, JPG, WebP
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
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  {activeTab === "details" ? (
                    <Button
                      type="button"
                      onClick={() => setActiveTab("images")}
                    >
                      Continue to Images →
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={
                        uploading || (!iconPreview && !category?.iconUrl)
                      }
                    >
                      {uploading
                        ? "Saving..."
                        : category
                          ? "Update Category"
                          : "Create Category"}
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
};

export default CategoryForm;
