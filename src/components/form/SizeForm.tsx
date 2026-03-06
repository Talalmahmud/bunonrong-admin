"use client";

import React, { useState } from "react";
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
import { Ruler, Plus } from "lucide-react";
import api from "@/lib/axiosInterceptor";

interface Size {
  id: string;
  name: string;
}

interface Props {
  size?: Size;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export default function SizeForm({ size, onSuccess, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(size?.name || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (size) {
        await api.put(`/sizes/${size.id}`, { name });
      } else {
        await api.post("/sizes", { name });
      }

      setOpen(false);
      setName("");
      onSuccess?.();
    } catch (err) {
      console.error("Error saving size:", err);
      alert(err|| "Failed to save size. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant={size ? "outline" : "default"}>
            {size ? "Edit Size" : "+ Add Size"}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            {size ? "Edit Size" : "Create New Size"}
          </DialogTitle>
          <DialogDescription>
            {size ? "Update size information" : "Add a new size to your catalog"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Size Name *</Label>
            <Input
              id="name"
              placeholder="e.g., S, M, L, XL, 28, 32, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
            <p className="text-xs text-gray-500">
              Enter the size identifier (alphanumeric, max 10 characters)
            </p>
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
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Saving...
                </>
              ) : size ? (
                "Update Size"
              ) : (
                "Create Size"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}