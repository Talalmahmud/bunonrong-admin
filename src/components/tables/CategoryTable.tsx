"use client";

import { useEffect, useState } from "react";
import { Category } from "@/types/category";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import api from "@/lib/axiosInterceptor";
import CategoryForm from "../form/CategoryForm";
import Image from "next/image";
import { imageLink } from "@/config/cloudinary";

export default function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([]);

  const load = async () => {
    const res = await api.get("/categories");
    setCategories(res.data.data);
  };

  useEffect(() => {
    const loadData = async () => await load();
    loadData();
  }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete category?")) return;
    await api.delete(`/categories/${id}`);
    load();
  };

  return (
    <div className="space-y-4">
      <CategoryForm onSuccess={load} />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Icon</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {categories.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <Image
                  src={`${imageLink(c.iconUrl)}`}
                  height={36}
                  width={36}
                  alt=""
                  loading="eager"
                  className="h-8"
                />
              </TableCell>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.slug}</TableCell>
              <TableCell>{c.sortOrder}</TableCell>
              <TableCell>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    c.isActive ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {c.isActive ? "Active" : "Inactive"}
                </span>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <CategoryForm category={c} onSuccess={load} />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(c.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
