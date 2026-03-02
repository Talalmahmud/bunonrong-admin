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
import { Badge } from "@/components/ui/badge";
import {
  Search,
  RefreshCw,
  AlertCircle,
  Edit,
  Trash2,
  Ruler,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import api from "@/lib/axiosInterceptor";
import { Skeleton } from "@/components/ui/skeleton";
import SizeForm from "../form/SizeForm";

interface Size {
  id: string;
  name: string;
}

export default function SizeTable() {
  const [data, setData] = useState<Size[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Sorting
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const params = {
        search,
        page: 1,
        limit: 20,
      };

      const res = await api.get("/sizes", { params });
      setData(res.data.data || res.data);
    } catch (error) {
      console.error("Error loading sizes:", error);
      alert("Failed to load sizes. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this size? This will remove it from all products.",
      )
    ) {
      return;
    }

    try {
      await api.delete(`/sizes/${id}`);
      load();
    } catch (error) {
      console.log("Error deleting size:", error);
      const message =
        error ||
        "Cannot delete size because it's being used by products. Remove it from products first.";
      alert(message);
    }
  };

  const handleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const handleClearSearch = () => {
    setSearch("");
  };

  const filteredData = data.filter((size) =>
    size.name.toLowerCase().includes(search.toLowerCase()),
  );

  const getSortIcon = () => {
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sizes</h1>
          <p className="text-gray-500">Manage product sizes for your catalog</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={load}
            disabled={refreshing}
            title="Refresh"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
          <SizeForm onSuccess={load} />
        </div>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <CardTitle>Search Sizes</CardTitle>
              <CardDescription>Find sizes by name</CardDescription>
            </div>
            {search && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear search
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by size name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Sizes</CardTitle>
              <CardDescription>
                {filteredData.length} size{filteredData.length !== 1 ? "s" : ""}{" "}
                found
                {search && " (filtered)"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Ruler className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {search ? "No sizes found" : "No sizes yet"}
              </h3>
              <p className="text-gray-500 mb-4">
                {search
                  ? "Try adjusting your search term"
                  : "Get started by creating your first size"}
              </p>
              {search ? (
                <Button variant="outline" onClick={handleClearSearch}>
                  Clear search
                </Button>
              ) : (
                <SizeForm onSuccess={load} />
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={handleSort}
                    >
                      <div className="flex items-center">
                        Size Name
                        {getSortIcon()}
                      </div>
                    </TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((size, index) => (
                    <TableRow key={size.id}>
                      {/* Index */}
                      <TableCell>
                        <div className="font-mono text-gray-500">
                          {index + 1}
                        </div>
                      </TableCell>

                      {/* Size Name */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Ruler className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{size.name}</div>
                            <Badge variant="outline" className="mt-1 text-xs">
                              Product Size
                            </Badge>
                          </div>
                        </div>
                      </TableCell>

                      {/* ID */}
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {size.id.substring(0, 8)}...
                        </code>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <SizeForm
                            size={size}
                            onSuccess={load}
                            trigger={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            }
                          />

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(size.id)}
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

      {/* Stats Card */}
      {!loading && filteredData.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{filteredData.length}</div>
                <div className="text-sm text-gray-500">Total Sizes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {new Set(filteredData.map((s) => s.name.length)).size}
                </div>
                <div className="text-sm text-gray-500">Different Lengths</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {filteredData.filter((s) => /^\d+$/.test(s.name)).length}
                </div>
                <div className="text-sm text-gray-500">Numeric Sizes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
