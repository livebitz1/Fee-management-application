"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowRight,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getDashboardStats,
  getRevenueData,
  getRecentActivities,
  getPendingFees,
} from "@/lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
  class: string;
  monthsFell: number;
  amount: number;
  daysOverdue: number;
}

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
      <div className="p-4 md:p-8">
        <Card className="p-6 border-red-200 bg-red-50">
          <p className="text-red-800">{error}</p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 md:p-8">
        <div className="space-y-6 md:space-y-8">
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-4 md:p-6">
                <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-4 md:p-8">
        <Card className="p-6">
          <p className="text-gray-500">No data available</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-black">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back. Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex gap-2 md:gap-3">
          <Button variant="outline" className="text-sm">Export</Button>
          <Button className="bg-black hover:bg-gray-900 text-sm">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Add Student</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="p-4 md:p-6 border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-xs md:text-sm font-medium">Total Students</p>
              <p className="text-2xl md:text-4xl font-bold text-black mt-2">
                {stats.totalStudents}
              </p>
              <p className="text-gray-500 text-xs mt-2">+2 this month</p>
            </div>
            <div className="p-2 md:p-3 bg-gray-100 rounded-lg flex-shrink-0">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-black" />
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-6 border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-xs md:text-sm font-medium">Total Revenue</p>
              <p className="text-2xl md:text-4xl font-bold text-black mt-2">
                ₹{stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-gray-500 text-xs mt-2">+12% from last month</p>
            </div>
            <div className="p-2 md:p-3 bg-gray-100 rounded-lg flex-shrink-0">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-black" />
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-6 border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-xs md:text-sm font-medium">Pending Fees</p>
              <p className="text-2xl md:text-4xl font-bold text-black mt-2">
                ₹{stats.pendingFees.toLocaleString()}
              </p>
              <p className="text-gray-500 text-xs mt-2">2 students</p>
            </div>
            <div className="p-2 md:p-3 bg-gray-100 rounded-lg flex-shrink-0">
              <Clock className="w-5 h-5 md:w-6 md:h-6 text-black" />
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-6 border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-xs md:text-sm font-medium">Overdue Payments</p>
              <p className="text-2xl md:text-4xl font-bold text-black mt-2">
                ₹{stats.overduePayments.toLocaleString()}
              </p>
              <p className="text-gray-500 text-xs mt-2">2 students</p>
            </div>
            <div className="p-2 md:p-3 bg-gray-100 rounded-lg flex-shrink-0">
              <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-black" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Revenue Chart */}
        <Card className="col-span-1 lg:col-span-2 p-4 md:p-6 border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-semibold text-black">Revenue Trend</h2>
            <select className="text-xs md:text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={250} minHeight={200}>
            <LineChart data={revenueData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />
              <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: 11 }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#000"
                dot={{ fill: "#000" }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Collection Rate */}
        <Card className="p-4 md:p-6 border-gray-200">
          <h3 className="text-base md:text-lg font-semibold text-black mb-4 text-center">
            Collection Rate
          </h3>
          <div className="flex flex-col items-center justify-center py-4 md:py-6">
            <div className="relative w-28 h-28 md:w-36 md:h-36">
              <svg
                className="absolute inset-0 w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="5"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#000"
                  strokeWidth="5"
                  strokeDasharray={`${(stats.collectionRate / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl md:text-4xl font-bold text-black leading-none">
                  {stats.collectionRate}
                </span>
                <span className="text-xs md:text-sm text-gray-500 font-medium mt-1">%</span>
              </div>
            </div>
            <p className="text-gray-500 text-xs md:text-sm text-center mt-4 md:mt-6 leading-snug">
              Of all fees collected this month
            </p>
          </div>
        </Card>
      </div>

      {/* Recent Activity and Pending Fees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Recent Activity */}
        <Card className="p-4 md:p-6 border-gray-200">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold text-black">Recent Activity</h3>
            <Button variant="ghost" size="sm" className="text-xs md:text-sm">
              View all <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-2" />
            </Button>
          </div>
          <div className="space-y-3 md:space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-2 md:p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="text-xs md:text-sm font-medium text-black">
                    {activity.student}
                  </p>
                  <p className="text-xs text-gray-500">{activity.action}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs md:text-sm font-semibold text-black">
                    ₹{activity.amount}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending Fees */}
        <Card className="p-4 md:p-6 border-gray-200">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold text-black">Pending Fees</h3>
            <Button variant="ghost" size="sm" className="text-xs md:text-sm">
              View all <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-2" />
            </Button>
          </div>
          <div className="space-y-3 md:space-y-4">
            {pendingFees.map((fee) => (
              <div key={fee.id} className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-black">{fee.student_name}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">{fee.class}</Badge>
                    <Badge variant="outline" className="text-xs">
                      {fee.monthsFell} month(s)
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs md:text-sm font-semibold text-black">
                    ₹{fee.amount}
                  </p>
                  {fee.daysOverdue > 0 && (
                    <p className="text-xs text-red-600">
                      {fee.daysOverdue} days overdue
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
