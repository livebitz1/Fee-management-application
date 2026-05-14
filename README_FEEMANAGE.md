# FeeManage - Modern School Fee Management SaaS

A premium, minimal fee management SaaS application built with Next.js 16, TailwindCSS, and shadcn/ui components.

## 🎯 Project Overview

FeeManage is a comprehensive fee collection and management system designed for schools. The application provides an intuitive interface for managing students, collecting fees, tracking payments, and generating reports.

## ✨ Features

### 1. **Dashboard**
- Real-time KPI cards showing Total Students, Total Revenue, Pending Fees, and Overdue Payments
- Interactive revenue trend chart (6-month view)
- Collection rate indicator
- Recent payment activity list
- Pending fees overview with payment status

### 2. **Students Management**
- Searchable student database with advanced filtering
- Display of student information: Name, Class, Admission Number, Phone, Monthly Fee
- Payment status indicators (Paid/Pending/Overdue)
- Add new student modal with form validation
- Statistics overview showing total students, paid, and pending/overdue

### 3. **Collect Fee**
- Intuitive fee collection form with validation
- Student selection with auto-filled monthly fee
- Payment method selection (UPI, Bank Transfer, Cash, Cheque)
- UTR/Reference ID tracking with duplicate detection
- Optional notes section
- Success state with receipt preview and download options
- Quick reference panel for payment methods and recent collections

### 4. **Payments History**
- Comprehensive payment transaction table
- Advanced filtering by Month, Status, and Payment Method
- Search functionality for student names and UTR IDs
- Payment metrics (Total Payments, Total Amount, Completed, Pending)
- Export functionality
- Color-coded status badges

### 5. **Receipts Management**
- Receipt cards grid layout with search functionality
- Individual receipt preview modal
- Receipt details including Receipt No., Student, Amount, Date, Method
- Download and Print capabilities
- "Issued" status badge

### 6. **Reports & Analytics**
- Collection rate percentage with trend
- Class-wise collection comparison (Bar chart)
- Revenue trend analysis (Line chart)
- Collection status breakdown (Pie chart)
- Performance summary with key metrics
- Action items and recommendations
- Multiple export options (PDF, Excel, CSV)

### 7. **Settings**
- School information management (Name, Address, Phone, Email)
- Logo upload functionality
- Payment settings (UPI ID, Receipt Prefix)
- Theme preferences
- Account information display
- Help & Support section
- System information

## 🎨 Design Language

The application follows a **premium, minimal SaaS design** philosophy:
- **Color Palette**: Black, White, Gray with subtle accent colors
- **Typography**: Clean, hierarchical font styling
- **Spacing**: Generous whitespace for visual clarity
- **Components**: Rounded corners, subtle borders, soft shadows
- **Icons**: Lucide React icons throughout
- **Animations**: Subtle, fast transitions

## 🏗️ Technical Stack

- **Framework**: Next.js 16.1.7 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom configuration
- **UI Components**: shadcn/ui Radix-based components
- **Charts**: Recharts with responsive design
- **Icons**: Lucide React
- **State Management**: React hooks (useState)

## 📁 Project Structure

```
next-app/
├── app/
│   ├── layout.tsx              # Root layout with sidebar and header
│   ├── page.tsx                # Dashboard page
│   ├── globals.css             # Global styles
│   ├── students/
│   │   └── page.tsx            # Students management page
│   ├── collect-fee/
│   │   └── page.tsx            # Fee collection page
│   ├── payments/
│   │   └── page.tsx            # Payments history page
│   ├── receipts/
│   │   └── page.tsx            # Receipts management page
│   ├── reports/
│   │   └── page.tsx            # Reports and analytics
│   └── settings/
│       └── page.tsx            # Settings and configuration
├── components/
│   ├── sidebar.tsx             # Navigation sidebar
│   ├── header.tsx              # Top header with search
│   └── ui/                     # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── table.tsx
│       ├── select.tsx
│       ├── dialog.tsx
│       ├── badge.tsx
│       ├── alert.tsx
│       ├── chart.tsx
│       └── ... (more components)
├── lib/
│   ├── types.ts                # TypeScript type definitions
│   ├── mockData.ts             # Realistic dummy data
│   └── utils.ts                # Utility functions
└── public/                     # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📊 Sample Data

The application comes with realistic dummy data including:
- 8 sample students with diverse payment statuses
- 5 sample payment transactions
- 4 sample receipts
- 6-month revenue data
- Recent activity log
- Pending fees list

## 🎯 Key Features Highlighted

### Responsive Design
- Fixed sidebar (256px width)
- Fixed header (64px height)
- Responsive main content area
- Mobile-friendly layout (ready for mobile optimization)

### Modern UI Interactions
- Active page indicators in navigation
- Hover effects on interactive elements
- Smooth transitions and animations
- Color-coded status badges
- Form validation with error states
- Success notifications

### Data Management
- Search and filter functionality
- Advanced form controls with dropdowns
- Data export capabilities
- Duplicate detection (UTR validation)
- Real-time form validation

## 🔄 Workflow Example

### Fee Collection Flow:
1. Navigate to "Collect Fee"
2. Select a student from dropdown
3. Choose the month for collection
4. Enter payment amount
5. Select payment method
6. Enter UTR/Reference ID
7. System validates (checks for duplicates)
8. Submit to generate receipt
9. Download or email receipt

## 💡 Future Enhancements

- Backend API integration
- User authentication and authorization
- Database persistence
- Email notifications
- SMS reminders
- Bulk fee collection
- Student portals
- Mobile application
- Advanced reporting and analytics
- Payment gateway integration

## 📝 Notes

- This is a **frontend-only implementation** with realistic mock data
- No backend server, database, or authentication logic included
- All data is client-side only and resets on page refresh
- Ready for backend integration

## 🎉 Built With

- **Next.js** - React framework
- **TailwindCSS** - Utility-first CSS
- **shadcn/ui** - High-quality React components
- **Recharts** - Charting library
- **Lucide React** - Icon library
- **TypeScript** - Type safety
