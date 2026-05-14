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

  console.log("Seeding database...");

  // Create students
  const students = await Promise.all([
    prisma.student.create({
      data: {
        name: "Aaryan Singh",
        class: "10-A",
        section: "A",
        admissionNumber: "2024001",
        parentPhone: "9876543210",
        monthlyFee: 5000,
        paymentStatus: "paid",
        lastPaymentDate: new Date("2024-05-01"),
      },
    }),
    prisma.student.create({
      data: {
        name: "Priya Sharma",
        class: "10-B",
        section: "B",
        admissionNumber: "2024002",
        parentPhone: "9876543211",
        monthlyFee: 5000,
        paymentStatus: "paid",
        lastPaymentDate: new Date("2024-05-02"),
      },
    }),
    prisma.student.create({
      data: {
        name: "Rohan Patel",
        class: "9-A",
        section: "A",
        admissionNumber: "2024003",
        parentPhone: "9876543212",
        monthlyFee: 4500,
        paymentStatus: "pending",
      },
    }),
    prisma.student.create({
      data: {
        name: "Ananya Gupta",
        class: "11-A",
        section: "A",
        admissionNumber: "2024004",
        parentPhone: "9876543213",
        monthlyFee: 6000,
        paymentStatus: "overdue",
      },
    }),
    prisma.student.create({
      data: {
        name: "Nikhil Kumar",
        class: "9-B",
        section: "B",
        admissionNumber: "2024005",
        parentPhone: "9876543214",
        monthlyFee: 4500,
        paymentStatus: "paid",
        lastPaymentDate: new Date("2024-04-15"),
      },
    }),
    prisma.student.create({
      data: {
        name: "Divya Verma",
        class: "10-A",
        section: "A",
        admissionNumber: "2024006",
        parentPhone: "9876543215",
        monthlyFee: 5000,
        paymentStatus: "paid",
        lastPaymentDate: new Date("2024-05-05"),
      },
    }),
    prisma.student.create({
      data: {
        name: "Arjun Desai",
        class: "11-B",
        section: "B",
        admissionNumber: "2024007",
        parentPhone: "9876543216",
        monthlyFee: 6000,
        paymentStatus: "pending",
      },
    }),
    prisma.student.create({
      data: {
        name: "Sneha Iyer",
        class: "12-A",
        section: "A",
        admissionNumber: "2024008",
        parentPhone: "9876543217",
        monthlyFee: 6500,
        paymentStatus: "paid",
        lastPaymentDate: new Date("2024-05-08"),
      },
    }),
  ]);

  console.log(`Created ${students.length} students`);

  // Create payments
  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        studentId: students[0].id,
        studentName: students[0].name,
        amount: 5000,
        method: "upi",
        utrId: "UPI2024050001",
        month: "May",
        year: 2024,
        date: new Date("2024-05-01"),
        status: "completed",
      },
    }),
    prisma.payment.create({
      data: {
        studentId: students[1].id,
        studentName: students[1].name,
        amount: 5000,
        method: "bank_transfer",
        utrId: "BT2024050002",
        month: "May",
        year: 2024,
        date: new Date("2024-05-02"),
        status: "completed",
      },
    }),
    prisma.payment.create({
      data: {
        studentId: students[4].id,
        studentName: students[4].name,
        amount: 4500,
        method: "cash",
        utrId: "CASH2024050003",
        month: "May",
        year: 2024,
        date: new Date("2024-05-08"),
        status: "completed",
      },
    }),
    prisma.payment.create({
      data: {
        studentId: students[5].id,
        studentName: students[5].name,
        amount: 5000,
        method: "cheque",
        utrId: "CHK2024050004",
        month: "May",
        year: 2024,
        date: new Date("2024-05-05"),
        status: "completed",
      },
    }),
    prisma.payment.create({
      data: {
        studentId: students[7].id,
        studentName: students[7].name,
        amount: 6500,
        method: "upi",
        utrId: "UPI2024050005",
        month: "May",
        year: 2024,
        date: new Date("2024-05-08"),
        status: "completed",
      },
    }),
  ]);

  console.log(`Created ${payments.length} payments`);

  // Create receipts
  await Promise.all([
    prisma.receipt.create({
      data: {
        paymentId: payments[0].id,
        studentId: students[0].id,
        receiptNumber: "RCP-2024-0001",
        studentName: students[0].name,
        amount: 5000,
        paymentDate: new Date("2024-05-01"),
        paymentMethod: "UPI",
        month: "May",
        utrId: "UPI2024050001",
      },
    }),
    prisma.receipt.create({
      data: {
        paymentId: payments[1].id,
        studentId: students[1].id,
        receiptNumber: "RCP-2024-0002",
        studentName: students[1].name,
        amount: 5000,
        paymentDate: new Date("2024-05-02"),
        paymentMethod: "Bank Transfer",
        month: "May",
        utrId: "BT2024050002",
      },
    }),
    prisma.receipt.create({
      data: {
        paymentId: payments[2].id,
        studentId: students[4].id,
        receiptNumber: "RCP-2024-0003",
        studentName: students[4].name,
        amount: 4500,
        paymentDate: new Date("2024-05-08"),
        paymentMethod: "Cash",
        month: "May",
        utrId: "CASH2024050003",
      },
    }),
    prisma.receipt.create({
      data: {
        paymentId: payments[3].id,
        studentId: students[5].id,
        receiptNumber: "RCP-2024-0004",
        studentName: students[5].name,
        amount: 5000,
        paymentDate: new Date("2024-05-05"),
        paymentMethod: "Cheque",
        month: "May",
        utrId: "CHK2024050004",
      },
    }),
  ]);

  console.log("Created receipts");

  // Create pending fees
  await Promise.all([
    prisma.pendingFee.create({
      data: {
        studentId: students[2].id,
        student_name: students[2].name,
        class: students[2].class,
        monthsFell: 2,
        amount: 9000,
        daysOverdue: 15,
      },
    }),
    prisma.pendingFee.create({
      data: {
        studentId: students[3].id,
        student_name: students[3].name,
        class: students[3].class,
        monthsFell: 1,
        amount: 6000,
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
        revenue: 120000,
      },
    }),
    prisma.revenueData.create({
      data: {
        month: "Feb",
        year: 2024,
        revenue: 135000,
      },
    }),
    prisma.revenueData.create({
      data: {
        month: "Mar",
        year: 2024,
        revenue: 128000,
      },
    }),
    prisma.revenueData.create({
      data: {
        month: "Apr",
        year: 2024,
        revenue: 142000,
      },
    }),
    prisma.revenueData.create({
      data: {
        month: "May",
        year: 2024,
        revenue: 155000,
      },
    }),
    prisma.revenueData.create({
      data: {
        month: "Jun",
        year: 2024,
        revenue: 148000,
      },
    }),
  ]);

  console.log("Created revenue data");

  // Create dashboard stats
  await prisma.dashboardStat.create({
    data: {
      totalStudents: students.length,
      totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
      pendingFees: 15000,
      overduePayments: 2,
      collectionRate: 92.5,
    },
  });

  console.log("Created dashboard stats");

  // Create recent activities
  await Promise.all([
    prisma.recentActivity.create({
      data: {
        student: "Aaryan Singh",
        action: "Fee collected",
        amount: 5000,
        time: "2 hours ago",
        status: "completed",
      },
    }),
    prisma.recentActivity.create({
      data: {
        student: "Priya Sharma",
        action: "Fee collected",
        amount: 5000,
        time: "4 hours ago",
        status: "completed",
      },
    }),
    prisma.recentActivity.create({
      data: {
        student: "Rohan Patel",
        action: "Payment reminder sent",
        amount: 4500,
        time: "1 day ago",
        status: "pending",
      },
    }),
    prisma.recentActivity.create({
      data: {
        student: "Ananya Gupta",
        action: "Fee overdue notice",
        amount: 6000,
        time: "2 days ago",
        status: "overdue",
      },
    }),
  ]);

  console.log("Created recent activities");
  console.log("Seeding completed!");
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
