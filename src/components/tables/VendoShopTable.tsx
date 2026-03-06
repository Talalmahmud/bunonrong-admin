"use client";

import React, { useState, useEffect } from "react";
import { Shop } from "@/types/shop";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Building,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  RefreshCw,
  Filter,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import api from "@/lib/axiosInterceptor";
import { imageLink } from "@/config/cloudinary";
import VendorShopForm from "../form/vendor/shop-form";

interface ShopResponse {
  data: Shop[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface Props {
  initialData?: ShopResponse;
}

export default function VendorShopTable({ initialData }: Props) {
  const [shops, setShops] = useState<Shop[]>(initialData?.data || []);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shopToDelete, setShopToDelete] = useState<Shop | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [shopToView, setShopToView] = useState<Shop | null>(null);
  const [pagination, setPagination] = useState({
    page: initialData?.meta?.page || 1,
    limit: initialData?.meta?.limit || 50,
    total: initialData?.meta?.total || 0,
    totalPages: initialData?.meta?.totalPages || 1,
  });

  // Fetch shops with search and pagination
  const fetchShops = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get<ShopResponse>("/shops", {
        params: {
          page,
          limit: pagination.limit,
          search: searchTerm || undefined,
        },
      });

      setShops(response.data.data);
      setPagination({
        page: response.data.meta.page,
        limit: response.data.meta.limit,
        total: response.data.meta.total,
        totalPages: response.data.meta.totalPages,
      });
    } catch (error) {
      console.error("Error fetching shops:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete shop
  //   const handleDelete = async () => {
  //     if (!shopToDelete) return;

  //     try {
  //       await api.delete(`/shops/${shopToDelete.id}`);
  //       setShops(shops.filter((shop) => shop.id !== shopToDelete.id));
  //       setDeleteDialogOpen(false);
  //       setShopToDelete(null);
  //       setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
  //     } catch (error) {
  //       console.error("Error deleting shop:", error);
  //       alert("Failed to delete shop");
  //     }
  //   };

  // Format date
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time
  const formatTime = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get shop image URL

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchShops(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Initial fetch
  useEffect(() => {
    if (!initialData) {
      fetchShops();
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Shops Management
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>{pagination.total} total shops</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search shops by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <XCircle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchShops(pagination.page)}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
            <VendorShopForm onSuccess={() => fetchShops(pagination.page)} />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Shops</p>
              <p className="text-2xl font-bold">{pagination.total}</p>
            </div>
            <Building className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Verified</p>
              <p className="text-2xl font-bold">
                {shops.filter((s) => s.emailVerified).length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Unverified</p>
              <p className="text-2xl font-bold">
                {shops.filter((s) => !s.emailVerified).length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Products</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <Package className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                <TableHead className="w-[300px]">Shop Information</TableHead>
                <TableHead>Contact Details</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                      <p className="text-gray-500">Loading shops...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : shops.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64">
                    <div className="flex flex-col items-center justify-center text-center">
                      <Building className="h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No shops found
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {searchTerm
                          ? "No shops match your search criteria"
                          : "Get started by creating your first shop"}
                      </p>
                      {!searchTerm && <VendorShopForm />}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                shops.map((shop) => {
                  return (
                    <TableRow key={shop.id} className="hover:bg-gray-50/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {shop.imageUrl ? (
                              <div className="w-12 h-12 rounded-lg overflow-hidden border bg-gray-100">
                                <Image
                                  src={imageLink(shop.imageUrl)}
                                  alt={shop.name}
                                  width={48}
                                  height={48}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gray-100 border flex items-center justify-center">
                                <Building className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-semibold text-gray-900">
                              {shop.name}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Mail className="h-3 w-3" />
                              <span className="truncate max-w-[200px]">
                                {shop.email}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-sm font-medium">
                              {shop.phone}
                            </span>
                          </div>
                          {shop.address && (
                            <div className="flex items-start gap-2">
                              <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-500 line-clamp-2">
                                {shop.address}
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        {shop.owner ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="h-3.5 w-3.5 text-gray-400" />
                              <span className="font-medium">
                                {shop.owner.name}
                              </span>
                            </div>

                            <p className="text-xs text-gray-500 pl-6">
                              {shop.owner.email}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Not assigned
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant={
                              shop.emailVerified ? "default" : "secondary"
                            }
                            className="w-fit"
                          >
                            {shop.emailVerified ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Unverified
                              </>
                            )}
                          </Badge>
                          <Badge variant="outline" className="w-fit text-xs">
                            ID: {shop.id.substring(0, 8)}...
                          </Badge>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                            {formatDate(shop.createdAt)}
                          </div>
                          <p className="text-xs text-gray-500 pl-6">
                            {formatTime(shop.createdAt)}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setShopToView(shop);
                              setViewDialogOpen(true);
                            }}
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <VendorShopForm
                            shop={shop}
                            onSuccess={() => fetchShops(pagination.page)}
                            trigger={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            }
                          />
                          {/* <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              setShopToDelete(shop);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button> */}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {shops.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              of <span className="font-medium">{pagination.total}</span> shops
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchShops(pagination.page - 1)}
                disabled={pagination.page === 1 || loading}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          pagination.page === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        className="h-8 w-8"
                        onClick={() => fetchShops(pageNum)}
                        disabled={loading}
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                )}
                {pagination.totalPages > 5 && <span className="px-2">...</span>}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchShops(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages || loading}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Shop Details
            </DialogTitle>
            <DialogDescription>
              Complete information about {shopToView?.name}
            </DialogDescription>
          </DialogHeader>

          {shopToView && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  {shopToView.imageUrl ? (
                    <div className="w-20 h-20 rounded-lg overflow-hidden border">
                      <Image
                        src={imageLink(shopToView.imageUrl)!}
                        alt={shopToView.name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-gray-100 border flex items-center justify-center">
                      <Building className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{shopToView.name}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge
                      variant={
                        shopToView.emailVerified ? "default" : "secondary"
                      }
                    >
                      {shopToView.emailVerified ? "Verified" : "Unverified"}
                    </Badge>
                    <Badge variant="outline">ID: {shopToView.id}</Badge>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">
                    Contact Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{shopToView.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{shopToView.phone}</p>
                      </div>
                    </div>
                    {shopToView.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium">{shopToView.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Owner Information */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Owner Details</h4>
                  {shopToView.owner ? (
                    <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium">{shopToView.owner.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">
                            {shopToView.owner.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">
                            {shopToView.owner.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No owner assigned</p>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Created</h4>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{formatDate(shopToView.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-500 pl-6">
                    {formatTime(shopToView.createdAt)}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Last Updated</h4>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>
                      {formatDate(shopToView.updatedAt || shopToView.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 pl-6">
                    {formatTime(shopToView.updatedAt || shopToView.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            {shopToView && (
              <VendorShopForm
                shop={shopToView}
                onSuccess={() => {
                  fetchShops(pagination.page);
                  setViewDialogOpen(false);
                }}
              />
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Shop</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              shop and all associated products and data.
            </DialogDescription>
          </DialogHeader>

          {shopToDelete && (
            <div className="py-4">
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <Trash2 className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="font-medium">Confirm deletion</p>
                  <p className="text-sm">
                    Shop:{" "}
                    <span className="font-semibold">{shopToDelete.name}</span>
                  </p>
                  {shopToDelete.owner && (
                    <p className="text-sm">
                      Owner:{" "}
                      <span className="font-medium">
                        {shopToDelete.owner.name}
                      </span>
                    </p>
                  )}
                  <p className="text-xs text-red-600 mt-2">
                    ⚠️ Warning: All products under this shop will also be
                    deleted.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setShopToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Shop
            </Button>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper component
function Package(props: React.ComponentProps<typeof Building>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}
