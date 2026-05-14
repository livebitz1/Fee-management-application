"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Search, Printer } from "lucide-react";
import { getReceipts } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface Receipt {
  id: string;
  receiptNumber: string;
  studentName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  month: string;
  utrId: string;
}

export default function ReceiptsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await getReceipts();
        if (mounted) {
          setReceipts(data);
        }
      } catch (err) {
        if (mounted) {
          console.error("Error fetching receipts:", err);
          setError("Failed to load receipts");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredReceipts = receipts.filter(
    (receipt) =>
      (receipt.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.receiptNumber?.includes(searchTerm)) ?? false
  );

  if (error) {
    return (
      <div className="p-4 md:p-8">
        <Card className="p-6 border-red-200 bg-red-50">
          <p className="text-red-800">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-black">Receipts</h1>
          <p className="text-gray-500 text-sm mt-1">
            View and download payment receipts
          </p>
        </div>
      </div>

      {/* Search */}
      <Card className="p-4 border-gray-200">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by student name or receipt number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 placeholder:text-gray-500 focus:ring-0 text-sm"
          />
        </div>
      </Card>

      {/* Grid of Receipts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4 md:p-6 border-gray-200">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="border-t border-gray-100" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : filteredReceipts.length > 0 ? (
          filteredReceipts.map((receipt) => (
            <Card
              key={receipt.id}
              className="p-4 md:p-6 border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3 md:space-y-4">
                {/* Receipt Number */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-600 font-medium uppercase">
                      Receipt No.
                    </p>
                    <p className="text-base md:text-lg font-semibold text-black mt-1">
                      {receipt.receiptNumber}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-0 text-xs">
                    Issued
                  </Badge>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Student Info */}
                <div>
                  <p className="text-xs text-gray-600 font-medium">Student</p>
                  <p className="text-sm font-semibold text-black mt-1">
                    {receipt.studentName}
                  </p>
                </div>

                {/* Amount */}
                <div>
                  <p className="text-xs text-gray-600 font-medium">Amount</p>
                  <p className="text-2xl font-bold text-black mt-1">
                    ₹{receipt.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    For: {receipt.month}
                  </p>
                </div>

                {/* Date and Method */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-gray-600 font-medium">Date</p>
                    <p className="text-gray-700 mt-1">
                      {new Date(receipt.paymentDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Method</p>
                    <p className="text-gray-700 mt-1">
                      {receipt.paymentMethod}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-200 flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedReceipt(receipt)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Receipt Preview</DialogTitle>
                      </DialogHeader>
                      {selectedReceipt && (
                        <div className="space-y-6 py-4">
                          {/* Receipt */}
                          <div className="border border-gray-200 rounded-lg p-8 bg-white">
                            {/* Receipt Header */}
                            <div className="border-b border-gray-200 pb-6 mb-6">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <h2 className="text-2xl font-bold text-black">
                                    RECEIPT
                                  </h2>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-600 font-medium">
                                    Receipt No.
                                  </p>
                                  <p className="text-lg font-semibold text-black">
                                    {selectedReceipt.receiptNumber}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500">
                                Date: {new Date(selectedReceipt.paymentDate).toLocaleDateString()}
                              </p>
                            </div>

                            {/* School Info */}
                            <div className="mb-6">
                              <h3 className="font-semibold text-black mb-2">
                                ABC High School
                              </h3>
                              <p className="text-sm text-gray-600">
                                123 School Road, City - 400001
                              </p>
                            </div>

                            {/* Student Details */}
                            <div className="mb-6">
                              <p className="text-xs text-gray-600 font-medium uppercase mb-2">
                                Bill To
                              </p>
                              <p className="text-lg font-semibold text-black">
                                {selectedReceipt.studentName}
                              </p>
                            </div>

                            {/* Details Table */}
                            <div className="mb-6 border-y border-gray-200 py-4">
                              <div className="grid grid-cols-4 gap-4 mb-4">
                                <div>
                                  <p className="text-xs text-gray-600 font-medium">
                                    Description
                                  </p>
                                  <p className="text-sm font-semibold text-black mt-1">
                                    Fee for {selectedReceipt.month}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 font-medium">
                                    Method
                                  </p>
                                  <p className="text-sm font-semibold text-black mt-1">
                                    {selectedReceipt.paymentMethod}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 font-medium">
                                    Reference
                                  </p>
                                  <p className="text-sm font-semibold text-black mt-1">
                                    {selectedReceipt.utrId}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 font-medium">
                                    Amount
                                  </p>
                                  <p className="text-sm font-semibold text-black mt-1">
                                    ₹{selectedReceipt.amount.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-end mb-6">
                              <div className="w-full max-w-xs">
                                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                                  <span className="font-semibold text-black">
                                    Total Amount
                                  </span>
                                  <span className="text-2xl font-bold text-black">
                                    ₹{selectedReceipt.amount.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t border-gray-200 pt-4 text-center">
                              <p className="text-xs text-gray-500">
                                This is a digitally generated receipt.
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Please keep it for your records.
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 justify-end pt-4">
                            <Button
                              variant="outline"
                              onClick={() =>
                                window.print()
                              }
                            >
                              <Printer className="w-4 h-4 mr-2" />
                              Print
                            </Button>
                            <Button className="bg-black hover:bg-gray-900">
                              <Download className="w-4 h-4 mr-2" />
                              Download PDF
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">
              No receipts found matching your search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
