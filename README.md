# Syntax Saga – A Kids‑Friendly Coding Game

## Overview

Syntax Saga is a playful, visual game that teaches core programming concepts. Kids sequence commands to move a seahorse through 3D ocean levels, collect items, and reach goals—learning about order of operations, directions, and simple logic along the way.

## Key Features
- Friendly drag‑and‑drop command blocks (forward, turnLeft, turnRight, wait, etc.)
- Live 3D scene rendered with React Three Fiber
- Instant code preview of the generated Python for each sequence
- Progressive levels with simple constraints and visual feedback
- Lightweight UI components and consistent, accessible styles

## Tech Stack
- Next.js (App Router)
- React, TypeScript
- React Three Fiber + drei for 3D
- Shadcn/ui components for UI controls

## Project Structure

```
app/
  game/
    level1/
      page.tsx          # Level 1: forward steps and bounds
      quiz/             # Level 1 quiz page
    Level2/
      page.tsx          # Level 2: path turning + coin pickup
      quiz/             # Level 2 quiz page
    level3/
      page.tsx          # Level 3: key + door + goal
  api/
    generate-quiz/      # Quiz generation endpoint
components/
  AnimatedSeahorse.tsx
  CodeDisplay.tsx
  ProgrammingBar.tsx     # Drag/drop commands and sequencing
  ui/                    # Reusable UI primitives
lib/
  codeGenerator.ts       # Converts commands → Python code
  firebase.ts            # Firebase client init (if used)
  auth.ts                # Auth helpers (if used)
public/
  *.glb                  # 3D models
  images/*
```

## Gameplay
- Build a sequence of commands in the Programming Bar and run it.
- The seahorse follows your program step by step in the 3D scene.
- If you go out of bounds or off the tiles, the game stops with a friendly error.
- Complete the objective to finish the level, then take a short quiz.

### Levels
- Level 1: Move forward a limited number of steps without falling off.
- Level 2: Follow a tiled path, turn at the right time, and collect a coin.
- Level 3: Find a key, open the door, and reach the goal.

## Local Setup

1) Requirements
- Node.js 18+
- pnpm or npm

2) Install dependencies
```
npm install
```

3) Environment variables
Create one of the following at the project root (choose what you prefer for local dev):
- `.env.local` (recommended) or `.env`

Add keys as needed. Example:
```
# Firebase (client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_APP_ID=1:xxxxxxxxxxxx:web:xxxxxxxxxxxxxxxx
# Optional
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

4) Start the dev server
```
npm run dev
```

## Commands
- `npm run dev` – Start development server
- `npm run build` – Production build
- `npm run start` – Start built app locally

## Conventions
- Use descriptive variable names; prefer readability over cleverness
- Keep components small and focused; colocate logic with UI when obvious
- Avoid deep nesting; use early returns and clear branches

## Privacy & Secrets
- Secrets should live in `.env.local` or `.env`, which are ignored by git. Example files like `.env.example` may be committed for reference but must not contain real keys.

## Notes
- 3D models are stored in `public/` and preloaded in levels for smoother experience.
- If you change environment variables, fully restart the dev server so changes take effect.