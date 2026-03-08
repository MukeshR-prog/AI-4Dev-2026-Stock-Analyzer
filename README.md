# 🛒 AI-Powered Retail Intelligence Platform

## 📋 Project Overview

An **AI-driven multi-branch retail inventory intelligence platform** designed to help retail chains, specifically grocery and perishable goods stores, **reduce food waste through predictive analytics, smart inventory redistribution, and automated decision-making**.

The platform uses **real-time AI insights** powered by Groq AI (LLaMA 3.3) to analyze inventory data, predict expiry risks, generate smart discount strategies, optimize reorder timing, and facilitate inter-branch stock transfers—all aimed at maximizing revenue while minimizing waste.

### 🎯 Problem Statement

Retail chains with multiple branches face critical challenges:
- **Food waste** due to unsold inventory expiring
- **Revenue loss** from markdowns and disposal costs
- **Stock imbalances** between branches (some overstocked, others understocked)
- **Manual decision-making** that's slow and reactive rather than proactive
- **Lack of visibility** into cross-branch inventory optimization opportunities

### 💡 Solution

This platform provides:
- **AI-powered predictions** for expiry risk and demand forecasting
- **Automated alerts** for critical inventory issues
- **Smart discount suggestions** to clear near-expiry stock
- **Inter-branch transfer recommendations** to balance inventory
- **Real-time operational dashboards** for managers and staff
- **Weekly performance analytics** with actionable insights

---

## 🚀 Key Features

### 1. **Multi-Tenant Authentication & Onboarding**
- Google OAuth via Firebase Authentication
- Role-based access (Branch Manager, Regional Manager, Admin)
- Seamless onboarding flow for new users and companies
- MongoDB-backed user profiles with branch associations

### 2. **My Store Dashboard**
- **Real-time inventory monitoring** with expiry tracking
- **KPI Cards**: Total Products, Near Expiry Items, High Risk Items, Total Units
- **Smart Alerts System**: 4-tier priority alerts (Critical, High, Medium, Low)
  - Expiry risk alerts
  - Surplus inventory warnings
  - Demand mismatch notifications
- **AI Insights Tab**: Contextual explanations for every alert and recommendation

### 3. **Branch Insights (Company-Wide View)**
- **Multi-branch comparison table** with key metrics:
  - Revenue, Waste %, Growth Rate
  - Manager contact, region, rating
- **Performance indicators**: Best performers vs. branches needing attention
- **Regional filtering** for geographic analysis
- **Transfer opportunities** identified automatically

### 4. **AI-Powered Recommendations**
- **Smart Discount Suggestions**:
  - AI calculates optimal discount percentages (15%-50%)
  - Revenue impact projections
  - Expected sales increase estimates
  - Reasoning for each recommendation
- **Demand-Based Reorder Suggestions**:
  - 3-day demand forecasting
  - Optimal reorder quantities
  - Urgency levels (Urgent, Soon, Planned)
- **Inter-Branch Transfer Recommendations**:
  - Automatic matching of surplus vs. shortage
  - Priority-based suggestions

### 5. **Operations Center**
- **Today's Action Items**: Staff task list with priorities
- **Discount Strategies**: AI-generated pricing recommendations
- **Reorder Management**: Stock-out prevention
- **Financial Impact Analysis**: Predicted losses and mitigation strategies
- **Weekly Performance Summary**:
  - Total waste metrics
  - Inventory turnover rate
  - Top selling & slow-moving products
  - AI-generated weekly analysis

### 6. **Stock Transfer System**
- Request stock transfers between branches
- Multi-status workflow (Pending → Approved → In Transit → Completed)
- Manager approval system
- Real-time status tracking

### 7. **Impact Dashboard**
- **Waste reduction metrics** over time
- **Financial impact visualization**
- **Comparison charts**: Before vs. After AI implementation
- **Cost savings tracking**

---

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 16.1.6** (App Router with React Server Components)
- **React 19.2.3** with TypeScript
- **Tailwind CSS 4.2.1** for styling
- **Framer Motion 12.35.0** for animations
- **Lucide React** for icons
- **Recharts 3.7.0** for data visualization

### **Backend & Database**
- **Next.js API Routes** (serverless functions)
- **MongoDB with Mongoose 9.2.4** for data persistence
- **Firebase Authentication** for user management

### **AI & Intelligence**
- **Groq AI API** with LLaMA 3.3-70B model
- Custom **recommendation engines**:
  - `recommendationEngine.ts`: Rule-based inventory optimization
  - `alertEngine.ts`: Smart alert generation
  - `insightEngine.ts`: Contextual insight explanations
  - `groqAI.ts`: AI-powered analysis and predictions

### **DevOps & Tooling**
- **ESLint** for code quality
- **TypeScript 5** for type safety
- **Git** for version control

---

## 📂 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API Routes (Backend)
│   │   ├── ai-insights/          # AI-powered insights endpoint
│   │   ├── alerts/               # Smart alerts API
│   │   ├── inventory/            # Inventory CRUD operations
│   │   ├── recommendations/      # Recommendation feedback
│   │   ├── reports/              # Weekly reports generation
│   │   ├── tasks/                # Action items management
│   │   └── transfers/            # Stock transfer requests
│   ├── dashboard/                # Main dashboard pages
│   │   ├── branch-insights/      # Company-wide branch view
│   │   ├── directory/            # Branch contact directory
│   │   ├── impact/               # Waste reduction impact
│   │   ├── my-store/             # Store inventory management
│   │   ├── operations/           # Operations center
│   │   ├── recommendations/      # AI recommendations
│   │   └── transfers/            # Transfer management
│   ├── login/                    # Authentication page
│   ├── onboarding/               # New user setup
│   └── setup/                    # Company profile setup
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   ├── AlertList.tsx
│   ├── BranchTable.tsx
│   ├── RecommendationCard.tsx
│   ├── Navbar.tsx
│   └── Sidebar.tsx
├── context/
│   └── AuthContext.tsx           # Firebase auth state management
├── data/
│   ├── inventory.ts              # Mock inventory data
│   └── transfers.ts              # Mock transfer data
├── lib/                          # Core business logic
│   ├── alertEngine.ts            # Smart alert generation
│   ├── groqAI.ts                 # AI service integration
│   ├── insightEngine.ts          # Insight explanations
│   ├── recommendationEngine.ts   # Inventory optimization logic
│   ├── wasteSimulation.ts        # Waste prediction models
│   ├── firebase.ts               # Firebase configuration
│   └── mongodb.ts                # MongoDB connection
├── models/                       # MongoDB schemas
│   ├── Alert.ts
│   ├── Branch.ts
│   ├── Inventory.ts
│   ├── Recommendation.ts
│   ├── Task.ts
│   ├── TransferRequest.ts
│   ├── User.ts
│   └── WasteReport.ts
└── types/
    └── index.ts                  # TypeScript type definitions
```

---

## 🔧 Installation & Setup

### Prerequisites
- **Node.js 20+** and npm/yarn
- **MongoDB** (local instance or MongoDB Atlas)
- **Firebase Project** (for authentication)
- **Groq API Key** (for AI features)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AI-4Dev-2026-Stock-Analyzer
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# MongoDB
MONGODB_URI=mongodb://localhost:27017/stock-analyzer
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/stock-analyzer

# Groq AI
GROQ_API_KEY=your_groq_api_key
```

### 4. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Google Authentication** in Authentication settings
4. Copy your configuration values to `.env.local`

### 5. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod --dbpath /path/to/data
```

**Option B: MongoDB Atlas (Cloud)**
1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `MONGODB_URI` in `.env.local`

### 6. Get Groq API Key

1. Sign up at [Groq Console](https://console.groq.com/)
2. Generate an API key
3. Add it to `.env.local` as `GROQ_API_KEY`

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Usage Guide

### First-Time Setup

1. **Login**: Click "Sign in with Google"
2. **Onboarding**: 
   - Enter your company name
   - Select your branch/store
   - Define your role (e.g., Branch Manager)
3. **Dashboard**: You'll be redirected to the main dashboard

### For Branch Managers

1. **My Store Dashboard**:
   - Monitor inventory in real-time
   - Review alerts (Critical/High priority first)
   - View AI insights for each alert
   
2. **Operations Center**:
   - Check "Today's Action Items"
   - Review discount suggestions
   - Process reorder recommendations
   - Analyze weekly performance

3. **Transfers**:
   - Request stock from other branches
   - View transfer status
   - Approve incoming requests (if authorized)

### For Regional/Company Managers

1. **Branch Insights**:
   - Compare performance across all branches
   - Identify top performers and struggling stores
   - Filter by region

2. **Impact Dashboard**:
   - Track company-wide waste reduction
   - View financial savings
   - Generate weekly reports

---

## 🤖 AI Features Explained

### 1. **Discount Optimization**
The AI analyzes:
- Days until expiry
- Current stock levels
- Historical sales velocity
- Price elasticity

It then suggests optimal discount percentages (15%-50%) and predicts sales increase.

### 2. **Demand Forecasting**
Using historical data and day-of-week patterns, the AI:
- Predicts 3-day demand
- Calculates optimal reorder quantities
- Assigns urgency levels

### 3. **Action Item Generation**
AI creates prioritized tasks:
- Transfer X units to Branch Y
- Apply 25% discount to Product Z
- Reorder Product A (urgent)

### 4. **Weekly Analysis**
Every week, AI generates:
- Performance summary
- Trend analysis
- Strategic recommendations
- Confidence scoring

---

## 📊 Data Models

### Key Schemas

**User Profile**
```typescript
{
  uid: string;
  name: string;
  email: string;
  company: string;
  branch: string;
  role: string;
}
```

**Inventory Item**
```typescript
{
  product: string;
  stock: number;
  expiryDays: number;
  salesPerDay: number;
  unitPrice: number;
  expiryRisk: "High" | "Medium" | "Low";
}
```

**Smart Alert**
```typescript
{
  id: string;
  type: "expiry-risk" | "surplus-inventory" | "demand-mismatch";
  priority: "critical" | "high" | "medium" | "low";
  product: string;
  title: string;
  message: string;
}
```

**Stock Transfer Request**
```typescript
{
  id: string;
  fromBranch: string;
  toBranch: string;
  product: string;
  quantity: number;
  status: "pending" | "approved" | "rejected" | "in_transit" | "completed";
}
```

---

## 🧪 Development Workflows

### Build for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npx tsc --noEmit
```

---

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main

### Environment Variables for Production
Make sure all `.env.local` variables are set in your deployment platform.

---

## 🔐 Security Considerations

- **Firebase Authentication** handles user sessions securely
- **MongoDB connection** uses environment variables (never commit credentials)
- **API routes** should validate user permissions (implement role checks)
- **Groq API key** is server-side only (never exposed to client)

---

## 🐛 Troubleshooting

### Common Issues

**"Cannot destructure property" error**
- Fixed in `operations/page.tsx` with fallback priority handling

**MongoDB connection errors**
```bash
# Check if MongoDB is running
mongod --version
```

**Firebase auth not working**
- Verify all Firebase env variables are set
- Check Firebase Console for enabled providers

**Groq API errors**
- Verify API key is valid
- Check API quota limits

---

## 📚 Documentation

- [System Architecture](docs/SYSTEM_ARCHITECTURE.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Groq AI API Docs](https://console.groq.com/docs)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is developed for educational purposes as part of AI-4Dev 2026.

---

## 👥 Team & Contact

**Project Name**: AI-4Dev-2026 Stock Analyzer  
**Platform**: Next.js 16 + React 19 + AI Integration  
**AI Model**: Groq (LLaMA 3.3-70B)

---

## 🎯 Future Roadmap

- [ ] Mobile app for staff (React Native)
- [ ] Voice-activated inventory checks
- [ ] Computer vision for shelf monitoring
- [ ] Integration with POS systems
- [ ] Advanced forecasting with seasonality
- [ ] Multi-language support
- [ ] Blockchain for supply chain transparency

---

**Built with ❤️ using Next.js, AI, and a passion for reducing food waste.**
