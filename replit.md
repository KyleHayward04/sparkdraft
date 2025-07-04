# SparkDraft - AI Content Generation Platform

## Overview

SparkDraft is a full-stack web application that generates AI-powered content outlines, titles, and promotional copy for various content formats (blog posts, videos, newsletters, and carousels). The application is built with a modern tech stack featuring React frontend, Node.js backend, and includes subscription-based payment processing through Stripe.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI GPT API for content generation
- **Payment Processing**: Stripe for subscription management
- **Storage**: In-memory storage with interface for easy database migration

## Key Components

### Data Models
- **Users**: Authentication, subscription tiers, usage tracking
- **Projects**: Content generation requests with generated outputs
- **Schema**: Drizzle ORM schema with Zod validation

### Core Features
1. **Content Generation**: AI-powered creation of outlines, titles, and promotional content
2. **Project Management**: Save, organize, and favorite generated content
3. **Subscription System**: Tiered pricing with usage limits
4. **Mobile-First Design**: Progressive Web App with responsive UI

### API Endpoints
- Authentication: `/api/register`, `/api/login`
- Content Generation: `/api/projects` (CRUD operations)
- Subscription Management: `/api/subscribe/*`
- User Management: `/api/user/*`

## Data Flow

1. **User Authentication**: Simple email/password authentication with session management
2. **Content Generation**: User submits topic/format → OpenAI API → Structured content response
3. **Project Storage**: Generated content saved to database with metadata
4. **Subscription Management**: Stripe integration for payment processing and usage tracking

## External Dependencies

### Core Dependencies
- **OpenAI API**: Content generation service
- **Stripe**: Payment processing and subscription management
- **Neon Database**: PostgreSQL hosting (configured for production)

### Development Tools
- **Vite**: Development server and build tool
- **TypeScript**: Type safety and development experience
- **ESLint/Prettier**: Code quality and formatting

## Deployment Strategy

### Development
- Hot module replacement with Vite
- In-memory storage for rapid prototyping
- Environment variables for API keys

### Production
- Static asset serving through Express
- PostgreSQL database connection
- Environment-based configuration
- Build optimization through Vite

### Build Process
1. Frontend: Vite builds React app to `dist/public`
2. Backend: ESBuild bundles server code to `dist/index.js`
3. Database: Drizzle migrations applied via `db:push`

## Changelog

- July 04, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.