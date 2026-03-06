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

import ProductForm from "../form/ProductForm";
import { Product } from "@/types/product";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get(`/products?page=${page}&limit=${limit}`);

      setProducts(res.data.data);
      setTotalPages(res.data.meta.totalPages);
      // 👆 make sure backend sends:
      // {
      //   data: Product[],
      //   meta: { totalPages: number }
      // }
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  const toggleExpand = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
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
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
  
        const res = await api.get(
          `/products?page=${page}&limit=${limit}`
        );
  
        setProducts(res.data.data);
        setTotalPages(res.data.meta.totalPages);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, [page, limit]);
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }
  // console.log(products);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage your catalog</CardDescription>
        </div>
        <ProductForm onSuccess={load} />
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
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
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
                      <TableCell className="  ">
                        <div className=" flex flex-col gap-1">
                          <p>
                            Price: {p.price}
                            <span className=" text-red-600 font-bold">
                              {" "}
                              BDT
                            </span>
                          </p>
                          <p>
                            Discount Price: {p.discountPrice}{" "}
                            <span className=" text-red-600 font-bold">
                              {" "}
                              BDT
                            </span>
                          </p>

                          <p>
                            Shop Price: {p.shopPrice}{" "}
                            <span className=" text-red-600 font-bold">
                              {" "}
                              BDT
                            </span>
                          </p>
                          <p>
                            Sell Price: {p.shopSellPrice}{" "}
                            <span className=" text-red-600 font-bold">
                              {" "}
                              BDT
                            </span>
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{p.stock}</TableCell>
                      <TableCell>
                        <Badge variant={p.isActive ? "default" : "secondary"}>
                          {p.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>{" "}
                      <TableCell>
                        <Badge variant={p.isFeatured ? "default" : "secondary"}>
                          {p.isActive ? "Featured" : "Not Featured"}
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
                              <DropdownMenuItem
                                onClick={() => toggleStatus(p.id, p.isActive)}
                              >
                                {p.isActive ? (
                                  <EyeOff className="mr-2 h-4 w-4" />
                                ) : (
                                  <Eye className="mr-2 h-4 w-4" />
                                )}
                                Toggle Status
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <ProductForm
                                  product={p}
                                  onSuccess={load}
                                  trigger={
                                    <button className="flex items-center w-full">
                                      <Edit className="mr-2 h-4 w-4" /> Edit
                                    </button>
                                  }
                                />
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => remove(p.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>

                    {expanded.has(p.id) && (
                      <TableRow className="bg-gray-50">
                        <TableCell colSpan={6}>
                          <div className="p-4 w-full max-h-86 grid grid-cols-1 md:grid-cols-3 overflow-y-auto gap-4">
                            {p.imageUrls?.map((img, i) => (
                              <div
                                key={i}
                                className="relative min-w-full h-80 rounded overflow-hidden"
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
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => page > 1 && setPage(page - 1)}
                        className={
                          page === 1 ? "pointer-events-none opacity-50" : ""
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={page === i + 1}
                          onClick={() => setPage(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => page < totalPages && setPage(page + 1)}
                        className={
                          page === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
