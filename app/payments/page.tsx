"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Download } from "lucide-react";
import { getPayments } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface Payment {
  id: string;
  studentName: string;
  amount: number;
  method: string;
  utrId: string;
  month: string;
  date: string;
  status: string;
  notes?: string;
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await getPayments();
        if (mounted) {
          setPayments(data);
        }
      } catch (err) {
        if (mounted) {
          console.error("Error fetching payments:", err);
          setError("Failed to load payments");
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

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      (payment.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.utrId?.toLowerCase().includes(searchTerm.toLowerCase())) ?? false;

    const matchesMonth = filterMonth === "all" || !filterMonth || payment.month === filterMonth;
    const matchesStatus = filterStatus === "all" || !filterStatus || payment.status === filterStatus;
    const matchesMethod = filterMethod === "all" || !filterMethod || payment.method === filterMethod;

    return matchesSearch && matchesMonth && matchesStatus && matchesMethod;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case "upi":
        return "UPI";
      case "bank_transfer":
        return "Bank Transfer";
      case "cash":
        return "Cash";
      case "cheque":
        return "Cheque";
      default:
        return method;
    }
  };

  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

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
          <h1 className="text-2xl md:text-3xl font-bold text-black">Payments</h1>
          <p className="text-gray-500 text-sm mt-1">
            View and manage all payment transactions
          </p>
        </div>
        <Button variant="outline" className="text-sm w-full md:w-auto">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="p-4 md:p-6 border-gray-200">
          <p className="text-gray-600 text-xs md:text-sm font-medium">Total Payments</p>
          <p className="text-2xl md:text-3xl font-bold text-black mt-2">
            {isLoading ? <Skeleton className="h-8 w-12" /> : filteredPayments.length}
          </p>
        </Card>
        <Card className="p-4 md:p-6 border-gray-200">
          <p className="text-gray-600 text-xs md:text-sm font-medium">Total Amount</p>
          <p className="text-2xl md:text-3xl font-bold text-black mt-2">
            {isLoading ? <Skeleton className="h-8 w-24" /> : `₹${totalAmount.toLocaleString()}`}
          </p>
        </Card>
        <Card className="p-4 md:p-6 border-gray-200">
          <p className="text-gray-600 text-xs md:text-sm font-medium">Completed</p>
          <p className="text-2xl md:text-3xl font-bold text-black mt-2">
            {isLoading ? <Skeleton className="h-8 w-12" /> : filteredPayments.filter((p) => p.status === "completed").length}
          </p>
        </Card>
        <Card className="p-4 md:p-6 border-gray-200">
          <p className="text-gray-600 text-xs md:text-sm font-medium">Pending</p>
          <p className="text-2xl md:text-3xl font-bold text-black mt-2">
            {isLoading ? <Skeleton className="h-8 w-12" /> : filteredPayments.filter((p) => p.status === "pending").length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-3 md:p-4 border-gray-200 space-y-3 md:space-y-4">
        <div className="flex gap-2 md:gap-4 flex-wrap items-end">
          {/* Search */}
          <div className="flex-1 min-w-full md:min-w-64">
            <label className="text-xs md:text-sm font-medium text-gray-700 block mb-2">
              Search
            </label>
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name or UTR..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 placeholder:text-gray-500 focus:ring-0 text-sm"
              />
            </div>
          </div>

          {/* Month Filter */}
          <div className="min-w-full md:min-w-32">
            <label className="text-xs md:text-sm font-medium text-gray-700 block mb-2">
              Month
            </label>
            <Select value={filterMonth} onValueChange={setFilterMonth}>
              <SelectTrigger className="border-gray-200 text-sm">
                <SelectValue placeholder="All months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All months</SelectItem>
                <SelectItem value="May">May</SelectItem>
                <SelectItem value="April">April</SelectItem>
                <SelectItem value="March">March</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="min-w-full md:min-w-32">
            <label className="text-xs md:text-sm font-medium text-gray-700 block mb-2">
              Status
            </label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="border-gray-200 text-sm">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Method Filter */}
          <div className="min-w-full md:min-w-32">
            <label className="text-xs md:text-sm font-medium text-gray-700 block mb-2">
              Method
            </label>
            <Select value={filterMethod} onValueChange={setFilterMethod}>
              <SelectTrigger className="border-gray-200 text-sm">
                <SelectValue placeholder="All methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All methods</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setFilterMonth("all");
              setFilterStatus("all");
              setFilterMethod("all");
            }}
            className="text-xs md:text-sm"
          >
            Reset
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="border-gray-200 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 bg-gray-50 hover:bg-gray-50">
              <TableHead className="text-gray-700 font-semibold text-xs md:text-sm">
                Student Name
              </TableHead>
              <TableHead className="text-gray-700 font-semibold text-xs md:text-sm">
                Amount
              </TableHead>
              <TableHead className="text-gray-700 font-semibold text-xs md:text-sm">
                Method
              </TableHead>
              <TableHead className="text-gray-700 font-semibold text-xs md:text-sm hidden sm:table-cell">
                UTR ID
              </TableHead>
              <TableHead className="text-gray-700 font-semibold text-xs md:text-sm">
                Month
              </TableHead>
              <TableHead className="text-gray-700 font-semibold text-xs md:text-sm hidden md:table-cell">Date</TableHead>
              <TableHead className="text-gray-700 font-semibold text-xs md:text-sm">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-gray-200">
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <TableRow
                  key={payment.id}
                  className="border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium text-black text-xs md:text-sm">
                    {payment.studentName}
                  </TableCell>
                  <TableCell className="font-semibold text-black text-xs md:text-sm">
                    ₹{payment.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-gray-600 text-xs md:text-sm">
                    {getMethodLabel(payment.method)}
                  </TableCell>
                  <TableCell className="text-gray-600 font-mono text-xs hidden sm:table-cell">
                    {payment.utrId}
                  </TableCell>
                  <TableCell className="text-gray-600 text-xs md:text-sm">
                    {payment.month}
                  </TableCell>
                  <TableCell className="text-gray-600 text-xs md:text-sm hidden md:table-cell">
                    {new Date(payment.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(payment.status || "")} border-0 text-xs`}>
                      {payment.status
                        ? payment.status.charAt(0).toUpperCase() +
                          payment.status.slice(1)
                        : "N/A"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  No payments found matching your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
