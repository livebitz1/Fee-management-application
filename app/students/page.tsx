"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Users, 
  GraduationCap, 
  Phone, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreVertical,
  UserPlus,
  CreditCard,
  UserCircle,
  Pencil,
  Trash2
} from "lucide-react";
import { getStudents, createStudent, updateStudent, getStudent } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface Student {
  id: string;
  name: string;
  course: string;
  academicYear: string;
  semester?: string;
  admissionNumber: string;
  studentPhone: string;
  monthlyFee: number;
  paymentStatus: string;
}

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    academicYear: "",
    semester: "",
    admissionNumber: "",
    studentPhone: "",
    monthlyFee: "",
    yearlyFees: [
      { yearName: "Year 1", amount: "" },
    ]
  });

  const fetchStudents = async (mounted = true) => {
    try {
      setIsLoading(true);
      const data = await getStudents();
      if (mounted) {
        setError(null);
        setStudents(data);
      }
    } catch (err) {
      if (mounted) {
        console.error("Error fetching students:", err);
        setError("Failed to load students");
      }
    } finally {
      if (mounted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let mounted = true;
    void (async () => {
      await fetchStudents(mounted);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAddStudent = async () => {
    try {
      if (!formData.name || !formData.course || !formData.admissionNumber) {
        setError("Please fill in all required fields");
        return;
      }
      
      const processedYearlyFees = formData.yearlyFees.map(yf => ({
        ...yf,
        amount: parseFloat(yf.amount as string) || 0
      }));

      const payload = {
        ...formData,
        monthlyFee: processedYearlyFees.reduce((acc, yf) => acc + yf.amount, 0),
        yearlyFees: processedYearlyFees,
      };

      if (isEditMode && editingStudentId) {
        await updateStudent(editingStudentId, payload);
      } else {
        await createStudent(payload);
      }

      setFormData({
        name: "",
        course: "",
        academicYear: "",
        semester: "",
        admissionNumber: "",
        studentPhone: "",
        monthlyFee: "",
        yearlyFees: [{ yearName: "Year 1", amount: "" }],
      });
      setIsAddModalOpen(false);
      setIsEditMode(false);
      setEditingStudentId(null);
      await fetchStudents();
    } catch (err) {
      console.error("Error saving student:", err);
      setError("Failed to save student details");
    }
  };

  const handleEditClick = async (student: any) => {
    try {
      setIsLoading(true);
      const fullStudent = await getStudent(student.id);
      setFormData({
        name: fullStudent.name,
        course: fullStudent.course,
        academicYear: fullStudent.academicYear,
        semester: fullStudent.semester || "",
        admissionNumber: fullStudent.admissionNumber,
        studentPhone: fullStudent.studentPhone || "",
        monthlyFee: fullStudent.monthlyFee.toString(),
        yearlyFees: fullStudent.yearlyFees?.map((yf: any) => ({
          yearName: yf.yearName,
          amount: yf.amount.toString(),
          paidAmount: yf.paidAmount,
          status: yf.status
        })) || [{ yearName: "Year 1", amount: "" }]
      });
      setEditingStudentId(student.id);
      setIsEditMode(true);
      setIsAddModalOpen(true);
    } catch (err) {
      console.error("Error preparing edit:", err);
      setError("Failed to load student details for editing");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      (student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNumber?.includes(searchTerm)) ?? false
  );

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "paid":
        return { color: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: CheckCircle2, label: "Paid" };
      case "pending":
        return { color: "bg-amber-50 text-amber-700 border-amber-100", icon: Clock, label: "Pending" };
      case "overdue":
        return { color: "bg-rose-50 text-rose-700 border-rose-100", icon: AlertCircle, label: "Overdue" };
      default:
        return { color: "bg-slate-50 text-slate-700 border-slate-100", icon: Clock, label: "N/A" };
    }
  };

  if (error) {
    return (
      <div className="p-8">
        <Card className="p-8 border-red-200 bg-red-50 flex flex-col items-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-red-900 mb-2">Error Loading Students</h2>
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Student Directory</h1>
          <p className="text-slate-500 mt-1">
            Manage student records, enrollment details, and payment statuses.
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-black hover:bg-slate-800 text-white shadow-lg shadow-slate-200">
              <UserPlus className="w-4 h-4 mr-2" />
              Register Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] rounded-2xl border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {isEditMode ? "Edit Student Profile" : "New Enrollment"}
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                {isEditMode 
                  ? "Update student information and adjust fee schedules." 
                  : "Register a new student into the system. All fields marked with * are required."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase">Student Full Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Rahul Sharma"
                  className="h-11 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course" className="text-xs font-bold text-slate-500 uppercase">Course Enrolled *</Label>
                  <Input
                    id="course"
                    placeholder="e.g. B.Tech CSE"
                    className="h-11 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="academicYear" className="text-xs font-bold text-slate-500 uppercase">Academic Year *</Label>
                  <Input
                    id="academicYear"
                    placeholder="e.g. 2024-25"
                    className="h-11 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="semester" className="text-xs font-bold text-slate-500 uppercase">Semester</Label>
                  <Input
                    id="semester"
                    placeholder="e.g. Semester 3"
                    className="h-11 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admission" className="text-xs font-bold text-slate-500 uppercase">Enrollment No. *</Label>
                  <Input
                    id="admission"
                    placeholder="e.g. UNV-2024-001"
                    className="h-11 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all"
                    value={formData.admissionNumber}
                    onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                  />
                </div>
              </div>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Yearly Fee Structure (₹)</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 px-2 text-[9px] font-bold rounded-md border-indigo-100 text-indigo-600 hover:bg-indigo-50"
                      onClick={() => {
                        const nextYear = formData.yearlyFees.length + 1;
                        setFormData({
                          ...formData,
                          yearlyFees: [...formData.yearlyFees, { yearName: `Year ${nextYear}`, amount: "" }]
                        });
                      }}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Year
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                    {formData.yearlyFees.map((yf, idx) => (
                      <div key={idx} className="flex items-end gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                        <div className="flex-1 space-y-1.5">
                          <Label className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Year Label</Label>
                          <Input
                            placeholder="e.g. 1st Year"
                            className="h-9 bg-white border-slate-200 rounded-lg text-xs"
                            value={yf.yearName}
                            onChange={(e) => {
                              const newFees = [...formData.yearlyFees];
                              newFees[idx].yearName = e.target.value;
                              setFormData({ ...formData, yearlyFees: newFees });
                            }}
                          />
                        </div>
                        <div className="flex-[1.5] space-y-1.5">
                          <Label className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Tuition Amount</Label>
                          <div className="relative">
                            <Input
                              type="number"
                              placeholder="0.00"
                              className="h-9 bg-white border-slate-200 rounded-lg text-xs"
                              value={yf.amount}
                              onChange={(e) => {
                                const newFees = [...formData.yearlyFees];
                                newFees[idx].amount = e.target.value;
                                setFormData({ ...formData, yearlyFees: newFees });
                              }}
                            />
                          </div>
                        </div>
                        {formData.yearlyFees.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
                            onClick={() => {
                              const newFees = formData.yearlyFees.filter((_, i) => i !== idx);
                              setFormData({ ...formData, yearlyFees: newFees });
                            }}
                          >
                            <Plus className="w-4 h-4 rotate-45" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-bold text-slate-500 uppercase">Student Contact No.</Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="phone"
                    placeholder="e.g. +91 98765 43210"
                    className="pl-10 h-11 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all"
                    value={formData.studentPhone}
                    onChange={(e) => setFormData({ ...formData, studentPhone: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="ghost"
                  className="flex-1 h-11 rounded-xl text-slate-500"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Discard
                </Button>
                <Button
                  className="flex-1 h-11 rounded-xl bg-black hover:bg-slate-800 text-white shadow-lg shadow-slate-100"
                  onClick={handleAddStudent}
                >
                  Confirm Registration
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-none shadow-sm group">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500">Total Strength</p>
                <div className="text-2xl font-black text-slate-900">
                  {isLoading ? <Skeleton className="h-8 w-12" /> : students.length}
                </div>
              </div>
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm group">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500">Cleared This Year</p>
                <div className="text-2xl font-black text-slate-900">
                  {isLoading ? <Skeleton className="h-8 w-12" /> : students.filter((s) => s.paymentStatus === "paid").length}
                </div>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm group">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500">Pending Follow-up</p>
                <div className="text-2xl font-black text-slate-900">
                  {isLoading ? <Skeleton className="h-8 w-12" /> : students.filter((s) => s.paymentStatus === "pending" || s.paymentStatus === "overdue").length}
                </div>
              </div>
              <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600 group-hover:bg-rose-100 transition-colors">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Directory Section */}
      <Card className="rounded-2xl border-none shadow-sm bg-white overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-50 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <Input
              placeholder="Search by student name or admission number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all text-sm w-full md:max-w-md"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                <TableHead className="py-4 px-6 text-slate-500 font-bold text-xs uppercase tracking-wider">Student Details</TableHead>
                <TableHead className="py-4 px-6 text-slate-500 font-bold text-xs uppercase tracking-wider">Course & Year</TableHead>
                <TableHead className="py-4 px-6 text-slate-500 font-bold text-xs uppercase tracking-wider">Mobile Contact</TableHead>
                <TableHead className="py-4 px-6 text-slate-500 font-bold text-xs uppercase tracking-wider">Annual Fee</TableHead>
                <TableHead className="py-4 px-6 text-slate-500 font-bold text-xs uppercase tracking-wider text-center">Payment Status</TableHead>
                <TableHead className="py-4 px-6 text-slate-500 font-bold text-xs uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="border-b border-slate-50">
                    <TableCell className="py-4 px-6"><Skeleton className="h-10 w-48 rounded-lg" /></TableCell>
                    <TableCell className="py-4 px-6"><Skeleton className="h-10 w-24 rounded-lg" /></TableCell>
                    <TableCell className="py-4 px-6"><Skeleton className="h-10 w-32 rounded-lg" /></TableCell>
                    <TableCell className="py-4 px-6"><Skeleton className="h-10 w-20 rounded-lg" /></TableCell>
                    <TableCell className="py-4 px-6"><Skeleton className="h-8 w-20 rounded-full mx-auto" /></TableCell>
                    <TableCell className="py-4 px-6 text-right"><Skeleton className="h-9 w-24 rounded-lg ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const statusInfo = getStatusConfig(student.paymentStatus || "");
                  const StatusIcon = statusInfo.icon;

                  return (
                    <TableRow key={student.id} className="group hover:bg-slate-50/40 transition-colors border-b border-slate-50 last:border-0">
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-black text-sm">
                            {student.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 text-sm">{student.name}</span>
                            <span className="text-[10px] font-mono text-slate-400 mt-0.5 tracking-tighter">ID: {student.admissionNumber}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
                            <GraduationCap className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-700">{student.course}</span>
                            <span className="text-[10px] text-slate-400">{student.academicYear} {student.semester && `| ${student.semester}`}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
                            <Phone className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-medium text-slate-600">{student.studentPhone || 'No Contact'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <span className="font-black text-slate-900 text-sm">₹{student.monthlyFee.toLocaleString()}</span>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-center">
                        <Badge className={`${statusInfo.color} border shadow-none px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleEditClick(student)}
                            className="h-9 w-9 p-0 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Link href="/collect-fee">
                            <Button size="sm" variant="ghost" className="h-9 rounded-xl text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-bold text-xs">
                              <CreditCard className="w-3.5 h-3.5 mr-2" />
                              Collect Fee
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="p-4 bg-slate-50 rounded-full mb-3 text-slate-300">
                        <Users className="w-8 h-8" />
                      </div>
                      <p className="text-slate-500 font-medium">No students found</p>
                      <p className="text-slate-400 text-xs mt-1">Try adjusting your search criteria</p>
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
