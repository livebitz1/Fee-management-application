"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { getStudents, createPayment } from "@/lib/api";

interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  admissionNumber: string;
  monthlyFee: number;
  paymentStatus: string;
}

interface SubmittedData {
  student?: string;
  month: string;
  amount: string;
  method: string;
  utr: string;
  date: string;
  receiptNumber: string;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CollectFeePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [utrId, setUtrId] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await getStudents();
        if (mounted) {
          setStudents(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          console.error("Error fetching students:", err);
          setError("Failed to load students");
          setIsLoading(false);
        }
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const student = students.find((s) => s.id === selectedStudent);
  const isDuplicateUtr = error?.toLowerCase().includes("duplicate utr") || false;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDuplicateUtr) return;
    
    if (
      selectedStudent &&
      selectedMonth &&
      amount &&
      paymentMethod &&
      utrId
    ) {
      try {
        setIsSubmitting(true);
        setError(null);
        
        const res = await createPayment({
          studentId: selectedStudent,
          studentName: student?.name,
          amount: parseFloat(amount),
          method: paymentMethod as "upi" | "bank_transfer" | "cash" | "cheque",
          utrId,
          month: selectedMonth,
          year: new Date().getFullYear(),
          date: new Date().toISOString(),
          status: "completed",
          notes,
        });

        setSubmittedData({
          student: student?.name,
          month: selectedMonth,
          amount,
          method: paymentMethod,
          utr: utrId,
          date: new Date().toLocaleDateString(),
          receiptNumber: res.receipt?.receiptNumber || `RCP-2024-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
        });
        setIsSubmitted(true);
        
        // Reset form
        setSelectedStudent("");
        setSelectedMonth("");
        setAmount("");
        setPaymentMethod("");
        setUtrId("");
        setNotes("");
      } catch (err: unknown) {
        console.error("Error creating payment:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to create payment";
        setError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleReset = () => {
    setSelectedStudent("");
    setSelectedMonth("");
    setAmount("");
    setPaymentMethod("");
    setUtrId("");
    setNotes("");
    setIsSubmitted(false);
    setSubmittedData(null);
    setError(null);
  };

  if (isSubmitted && submittedData) {
    return (
      <div className="p-4 md:p-8 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-black">Collect Fee</h1>
            <p className="text-gray-500 text-sm mt-1">Payment Successful</p>
          </div>
        </div>

        {/* Success Message */}
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 ml-2 text-sm">
            Fee collected successfully. Receipt has been generated.
          </AlertDescription>
        </Alert>

        {/* Receipt Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="col-span-1 lg:col-span-2 p-4 md:p-8 border-gray-200">
            <div className="space-y-4 md:space-y-6">
              {/* Receipt Header */}
              <div className="border-b border-gray-200 pb-4 md:pb-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-black">RECEIPT</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-xs md:text-sm text-gray-600 font-medium">
                      Receipt No.
                    </p>
                    <p className="text-base md:text-lg font-semibold text-black">
                      {submittedData.receiptNumber}
                    </p>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-gray-500">
                  Date: {submittedData.date}
                </p>
              </div>

              {/* Student Details */}
              <div>
                <p className="text-xs text-gray-600 font-medium uppercase">
                  Student Information
                </p>
                <p className="text-base md:text-lg font-semibold text-black mt-1">
                  {submittedData.student}
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  {student?.class} | ID: {student?.admissionNumber}
                </p>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <p className="text-xs text-gray-600 font-medium uppercase">
                    Payment Method
                  </p>
                  <p className="text-xs md:text-sm font-semibold text-black mt-1">
                    {submittedData.method === "upi"
                      ? "UPI"
                      : submittedData.method === "bank_transfer"
                      ? "Bank Transfer"
                      : submittedData.method === "cash"
                      ? "Cash"
                      : "Cheque"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium uppercase">
                    UTR/Reference
                  </p>
                  <p className="text-xs md:text-sm font-semibold text-black mt-1">
                    {submittedData.utr}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                <p className="text-xs md:text-sm text-gray-600">Amount Paid</p>
                <p className="text-2xl md:text-3xl font-bold text-black mt-2">
                  ₹{parseInt(submittedData.amount).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  For: {submittedData.month} 2024
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4 md:pt-6">
                <p className="text-xs text-gray-500 text-center">
                  This is a digital receipt. Please keep it for your records.
                </p>
              </div>
            </div>
          </Card>

          {/* Receipt Download and Actions */}
          <div className="space-y-3 md:space-y-4">
            <Card className="p-4 md:p-6 border-gray-200">
              <h3 className="font-semibold text-sm md:text-base text-black mb-4">Receipt Actions</h3>
              <div className="space-y-2 md:space-y-3">
                <Button className="w-full bg-black hover:bg-gray-900 text-sm">
                  Download PDF
                </Button>
                <Button variant="outline" className="w-full text-sm">
                  Send via Email
                </Button>
                <Button variant="outline" className="w-full text-sm">
                  Print
                </Button>
              </div>
            </Card>

            <Card className="p-4 md:p-6 border-gray-200">
              <h3 className="font-semibold text-sm md:text-base text-black mb-4">Summary</h3>
              <div className="space-y-3 text-xs md:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Student</span>
                  <span className="font-medium text-black">
                    {submittedData.student}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Month</span>
                  <span className="font-medium text-black">
                    {submittedData.month}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-medium text-black">
                    ₹{parseInt(submittedData.amount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <Badge className="bg-green-100 text-green-800 border-0 text-xs">
                    Completed
                  </Badge>
                </div>
              </div>
            </Card>

            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full text-sm"
            >
              Collect Another Fee
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-black">Collect Fee</h1>
        <p className="text-gray-500 text-sm mt-1">
          Record a new fee collection from a student
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Form */}
        <Card className="col-span-1 lg:col-span-2 p-4 md:p-8 border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Student Selection */}
            <div className="space-y-2">
              <Label htmlFor="student" className="text-sm font-medium">
                Select Student
              </Label>
              <Select 
                value={selectedStudent} 
                onValueChange={(val) => {
                  setSelectedStudent(val);
                  if (error) setError(null);
                }} 
                disabled={isLoading}
              >
                <SelectTrigger className="border-gray-200 text-sm">
                  <SelectValue placeholder={isLoading ? "Loading students..." : "Choose a student"} />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name || "Unknown"} ({student.class || "N/A"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Student Info */}
            {student && (
              <Card className="p-4 border-gray-200 bg-gray-50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Monthly Fee</p>
                    <p className="font-semibold text-black">
                      ₹{student.monthlyFee}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Current Status</p>
                    <Badge className="">{student.paymentStatus}</Badge>
                  </div>
                </div>
              </Card>
            )}

            {/* Month Selection */}
            <div className="space-y-2">
              <Label htmlFor="month" className="text-sm font-medium">
                Select Month
              </Label>
              <Select 
                value={selectedMonth} 
                onValueChange={(val) => {
                  setSelectedMonth(val);
                  if (error) setError(null);
                }}
              >
                <SelectTrigger className="border-gray-200">
                  <SelectValue placeholder="Choose a month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month} 2024
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (error) setError(null);
                }}
                className="border-gray-200 text-lg"
              />
              {student && (
                <p className="text-xs text-gray-500">
                  Monthly fee: ₹{student.monthlyFee}
                </p>
              )}
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="method" className="text-sm font-medium">
                Payment Method
              </Label>
              <Select 
                value={paymentMethod} 
                onValueChange={(val) => {
                  setPaymentMethod(val);
                  if (error) setError(null);
                }}
              >
                <SelectTrigger className="border-gray-200">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* UTR ID */}
            <div className="space-y-2">
              <Label htmlFor="utr" className="text-sm font-medium">
                UTR ID / Reference
              </Label>
              <Input
                id="utr"
                placeholder="Enter UTR or transaction ID"
                value={utrId}
                onChange={(e) => {
                  setUtrId(e.target.value);
                  if (error) setError(null);
                }}
                className={`border-gray-200 ${
                  isDuplicateUtr ? "border-red-500 ring-1 ring-red-500" : ""
                }`}
              />
              {isDuplicateUtr && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 ml-2">
                    This UTR ID already exists in the system. Please use a
                    different one.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="border-gray-200 resize-none h-20"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" type="button" onClick={handleReset} disabled={isSubmitting}>
                Clear
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-black hover:bg-gray-900"
                disabled={!selectedStudent || !amount || isSubmitting || isDuplicateUtr}
              >
                {isSubmitting ? "Processing..." : "Collect Fee"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Quick Reference */}
        <Card className="p-6 border-gray-200 h-fit">
          <h3 className="font-semibold text-black mb-4">Quick Reference</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-600 font-medium mb-2">
                PAYMENT METHODS
              </p>
              <div className="space-y-1 text-sm">
                <p className="text-gray-700">• UPI</p>
                <p className="text-gray-700">• Bank Transfer</p>
                <p className="text-gray-700">• Cash</p>
                <p className="text-gray-700">• Cheque</p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-600 font-medium mb-2">
                RECENT COLLECTIONS
              </p>
              <p className="text-sm text-gray-600">
                4 fees collected today
              </p>
              <p className="text-lg font-semibold text-black mt-1">
                ₹31,000
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
