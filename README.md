# RCNVProjectV1
# RCNV - Rotary Club Management App

Multi-tenant Rotary Club management platform built with Next.js, Prisma, and Supabase.

## Features

- **Member Directory** — Members, spouses, and kids with search
- **Projects** — Track club projects across all 5 avenues of service
- **Rotary News** — Club announcements with pinning support
- **Birthdays & Anniversaries** — Monthly view for members and family
- **Branding & Promotions** — Business listings for Rotarians
- **Monthly Dues** — Track payments per member
- **Admin Dashboard** — Stats, member management, CSV upload, project & news management
- **Multi-tenant** — Each club gets isolated data via club slug

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase free tier)
- **Auth**: Cookie-based sessions with bcrypt
- **Hosting**: Vercel (free tier)

## Setup

1. Create a [Supabase](https://supabase.com) project (free)
2. Copy `.env.example` to `.env` and fill in your Supabase credentials
3. Install and set up:

```bash
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

4. Open http://localhost:3000 and log in:
   - Club ID: `rotary-navi-mumbai`
   - Email: `admin@rotary.local`
   - Password: `admin123`

## CSV Upload Format

Admin can bulk-upload members via CSV. Download the template from the admin panel. Required columns: `name`, `email`. Optional: `phone`, `classification`, `dateofbirth`, `anniversary`, `address`, `businessname`, `businesstagline`, `spousename`, `spousedob`, `child1`, `child1dob`, `child2`, `child2dob`.

## Deploy to Vercel

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy
