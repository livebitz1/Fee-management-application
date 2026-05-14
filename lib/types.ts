export type Student = {
  id: string;
  name: string;
  class: string;
  section: string;
  admissionNumber: string;
  parentPhone: string;
  monthlyFee: number;
  paymentStatus: "paid" | "pending" | "overdue";
  lastPaymentDate?: string;
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
};

export type Receipt = {
  id: string;
  receiptNumber: string;
  studentName: string;
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
