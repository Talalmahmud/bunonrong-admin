"use client";

import React, { useState, useEffect } from "react";
import { Shop, ShopFormData } from "@/types/shop";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building,
  Phone,
  Mail,
  MapPin,
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react";
import Image from "next/image";
import api from "@/lib/axiosInterceptor";
import { imageLink } from "@/config/cloudinary";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Props {
  shop?: Shop;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export default function VendorShopForm({ shop, onSuccess, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    shop?.imageUrl || ""
  );

  const [formData, setFormData] = useState<ShopFormData>({
    name: shop?.name || "",
    phone: shop?.phone || "",
    email: shop?.email || "",
    imageUrl: shop?.imageUrl || "",
    address: shop?.address || "",
  });

  // Handle input changes
  const handleChange = (
    field: keyof ShopFormData,
    value: string | File | null
  ) => {
    if (field === "imageUrl" && value instanceof File) {
      // Handle image file
      const file = value;
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Invalid file type. Use JPG, PNG, or WebP.");
        return;
      }

      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      setFormData((prev) => ({ ...prev, imageUrl: objectUrl }));
    } else if (typeof value === "string") {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Clean up blob URL
  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Load data when dialog opens
  useEffect(() => {
    if (open) {
      if (shop) {
        setFormData({
          name: shop.name,
          phone: shop.phone,
          email: shop.email,
          imageUrl: shop.imageUrl || "",
          address: shop.address || "",
          ownerId: shop.ownerId,
        });
        setImagePreview(shop.imageUrl || "");
      } else {
        // Reset form for new shop
        setFormData({
          name: "",
          phone: "",
          email: "",
          imageUrl: "",
          address: "",
        });
        setImagePreview("");
        setImageFile(null);
      }
    }
  }, [open, shop]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value && key !== "imageUrl") {
          formDataToSend.append(key, value.toString());
        }
      });

      // Add image file if exists
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      if (shop) {
        // Update existing shop
        await api.put(`/shops/${shop.id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Create new shop
        await api.post("/shops", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error saving shop:", error);
      alert(error || "Failed to save shop");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview("");
    setImageFile(null);
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant={shop ? "outline" : "default"}>
            {shop ? "Edit Shop" : "+ Add Shop"}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {shop ? "Edit Shop" : "Create New Shop"}
          </DialogTitle>
          <DialogDescription>
            {shop ? "Update shop details" : "Add a new shop to the platform"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Shop Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Shop Name *
              </div>
            </Label>
            <Input
              id="name"
              placeholder="Enter shop name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number *
              </div>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </div>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </div>
            </Label>
            <Textarea
              id="address"
              placeholder="Enter shop address"
              value={formData.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              rows={3}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Shop Image</Label>
            {imagePreview ? (
              <div className="relative">
                <div className="w-32 h-32 rounded-lg overflow-hidden border">
                  <Image
                    src={imageLink(imagePreview)}
                    alt="Shop preview"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={removeImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => document.getElementById("image-upload")?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Upload Shop Image</p>
                    <p className="text-sm text-gray-500">
                      Click to upload or drag and drop
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    JPG, PNG, WebP up to 5MB
                  </p>
                </div>
              </div>
            )}
            <input
              id="image-upload"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={(e) =>
                handleChange("imageUrl", e.target.files?.[0] || null)
              }
              className="hidden"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  {shop ? "Updating..." : "Creating..."}
                </>
              ) : shop ? (
                "Update Shop"
              ) : (
                "Create Shop"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
