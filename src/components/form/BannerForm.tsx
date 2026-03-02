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
import { ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { Banner } from "@/types/banner";
import api from "@/lib/axiosInterceptor";
import { imageLink } from "@/config/cloudinary";

interface Props {
  banner?: Banner;
  onSuccess?: () => void;
}

const BannerForm = ({ banner, onSuccess }: Props) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(banner?.title || "");
  const [slug, setSlug] = useState(banner?.slug || "");
  const [redirectUrl, setRedirectUrl] = useState(
    imageLink(banner?.redirectUrl || "") || "",
  );
  const [order, setOrder] = useState(banner?.order || 0);
  const [isActive, setIsActive] = useState(banner?.isActive ?? true);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    banner?.imageUrl || null,
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      // Check file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(selectedFile.type)) {
        alert("Please select a valid image file (JPG, JPEG, PNG, or WebP)");
        return;
      }

      // Check file size (limit to 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setFile(selectedFile);

      // Create preview URL
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);

      // Cleanup function
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageLink(previewUrl));
      }
    };
  }, [previewUrl]);

  const handleRemoveImage = () => {
    setFile(null);
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imageLink(previewUrl));
    }
    // If editing existing banner, keep the original image URL
    setPreviewUrl(banner?.imageUrl || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("redirectUrl", redirectUrl);
      formData.append("order", order.toString());
      formData.append("isActive", isActive.toString());

      // Append file only if new file is selected
      if (file) {
        formData.append("image", file);
      }

      if (banner) {
        await api.put(`/banners/${banner.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/banners", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setOpen(false);
      onSuccess?.();
    } catch (err) {
      console.error("Error saving banner:", err);
      alert("Failed to save banner. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={banner ? "outline" : "default"}>
          {banner ? "Edit Banner" : "Add Banner"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {banner ? "Edit Banner" : "Create New Banner"}
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter banner title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Position/Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                placeholder="e.g., home-hero, sidebar-banner"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">
                Used to identify banner placement
              </p>
            </div>

            {/* Redirect URL */}
            <div className="space-y-2">
              <Label htmlFor="redirectUrl">Redirect URL</Label>
              <Input
                id="redirectUrl"
                placeholder="https://example.com"
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
              />
            </div>

            {/* Order */}
            <div className="space-y-2">
              <Label htmlFor="order">Display Order *</Label>
              <Input
                id="order"
                type="number"
                min="0"
                placeholder="0"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                required
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Active Status</Label>
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <Label htmlFor="image">
                Banner Image *
                <span className="text-xs text-gray-500 ml-2">
                  (JPG, PNG, WebP, max 5MB)
                </span>
              </Label>

              <div className="space-y-4">
                {/* Upload Area */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="image"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {previewUrl ? (
                    <div className="relative">
                      <div className="relative w-full max-w-md mx-auto aspect-video rounded-md overflow-hidden">
                        <Image
                          src={imageLink(previewUrl)}
                          alt={file?.name || banner?.title || "Preview"}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 500px"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <Upload className="h-6 w-6 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">Click to upload</p>
                        <p className="text-sm text-gray-500">
                          or drag and drop
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        JPG, PNG, WebP up to 5MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Image Requirements */}
                {!previewUrl && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <ImageIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Recommended</p>
                          <ul className="text-xs text-gray-500 space-y-1">
                            <li>
                              • Aspect ratio: 16:9 (banners) or 1:1 (square)
                            </li>
                            <li>
                              • Resolution: 1920×1080 or higher for HD displays
                            </li>
                            <li>• File size: Under 5MB for fast loading</li>
                            <li>• Format: JPG, PNG, or WebP</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={uploading || !previewUrl}>
              {uploading
                ? "Saving..."
                : banner
                  ? "Update Banner"
                  : "Create Banner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BannerForm;
