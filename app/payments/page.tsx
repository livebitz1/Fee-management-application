"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { 
  Search, 
  Download, 
  Filter, 
  RefreshCcw, 
  Eye, 
  IndianRupee, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  CreditCard,
  Banknote,
  Smartphone,
  FileText,
  HelpCircle
} from "lucide-react";
import { getPayments } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

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
  const [filterMonth, setFilterMonth] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");
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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return { color: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: CheckCircle2 };
      case "pending":
        return { color: "bg-amber-50 text-amber-700 border-amber-100", icon: Clock };
      case "failed":
        return { color: "bg-rose-50 text-rose-700 border-rose-100", icon: AlertCircle };
      default:
        return { color: "bg-slate-50 text-slate-700 border-slate-100", icon: HelpCircle };
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "upi":
        return <Smartphone className="w-3.5 h-3.5 mr-1.5" />;
      case "bank_transfer":
        return <CreditCard className="w-3.5 h-3.5 mr-1.5" />;
      case "cash":
        return <Banknote className="w-3.5 h-3.5 mr-1.5" />;
      default:
        return <FileText className="w-3.5 h-3.5 mr-1.5" />;
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
      <div className="p-8">
        <Card className="p-8 border-red-200 bg-red-50 flex flex-col items-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-red-900 mb-2">Error Loading Payments</h2>
          <p className="text-red-700 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="border-red-200 text-red-700 hover:bg-red-100">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Payment Transactions</h1>
          <p className="text-slate-500 mt-1">
            Comprehensive history of all fee collections and digital payments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200 bg-white hover:bg-slate-50 shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Link href="/collect-fee">
            <Button className="rounded-xl bg-black hover:bg-slate-800 text-white shadow-lg shadow-slate-200">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Sync Data
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-2xl border-none shadow-sm group">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500">Total Count</p>
                <div className="text-2xl font-black text-slate-900">
                  {isLoading ? <Skeleton className="h-8 w-12" /> : filteredPayments.length}
                </div>
              </div>
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                <FileText className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm group">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500">Collected Value</p>
                <div className="text-2xl font-black text-slate-900">
                  {isLoading ? <Skeleton className="h-8 w-24" /> : `₹${totalAmount.toLocaleString()}`}
                </div>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm group">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500">Success Rate</p>
                <div className="text-2xl font-black text-slate-900">
                  {isLoading ? <Skeleton className="h-8 w-12" /> : `${Math.round((filteredPayments.filter(p => p.status === "completed").length / (filteredPayments.length || 1)) * 100)}%`}
                </div>
              </div>
              <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-100 transition-colors">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm group">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500">Pending Dues</p>
                <div className="text-2xl font-black text-slate-900">
                  {isLoading ? <Skeleton className="h-8 w-12" /> : filteredPayments.filter((p) => p.status === "pending").length}
                </div>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600 group-hover:bg-amber-100 transition-colors">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filter Bar */}
      <Card className="rounded-2xl border-none shadow-sm bg-white overflow-hidden">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
            {/* Search Input */}
            <div className="flex-1 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Search Record</label>
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <Input
                  placeholder="Filter by student name, UTR ID or memo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all text-sm"
                />
              </div>
            </div>

            {/* Select Group */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Period</label>
                <Select value={filterMonth} onValueChange={setFilterMonth}>
                  <SelectTrigger className="h-11 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all text-sm min-w-[130px]">
                    <SelectValue placeholder="All Period" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100">
                    <SelectItem value="all">Full History</SelectItem>
                    <SelectItem value="May">May 2024</SelectItem>
                    <SelectItem value="April">April 2024</SelectItem>
                    <SelectItem value="March">March 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Channel</label>
                <Select value={filterMethod} onValueChange={setFilterMethod}>
                  <SelectTrigger className="h-11 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all text-sm min-w-[130px]">
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100">
                    <SelectItem value="all">All Channels</SelectItem>
                    <SelectItem value="upi">UPI Gateway</SelectItem>
                    <SelectItem value="bank_transfer">Direct Bank</SelectItem>
                    <SelectItem value="cash">Cash Desk</SelectItem>
                    <SelectItem value="cheque">Cheque Pay</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2 md:col-span-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-11 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all text-sm min-w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Success</SelectItem>
                    <SelectItem value="pending">In Progress</SelectItem>
                    <SelectItem value="failed">Declined</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Button */}
            <Button
              variant="ghost"
              onClick={() => {
                setSearchTerm("");
                setFilterMonth("all");
                setFilterStatus("all");
                setFilterMethod("all");
              }}
              className="h-11 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all px-6"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="rounded-2xl border-none shadow-sm bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                <TableHead className="py-4 px-6 text-slate-500 font-bold text-xs uppercase tracking-wider">Student & Reference</TableHead>
                <TableHead className="py-4 px-6 text-slate-500 font-bold text-xs uppercase tracking-wider">Collection Detail</TableHead>
                <TableHead className="py-4 px-6 text-slate-500 font-bold text-xs uppercase tracking-wider">Timeline</TableHead>
                <TableHead className="py-4 px-6 text-slate-500 font-bold text-xs uppercase tracking-wider text-center">Status</TableHead>
                <TableHead className="py-4 px-6 text-slate-500 font-bold text-xs uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="border-b border-slate-50">
                    <TableCell className="py-4 px-6"><Skeleton className="h-10 w-48 rounded-lg" /></TableCell>
                    <TableCell className="py-4 px-6"><Skeleton className="h-10 w-32 rounded-lg" /></TableCell>
                    <TableCell className="py-4 px-6"><Skeleton className="h-10 w-24 rounded-lg" /></TableCell>
                    <TableCell className="py-4 px-6"><Skeleton className="h-8 w-20 rounded-full mx-auto" /></TableCell>
                    <TableCell className="py-4 px-6 text-right"><Skeleton className="h-9 w-24 rounded-lg ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => {
                  const statusInfo = getStatusConfig(payment.status || "");
                  const StatusIcon = statusInfo.icon;

                  return (
                    <TableRow
                      key={payment.id}
                      className="group hover:bg-slate-50/40 transition-colors border-b border-slate-50 last:border-0"
                    >
                      <TableCell className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-sm">{payment.studentName}</span>
                          <span className="text-[10px] font-mono text-slate-400 mt-0.5 tracking-tighter">REF: {payment.utrId || "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 text-sm">₹{payment.amount.toLocaleString()}</span>
                          <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">
                            {getMethodIcon(payment.method)}
                            {getMethodLabel(payment.method)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700">{payment.month}</span>
                          <span className="text-[10px] font-medium text-slate-400 mt-0.5">{new Date(payment.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-center">
                        <Badge className={`${statusInfo.color} border shadow-none px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-right">
                        <Link href="/receipts">
                          <Button size="sm" variant="ghost" className="h-9 rounded-xl text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-bold text-xs">
                            <Eye className="w-3.5 h-3.5 mr-2" />
                            Receipt
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="p-4 bg-slate-50 rounded-full mb-3 text-slate-300">
                        <Filter className="w-8 h-8" />
                      </div>
                      <p className="text-slate-500 font-medium">No matching transactions found</p>
                      <p className="text-slate-400 text-xs mt-1">Try adjusting your search or filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
