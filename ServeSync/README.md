# ServeSync — Project Overview

ServeSync is an AI‑powered back‑office system designed for hospitality operators.  
This repository contains the full codebase for the public landing page and the backend API routes powering early ServeSync features.

This file serves as the `high‑level summary` of the entire project.  
For detailed documentation, refer to the folder‑specific README files.

## Screenshot
![alt text](ServeSync/public/images/README-image.png)

## Project Purpose

ServeSync aims to automate the operational workload of restaurants, cafés, bars, and hospitality groups.  
This repository currently includes:

- The official landing page  
- Backend API endpoints for checkout, onboarding, and trial management  
- Full integration with Supabase for authentication and data storage  
- Full integration with Stripe for subscription billing  

As the project evolves, additional modules (scheduling, inventory, staff management, reporting) will be added.

## Tech Stack (High-Level)

- `Frontend:` React, Vite, TypeScript, Tailwind CSS  
- `Backend:` Express (Vercel Serverless Functions)  
- `Database:` Supabase (PostgreSQL + RLS)  
- `Auth:` Supabase Auth  
- `Payments:` Stripe (Checkout + Payment Links)  
- `Deployment:` Vercel  

## Authentication System

- Supabase Auth  
- Email/password login  
- Password reset  
- Email verification  
- Multi‑tenant RLS  
- Auth Guard  
- Admin Guard  

## Current Status (Summary)

- Full landing page completed  
- Contact form fully functional  
- Supabase RLS configured for multi‑tenant data isolation  
- Authentication system implemented  
- Trial system implemented (14-day, one trial per email, server-enforced)  
- Stripe Checkout live for three plans: Counter, Kitchen, and Group (custom pricing)  
- Onboarding flow verified end-to-end, including live payment testing  
- Dashboard shell with sidebar navigation in progress  

For deeper details, see `/frontend/README.md`.

## Trial System

- 14‑day trial  
- One trial per email, enforced server-side via a permanent ledger  
- Trial banner  
- Trial columns in profiles table  
- Trial Expired page  
- Full reuse-prevention/auto-cleanup enforcement in progress  

## Subscription System

- Stripe Checkout integration — **live**  
- Three plans: Counter ($39/mo), Kitchen ($99/mo), Group (custom, via Payment Link)  
- Server-side plan verification (Stripe session metadata cross-checked before granting access)  
- Stripe Webhooks — upcoming  
- Billing history page — upcoming  
- Subscription cancellation flow — upcoming  

## Application Structure

- Landing page (public marketing site)  
- Frontend application (dashboard, settings, admin)  
- Backend API (serverless functions)  
- Supabase database + authentication  

## Backend Overview

- Serverless API routes  
- Supabase database  
- Row-Level Security (RLS)  
- Profiles table (trial + subscription columns)  

## Roadmap (High-Level)

### Frontend (Landing Page)
- Testimonials section  
- Dashboard preview section  
- Smooth scroll navigation  
- Active link highlighting  
- Scroll‑triggered animations  
- Multi‑language support  

### Core SaaS
- Trial expiration enforcement (in progress)  
- Multi-currency checkout  
- Billing history  
- Business profile page  

### Admin
- User list  
- Extend trial  
- Subscription overview  
- Analytics  

### Operations Modules
- Scheduling module (in progress — first module)  
- Inventory module  
- Staff module  
- Reports module  

## End‑Project Considerations

This file will be updated as ServeSync grows.  
It will include:

- Architecture decisions  
- Module summaries  
- Final project documentation  
- Release notes for major versions  

For implementation‑level details, refer to the frontend and API READMEs.

## Author

Yoichi dev