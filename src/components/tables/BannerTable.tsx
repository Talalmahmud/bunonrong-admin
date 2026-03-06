"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Image as ImageIcon,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  ArrowUpDown,
  Grid3X3,
  List,
} from "lucide-react";
import Image from "next/image";
import { Banner } from "@/types/banner";
import api from "@/lib/axiosInterceptor";
import BannerForm from "../form/BannerForm";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { imageLink } from "@/config/cloudinary";

const BannerTable = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<string>("grid");

  // Extract unique positions from banners
  const positions = Array.from(new Set(banners.map((b) => b.slug)));

  const fetchBanners = useCallback(async () => {
    setRefreshing(true);
    try {
      const params: { isActive?: boolean; search: string; slug?: string } = {
        search,
      };

      if (statusFilter !== "all") {
        params.isActive = statusFilter === "active";
      }

      if (positionFilter !== "all") {
        params.slug = positionFilter;
      }

      const res = await api.get("/banners", { params });
      setBanners(res.data.data || res.data);
    } catch (err) {
      console.error("Error fetching banners:", err);
      alert("Failed to load banners. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, statusFilter, positionFilter]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this banner? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await api.delete(`/banners/${id}`);
      fetchBanners();
    } catch (err) {
      console.log("Error deleting banner:", err);
      alert(err || "Failed to delete banner. Please try again.");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/banners/${id}`, {
        isActive: !currentStatus,
      });
      fetchBanners();
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Failed to update banner status. Please try again.");
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPositionFilter("all");
  };

  const filteredBanners = banners.filter((banner) => {
    const matchesSearch = search
      ? banner.title.toLowerCase().includes(search.toLowerCase()) ||
        banner?.slug?.toLowerCase().includes(search.toLowerCase()) ||
        banner.redirectUrl?.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
          ? banner.isActive
          : !banner.isActive;

    const matchesPosition =
      positionFilter === "all" ? true : banner.slug === positionFilter;

    return matchesSearch && matchesStatus && matchesPosition;
  });

  const handleRedirect = (url: string) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banners</h1>
          <p className="text-gray-500">Manage website banners and promotions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchBanners}
            disabled={refreshing}
            title="Refresh"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
          <BannerForm onSuccess={fetchBanners} />
        </div>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <CardTitle>Filters</CardTitle>
              <CardDescription>
                Filter banners by search, status, or position
              </CardDescription>
            </div>
            {(search || statusFilter !== "all" || positionFilter !== "all") && (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2 lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by title, position, or URL..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Position Filter */}
            <div>
              <Select
                value={positionFilter}
                onValueChange={setPositionFilter}
                disabled={positions.length === 0}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="All Positions">
                      {positionFilter !== "all"
                        ? positionFilter
                        : "All Positions"}
                    </SelectValue>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {positions.map((position) => (
                    <SelectItem key={position} value={position || ""}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {filteredBanners.length} banner
          {filteredBanners.length !== 1 ? "s" : ""} found
          {(search || statusFilter !== "all" || positionFilter !== "all") &&
            " (filtered)"}
        </div>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="grid" onValueChange={(v) => setViewMode(v)}>
            <TabsList>
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <Grid3X3 className="h-4 w-4" />
                Grid
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredBanners.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {search || statusFilter !== "all" || positionFilter !== "all"
                  ? "No banners found"
                  : "No banners yet"}
              </h3>
              <p className="text-gray-500 mb-4">
                {search || statusFilter !== "all" || positionFilter !== "all"
                  ? "Try adjusting your filters or search term"
                  : "Get started by creating your first banner"}
              </p>
              {search || statusFilter !== "all" || positionFilter !== "all" ? (
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear filters
                </Button>
              ) : (
                <BannerForm onSuccess={fetchBanners} />
              )}
            </div>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBanners.map((banner) => (
            <Card
              key={banner.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                {banner.imageUrl ? (
                  <Image
                    src={imageLink(banner.imageUrl)}
                    alt={banner.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <Badge
                    variant={banner.isActive ? "default" : "secondary"}
                    className="shadow-sm"
                  >
                    {banner.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {/* Order Badge */}
                <div className="absolute top-3 right-3">
                  <Badge
                    variant="outline"
                    className="bg-white/90 backdrop-blur-sm"
                  >
                    Order: {banner.order}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-1">
                  {banner.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {banner.slug}
                  </Badge>
                  {banner.redirectUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => handleRedirect(banner.redirectUrl!)}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visit URL
                    </Button>
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-2">
                {banner.redirectUrl && (
                  <p className="text-sm text-gray-500 truncate">
                    ↪ {banner.redirectUrl}
                  </p>
                )}
              </CardContent>

              <CardFooter className="pt-2 flex justify-between border-t">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() =>
                        handleToggleStatus(banner.id, banner.isActive)
                      }
                    >
                      {banner.isActive ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <BannerForm banner={banner} onSuccess={fetchBanners} />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDelete(banner.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex gap-2">
                  <BannerForm banner={banner} onSuccess={fetchBanners} />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(banner.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        // List View (Table)
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBanners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <div className="relative h-12 w-20 rounded-md overflow-hidden bg-gray-100">
                        {banner.imageUrl ? (
                          <Image
                            src={imageLink(banner.imageUrl)}
                            alt={banner.title}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {banner.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{banner.slug}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{banner.order}</Badge>
                    </TableCell>
                    <TableCell>
                      {banner.redirectUrl ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => handleRedirect(banner.redirectUrl!)}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Link
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={banner.isActive ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {banner.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleToggleStatus(banner.id, banner.isActive)
                          }
                          className="h-8 w-8 p-0"
                          title={banner.isActive ? "Deactivate" : "Activate"}
                        >
                          {banner.isActive ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <BannerForm banner={banner} onSuccess={fetchBanners} />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(banner.id)}
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BannerTable;
