# Lynva AI Receptionist - Local Development Guide

## 📋 Prerequisites

Before running the application locally, ensure you have the following installed:

### Required Software
- **Node.js**: Version 18.0 or higher
- **npm** or **pnpm**: Package manager (pnpm recommended)
- **Git**: For version control

### Accounts Required
- **Supabase Account**: For database and authentication
- **Vercel Account** (optional): For deployment

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
# Clone the project
git clone <repository-url>
cd lynva-ai-receptionist

# Or if you have the source files locally
cd lynva-ai-receptionist
```

### 2. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# API Keys (Optional - for full functionality)
VAPI_API_KEY=your_vapi_api_key
OPENAI_API_KEY=your_openai_api_key
GOOGLE_CALENDAR_CLIENT_ID=your_google_client_id
GOOGLE_CALENDAR_CLIENT_SECRET=your_google_client_secret
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### 4. Database Setup

#### Option A: Use Existing Supabase Project
If you have access to the production Supabase project, skip to step 5.

#### Option B: Create New Supabase Project

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Set up Database Schema**:
   ```bash
   # Run database migrations
   cd supabase
   
   # Execute each table creation script
   psql -h your-db-host -U postgres -d postgres -f tables/businesses.sql
   psql -h your-db-host -U postgres -d postgres -f tables/users.sql
   psql -h your-db-host -U postgres -d postgres -f tables/bookings.sql
   psql -h your-db-host -U postgres -d postgres -f tables/call_logs.sql
   psql -h your-db-host -U postgres -d postgres -f tables/faqs.sql
   psql -h your-db-host -U postgres -d postgres -f tables/services.sql
   psql -h your-db-host -U postgres -d postgres -f tables/whatsapp_messages.sql
   psql -h your-db-host -U postgres -d postgres -f tables/analytics_events.sql
   psql -h your-db-host -U postgres -d postgres -f tables/calendar_integrations.sql
   psql -h your-db-host -U postgres -d postgres -f tables/business_settings.sql
   ```

3. **Deploy Edge Functions** (Optional):
   ```bash
   # Install Supabase CLI
   npm install -g @supabase/cli
   
   # Login to Supabase
   supabase login
   
   # Link your project
   supabase link --project-ref your-project-ref
   
   # Deploy edge functions
   supabase functions deploy vapi-webhook
   supabase functions deploy booking-management
   supabase functions deploy google-calendar-auth
   supabase functions deploy whatsapp-webhook
   supabase functions deploy send-whatsapp-message
   ```

### 5. Run the Application

```bash
# Development mode
pnpm dev

# Or with npm
npm run dev
```

The application will be available at: **http://localhost:3000**

---

## 🔧 Development Commands

### Essential Commands
```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Type checking
pnpm type-check
```

### Database Commands
```bash
# Generate TypeScript types from Supabase
pnpm generate-types

# Reset database (if using local Supabase)
supabase db reset

# Run migrations
supabase migration up
```

---

## 📁 Project Structure

```
lynva-ai-receptionist/
├── app/                    # Next.js 14 App Router
│   ├── dashboard/          # Dashboard pages
│   │   ├── bookings/       # Booking management
│   │   ├── calls/          # Call logs
│   │   ├── content/        # FAQ management
│   │   ├── services/       # Service configuration
│   │   ├── analytics/      # Analytics dashboard
│   │   ├── settings/       # Business settings
│   │   └── help/           # Help and support
│   ├── auth/              # Authentication pages
│   │   ├── login/          # Login page
│   │   └── register/       # Registration page
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   └── ui/               # Shadcn/ui components
├── lib/                  # Utilities and configurations
│   ├── supabase.ts       # Supabase client
│   ├── auth.tsx          # Authentication context
│   └── utils.ts          # Utility functions
├── supabase/             # Database and backend
│   ├── tables/           # SQL table definitions
│   └── functions/        # Edge function implementations
├── public/               # Static assets
├── .env.example          # Environment variables template
├── tailwind.config.js    # Tailwind CSS configuration
├── package.json          # Dependencies and scripts
└── README.md             # Project documentation
```

---

## 🔑 Environment Variables Explained

### Required for Basic Functionality
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public anon key from Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for admin operations

### Optional for Enhanced Features
- `VAPI_API_KEY`: Voice AI integration
- `OPENAI_API_KEY`: GPT conversation intelligence
- `GOOGLE_CALENDAR_CLIENT_ID/SECRET`: Calendar booking
- `WHATSAPP_ACCESS_TOKEN`: WhatsApp messaging
- `STRIPE_SECRET_KEY`: Payment processing

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### 2. TypeScript Errors
```bash
# Generate fresh types from Supabase
pnpm generate-types

# Check TypeScript configuration
pnpm type-check
```

#### 3. Database Connection Issues
- Verify Supabase URL and keys in `.env.local`
- Check if your IP is whitelisted in Supabase dashboard
- Ensure database tables are created

#### 4. Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
pnpm build
```

#### 5. Styling Issues
```bash
# Rebuild Tailwind CSS
pnpm build-css
```

### Development Tips

#### Hot Reload Not Working
```bash
# Restart development server
pnpm dev
```

#### Environment Variables Not Loading
- Restart the development server after changing `.env.local`
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Check for typos in variable names

#### Database Schema Issues
- Verify all tables are created in Supabase
- Check table permissions and RLS policies
- Ensure user authentication is working

---

## 🚀 Deployment

### Local Production Build
```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

---

## 📊 Database Schema Overview

### Core Tables
1. **businesses**: Business profiles and configurations
2. **users**: User accounts linked to businesses
3. **bookings**: Appointment records with calendar sync
4. **call_logs**: Call history and conversation transcripts
5. **faqs**: Business-specific FAQ content
6. **services**: Service offerings and pricing
7. **whatsapp_messages**: Message history and templates
8. **analytics_events**: Business analytics tracking
9. **calendar_integrations**: Google Calendar connection settings
10. **business_settings**: Additional business configuration

### Relationships
- Users belong to businesses (many-to-one)
- Bookings, calls, FAQs, and services are linked to businesses
- Analytics events track user and business activities

---

## 🔐 Authentication Flow

### User Registration
1. User fills registration form
2. Supabase Auth creates user account
3. User profile created in `users` table
4. Business profile created in `businesses` table
5. User redirected to dashboard

### User Login
1. Email/password authentication via Supabase
2. Session management handled automatically
3. Protected routes check authentication status
4. User context provides business data

---

## 🛠️ Adding New Features

### Adding a New Page
1. Create page component in `app/dashboard/new-page/page.tsx`
2. Add navigation link in sidebar component
3. Update routing configuration if needed

### Adding API Endpoints
1. Create API route in `app/api/new-endpoint/route.ts`
2. Implement GET, POST, PUT, DELETE methods
3. Add error handling and validation

### Database Changes
1. Create migration SQL file in `supabase/tables/`
2. Run migration on your Supabase project
3. Update TypeScript types
4. Update application code

---

## 📞 Support

### Getting Help
- Check this documentation first
- Review error messages in browser console
- Check Supabase dashboard for database issues
- Verify environment variables are set correctly

### Development Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com/)

---

## ✅ Verification Checklist

Before considering your local setup complete, verify:

- [ ] Application starts without errors at `http://localhost:3000`
- [ ] User registration and login work properly
- [ ] Dashboard loads with all navigation links functional
- [ ] Database connection is established (check browser network tab)
- [ ] All pages render without TypeScript errors
- [ ] Environment variables are properly configured
- [ ] Build process completes successfully (`pnpm build`)

---

**Your Lynva AI Receptionist application should now be running locally and ready for development!**
