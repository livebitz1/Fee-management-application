"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Search, Plus } from "lucide-react";
import { getStudents, createStudent } from "@/lib/api";

interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  admissionNumber: string;
  parentPhone: string;
  monthlyFee: number;
  paymentStatus: string;
}

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    section: "",
    admissionNumber: "",
    parentPhone: "",
    monthlyFee: "",
  });

  const fetchStudents = async (mounted = true) => {
    try {
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
      if (!formData.name || !formData.class || !formData.admissionNumber) {
        setError("Please fill in all required fields");
        return;
      }
      await createStudent({
        ...formData,
        monthlyFee: parseFloat(formData.monthlyFee),
      });
      setFormData({
        name: "",
        class: "",
        section: "",
        admissionNumber: "",
        parentPhone: "",
        monthlyFee: "",
      });
      setIsAddModalOpen(false);
      await fetchStudents();
    } catch (err) {
      console.error("Error adding student:", err);
      setError("Failed to add student");
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      (student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNumber?.includes(searchTerm)) ?? false
  );

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
          <h1 className="text-2xl md:text-3xl font-bold text-black">Students</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage all enrolled students and their fee status
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-900 text-sm w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Enter the student&apos;s information to add them to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Student Name</Label>
                <Input
                  id="name"
                  placeholder="Enter student name"
                  className="border-gray-200"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Input
                    id="class"
                    placeholder="e.g., 10-A"
                    className="border-gray-200"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <Input
                    id="section"
                    placeholder="e.g., A"
                    className="border-gray-200"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admission">Admission Number</Label>
                <Input
                  id="admission"
                  placeholder="e.g., 2024001"
                  className="border-gray-200"
                  value={formData.admissionNumber}
                  onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Parent Phone</Label>
                <Input
                  id="phone"
                  placeholder="e.g., 9876543210"
                  className="border-gray-200"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fee">Monthly Fee</Label>
                <Input
                  id="fee"
                  type="number"
                  placeholder="e.g., 5000"
                  className="border-gray-200"
                  value={formData.monthlyFee}
                  onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-black hover:bg-gray-900"
                  onClick={handleAddStudent}
                >
                  Add Student
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="p-4 border-gray-200">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name or admission number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 placeholder:text-gray-500 focus:ring-0 text-sm"
          />
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
                Class
              </TableHead>
              <TableHead className="text-gray-700 font-semibold text-xs md:text-sm">
                Admission No.
              </TableHead>
              <TableHead className="text-gray-700 font-semibold text-xs md:text-sm hidden sm:table-cell">
                Phone
              </TableHead>
              <TableHead className="text-gray-700 font-semibold text-xs md:text-sm">
                Monthly Fee
              </TableHead>
              <TableHead className="text-gray-700 font-semibold text-xs md:text-sm">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id} className="border-gray-200">
                  <TableCell className="font-medium text-black text-xs md:text-sm">
                    {student.name}
                  </TableCell>
                  <TableCell className="text-gray-600 text-xs md:text-sm">
                    {student.class}
                  </TableCell>
                  <TableCell className="text-gray-600 text-xs md:text-sm">
                    {student.admissionNumber}
                  </TableCell>
                  <TableCell className="text-gray-600 text-xs md:text-sm hidden sm:table-cell">
                    {student.parentPhone}
                  </TableCell>
                  <TableCell className="font-semibold text-black text-xs md:text-sm">
                    ₹{student.monthlyFee}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${getPaymentStatusColor(
                        student.paymentStatus || ""
                      )} border-0`}
                    >
                      {student.paymentStatus
                        ? student.paymentStatus.charAt(0).toUpperCase() +
                          student.paymentStatus.slice(1)
                        : "N/A"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No students found matching your search
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6 border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Total Students</p>
          <p className="text-2xl font-bold text-black mt-2">
            {students.length}
          </p>
        </Card>
        <Card className="p-6 border-gray-200">
          <p className="text-gray-600 text-sm font-medium">
            Fees Paid This Month
          </p>
          <p className="text-2xl font-bold text-black mt-2">
            {students.filter((s) => s.paymentStatus === "paid").length}
          </p>
        </Card>
        <Card className="p-6 border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Pending/Overdue</p>
          <p className="text-2xl font-bold text-black mt-2">
            {students.filter(
              (s) => s.paymentStatus === "pending" || s.paymentStatus === "overdue"
            ).length}
          </p>
        </Card>
      </div>
    </div>
  );
}
