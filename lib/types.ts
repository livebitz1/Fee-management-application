export type Student = {
  id: string;
  name: string;
  course: string;
  academicYear: string;
  semester?: string;
  admissionNumber: string;
  studentPhone: string;
  monthlyFee: number;
  paymentStatus: "paid" | "pending" | "overdue";
  lastPaymentDate?: string;
  payments?: any[];
  yearlyFees?: YearlyFee[];
};

export type YearlyFee = {
  id?: string;
  yearName: string;
  amount: number;
  paidAmount?: number;
  status?: "paid" | "pending" | "overdue";
};

export type Payment = {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  method: "upi" | "bank_transfer" | "cash" | "cheque";
  utrId: string;
  month: string;
  year: number;
  date: string;
  status: "completed" | "pending" | "failed";
  notes?: string;
  targetYearId?: string;
};

export type Receipt = {
  id: string;
  receiptNumber: string;
  studentName: string;
  course?: string;
  academicYear?: string;
  semester?: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  month: string;
  utrId: string;
};

export type Report = {
  totalStudents: number;
  totalRevenue: number;
  pendingFees: number;
  overdueFees: number;
  collectionRate: number;
};
