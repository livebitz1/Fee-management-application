"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Users, 
  TrendingUp, 
  CreditCard, 
  AlertCircle, 
  CheckCircle2,
  Filter,
  Calendar,
  IndianRupee,
  Clock,
  Printer
} from "lucide-react";
import { getReportsData } from "@/lib/api";
import { downloadReceipt } from "@/lib/pdf";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ReportData {
  collectionData: { name: string; value: number; fill: string }[];
  classWiseData: { class: string; collected: number; target: number; studentCount: number; rate: number }[];
  methodData: { name: string; value: number }[];
  monthlyTrend: { month: string; revenue: number }[];
  summary: {
    totalCollected: number;
    totalPending: number;
    totalStudents: number;
    overallCollectionRate: number;
  };
  performanceSummary: {
    bestPerformingClass: string;
    onTimeCollectionRate: string;
  };
}

export default function ReportsPage() {
  const [reportsData, setReportsData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await getReportsData();
        if (mounted) {
          setReportsData(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          console.error("Error fetching reports data:", err);
          setError("Failed to load reports data. Please check your connection.");
          setIsLoading(false);
        }
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleExport = async () => {
    if (!reportsData) return;
    try {
      toast.loading("Compiling financial report...", { id: "report-gen" });
      await downloadReceipt("report-capture-area", `Financial_Report_${format(new Date(), "yyyy_MM_dd")}`);
      toast.success("Report exported successfully", { id: "report-gen" });
    } catch (err) {
      console.error(err);
      toast.error("Export failed. Try printing the page.", { id: "report-gen" });
    }
  };

  if (error) {
    return (
      <div className="p-4 md:p-8">
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-600 w-5 h-5" />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-600 hover:bg-red-700 text-white"
          >
            Retry Loading
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading || !reportsData) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-64 bg-gray-100 animate-pulse rounded"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[400px] bg-gray-100 animate-pulse rounded-xl"></div>
          <div className="h-[400px] bg-gray-100 animate-pulse rounded-xl"></div>
        </div>
      </div>
    );
  }

  const { 
    collectionData, 
    classWiseData, 
    methodData, 
    monthlyTrend, 
    summary, 
    performanceSummary 
  } = reportsData;

  const COLORS = ['#000000', '#475569', '#94a3b8', '#cbd5e1', '#e2e8f0'];

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50/50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <Calendar className="w-4 h-4" />
            <span>Academic Year 2024-25</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Financial Analytics</h1>
          <p className="text-slate-500">Comprehensive overview of school fee collections and performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200 bg-white hover:bg-slate-50 no-print" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" />
            Print Page
          </Button>
          <Button 
            className="rounded-xl bg-black hover:bg-slate-800 text-white shadow-lg shadow-slate-200 no-print"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-none shadow-sm overflow-hidden group">
          <CardContent className="p-0">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <IndianRupee className="w-5 h-5 text-emerald-600" />
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12%
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Collected</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">₹{summary.totalCollected.toLocaleString()}</h3>
              </div>
            </div>
            <div className="h-1 bg-emerald-500" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Pending Amount</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">₹{summary.totalPending.toLocaleString()}</h3>
              </div>
            </div>
            <div className="h-1 bg-amber-500" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Students</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{summary.totalStudents}</h3>
              </div>
            </div>
            <div className="h-1 bg-blue-500" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-slate-900 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Collection Rate</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{summary.overallCollectionRate}%</h3>
              </div>
            </div>
            <div className="h-1 bg-slate-900" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card className="rounded-2xl border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Revenue Analytics</CardTitle>
            <CardDescription>Monthly collection trends over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(val) => `₹${val/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(val: any) => [`₹${val.toLocaleString()}`, 'Revenue']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#000" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#000', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Collection Distribution */}
        <Card className="rounded-2xl border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Collection Status</CardTitle>
            <CardDescription>Overall student payment compliance distribution</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-[300px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={collectionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {collectionData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-3">
              {collectionData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-sm font-medium text-slate-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Class-wise Performance */}
        <Card className="col-span-1 lg:col-span-2 rounded-2xl border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Class Performance</CardTitle>
            <CardDescription>Collection progress and target achievement per grade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classWiseData} barGap={12}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="class" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(val) => `₹${val/1000}k`}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="collected" fill="#000" radius={[4, 4, 0, 0]} name="Amount Collected" />
                  <Bar dataKey="target" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Collection Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="rounded-2xl border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Payment Channels</CardTitle>
            <CardDescription>Revenue distribution across different payment methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={methodData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    label={({ name, percent }: any) => `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                  >
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {methodData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={2} />
                    ))}
                  </Pie>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <Tooltip formatter={(val: any) => `₹${val.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance & Insights */}
        <Card className="rounded-2xl border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">System Insights</CardTitle>
            <CardDescription>Automatic performance tracking and collection health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <TrendingUp className="w-4 h-4 text-slate-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">Top Performing Class</span>
                </div>
                <Badge className="bg-black text-white px-3">{performanceSummary.bestPerformingClass}</Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-slate-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">Avg. Collection Compliance</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{performanceSummary.onTimeCollectionRate}</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <CreditCard className="w-4 h-4 text-slate-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">Primary Channel</span>
                </div>
                <Badge variant="outline" className="border-slate-200 font-semibold">UPI / DIGITAL</Badge>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-bold text-amber-900">Collection Alert</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Collection rate is currently at {summary.overallCollectionRate}%. 
                  We recommend sending automated reminders to {summary.totalStudents} students with pending status to reach the 95% threshold.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hidden Report Template for PDF Capture */}
      <div className="fixed -left-[5000px] top-0 pointer-events-none opacity-0">
        <div id="report-capture-area" className="w-[1000px] bg-white p-12 space-y-10">
          <div className="flex justify-between items-end border-b-2 border-slate-900 pb-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Financial Audit Report</h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">ABC High School • Academic Session 2024-25</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase">Generated On</p>
              <p className="text-lg font-bold text-slate-900">{format(new Date(), "PPP")}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Total Revenue</p>
              <p className="text-2xl font-black text-slate-900">₹{summary.totalCollected.toLocaleString()}</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Pending Arrears</p>
              <p className="text-2xl font-black text-slate-900">₹{summary.totalPending.toLocaleString()}</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Collection Compliance</p>
              <p className="text-2xl font-black text-slate-900">{summary.overallCollectionRate}%</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-l-4 border-slate-900 pl-4 uppercase">Class-wise Performance</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-widest">
                  <th className="p-4 rounded-tl-xl">Grade</th>
                  <th className="p-4 text-center">Enrollment</th>
                  <th className="p-4 text-right">Collected</th>
                  <th className="p-4 text-right">Target</th>
                  <th className="p-4 text-right rounded-tr-xl">Rate</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {classWiseData.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-100">
                    <td className="p-4 font-bold text-slate-900">{row.class}</td>
                    <td className="p-4 text-center text-slate-600">{row.studentCount}</td>
                    <td className="p-4 text-right font-bold text-slate-900">₹{row.collected.toLocaleString()}</td>
                    <td className="p-4 text-right text-slate-500">₹{row.target.toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <span className={cn(
                        "px-2 py-1 rounded-lg text-[10px] font-black",
                        row.rate >= 90 ? "bg-emerald-50 text-emerald-700" : 
                        row.rate >= 70 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"
                      )}>
                        {row.rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-12 pt-8">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 uppercase">Revenue Composition</h2>
              <div className="space-y-3">
                {methodData.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-sm font-bold text-slate-700">{item.name}</span>
                    <span className="text-sm font-black text-slate-900">₹{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4 bg-slate-900 text-white p-8 rounded-3xl">
              <h2 className="text-lg font-bold uppercase tracking-widest text-slate-400">Executive Insight</h2>
              <p className="text-sm leading-relaxed text-slate-300">
                The institution has achieved a collection compliance rate of <span className="text-emerald-400 font-bold">{summary.overallCollectionRate}%</span> for the current period. 
                <span className="font-bold text-white"> {performanceSummary.bestPerformingClass} </span> leads with the highest contribution. 
                Current pending amount stands at <span className="text-amber-400 font-bold">₹{summary.totalPending.toLocaleString()}</span> across {summary.totalStudents} enrollments.
              </p>
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Compliance Status</span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                  Healthy
                </span>
              </div>
            </div>
          </div>

          <div className="pt-12 text-center">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
              Confidential Financial Record • Generated via SmartFee Pro Intelligence<br/>
              © 2024 ABC High School Administration System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
