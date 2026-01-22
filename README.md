# MoodTrack - Personal Wellness Diary

A fullstack diary application built with Next.js, TypeScript, and Tailwind CSS. Track your mood, sleep, work hours, activities, and get AI-powered insights into your patterns.

![MoodTrack](./public/og-image.jpg)

## Features

- 📊 **Dashboard** - Visual metrics and charts showing mood trends, sleep vs work balance, and more
- 📝 **Daily Logging** - Track mood, sleep hours, work hours, outdoor time, meals, activities, and free-form notes
- 🤖 **AI Chat** - Interact with an AI assistant that analyzes your patterns and provides insights
- 🔍 **Pattern Analysis** - AI-powered analysis of your diary entries to discover behavioral patterns
- 🔐 **Authentication** - Secure login/register with mocked Clerk integration (ready for production)
- 📱 **Responsive** - Fully responsive design that works on mobile, tablet, and desktop
- 🎨 **SEO Optimized** - Landing page built with SEO best practices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Auth**: Mocked Clerk (see migration guide below)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd diary-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth routes (login, register)
│   ├── (private)/         # Protected routes (dashboard, diary)
│   ├── api/               # API routes
│   │   ├── analyze/       # AI analysis endpoint
│   │   ├── chat/          # Chat endpoint
│   │   └── diary/         # Diary CRUD endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/
│   ├── chat/              # Chat and diary form components
│   ├── dashboard/         # Dashboard charts and metrics
│   ├── landing/           # Landing page sections
│   ├── layout/            # Navbar, Footer, Sidebar
│   └── ui/                # Reusable UI components
├── content/
│   └── text.ts            # All app text (single source of truth)
├── lib/
│   ├── clerk-mock.ts      # Mocked Clerk authentication
│   └── utils.ts           # Utility functions
├── store/
│   ├── useAuthStore.ts    # Auth state management
│   └── useDiaryStore.ts   # Diary state management
├── types/
│   └── index.ts           # TypeScript type definitions
└── middleware.ts          # Route protection middleware
```

## Text Management

All application text is centralized in `src/content/text.ts`. This single file contains:

- Meta tags and SEO content
- Navigation labels
- Landing page content (hero, features, testimonials, etc.)
- Auth page content
- Dashboard labels
- Diary/Chat interface text
- Common strings

To change any text in the app, simply edit this file:

```typescript
// src/content/text.ts
export const content = {
  meta: {
    title: "MoodTrack - Your Personal Wellness Diary",
    description: "Track your mood, sleep, work hours...",
  },
  nav: {
    brand: "MoodTrack",
    // ... more content
  },
  // ... all other content
};
```

## Authentication

The app uses a mocked Clerk service for authentication. This allows development and testing without setting up Clerk accounts.

### Default Behavior:
- User data is stored in localStorage
- Sign up creates a new user
- Sign in validates credentials against stored users
- Sessions persist across page reloads

### Migrating to Real Clerk

1. Install Clerk:
```bash
npm install @clerk/nextjs
```

2. Add environment variables:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

3. Update `src/app/layout.tsx`:
```typescript
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

4. Update `src/middleware.ts`:
```typescript
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/login", "/register"],
});
```

5. Replace mock hooks with Clerk hooks in components:
```typescript
import { useUser, useAuth } from '@clerk/nextjs';
```

See `src/lib/clerk-mock.ts` for detailed migration instructions.

## API Routes

### POST /api/chat
Handle chat messages and generate AI responses.

**Request:**
```json
{
  "message": "How has my mood been this week?",
  "entries": [...],
  "userId": "user123"
}
```

**Response:**
```json
{
  "response": "Based on your recent entries..."
}
```

### POST /api/analyze
Analyze diary entries for patterns.

**Request:**
```json
{
  "entries": [...],
  "userId": "user123"
}
```

**Response:**
```json
{
  "summary": "Based on 15 diary entries...",
  "patterns": ["Your mood tends to be higher when..."],
  "recommendations": ["Try to maintain 7+ hours of sleep"],
  "insights": [...]
}
```

### Integration with Real LLM

To connect with a real LLM (OpenAI, Anthropic, etc.):

1. Install the SDK:
```bash
npm install openai
```

2. Add API key to environment:
```env
OPENAI_API_KEY=sk-...
```

3. Update the API routes in `src/app/api/chat/route.ts`:
```typescript
import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(request: NextRequest) {
  const { message, entries } = await request.json();
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a wellness assistant..." },
      { role: "user", content: message }
    ],
  });
  
  return NextResponse.json({
    response: completion.choices[0].message.content
  });
}
```

## Data Persistence

Currently, data is stored in localStorage for demo purposes. For production:

1. Set up a database (PostgreSQL, MongoDB, etc.)
2. Add Prisma or another ORM:
```bash
npm install prisma @prisma/client
npx prisma init
```

3. Define your schema:
```prisma
model DiaryEntry {
  id          String   @id @default(cuid())
  userId      String
  date        DateTime
  mood        Int
  sleepHours  Float
  workHours   Float
  outdoorHours Float
  meals       String?
  activities  String?
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

4. Update API routes to use database

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
