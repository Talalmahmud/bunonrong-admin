import VendorPaymentTable from "@/components/tables/VendorPaymentTable";
import React from "react";

const page = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Payment</h1>
      <VendorPaymentTable />
    </div>
  );
};

export default page;
