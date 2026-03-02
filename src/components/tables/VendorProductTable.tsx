"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axiosInterceptor";
import { imageLink } from "@/config/cloudinary";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Package,
  Image as ImageIcon,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

import { Product, VendorProduct } from "@/types/product";
import VendorProductForm from "../form/vendor/product-form";

export default function VendorProductTable() {
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/products/admin");
      setProducts(res.data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleExpand = (id: string) => {
    const next = new Set(expanded);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpanded(next);
  };

  const toggleStatus = async (id: string, active: boolean) => {
    await api.patch(`/products/${id}`, { isActive: !active });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product permanently?")) return;
    await api.delete(`/products/${id}`);
    load();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }
  //   console.log(products);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage your catalog</CardDescription>
        </div>
        <VendorProductForm onSuccess={load} />
      </CardHeader>

      <CardContent>
        {products.length === 0 ? (
          <div className="py-16 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>My Price</TableHead>
                  <TableHead>Sell Price</TableHead>

                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {products.map((p) => (
                  <Fragment key={p.id}>
                    <TableRow>
                      <TableCell>
                        <div className="relative h-12 w-12 rounded overflow-hidden bg-gray-100">
                          {p.imageUrls?.length ? (
                            <Image
                              src={`${imageLink(p.imageUrls[0])}.webp`}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-6 w-6 m-auto text-gray-400" />
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>{p.shopPrice} BDT</TableCell>
                      <TableCell>{p.shopSellPrice} BDT</TableCell>
                      <TableCell>{p.stock}</TableCell>
                      <TableCell>
                        <Badge variant={p.isActive ? "default" : "secondary"}>
                          {p.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => toggleExpand(p.id)}
                          >
                            {expanded.has(p.id) ? (
                              <ChevronUp />
                            ) : (
                              <ChevronDown />
                            )}
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <MoreVertical />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {/* <DropdownMenuItem
                                onClick={() => toggleStatus(p.id, p.isActive)}
                              >
                                {p.isActive ? (
                                  <EyeOff className="mr-2 h-4 w-4" />
                                ) : (
                                  <Eye className="mr-2 h-4 w-4" />
                                )}
                                Toggle Status
                              </DropdownMenuItem> */}
                              <DropdownMenuItem asChild>
                                <VendorProductForm
                                  product={p}
                                  onSuccess={load}
                                  trigger={
                                    <button className="flex items-center w-full">
                                      <Edit className="mr-2 h-4 w-4" /> Edit
                                    </button>
                                  }
                                />
                              </DropdownMenuItem>
                              {/* <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => remove(p.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem> */}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>

                    {expanded.has(p.id) && (
                      <TableRow className="bg-gray-50">
                        <TableCell colSpan={6}>
                          <div className="p-4 flex flex-wrap overflow-y-auto gap-4">
                            {p.imageUrls?.map((img, i) => (
                              <div
                                key={i}
                                className="relative w-[400px] h-[500px] rounded overflow-hidden"
                              >
                                <Image
                                  src={imageLink(img)}
                                  alt="product"
                                  fill
                                  className=" object-fill"
                                />
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
