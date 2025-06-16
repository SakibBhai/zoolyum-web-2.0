# Zoolyum Web Application

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)

[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/sakibbhaus-projects/v0-sakib)

## Overview

Zoolyum is a modern web application built with Next.js, React, Prisma, and PostgreSQL. It features a dynamic website with blog functionality, project portfolio, services showcase, team member profiles, and testimonials. The application includes both public-facing pages and an admin dashboard for content management.

## Features

- **Modern UI with Animations**: Utilizes Framer Motion for smooth animations and transitions
- **Responsive Design**: Fully responsive layout that works on all devices
- **Admin Dashboard**: Secure admin area for content management
- **Blog System**: Create, edit, and publish blog posts
- **Project Portfolio**: Showcase your work with detailed project pages
- **Team Member Profiles**: Display information about your team
- **Testimonials**: Share client feedback and testimonials
- **Authentication**: Secure user authentication with NextAuth.js
- **Database Integration**: PostgreSQL database with Prisma ORM

## Tech Stack

- **Frontend**: React 19, Next.js 15.2.4
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Animations**: Framer Motion
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v10.12.1 or higher)
- PostgreSQL database

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/SakibBhai/zoolyum-web-2.0.git
   cd zoolyum-web-2.0
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/zoolyum?schema=public"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Run database migrations
   ```bash
   pnpm prisma migrate dev
   ```

5. Start the development server
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app`: Next.js app router pages and API routes
- `/components`: Reusable React components
- `/lib`: Utility functions and database client
- `/prisma`: Database schema and migrations
- `/public`: Static assets
- `/styles`: Global CSS styles

## Deployment

The application is configured for deployment on Vercel. The `vercel.json` file includes the necessary configuration for building and deploying the application, including environment variables for the database connection.

### Deployment Configuration

The project uses the following Vercel configuration:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "installCommand": "pnpm install",
  "buildCommand": "prisma generate && corepack enable && pnpm run build",
  "env": {
    "ENABLE_EXPERIMENTAL_COREPACK": "1",
    "DATABASE_URL": "your-database-url"
  }
}
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)

- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Vercel](https://vercel.com/)
