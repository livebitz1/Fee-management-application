import { Student, Payment, Receipt } from "./types";

// API Client utility functions
const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // Use relative path in browser
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
};

const API_BASE_URL = getBaseUrl();

// Wait for a specific duration
async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Make API requests with retry logic
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        let errorData: any;
        try {
          const text = await response.text();
          try {
            errorData = JSON.parse(text);
          } catch {
            errorData = { error: text || `HTTP ${response.status}` };
          }
        } catch {
          errorData = { error: `HTTP ${response.status}` };
        }
        
        console.error(`API Error [${endpoint}]:`, errorData);
        const error = new Error(errorData.error || errorData.details || `HTTP ${response.status}`);
        
        // Don't retry on client errors (4xx), only on server errors (5xx) or network issues
        if (response.status >= 400 && response.status < 500) {
          throw error;
        }
        
        lastError = error;
        throw error;
      }

      return await response.json();
    } catch (error) {
      lastError = error as Error;
      
      // If it's a client error (4xx) that we threw above, don't retry
      const isClientError = lastError.message.includes("HTTP 4") || 
                           lastError.message.toLowerCase().includes("duplicate") ||
                           lastError.message.toLowerCase().includes("conflict");
      
      if (isClientError || i >= maxRetries - 1) {
        throw lastError;
      }

      await delay(1000 * (i + 1)); // Exponential backoff
    }
  }

  throw lastError || new Error("Failed to fetch data");
}

// Students API
export async function getStudents(): Promise<Student[]> {
  return apiCall<Student[]>("/students");
}

export async function getStudent(id: string): Promise<Student> {
  return apiCall<Student>(`/students/${id}`);
}

export async function createStudent(data: Partial<Student>): Promise<Student> {
  return apiCall<Student>("/students", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateStudent(id: string, data: Partial<Student>): Promise<Student> {
  return apiCall<Student>(`/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteStudent(id: string): Promise<{ success: boolean }> {
  return apiCall<{ success: boolean }>(`/students/${id}`, {
    method: "DELETE",
  });
}

// Payments API
export async function getPayments(): Promise<Payment[]> {
  return apiCall<Payment[]>("/payments");
}

export async function createPayment(data: Partial<Payment>): Promise<Payment & { receipt?: Receipt }> {
  return apiCall<Payment & { receipt?: Receipt }>("/payments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Receipts API
export async function getReceipts(): Promise<Receipt[]> {
  return apiCall<Receipt[]>("/receipts");
}

export async function createReceipt(data: Partial<Receipt>): Promise<Receipt> {
  return apiCall<Receipt>("/receipts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Dashboard API
export async function getDashboardStats(): Promise<{
  totalStudents: number;
  totalRevenue: number;
  pendingFees: number;
  overduePayments: number;
  collectionRate: number;
}> {
  return apiCall("/dashboard/stats");
}

export async function getRevenueData(): Promise<{ month: string; revenue: number }[]> {
  return apiCall("/dashboard/revenue");
}

export async function getRecentActivities(): Promise<{
  id: string;
  student: string;
  action: string;
  amount: number;
  time: string;
  status: string;
}[]> {
  return apiCall("/dashboard/activities");
}

// Reports API
export async function getReportsData(): Promise<{
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
}> {
  return apiCall("/reports");
}

// Pending Fees API
export async function getPendingFees(): Promise<{
  id: string;
  student_name: string;
  class: string;
  monthsFell: number;
  amount: number;
  daysOverdue: number;
}[]> {
  return apiCall("/pending-fees");
}
