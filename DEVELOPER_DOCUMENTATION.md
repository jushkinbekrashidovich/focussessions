# FocusDot - Developer Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Environment Setup](#environment-setup)
5. [Database Schema](#database-schema)
6. [API Architecture](#api-architecture)
7. [Component Architecture](#component-architecture)
8. [State Management](#state-management)
9. [Authentication System](#authentication-system)
10. [Payment Integration](#payment-integration)
11. [Development Guidelines](#development-guidelines)
12. [Deployment](#deployment)
13. [Troubleshooting](#troubleshooting)

## Project Overview

FocusDot is a productivity application that helps users build focus habits through visual tracking, deep work sessions, and progress analytics. The application provides a Pomodoro-style timer with advanced features like heatmaps, focus scores, and subscription-based premium features.

### Key Features
- **Focus Timer**: Customizable timer with flip mode and session tracking
- **Visual Analytics**: Deep work heatmap and progress statistics
- **Goal Management**: Create and track multiple focus categories
- **Subscription System**: Free and Pro tiers with different feature access
- **Activity Feed**: Real-time session history and progress tracking

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **UI Components**: Custom components with Tailwind
- **Icons**: Heroicons (SVG)

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Next.js API Routes
- **Real-time**: Supabase Realtime

### External Services
- **Payments**: Paddle
- **Deployment**: Vercel
- **Analytics**: Built-in focus tracking

## Project Structure

```
focussessions/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── app/               # Dashboard pages
│   │   ├── auth/              # Authentication pages
│   │   ├── login/             # Login page
│   │   ├── pricing/           # Pricing page
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable UI components
│   │   ├── TimerBox.tsx       # Main timer component
│   │   ├── DeepWorkStats.tsx  # Statistics display
│   │   ├── DeepWorkHeatmap.tsx # Activity heatmap
│   │   ├── ActivityFeed.tsx   # Session history
│   │   └── ...
│   ├── contexts/              # React contexts
│   │   ├── PaddleContext.tsx  # Payment context
│   │   └── ThemeContext.tsx   # Theme management
│   └── lib/                   # Utilities and services
│       ├── hooks/             # Custom React hooks
│       ├── supabaseClient.ts  # Database client
│       ├── paddleClient.ts    # Payment client
│       └── ...
├── public/                    # Static assets
├── supabase_migrations.sql    # Database migrations
└── package.json
```

## Environment Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Paddle account (for payments)

### Environment Variables

Create a `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Paddle Configuration
NEXT_PUBLIC_PADDLE_VENDOR_ID=your_paddle_vendor_id
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
PADDLE_API_KEY=your_paddle_api_key

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd focussessions

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
# Execute supabase_migrations.sql in your Supabase dashboard

# Start development server
npm run dev
```

## Database Schema

### Core Tables

#### `users` (Supabase Auth)
```sql
- id (uuid, primary key)
- email (text)
- created_at (timestamp)
- user_metadata (jsonb)
```

#### `skills` (Focus Categories)
```sql
CREATE TABLE skills (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  target_hours integer DEFAULT 0,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

#### `sessions` (Focus Sessions)
```sql
CREATE TABLE sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE,
  duration_min integer NOT NULL,
  note text,
  created_at timestamp with time zone DEFAULT now()
);
```

#### `user_subscriptions` (Payment Data)
```sql
CREATE TABLE user_subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id text UNIQUE,
  plan_type text NOT NULL,
  status text NOT NULL,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

### Indexes and Constraints
```sql
-- Performance indexes
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_created_at ON sessions(created_at);
CREATE INDEX idx_skills_user_id ON skills(user_id);

-- Unique constraints
ALTER TABLE user_subscriptions ADD CONSTRAINT unique_user_subscription UNIQUE (user_id, subscription_id);
```

## API Architecture

### API Routes Structure

#### `/api/subscriptions/cancel/route.ts`
- **Method**: POST
- **Purpose**: Cancel user subscription
- **Authentication**: Required
- **Response**: Success/error status

#### `/api/webhooks/paddle/route.ts`
- **Method**: POST
- **Purpose**: Handle Paddle webhook events
- **Authentication**: Webhook signature verification
- **Events**: subscription_created, subscription_updated, subscription_cancelled

### API Patterns

```typescript
// Example API route structure
export async function POST(request: Request) {
  try {
    // 1. Validate authentication
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 2. Parse and validate input
    const body = await request.json();
    const validatedData = validateInput(body);

    // 3. Process business logic
    const result = await processRequest(validatedData, user);

    // 4. Return response
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

## Component Architecture

### Component Hierarchy

```
App Layout
├── AppNavbar
├── TimerBox
│   ├── Timer Display
│   ├── Goal Selection
│   ├── Duration Controls
│   ├── Flip Mode Overlay
│   └── Modals (AddGoal, NoGoal)
├── DeepWorkStats
├── DeepWorkHeatmap
└── ActivityFeed
```

### Key Components

#### TimerBox Component
```typescript
interface TimerBoxProps {
  onSessionCompleted?: () => void;
}

// Key features:
// - Timer state management
// - Goal selection and creation
// - Flip mode overlay
// - Session saving
// - Real-time updates
```

#### DeepWorkHeatmap Component
```typescript
interface DeepWorkHeatmapProps {
  refreshTrigger?: number;
}

// Key features:
// - GitHub-style activity heatmap
// - Year selection
// - Intensity-based coloring
// - Pro upgrade prompts
```

### Component Patterns

```typescript
// 1. Props Interface
interface ComponentProps {
  data: DataType;
  onAction: (value: string) => void;
  isLoading?: boolean;
}

// 2. Custom Hooks
const { data, isLoading, error } = useCustomHook();

// 3. Error Boundaries
if (error) return <ErrorComponent />;
if (isLoading) return <LoadingComponent />;

// 4. Conditional Rendering
{condition && <Component />}
```

## State Management

### React Query Setup

```typescript
// Query Client Configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});
```

### Custom Hooks

#### `useSkills()`
```typescript
export function useSkills() {
  return useQuery({
    queryKey: skillKeys.user(),
    queryFn: skillsService.getUserSkills,
    staleTime: 2 * 60 * 1000,
  });
}
```

#### `useCreateSession()`
```typescript
export function useCreateSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillKeys.user() });
    },
  });
}
```

### Context Providers

#### PaddleContext
```typescript
interface PaddleContextType {
  openCheckout: (planId: string, email: string) => void;
  isLoading: boolean;
}

// Provides payment functionality across the app
```

## Authentication System

### Supabase Auth Integration

```typescript
// Authentication flow
const { data: user, isLoading } = useUser();

// Protected routes
if (isLoading) return <LoadingSpinner />;
if (!user) return <LoginPage />;
```

### User Management

```typescript
// User data structure
interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
}
```

### Route Protection

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Check authentication
  // Redirect to login if not authenticated
  // Allow access to protected routes
}
```

## Payment Integration

### Paddle Configuration

```typescript
// Paddle client setup
const paddle = new Paddle({
  environment: process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT,
  vendorId: process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID,
  apiKey: process.env.PADDLE_API_KEY,
});
```

### Subscription Management

```typescript
// Subscription states
type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing';

// Plan types
type PlanType = 'free' | 'pro_monthly' | 'pro_yearly';
```

### Webhook Handling

```typescript
// Webhook event processing
const handleWebhook = async (event: PaddleEvent) => {
  switch (event.event_type) {
    case 'subscription.created':
      await createSubscription(event.data);
      break;
    case 'subscription.updated':
      await updateSubscription(event.data);
      break;
    case 'subscription.cancelled':
      await cancelSubscription(event.data);
      break;
  }
};
```

## Development Guidelines

### Code Style

#### TypeScript
```typescript
// Use strict typing
interface UserData {
  id: string;
  email: string;
  createdAt: Date;
}

// Prefer interfaces over types for objects
// Use enums for constants
enum PlanType {
  FREE = 'free',
  PRO_MONTHLY = 'pro_monthly',
  PRO_YEARLY = 'pro_yearly',
}
```

#### React Components
```typescript
// Functional components with TypeScript
const Component: React.FC<Props> = ({ data, onAction }) => {
  // Component logic
  return <div>{/* JSX */}</div>;
};

// Custom hooks
const useCustomHook = (param: string) => {
  const [state, setState] = useState<StateType>();
  // Hook logic
  return { state, setState };
};
```

### File Naming
- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utilities: `camelCase.ts`
- Types: `types.ts` or `interfaces.ts`

### Git Workflow

```bash
# Feature branch naming
git checkout -b feature/timer-improvements
git checkout -b fix/heatmap-colors
git checkout -b refactor/state-management

# Commit messages
git commit -m "feat: add flip mode to timer"
git commit -m "fix: resolve heatmap color inconsistency"
git commit -m "docs: update API documentation"
```

### Testing Strategy

```typescript
// Component testing example
import { render, screen } from '@testing-library/react';
import TimerBox from './TimerBox';

test('renders timer component', () => {
  render(<TimerBox onSessionCompleted={jest.fn()} />);
  expect(screen.getByText('Start Timer')).toBeInTheDocument();
});
```

## Deployment

### Vercel Deployment

```bash
# Build and deploy
npm run build
vercel --prod

# Environment variables
# Set in Vercel dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - NEXT_PUBLIC_PADDLE_VENDOR_ID
# - PADDLE_API_KEY
```

### Database Migrations

```sql
-- Run migrations in Supabase dashboard
-- Or use Supabase CLI
supabase db push
```

### Environment Configuration

```bash
# Production environment variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_PADDLE_VENDOR_ID=your_vendor_id
NEXT_PUBLIC_PADDLE_ENVIRONMENT=production
PADDLE_API_KEY=your_api_key
```

## Troubleshooting

### Common Issues

#### 1. Supabase Connection Issues
```typescript
// Check environment variables
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);

// Verify client initialization
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

#### 2. Paddle Integration Issues
```typescript
// Check Paddle environment
const paddle = new Paddle({
  environment: process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT,
  // ... other config
});

// Verify webhook signatures
const isValidSignature = paddle.webhooks.verifySignature(
  request.body,
  request.headers['paddle-signature']
);
```

#### 3. React Query Issues
```typescript
// Check query keys
const queryKey = ['skills', 'user'];
queryClient.invalidateQueries({ queryKey });

// Debug queries
queryClient.setQueryData(['skills', 'user'], newData);
```

### Performance Optimization

#### 1. Database Queries
```sql
-- Use indexes for frequently queried columns
CREATE INDEX idx_sessions_user_created ON sessions(user_id, created_at);

-- Optimize queries with proper WHERE clauses
SELECT * FROM sessions 
WHERE user_id = $1 
AND created_at >= $2 
ORDER BY created_at DESC 
LIMIT 10;
```

#### 2. React Query Optimization
```typescript
// Use staleTime to reduce refetches
const { data } = useQuery({
  queryKey: ['skills'],
  queryFn: fetchSkills,
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Implement optimistic updates
const mutation = useMutation({
  mutationFn: createSkill,
  onMutate: async (newSkill) => {
    await queryClient.cancelQueries(['skills']);
    const previousSkills = queryClient.getQueryData(['skills']);
    queryClient.setQueryData(['skills'], old => [...old, newSkill]);
    return { previousSkills };
  },
});
```

#### 3. Component Optimization
```typescript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* Expensive rendering */}</div>;
});

// Use useCallback for event handlers
const handleClick = useCallback((id: string) => {
  // Handle click
}, [dependency]);
```

### Debugging Tools

#### 1. React Query Devtools
```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

#### 2. Supabase Debugging
```typescript
// Enable debug mode
const supabase = createClient(url, key, {
  auth: {
    debug: process.env.NODE_ENV === 'development'
  }
});
```

#### 3. Console Logging
```typescript
// Structured logging
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  }
};
```

## Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Write tests if applicable**
5. **Update documentation**
6. **Submit a pull request**

### Code Review Checklist

- [ ] Code follows TypeScript best practices
- [ ] Components are properly typed
- [ ] Error handling is implemented
- [ ] Performance considerations are addressed
- [ ] Documentation is updated
- [ ] Tests pass (if applicable)

### Release Process

1. **Update version in package.json**
2. **Update CHANGELOG.md**
3. **Create release tag**
4. **Deploy to production**
5. **Monitor for issues**

---

## Support

For technical support or questions:
- **Email**: jushkinbek.co@gmail.com
- **Documentation**: This file
- **Issues**: GitHub Issues

---

*Last updated: December 2024*
*Version: 1.0.0*
