"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowRight,
  Plus,
  IndianRupee,
  Calendar,
  ChevronRight,
  Download,
  Wallet,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getDashboardStats,
  getRevenueData,
  getRecentActivities,
  getPendingFees,
} from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface DashboardStats {
  totalStudents: number;
  totalRevenue: number;
  pendingFees: number;
  overduePayments: number;
  collectionRate: number;
}

interface RevenueData {
  month: string;
  revenue: number;
}

interface RecentActivity {
  id: string;
  student: string;
  action: string;
  amount: number;
  time: string;
  status: string;
}

interface PendingFee {
  id: string;
  student_name: string;
  course: string;
  monthsFell: number;
  amount: number;
  daysOverdue: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
} as const;

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [pendingFees, setPendingFees] = useState<PendingFee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [statsData, revenueDataRes, activitiesData, feesData] =
          await Promise.all([
            getDashboardStats(),
            getRevenueData(),
            getRecentActivities(),
            getPendingFees(),
          ]);

        setStats(statsData);
        setRevenueData(revenueDataRes);
        setActivities(activitiesData);
        setPendingFees(feesData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="p-6 md:p-12">
        <Card className="p-8 border-red-200 bg-red-50/50 backdrop-blur-sm flex flex-col items-center text-center">
          <div className="p-3 bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-red-900 mb-2">Something went wrong</h2>
          <p className="text-red-700 max-w-md mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="border-red-200 text-red-700 hover:bg-red-100">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 border-none shadow-sm">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-12 w-12 rounded-xl" />
              </div>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-2 h-[400px]">
            <Skeleton className="h-full w-full rounded-2xl" />
          </Card>
          <Card className="h-[400px]">
            <Skeleton className="h-full w-full rounded-2xl" />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-4 md:p-8 space-y-8 bg-slate-50/30 min-h-screen"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1">
            <Calendar className="w-4 h-4" />
            <span>Academic Session {new Date().getFullYear()}-{ (new Date().getFullYear() + 1).toString().slice(-2) }</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Executive Dashboard</h1>
          <p className="text-slate-500 mt-1 font-medium">
            Strategic financial tracking for multi-year academic programs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200 bg-white hover:bg-slate-50 shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            Export Stats
          </Button>
          <Link href="/collect-fee">
            <Button className="rounded-xl bg-black hover:bg-slate-800 text-white shadow-lg shadow-slate-200">
              <Plus className="w-4 h-4 mr-2" />
              Collect New Fee
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="rounded-2xl border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
            <CardContent className="p-0">
              <div className="p-6 flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500">Total Students</p>
                  <h3 className="text-3xl font-bold text-slate-900">{stats?.totalStudents}</h3>
                  <div className="flex items-center gap-1.5 text-emerald-600 font-medium text-xs">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+2 newly joined</span>
                  </div>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <div className="h-1.5 w-full bg-indigo-500/10">
                <div className="h-full bg-indigo-500 w-[75%]" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="rounded-2xl border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
            <CardContent className="p-0">
              <div className="p-6 flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500">Gross Revenue</p>
                  <h3 className="text-3xl font-bold text-slate-900">₹{stats?.totalRevenue.toLocaleString()}</h3>
                  <div className="flex items-center gap-1.5 text-emerald-600 font-medium text-xs">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>12% growth vs last month</span>
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                  <IndianRupee className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <div className="h-1.5 w-full bg-emerald-500/10">
                <div className="h-full bg-emerald-500 w-[85%]" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="rounded-2xl border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
            <CardContent className="p-0">
              <div className="p-6 flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500">Pending Dues</p>
                  <h3 className="text-3xl font-bold text-slate-900">₹{stats?.pendingFees.toLocaleString()}</h3>
                  <div className="flex items-center gap-1.5 text-amber-600 font-medium text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Across 12 students</span>
                  </div>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors">
                  <Wallet className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <div className="h-1.5 w-full bg-amber-500/10">
                <div className="h-full bg-amber-500 w-[30%]" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="rounded-2xl border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
            <CardContent className="p-0">
              <div className="p-6 flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500">Overdue Risk</p>
                  <h3 className="text-3xl font-bold text-slate-900">₹{stats?.overduePayments.toLocaleString()}</h3>
                  <div className="flex items-center gap-1.5 text-rose-600 font-medium text-xs">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Critical threshold reached</span>
                  </div>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl group-hover:bg-rose-100 transition-colors">
                  <Activity className="w-6 h-6 text-rose-600" />
                </div>
              </div>
              <div className="h-1.5 w-full bg-rose-500/10">
                <div className="h-full bg-rose-500 w-[15%]" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <motion.div variants={itemVariants} className="col-span-1 lg:col-span-2">
          <Card className="rounded-2xl border-none shadow-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold">Revenue Dynamics</CardTitle>
                <CardDescription>Monthly collection flow for current session</CardDescription>
              </div>
              <select className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all">
                <option>Session 2024-25</option>
                <option>Session 2023-24</option>
              </select>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                          <stop offset="100%" stopColor="#818cf8" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
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
                        contentStyle={{ 
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          padding: '12px'
                        }}
                        cursor={{ fill: '#f1f5f9', radius: 10 }}
                      />
                      <Bar 
                        dataKey="revenue" 
                        fill="url(#barGradient)" 
                        radius={[6, 6, 0, 0]} 
                        barSize={32}
                      />
                    </BarChart>
                  </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Collection Efficiency Circle */}
        <motion.div variants={itemVariants}>
          <Card className="rounded-2xl border-none shadow-sm h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Collection Health</CardTitle>
              <CardDescription>Efficiency tracking against target goals</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center py-6">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                  <motion.circle 
                    cx="50" cy="50" r="42" fill="none" stroke="url(#circleGradient)" strokeWidth="8"
                    strokeDasharray="264"
                    initial={{ strokeDashoffset: 264 }}
                    animate={{ strokeDashoffset: 264 - (264 * (stats?.collectionRate || 0)) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl font-black text-slate-900 tracking-tighter"
                  >
                    {stats?.collectionRate}
                  </motion.span>
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">% Rate</span>
                </div>
              </div>
              <div className="mt-10 space-y-4 w-full">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</span>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Healthy
                  </Badge>
                </div>
                <p className="text-xs text-center text-slate-500 px-4 leading-relaxed">
                  Excellent progress! You are currently <strong>5% ahead</strong> of last month&apos;s collection cycle.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Activity & Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
        {/* Recent Transactions */}
        <motion.div variants={itemVariants}>
          <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold">Activity Log</CardTitle>
                <CardDescription>Latest payment transactions recorded</CardDescription>
              </div>
              <Link href="/payments">
                <Button variant="ghost" size="sm" className="rounded-lg text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                  View List <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{activity.student}</p>
                        <p className="text-xs text-slate-500 font-medium">{activity.action}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">₹{activity.amount.toLocaleString()}</p>
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pending Risk Table */}
        <motion.div variants={itemVariants}>
          <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold">Priority Dues</CardTitle>
                <CardDescription>Students requiring immediate follow-up</CardDescription>
              </div>
              <Link href="/students">
                <Button variant="ghost" size="sm" className="rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                  Manage <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {pendingFees.map((fee) => (
                  <div key={fee.id} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 font-bold text-sm">
                        {fee.student_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{fee.student_name}</p>
                        <div className="flex gap-2 mt-0.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{fee.course}</span>
                          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">• Year {fee.monthsFell} Priority</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-rose-600">₹{fee.amount.toLocaleString()}</p>
                      {fee.daysOverdue > 0 && (
                        <div className="inline-flex items-center px-1.5 py-0.5 rounded bg-rose-100 text-[10px] font-black text-rose-700 mt-1 uppercase">
                          {fee.daysOverdue}D OVERDUE
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
