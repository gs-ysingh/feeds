# Instagram-like Feed App (React + TypeScript + Vite + GraphQL)

This project is a performant, accessible Instagram-like feed built with React, TypeScript, Vite, and a Node.js GraphQL backend (Apollo Server).

## Features

- Cursor-based pagination (GraphQL)
- Infinite scrolling (IntersectionObserver)
- List virtualization
- Lazy loading images
- Rich text rendering
- Performance optimizations
- Accessibility (ARIA, keyboard navigation)
- Error boundaries and loading states

## Getting Started

### 1. Install dependencies (root and server)

```sh
npm install
cd server && npm install
```

### 2. Start the GraphQL backend

```sh
cd server
npm start
```

The backend will run at [http://localhost:4000/](http://localhost:4000/)

### 3. Start the React frontend

Open a new terminal in the project root:

```sh
npm run dev
```

The frontend will run at [http://localhost:5173/](http://localhost:5173/) (or similar)

### 4. Open the app in your browser

- Visit [http://localhost:5173/](http://localhost:5173/) to use the app.

## Project Structure

- `src/` — React app source code
- `server/` — Node.js GraphQL backend
- `.github/copilot-instructions.md` — Copilot custom instructions

## Notes

- The frontend expects the backend to be running at `http://localhost:4000/`.
- You can customize the GraphQL schema and mock data in `server/`.
- For production, use a real database and secure the backend.

---

Built with ❤️ using Vite + React + TypeScript + Apollo Server.
