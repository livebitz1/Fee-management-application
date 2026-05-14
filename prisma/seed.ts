import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data
  await prisma.recentActivity.deleteMany();
  await prisma.pendingFee.deleteMany();
  await prisma.receipt.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.student.deleteMany();
  await prisma.revenueData.deleteMany();
  await prisma.dashboardStat.deleteMany();

  console.log("Seeding university database...");

  // Create university students
  const students = await Promise.all([
    prisma.student.create({
      data: {
        name: "Aaryan Singh",
        course: "B.Tech Computer Science",
        academicYear: "2024-25",
        semester: "Semester 3",
        admissionNumber: "UNV2024001",
        studentPhone: "9876543210",
        monthlyFee: 175000,
        paymentStatus: "paid",
        lastPaymentDate: new Date("2024-05-01"),
      },
    }),
    prisma.student.create({
      data: {
        name: "Priya Sharma",
        course: "MBA Marketing",
        academicYear: "2024-25",
        semester: "Semester 1",
        admissionNumber: "UNV2024002",
        studentPhone: "9876543211",
        monthlyFee: 250000,
        paymentStatus: "paid",
        lastPaymentDate: new Date("2024-05-02"),
      },
    }),
    prisma.student.create({
      data: {
        name: "Rohan Patel",
        course: "B.Com Honors",
        academicYear: "2023-24",
        semester: "Semester 4",
        admissionNumber: "UNV2024003",
        studentPhone: "9876543212",
        monthlyFee: 85000,
        paymentStatus: "pending",
      },
    }),
    prisma.student.create({
      data: {
        name: "Ananya Gupta",
        course: "M.Tech Robotics",
        academicYear: "2024-25",
        semester: "Semester 2",
        admissionNumber: "UNV2024004",
        studentPhone: "9876543213",
        monthlyFee: 195000,
        paymentStatus: "overdue",
      },
    }),
    prisma.student.create({
      data: {
        name: "Nikhil Kumar",
        course: "B.Sc Physics",
        academicYear: "2024-25",
        semester: "Semester 5",
        admissionNumber: "UNV2024005",
        studentPhone: "9876543214",
        monthlyFee: 75000,
        paymentStatus: "paid",
        lastPaymentDate: new Date("2024-04-15"),
      },
    }),
    prisma.student.create({
      data: {
        name: "Divya Verma",
        course: "B.Tech CSE",
        academicYear: "2024-25",
        semester: "Semester 3",
        admissionNumber: "UNV2024006",
        studentPhone: "9876543215",
        monthlyFee: 175000,
        paymentStatus: "paid",
        lastPaymentDate: new Date("2024-05-05"),
      },
    }),
    prisma.student.create({
      data: {
        name: "Arjun Desai",
        course: "LL.B Law",
        academicYear: "2023-24",
        semester: "Semester 6",
        admissionNumber: "UNV2024007",
        studentPhone: "9876543216",
        monthlyFee: 110000,
        paymentStatus: "pending",
      },
    }),
    prisma.student.create({
      data: {
        name: "Sneha Iyer",
        course: "Ph.D Data Science",
        academicYear: "2024-25",
        admissionNumber: "UNV2024008",
        studentPhone: "9876543217",
        monthlyFee: 65000,
        paymentStatus: "paid",
        lastPaymentDate: new Date("2024-05-08"),
      },
    }),
  ]);

  console.log(`Created ${students.length} university students`);

  // Create payments
  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        studentId: students[0].id,
        studentName: students[0].name,
        amount: 175000,
        method: "upi",
        utrId: "UPI2024050001",
        month: "Annual Session 2024-25",
        year: 2024,
        date: new Date("2024-05-01"),
        status: "completed",
      },
    }),
    prisma.payment.create({
      data: {
        studentId: students[1].id,
        studentName: students[1].name,
        amount: 250000,
        method: "bank_transfer",
        utrId: "BT2024050002",
        month: "Annual Session 2024-25",
        year: 2024,
        date: new Date("2024-05-02"),
        status: "completed",
      },
    }),
    prisma.payment.create({
      data: {
        studentId: students[4].id,
        studentName: students[4].name,
        amount: 75000,
        method: "cash",
        utrId: "CASH2024050003",
        month: "Annual Session 2024-25",
        year: 2024,
        date: new Date("2024-05-08"),
        status: "completed",
      },
    }),
    prisma.payment.create({
      data: {
        studentId: students[5].id,
        studentName: students[5].name,
        amount: 175000,
        method: "cheque",
        utrId: "CHK2024050004",
        month: "Annual Session 2024-25",
        year: 2024,
        date: new Date("2024-05-05"),
        status: "completed",
      },
    }),
    prisma.payment.create({
      data: {
        studentId: students[7].id,
        studentName: students[7].name,
        amount: 65000,
        method: "upi",
        utrId: "UPI2024050005",
        month: "Annual Session 2024-25",
        year: 2024,
        date: new Date("2024-05-08"),
        status: "completed",
      },
    }),
  ]);

  console.log(`Created ${payments.length} payments`);

  // Create receipts with university details
  await Promise.all([
    prisma.receipt.create({
      data: {
        paymentId: payments[0].id,
        studentId: students[0].id,
        receiptNumber: "RCP-2024-0001",
        studentName: students[0].name,
        course: students[0].course,
        academicYear: students[0].academicYear,
        semester: students[0].semester,
        amount: 175000,
        paymentDate: new Date("2024-05-01"),
        paymentMethod: "UPI",
        month: "Annual Session 2024-25",
        utrId: "UPI2024050001",
      },
    }),
    prisma.receipt.create({
      data: {
        paymentId: payments[1].id,
        studentId: students[1].id,
        receiptNumber: "RCP-2024-0002",
        studentName: students[1].name,
        course: students[1].course,
        academicYear: students[1].academicYear,
        semester: students[1].semester,
        amount: 250000,
        paymentDate: new Date("2024-05-02"),
        paymentMethod: "Bank Transfer",
        month: "Annual Session 2024-25",
        utrId: "BT2024050002",
      },
    }),
    prisma.receipt.create({
      data: {
        paymentId: payments[2].id,
        studentId: students[4].id,
        receiptNumber: "RCP-2024-0003",
        studentName: students[4].name,
        course: students[4].course,
        academicYear: students[4].academicYear,
        semester: students[4].semester,
        amount: 75000,
        paymentDate: new Date("2024-05-08"),
        paymentMethod: "Cash",
        month: "Annual Session 2024-25",
        utrId: "CASH2024050003",
      },
    }),
    prisma.receipt.create({
      data: {
        paymentId: payments[3].id,
        studentId: students[5].id,
        receiptNumber: "RCP-2024-0004",
        studentName: students[5].name,
        course: students[5].course,
        academicYear: students[5].academicYear,
        semester: students[5].semester,
        amount: 175000,
        paymentDate: new Date("2024-05-05"),
        paymentMethod: "Cheque",
        month: "Annual Session 2024-25",
        utrId: "CHK2024050004",
      },
    }),
  ]);

  console.log("Created university receipts");

  // Create pending fees
  await Promise.all([
    prisma.pendingFee.create({
      data: {
        studentId: students[2].id,
        student_name: students[2].name,
        course: students[2].course,
        monthsFell: 2,
        amount: 170000,
        daysOverdue: 15,
      },
    }),
    prisma.pendingFee.create({
      data: {
        studentId: students[3].id,
        student_name: students[3].name,
        course: students[3].course,
        monthsFell: 1,
        amount: 195000,
        daysOverdue: 8,
      },
    }),
  ]);

  console.log("Created pending fees");

  // Create revenue data
  await Promise.all([
    prisma.revenueData.create({
      data: {
        month: "Jan",
        year: 2024,
        revenue: 1200000,
      },
    }),
    prisma.revenueData.create({
      data: {
        month: "Feb",
        year: 2024,
        revenue: 1350000,
      },
    }),
    prisma.revenueData.create({
      data: {
        month: "Mar",
        year: 2024,
        revenue: 1280000,
      },
    }),
    prisma.revenueData.create({
      data: {
        month: "Apr",
        year: 2024,
        revenue: 1420000,
      },
    }),
    prisma.revenueData.create({
      data: {
        month: "May",
        year: 2024,
        revenue: 1550000,
      },
    }),
    prisma.revenueData.create({
      data: {
        month: "Jun",
        year: 2024,
        revenue: 1480000,
      },
    }),
  ]);

  console.log("Created revenue data");

  // Create dashboard stats
  await prisma.dashboardStat.create({
    data: {
      totalStudents: students.length,
      totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
      pendingFees: 365000,
      overduePayments: 2,
      collectionRate: 88.5,
    },
  });

  console.log("Created dashboard stats");

  // Create recent activities
  await Promise.all([
    prisma.recentActivity.create({
      data: {
        student: "Aaryan Singh",
        action: "Annual Fee Collected",
        amount: 175000,
        time: "2 hours ago",
        status: "completed",
      },
    }),
    prisma.recentActivity.create({
      data: {
        student: "Priya Sharma",
        action: "Semester Fee Collected",
        amount: 250000,
        time: "4 hours ago",
        status: "completed",
      },
    }),
    prisma.recentActivity.create({
      data: {
        student: "Rohan Patel",
        action: "Payment Reminder Sent",
        amount: 85000,
        time: "1 day ago",
        status: "pending",
      },
    }),
    prisma.recentActivity.create({
      data: {
        student: "Ananya Gupta",
        action: "Overdue Notice Issued",
        amount: 195000,
        time: "2 days ago",
        status: "overdue",
      },
    }),
  ]);

  console.log("Created recent activities");
  console.log("University Seeding Completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
