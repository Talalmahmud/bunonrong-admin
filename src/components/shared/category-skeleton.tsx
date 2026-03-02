import React from "react";
import { Skeleton } from "../ui/skeleton";

const CategorySkeleton = () => {
  return (
    <div className="flex flex-col items-center p-2">
      <Skeleton className="h-16 w-16 rounded-lg mb-1" />
      <Skeleton className="h-3 w-12 mt-1" />
    </div>
  );
};

export default CategorySkeleton;
