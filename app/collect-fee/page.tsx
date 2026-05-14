"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle2, 
  AlertCircle, 
  Calendar as CalendarIcon, 
  User, 
  IndianRupee, 
  CreditCard, 
  Wallet, 
  FileText, 
  History, 
  ShieldCheck, 
  Printer, 
  Download, 
  Mail,
  ArrowRight,
  Info,
  RefreshCcw,
} from "lucide-react";
import { getStudents, createPayment, checkUtrId } from "@/lib/api";
import { Student } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { downloadReceipt } from "@/lib/pdf";
import { toast } from "sonner";



interface SubmittedData {
  student?: string;
  month: string;
  amount: string;
  method: string;
  utr: string;
  date: string;
  receiptNumber: string;
}

export default function CollectFeePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(new Date());
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [utrId, setUtrId] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [utrExists, setUtrExists] = useState(false);
  const [isCheckingUtr, setIsCheckingUtr] = useState(false);

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

  // Debounced UTR check
  useEffect(() => {
    if (!utrId || utrId.length < 3) {
      setUtrExists(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setIsCheckingUtr(true);
        const { exists } = await checkUtrId(utrId);
        setUtrExists(exists);
        if (exists) {
          setError("Duplicate UTR ID detected. This transaction is already recorded.");
        } else if (error?.toLowerCase().includes("duplicate utr")) {
          setError(null);
        }
      } catch (err) {
        console.error("Error checking UTR:", err);
      } finally {
        setIsCheckingUtr(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [utrId]);

  const student = students.find((s) => s.id === selectedStudent);
  const isDuplicateUtr = utrExists || (error?.toLowerCase().includes("duplicate utr") || false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDuplicateUtr && paymentMethod !== "cash") return;
    
    // Auto-generate UTR for cash if not provided
    const finalUtrId = paymentMethod === "cash" 
      ? (utrId || `CASH-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`.toUpperCase())
      : utrId;

    if (selectedStudent && selectedMonth && amount && paymentMethod && finalUtrId) {
      try {
        setIsSubmitting(true);
        setError(null);
        
        const res = await createPayment({
          studentId: selectedStudent,
          studentName: student?.name,
          amount: parseFloat(amount),
          method: paymentMethod as "upi" | "bank_transfer" | "cash" | "cheque",
          utrId: finalUtrId,
          month: "Annual Fee",
          year: new Date().getFullYear(),
          date: selectedMonth ? selectedMonth.toISOString() : new Date().toISOString(),
          status: "completed",
          notes,
        });

        setSubmittedData({
          student: student?.name,
          month: `Annual Session ${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(-2)}`,
          amount,
          method: paymentMethod,
          utr: finalUtrId,
          date: selectedMonth ? format(selectedMonth, "PPP") : format(new Date(), "PPP"),
          receiptNumber: res.receipt?.receiptNumber || `RCP-${Date.now().toString().slice(-6)}`,
        });
        setIsSubmitted(true);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Payment processing failed";
        setError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleReset = () => {
    setSelectedStudent("");
    setSelectedMonth(new Date());
    setAmount("");
    setPaymentMethod("");
    setUtrId("");
    setUtrExists(false);
    setNotes("");
    setIsSubmitted(false);
    setSubmittedData(null);
    setError(null);
  };

  const handleDownload = async () => {
    if (!submittedData) return;
    try {
      toast.loading("Preparing high-quality PDF...", { id: "pdf-gen" });
      await downloadReceipt("download-capture-area-fee", `Receipt_${submittedData.receiptNumber}`);
      toast.success("Receipt saved successfully", { id: "pdf-gen" });
    } catch (err) {
      console.error(err);
      toast.error("Generation failed. Try Print instead.", { id: "pdf-gen" });
    }
  };

  if (isSubmitted && submittedData) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-2">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Payment Confirmed</h1>
          <p className="text-slate-500">Transaction recorded and receipt generated successfully.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 rounded-3xl border-none shadow-2xl overflow-hidden bg-white printable-area">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-start">
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Fee Receipt</h2>
                <p className="text-2xl font-bold italic">SmartFee Pro</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase">Receipt No.</p>
                <p className="text-lg font-mono font-bold text-emerald-400">{submittedData.receiptNumber}</p>
              </div>
            </div>
            
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</p>
                  <p className="font-bold text-slate-900">{submittedData.student}</p>
                  <p className="text-xs text-slate-500">{student?.course} | {student?.admissionNumber}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                  <p className="font-bold text-slate-900">{submittedData.date}</p>
                </div>
              </div>

              <div className="border-y border-slate-100 py-6 grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Channel</p>
                  <p className="text-sm font-bold text-slate-700 uppercase">{submittedData.method.replace("_", " ")}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference</p>
                  <p className="text-sm font-mono font-bold text-slate-700">{submittedData.utr}</p>
                </div>
              </div>

              <div className="flex justify-between items-center bg-slate-50 rounded-2xl p-6">
                <div>
                  <p className="text-xs font-bold text-slate-500">Service Period</p>
                  <p className="text-lg font-black text-slate-900">Full Academic Year</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-500">Total Amount</p>
                  <p className="text-3xl font-black text-slate-900">₹{parseInt(submittedData.amount).toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-4 text-center">
                <p className="text-[10px] text-slate-400 font-medium">Verified Digital Receipt • System Generated at {new Date().toLocaleTimeString()}</p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-2xl border-none shadow-sm bg-white p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 h-11" onClick={() => window.print()}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print Receipt
                </Button>
                <Button variant="outline" className="w-full rounded-xl border-slate-200 h-11" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>

              </div>
            </Card>

            <Button
              onClick={handleReset}
              className="w-full rounded-2xl h-14 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 font-bold"
            >
              Collect Another Fee
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
        {/* Hidden capture area for digital PDF download */}
        <div className="fixed -left-[4000px] top-0 pointer-events-none opacity-0">
          <div id="download-capture-area-fee" className="w-[1000px] bg-white">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-start rounded-t-2xl">
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Fee Receipt</h2>
                <p className="text-2xl font-bold italic">SmartFee Pro</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase">Receipt No.</p>
                <p className="text-lg font-mono font-bold text-emerald-400">{submittedData.receiptNumber}</p>
              </div>
            </div>
            <div className="p-8 space-y-8 bg-white border-x border-b border-slate-100 rounded-b-2xl">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</p>
                  <p className="font-bold text-slate-900">{student?.name}</p>
                  <p className="text-xs text-slate-500">Institution Enrollment Record</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Date</p>
                  <p className="font-bold text-slate-900">{selectedMonth ? format(selectedMonth, "PPP") : format(new Date(), "PPP")}</p>
                </div>
              </div>
              <div className="border-y border-slate-100 py-6 grid grid-cols-3 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Channel</p>
                  <p className="text-sm font-bold text-slate-700 uppercase">{paymentMethod.replace("_", " ")}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Period</p>
                  <p className="text-sm font-bold text-slate-700 uppercase">{selectedMonth ? format(selectedMonth, "MMMM") : ""}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference</p>
                  <p className="text-sm font-mono font-bold text-slate-700">{utrId}</p>
                </div>
              </div>
              <div className="flex justify-between items-center bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Payment Status</p>
                  <div className="flex items-center gap-2 text-emerald-600 font-black text-lg">
                    <CheckCircle2 className="w-5 h-5" />
                    CLEARED
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-500">Net Amount Paid</p>
                  <p className="text-3xl font-black text-slate-900">₹{parseFloat(amount).toLocaleString()}</p>
                </div>
              </div>
              <div className="pt-8 text-center border-t border-slate-50">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                  ABC High School • 123 Education Square • Contact: support@smartfee.pro<br/>
                  This is a legally valid digital instrument generated by SmartFee Pro Management System.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="p-4 md:p-8 bg-slate-50/30 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Collection Desk</h1>
          <p className="text-slate-500 mt-1">Record student payments and generate digital invoices.</p>
        </div>

        {error && (
          <Alert className="border-rose-200 bg-rose-50 rounded-2xl animate-in slide-in-from-top-2">
            <AlertCircle className="h-4 w-4 text-rose-600" />
            <AlertDescription className="text-rose-800 ml-2 font-medium">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 rounded-3xl border-none shadow-sm bg-white overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
              {/* Step 1: Student Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-black">1</div>
                  <h2 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Student Identification</h2>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Search or Select Student</Label>
                  <Select value={selectedStudent} onValueChange={(v) => { setSelectedStudent(v); setError(null); }} disabled={isLoading}>
                    <SelectTrigger className="h-12 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all">
                      <SelectValue placeholder={isLoading ? "Syncing student directory..." : "Type to find student..."} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100">
                      {students.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name} — {s.course} ({s.admissionNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <AnimatePresence>
                  {student && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-lg">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-base">{student.name}</p>
                            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Enrollment Verified</p>
                          </div>
                        </div>
                        <Badge className={cn(
                          "rounded-full px-3 py-1 border-0 font-black text-[10px] uppercase tracking-wider shadow-sm",
                          student.paymentStatus === 'paid' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                        )}>
                          {student.paymentStatus}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-4 gap-4 pt-4 border-t border-indigo-100/50">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Course/Year</p>
                          <p className="text-sm font-black text-slate-900 truncate">{student.course} ({student.academicYear})</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total Fee</p>
                          <p className="text-sm font-black text-slate-900">₹{student.monthlyFee.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Paid</p>
                          <p className="text-sm font-black text-emerald-600">
                            ₹{(student.payments?.reduce((acc, p) => acc + p.amount, 0) || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Remaining</p>
                          <p className="text-sm font-black text-rose-600">
                            ₹{(student.monthlyFee - (student.payments?.reduce((acc, p) => acc + p.amount, 0) || 0)).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Step 2: Payment Details */}
              <div className="space-y-6 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-black">2</div>
                  <h2 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Payment Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Payment Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-12 bg-slate-50 border-transparent rounded-xl justify-start font-medium text-slate-700 hover:bg-slate-100">
                          <CalendarIcon className="mr-2 h-4 w-4 text-indigo-600" />
                          {selectedMonth ? format(selectedMonth, "PPP") : "Pick date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-2xl" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedMonth}
                          onSelect={setSelectedMonth}
                          className="rounded-2xl"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Amount Recieved (₹)</Label>
                    <div className="relative group">
                      <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-10 h-12 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="h-12 bg-slate-50 border-transparent rounded-xl">
                        <SelectValue placeholder="Choose Method" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100">
                        <SelectItem value="upi">Digital (UPI/App)</SelectItem>
                        <SelectItem value="bank_transfer">Direct Bank Transfer</SelectItem>
                        <SelectItem value="cash">Physical Cash</SelectItem>
                        <SelectItem value="cheque">Bank Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Transaction Ref (UTR)</Label>
                    <div className="relative group">
                      <ShieldCheck className={cn(
                        "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                        isCheckingUtr ? "text-indigo-400 animate-pulse" : (isDuplicateUtr && paymentMethod !== "cash") ? "text-rose-500" : "text-slate-400"
                      )} />
                      <Input
                        placeholder={paymentMethod === "cash" ? "AUTO-GENERATED FOR CASH" : "UTR OR REF NUMBER"}
                        value={paymentMethod === "cash" ? "" : utrId}
                        disabled={paymentMethod === "cash"}
                        onChange={(e) => setUtrId(e.target.value.toUpperCase())}
                        className={cn(
                          "pl-10 h-12 bg-slate-50 border-transparent rounded-xl focus:bg-white transition-all font-mono text-sm uppercase",
                          (isDuplicateUtr && paymentMethod !== "cash") && "border-rose-200 bg-rose-50 focus:border-rose-300 focus:ring-rose-100",
                          paymentMethod === "cash" && "bg-slate-100 text-slate-400 cursor-not-allowed italic"
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Internal Memo (Optional)</Label>
                  <Textarea
                    placeholder="Add any specific details about this collection..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all min-h-[100px] resize-none"
                  />
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={handleReset}
                  className="rounded-xl h-14 px-8 text-slate-400 hover:text-slate-600"
                >
                  Clear Form
                </Button>
                <Button
                  type="submit"
                  disabled={!selectedStudent || !amount || !paymentMethod || (paymentMethod !== "cash" && !utrId) || isSubmitting || (paymentMethod !== "cash" && isDuplicateUtr)}
                  className="flex-1 rounded-2xl h-14 bg-black hover:bg-slate-800 text-white font-bold text-lg shadow-xl shadow-slate-200 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <RefreshCcw className="w-5 h-5 animate-spin" />
                      Finalizing...
                    </div>
                  ) : (
                    "Complete Transaction"
                  )}
                </Button>
              </div>
            </form>
          </Card>

          {/* Quick Stats Sidebar */}
          <div className="space-y-6">
            <Card className="rounded-3xl border-none shadow-sm bg-white p-6 overflow-hidden">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-600" />
                Session Insights
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Today&apos;s Yield</p>
                    <p className="text-xl font-black text-slate-900">₹31,000</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-t border-slate-50 pt-6">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Receipts Issued</p>
                    <p className="text-xl font-black text-slate-900">12 Digital</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-slate-900 rounded-2xl text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Pro Tip</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Verify UTR IDs from the bank portal before finalizing to avoid double entries.
                </p>
              </div>
            </Card>

            <Card className="rounded-3xl border-none shadow-sm bg-indigo-600 p-6 text-white overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="font-bold mb-2">System Status</h3>
                <p className="text-xs text-indigo-100 mb-4 leading-relaxed">Receipt engine is active and syncing with cloud records.</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Fully Operational</span>
                </div>
              </div>
              <CreditCard className="absolute -right-6 -bottom-6 w-32 h-32 text-indigo-500 opacity-20 rotate-12" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


