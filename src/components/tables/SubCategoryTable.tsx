"use client";

import { useCallback, useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Image as ImageIcon,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { SubCategory } from "@/types/sub-category";
import api from "@/lib/axiosInterceptor";
import SubCategoryForm from "../form/SubCategoryForm";
import { Category } from "@/types/category";
import { Skeleton } from "@/components/ui/skeleton";
import { imageLink } from "@/config/cloudinary";

export default function SubCategoryTable() {
  const [data, setData] = useState<SubCategory[]>([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await api.get("/subcategories", {
        params: {
          search,
          categoryId: categoryId || undefined,
          status: statusFilter === "all" ? undefined : statusFilter,
        },
      });
      setData(res.data.data || res.data);
    } catch (error) {
      console.error("Error loading subcategories:", error);
      alert("Failed to load subcategories. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, categoryId, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.data || res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this subcategory? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await api.delete(`/subcategories/${id}`);
      load();
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      alert("Failed to delete subcategory. Please try again.");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/subcategories/${id}`, {
        isActive: !currentStatus,
      });
      load();
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const filteredData = data.filter((item) => {
    if (statusFilter === "active") return item.isActive;
    if (statusFilter === "inactive") return !item.isActive;
    return true;
  });

  const handleClearFilters = () => {
    setSearch("");
    setCategoryId("");
    setStatusFilter("all");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subcategories</h1>
          <p className="text-gray-500">
            Manage subcategories and organize your products
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={load}
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
          <SubCategoryForm onSuccess={load} />
        </div>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <CardTitle>Filters</CardTitle>
              <CardDescription>
                Filter subcategories by search, category, or status
              </CardDescription>
            </div>
            {(search || categoryId || statusFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="w-full sm:w-64">
              <Select
                value={categoryId}
                onValueChange={(value) => setCategoryId(value)}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Filter by category">
                      {categoryId
                        ? categories.find((c) => c.id === categoryId)?.name ||
                          "Select category"
                        : "All Categories"}
                    </SelectValue>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {/* Remove the empty value option */}
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        {category.iconUrl && (
                          <div className="relative w-4 h-4">
                            <Image
                              src={imageLink(category.iconUrl)}
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
            </div>
            {/* Status Filter */}
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Subcategories</CardTitle>
              <CardDescription>
                {filteredData.length} subcategory
                {filteredData.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                No subcategories found
              </h3>
              <p className="text-gray-500 mb-4">
                {search || categoryId || statusFilter !== "all"
                  ? "Try adjusting your filters or search term"
                  : "Get started by creating your first subcategory"}
              </p>
              {search || categoryId || statusFilter !== "all" ? (
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear filters
                </Button>
              ) : (
                <SubCategoryForm onSuccess={load} />
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Icon</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Sort Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((subcategory) => (
                    <TableRow key={subcategory.id}>
                      {/* Icon */}
                      <TableCell>
                        <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                          {subcategory.iconUrl ? (
                            <Image
                              src={`${imageLink(subcategory.iconUrl)}`}
                              alt={subcategory.name}
                              fill
                              className="object-contain p-1"
                              sizes="40px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Name */}
                      <TableCell className="font-medium">
                        <div className="space-y-1">
                          <div>{subcategory.name}</div>
                        </div>
                      </TableCell>

                      {/* Slug */}

                      {/* Category */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {subcategory.category?.iconUrl && (
                            <div className="relative w-5 h-5">
                              <Image
                                src={`${imageLink(subcategory.category.iconUrl)}`}
                                alt={subcategory.category.name}
                                fill
                                className="object-contain"
                                sizes="20px"
                              />
                            </div>
                          )}
                          <span>{subcategory.category?.name || "—"}</span>
                        </div>
                      </TableCell>

                      {/* Sort Order */}
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {subcategory.sortOrder}
                        </Badge>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant={
                            subcategory.isActive ? "default" : "secondary"
                          }
                          className="capitalize"
                        >
                          {subcategory.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleToggleStatus(
                                subcategory.id,
                                subcategory.isActive,
                              )
                            }
                            className="h-8 w-8 p-0"
                            title={
                              subcategory.isActive
                                ? "Set Inactive"
                                : "Set Active"
                            }
                          >
                            {subcategory.isActive ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>

                          <SubCategoryForm
                            subcategory={subcategory}
                            onSuccess={load}
                          />

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(subcategory.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
