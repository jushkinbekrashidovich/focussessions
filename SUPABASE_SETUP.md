# Supabase Server-Side Setup

This project now includes a complete server-side Supabase setup with middleware for token refresh and session management.

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client Side   │    │    Middleware    │    │  Server Side    │
│                 │    │                  │    │                 │
│ TimerBox        │◄──►│ Token Refresh    │◄──►│ ServerUserInfo  │
│ ActivityPage    │    │ Route Protection │    │ API Routes      │
│ LoginPage       │    │ Session Mgmt     │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📁 **Files Created/Updated**

### 1. **`src/lib/supabaseServer.ts`**
- Server-side Supabase client
- Helper functions for server components
- Proper cookie handling for SSR

### 2. **`src/middleware.ts`**
- Automatic token refresh
- Route protection (`/app/*` requires auth)
- Automatic redirects (login ↔ app)

### 3. **`src/app/auth/callback/route.ts`**
- Updated to use server client
- Better error handling
- Proper session exchange

### 4. **`src/components/ServerUserInfo.tsx`**
- Example server component
- Shows how to use server-side auth

## 🚀 **How to Use**

### **In Server Components:**
```tsx
import { getServerUser } from '@/lib/supabaseServer'

export default async function MyServerComponent() {
  const user = await getServerUser()
  
  if (!user) {
    return <div>Not authenticated</div>
  }
  
  return <div>Welcome, {user.email}!</div>
}
```

### **In API Routes:**
```tsx
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function GET() {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('your_table')
    .select('*')
  
  return Response.json({ data, error })
}
```

### **In Route Handlers:**
```tsx
import { getServerSession } from '@/lib/supabaseServer'

export async function POST() {
  const session = await getServerSession()
  
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Your logic here
}
```

## 🔐 **Authentication Flow**

1. **User clicks "Sign in with Google"**
2. **Redirected to Google OAuth**
3. **Google redirects back to `/auth/callback`**
4. **Middleware processes the callback**
5. **Session is created and stored in cookies**
6. **User is redirected to `/app`**
7. **Middleware protects all `/app/*` routes**
8. **Automatic token refresh when needed**

## 🛡️ **Route Protection**

- **`/app/*`** - Protected routes (requires authentication)
- **`/login`** - Public route (redirects to `/app` if already authenticated)
- **`/`** - Public landing page
- **`/auth/*`** - Auth-related routes

## 🔄 **Token Refresh**

The middleware automatically:
- Refreshes expired tokens
- Maintains user sessions
- Handles cookie management
- Redirects unauthenticated users

## 🧪 **Testing the Setup**

1. **Start your dev server**: `npm run dev`
2. **Go to `/login`** - should show login form
3. **Sign in with Google** - should redirect to `/app`
4. **Try accessing `/app` directly** - should work if authenticated
5. **Try accessing `/app` without auth** - should redirect to `/login`

## 🚨 **Common Issues & Solutions**

### **"User not authenticated" error:**
- Check that RLS policies are set up in Supabase
- Ensure middleware is working (check console logs)
- Verify environment variables are correct

### **Session not persisting:**
- Check cookie settings in middleware
- Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Verify Supabase project settings

### **Middleware not running:**
- Check that `middleware.ts` is in the root `src/` folder
- Ensure the matcher pattern is correct
- Restart your dev server

## 📚 **Next Steps**

1. **Add the server component to your app page** to test server-side auth
2. **Create API routes** for server-side data operations
3. **Add more protected routes** as needed
4. **Implement role-based access control** if required

## 🔗 **Useful Links**

- [Supabase SSR Documentation](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
