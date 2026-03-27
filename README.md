# Telegram Clone

A modern, real-time Telegram-inspired chat application built with **Next.js 16**, **React 19**, **Prisma**, **PostgreSQL**, and **Better Auth**.  
The app is designed to feel fast, polished, and production-ready, with optimistic UI updates, live messaging, media support, and a strong focus on usability.

---

## Features

### Messaging
- Send, edit, and delete messages
- Image support
- Optimistic updates powered by **React Query**
- Real-time message delivery
- Reaction support

### Conversations
- Create conversations
- Delete conversations
- Leave conversations
- Private and group chats
- Conversation previews with last message data
- Read/unread state per member

### Presence and Live Updates
- Online/offline status
- Live conversation and message updates through **Pusher**
- Smooth real-time synchronization across clients

### Authentication
- Authentication powered by **Better Auth**
- Secure user sessions
- Seeded test accounts for quick local testing

### UI / UX
- Built with **shadcn/ui** and **Tailwind CSS**
- Light and dark theme support
- Clean, accessible interface
- Smooth animations with **Framer Motion**
- Responsive layout for desktop and mobile
- Better performance with virtualized message rendering

---

## Tech Stack

- **Framework:** Next.js 16
- **UI:** React 19, shadcn/ui, Tailwind CSS, Framer Motion
- **State/Data:** TanStack React Query, Jotai
- **Auth:** Better Auth
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Real-time:** Pusher
- **File Uploads:** Cloudinary
- **Forms & Validation:** React Hook Form, Zod
- **Icons:** Lucide React

---

## Project Highlights

This project was built with production-style structure in mind:

- server and client logic are separated cleanly
- database operations are handled through Prisma
- optimistic UI keeps interactions snappy
- real-time events keep users in sync
- accessible components and theme-aware styling improve the overall UX

The interface is intentionally designed to feel modern and refined, with attention to spacing, motion, and consistency across both light and dark modes.

---

## Getting Started

### 1. Install dependencies

```bash
bun install
```

### 2. Set up environment variables

Create a `.env` file in the root of the project and add the required variables for:

- PostgreSQL / Neon database
- Better Auth
- Pusher
- Cloudinary

Example structure:

```env
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_CLUSTER=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

> The exact values depend on your deployment and local setup.

### 3. Generate Prisma client

```bash
bun run db:generate
```

### 4. Push the database schema

```bash
bun run db:push
```

### 5. Seed the database

```bash
bun run db:seed
```

### 6. Start the app

```bash
bun run dev
```

---

## Available Scripts

```bash
bun run dev           # Start development server
bun run build         # Build for production
bun run start         # Start production server
bun run lint          # Run ESLint
bun run db:generate   # Generate Prisma client
bun run db:push       # Push Prisma schema to database
bun run db:studio    # Open Prisma Studio
bun run db:seed      # Seed the database
bun run generate-barrels # Generate barrel exports
```

---

## Seeded Test Users

The project includes built-in users so you can fully test the app right away.

Use these credentials:

```text
Email: user1@example.com
Password: password123
```

```text
Email: user2@example.com
Password: password123
```

```text
Email: user3@example.com
Password: password123
```

```text
Email: user4@example.com
Password: password123
```

```text
Email: user5@example.com
Password: password123
```

```text
Email: user6@example.com
Password: password123
```

```text
Email: user7@example.com
Password: password123
```

```text
Email: user8@example.com
Password: password123
```

```text
Email: user9@example.com
Password: password123
```

```text
Email: user10@example.com
Password: password123
```

---

## Seed Data

The seed script creates:
- 10 users
- 10 conversations
- conversation members
- seeded messages with timestamps
- per-member read states
- message reactions

This gives you enough data to test:
- chat lists
- unread indicators
- live updates
- reactions
- group and private conversation behavior

---

## Design Notes

- **Shadcn/ui** components are used with theme-aware styling for both light and dark modes.
- Animations are kept smooth and subtle to support usability instead of distracting from content.
- Interactive elements are designed with accessibility in mind, including keyboard-friendly behavior and clear visual states.
- Long message lists are optimized for better rendering performance.

---

## License

This project is currently private.

---

## Acknowledgements

Built as a full-featured messaging platform focused on real-time UX, clean architecture, and scalable foundations.
