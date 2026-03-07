# System Architecture Review

## Current System Overview

### Multi-Branch Retail Inventory Intelligence Platform
An AI-powered SaaS platform that helps retail chains reduce food waste through predictive analytics and inventory redistribution.

---

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              PRODUCT FLOW                                       │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│              │    │   Company    │    │    Store     │    │  Inventory   │
│    Login     │───▶│  Dashboard   │───▶│  Dashboard   │───▶│  Monitoring  │
│              │    │              │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘    └──────┬───────┘
                                                                    │
                                                                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│    Waste     │    │   Transfer   │    │   Nearby     │    │      AI      │
│  Reduction   │◀───│   Approval   │◀───│    Store     │◀───│Recommendations│
│              │    │              │    │   Requests   │    │              │
└──────────────┘    └──────────────┘    └──────────────┘    └──────┬───────┘
                                                                    │
                          ┌──────────────┐    ┌──────────────┐      │
                          │    Alerts    │    │     Risk     │      │
                          │  Generated   │◀───│  Detection   │◀─────┘
                          │              │    │              │
                          └──────────────┘    └──────────────┘
```

---

## Module Architecture

### 1. Authentication Module ✅
**Status:** Implemented

```
├── Firebase Google OAuth
├── Multi-tenant user management
├── Profile setup flow
└── MongoDB user persistence
```

**Flow:**
- Login → Firebase Auth → Check Setup → Dashboard/Setup

### 2. Dashboard Module ✅
**Status:** Implemented

```
├── Company context display
├── Branch context display
└── Navigation hub
```

### 3. My Store Module ✅
**Status:** Implemented

```
├── Overview Tab
│   ├── KPI Cards (Total Products, Near Expiry, High Risk, Inventory Units)
│   └── Inventory Table
├── Alerts Tab
│   └── Alert List with priorities
└── AI Insights Tab
    └── Insight Cards with explanations
```

**Logic Engines:**
- `alertEngine.ts` - Smart alert generation
- `insightEngine.ts` - AI insight explanations

### 4. Branch Insights Module ✅
**Status:** Implemented

```
├── Multi-branch comparison table
├── Region filtering
├── Performance metrics
│   ├── Revenue
│   ├── Waste %
│   └── Growth Rate
├── Best performing branches
└── Branches needing attention
```

### 5. Recommendations Module ✅
**Status:** Partially Implemented

```
├── AI-generated recommendations
│   ├── Transfer inventory
│   ├── Apply discount
│   └── Donate items
├── Category filtering
├── Priority filtering
└── ❌ Feedback system (MISSING)
```

**Logic Engine:**
- `recommendationEngine.ts` - Rule-based recommendation generation

### 6. Waste Impact Module ✅
**Status:** Implemented

```
├── Waste comparison charts
├── Impact summary
└── Waste simulation
```

**Logic Engine:**
- `wasteSimulation.ts` - Waste projection

---

## Identified Gaps & Missing Features

### ❌ Gap 1: Stock Transfer System
**Current:** Recommendations suggest transfers but no execution mechanism
**Missing:**
- Transfer request creation
- Request approval workflow
- Transfer status tracking
- Inventory adjustment after transfer

### ❌ Gap 2: Branch Contact Directory
**Current:** No way to contact other branch managers
**Missing:**
- Branch manager contact info
- Phone/email directory
- Location/address details

### ❌ Gap 3: Onboarding Flow
**Current:** Basic setup page for company/branch selection
**Missing:**
- Multi-step company creation wizard
- Branch setup with details
- Manager assignment
- Initial inventory upload
- System activation

### ❌ Gap 4: Recommendation Feedback
**Current:** Recommendations are read-only
**Missing:**
- Accept/Reject actions
- Mark as completed
- Feedback tracking
- Recommendation effectiveness metrics

### ❌ Gap 5: Nearby Store Discovery
**Current:** No visibility into nearby stores with available stock
**Missing:**
- Proximity-based branch search
- Stock availability check
- Direct transfer requests

---

## Proposed Architecture Additions

### A. Stock Transfer Module (NEW)

```
┌─────────────────────────────────────────────────────┐
│                TRANSFER REQUEST FLOW                 │
└─────────────────────────────────────────────────────┘

Store A (Requester)              Store B (Supplier)
      │                                │
      │  1. Create Transfer Request    │
      │───────────────────────────────▶│
      │                                │
      │  2. Review Request             │
      │                                │
      │  3. Approve/Reject             │
      │◀───────────────────────────────│
      │                                │
      │  4. Ship Inventory             │
      │◀───────────────────────────────│
      │                                │
      │  5. Confirm Receipt            │
      │───────────────────────────────▶│
      │                                │
      │  6. Update Inventory           │
      ▼                                ▼
```

**States:**
- `pending` - Awaiting approval
- `approved` - Ready for shipment
- `rejected` - Declined
- `in_transit` - Being shipped
- `completed` - Received and confirmed

### B. Branch Directory Module (NEW)

```
┌─────────────────────────────────────────────────────┐
│                 BRANCH DIRECTORY                     │
└─────────────────────────────────────────────────────┘

├── Branch List
│   ├── Name
│   ├── Address
│   ├── Region
│   └── Status (Active/Inactive)
│
├── Contact Information
│   ├── Manager Name
│   ├── Phone Number
│   └── Email Address
│
└── Quick Actions
    ├── Call Manager
    ├── Send Email
    └── Request Transfer
```

### C. Onboarding Module (NEW)

```
┌─────────────────────────────────────────────────────┐
│              ONBOARDING FLOW (5 STEPS)               │
└─────────────────────────────────────────────────────┘

Step 1: Company Setup
├── Company Name
├── Industry Type
└── Logo Upload

Step 2: Add Branches
├── Branch Name
├── Address
├── Region
└── [Add More Branches]

Step 3: Assign Managers
├── Select Branch
├── Manager Name
├── Email
├── Phone
└── Role Assignment

Step 4: Initial Inventory
├── CSV Upload Option
├── Manual Entry Option
└── Sample Data Option

Step 5: Activate Monitoring
├── Alert Preferences
├── Notification Settings
└── Dashboard Customization
```

### D. Recommendation Feedback System (NEW)

```
┌─────────────────────────────────────────────────────┐
│            RECOMMENDATION FEEDBACK FLOW              │
└─────────────────────────────────────────────────────┘

Recommendation Generated
        │
        ▼
┌───────────────────┐
│  Store Manager    │
│  Reviews Action   │
└─────────┬─────────┘
          │
    ┌─────┴─────┐
    ▼           ▼
┌───────┐   ┌────────┐
│Accept │   │ Reject │
└───┬───┘   └────┬───┘
    │            │
    ▼            ▼
┌────────┐  ┌──────────┐
│Execute │  │Provide   │
│Action  │  │Reason    │
└───┬────┘  └──────────┘
    │
    ▼
┌──────────────┐
│Mark Complete │
└──────────────┘
```

---

## Updated Navigation Structure

```
SIDEBAR NAVIGATION
├── Overview
│   ├── Dashboard
│   └── My Store
│       ├── Overview
│       ├── Inventory
│       ├── Alerts
│       └── AI Insights
│
├── Operations (NEW SECTION)
│   ├── Stock Transfers    ← NEW
│   └── Branch Directory   ← NEW
│
└── Analytics
    ├── Branch Insights
    ├── Recommendations
    └── Waste Impact
```

---

## Data Model Extensions

### StockTransferRequest
```typescript
interface StockTransferRequest {
  id: string;
  fromBranch: string;
  toBranch: string;
  product: string;
  quantity: number;
  status: 'pending' | 'approved' | 'rejected' | 'in_transit' | 'completed';
  requestedBy: string;
  requestedAt: Date;
  respondedBy?: string;
  respondedAt?: Date;
  notes?: string;
  rejectionReason?: string;
}
```

### BranchContact
```typescript
interface BranchContact {
  branchId: string;
  branchName: string;
  managerName: string;
  phone: string;
  email: string;
  address: string;
  region: string;
}
```

### RecommendationFeedback
```typescript
interface RecommendationFeedback {
  recommendationId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  actedBy?: string;
  actedAt?: Date;
  completionNotes?: string;
  rejectionReason?: string;
}
```

---

## Implementation Priority

| Priority | Feature | Complexity | Impact |
|----------|---------|------------|--------|
| 1 | Recommendation Feedback | Low | High |
| 2 | Stock Transfer Requests | Medium | High |
| 3 | Branch Directory | Low | Medium |
| 4 | Onboarding Flow | High | High |

---

## Technical Recommendations

### 1. State Management
Consider adding a global state solution (Zustand/Jotai) for:
- Transfer request notifications
- Real-time recommendation updates
- Cross-component state sharing

### 2. Real-time Updates
Implement WebSocket or polling for:
- Transfer request status changes
- New recommendation notifications
- Alert updates

### 3. API Layer
Create dedicated API routes for:
- `/api/transfers` - Transfer CRUD
- `/api/directory` - Branch contacts
- `/api/recommendations/feedback` - Feedback submission

### 4. Database Schema
Extend MongoDB models for:
- TransferRequest collection
- BranchContact embedded in Branch
- RecommendationFeedback collection

---

## Next Steps

1. ✅ Create this architecture document
2. 🔄 Implement Stock Transfer feature
3. 🔄 Implement Branch Directory
4. 🔄 Implement Onboarding Flow
5. 🔄 Add Recommendation Feedback
6. 🔄 Update Sidebar navigation
7. 🔄 Verify complete product flow
