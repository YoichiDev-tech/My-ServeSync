# ServeSync — Project Overview

ServeSync is an AI‑powered back‑office system designed for hospitality operators.  
This repository contains the full codebase for the public landing page and the backend API routes powering early ServeSync features.

This file serves as the `high‑level summary` of the entire project.  
For detailed documentation, refer to the folder‑specific README files.

## Project Purpose

ServeSync aims to automate the operational workload of restaurants, cafés, bars, and hospitality groups.  
This repository currently includes:

- The official landing page  
- The first backend API endpoints  
- Early integration with Supabase for authentication and data storage  

As the project evolves, additional modules (scheduling, payroll, staff management, forecasting) will be added.

## Tech Stack (High-Level)

- `Frontend:` React, Vite, TypeScript, Tailwind CSS  
- `Backend:` Express (Vercel Serverless Functions)  
- `Database:` Supabase (PostgreSQL + RLS)  
- `Auth:` Supabase Auth  
- `Deployment:` Vercel  

## Current Status (Summary)

- Full landing page completed  
- Contact form fully functional  
- Staff creation API implemented  
- Supabase RLS configured for multi‑tenant data isolation  
- Frontend staff creation form connected to backend  
- Project ready for next modules (staff list, staff edit, scheduling)

For deeper details, see `/frontend/README.md`.

## Roadmap (High-Level)

These are the next major milestones for ServeSync:

- Staff List Page (view all staff)
- Staff Edit Page (update staff details)
- Staff Delete Flow
- Scheduling module (shifts, availability, constraints)
- Dashboard preview section for landing page
- Multi‑language support
- Full documentation for API folder

Detailed task breakdowns will be added as GitHub issues.

## End‑Project Considerations

This file will be updated as ServeSync grows.  
It will include:

- Architecture decisions  
- Deployment notes  
- Module summaries  
- Final project documentation  
- Release notes for major versions  

For implementation‑level details, refer to the frontend and API READMEs.

## Author

Yoichi dev