import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Database Diagnostic Script ---')
  try {
    const studentsCount = await prisma.student.count()
    console.log(`Students count: ${studentsCount}`)

    try {
      const pendingFees = await prisma.pendingFee.findMany({
        take: 5,
        include: { student: true }
      })
      console.log(`Pending fees count: ${pendingFees.length}`)
      console.log('Sample pending fee:', JSON.stringify(pendingFees[0], null, 2))
    } catch (e: any) {
      console.error('Error querying PendingFee table:', e.message)
      if (e.message.includes('column') || e.message.includes('relation')) {
        console.log('SUGGESTION: Table structure mismatch. Try running npx prisma generate again.')
      }
    }

  } catch (e: any) {
    console.error('CRITICAL: Database connection failed:', e.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
