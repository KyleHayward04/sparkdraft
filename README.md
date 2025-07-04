# SparkDraft – AI Content Generation Platform

Generate outlines, titles and promo copy for blogs, videos, newsletters and carousels—powered by OpenAI.

---

## Overview
SparkDraft is a full-stack Progressive Web App (PWA) that turns a simple topic or keyword into:
- Structured content **outlines**
- Catchy **titles**
- Ready-to-post **promotional copy**

Built with React on the front end and Node.js on the back end, it supports subscription billing via Stripe and stores your projects in PostgreSQL.

---

## System Architecture

### Frontend
- **Framework:** React 18 + TypeScript  
- **Styling:** Tailwind CSS + shadcn/ui  
- **State Management:** TanStack Query  
- **Routing:** Wouter  
- **Build Tool:** Vite  
- **UI Primitives:** Radix UI (custom-styled)  

### Backend
- **Runtime:** Node.js + Express  
- **Language:** TypeScript (ES modules)  
- **Database:** PostgreSQL via Drizzle ORM  
- **AI Integration:** OpenAI GPT API  
- **Billing:** Stripe subscriptions  
- **Storage:** In-memory layer (easy swap to other stores)  

---

## Key Components

### Data Models
- **Users:** Authentication, subscription tier, usage tracking  
- **Projects:** Topic, format, generated outputs, timestamps  
- **Validation:** Drizzle schema + Zod  

### Core Features
1. **Content Generation**  
   - AI-powered outlines, titles and promos  
2. **Project Management**  
   - Save, organize and favorite your sparks  
3. **Subscription System**  
   - Tiered limits and usage quotas  
4. **Mobile-First Design**  
   - PWA with fully responsive UI  

---

## API Endpoints

| Endpoint                 | Method | Description                                 |
|--------------------------|:------:|---------------------------------------------|
| `/api/register`          | POST   | Create a new user account                   |
| `/api/login`             | POST   | Authenticate and start a session            |
| `/api/projects`          | GET    | List your projects                          |
| `/api/projects`          | POST   | Generate a new content project              |
| `/api/projects/:id`      | GET    | Fetch single project details                |
| `/api/projects/:id`      | DELETE | Delete a project                            |
| `/api/subscribe/*`       | POST   | Create or update Stripe subscription        |
| `/api/user/*`            | GET/PUT| Fetch or update user profile and settings   |

---

## Data Flow

1. **User Authentication**  
   - Email and password → session cookie  
2. **Content Generation**  
   - User submits topic and format → backend calls OpenAI → returns structured JSON  
3. **Project Storage**  
   - Store output and metadata in PostgreSQL  
4. **Billing and Limits**  
   - Stripe webhook updates usage and subscription status  

---

## External Dependencies

### Core Services
- **OpenAI API** – GPT content engine  
- **Stripe** – subscription billing  
- **Neon** – hosted PostgreSQL (production)  

### Development Tools
- **Vite** – development server and build tool  
- **TypeScript** – type safety  
- **ESLint / Prettier** – code linting and formatting  

---

## Deployment Strategy

### Development
- Vite hot module replacement  
- In-memory storage for rapid prototyping  
- `.env` for API keys  

### Production
- Vite build → static files served by Express  
- PostgreSQL on Neon  
- Environment-based configuration and secrets  
- Backend bundled with ESBuild  

---

## Build Process

```bash
# Frontend
cd client
npm install
npm run dev      # local PWA

# Backend
cd server
npm install
npm run build    # bundles to dist/index.js
npm run start    # production mode

# Database
npx drizzle-kit migrate:push
