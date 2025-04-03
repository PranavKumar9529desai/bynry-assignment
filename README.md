# Bynry Assignment

A modern web application built with Next.js 15, featuring user profiles and map integration. View the live demo at [https://bynry-assignment-one.vercel.app/](https://bynry-assignment-one.vercel.app/)

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (React Framework)
- **Database:** [Neon Postgres](https://neon.tech/) (Serverless Postgres)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/) for type-safe database operations
- **Styling:** Tailwind CSS
- **Maps:** Leaflet for interactive map integration
- **Deployment:** Vercel

## Features

- User profile management
- Interactive map view with location markers
- Server-side rendering for optimal performance
- Responsive design for all device sizes
- Type-safe database operations with Drizzle ORM

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
# Create a .env.local file with:
DATABASE_URL=your_neon_postgres_connection_string
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Schema

The project uses Drizzle ORM with Neon Postgres. Schema migrations are handled automatically through Drizzle Kit.

To run database migrations:
```bash
npm run db:push
```

## Project Structure

```
src/
├── app/
│   ├── components/    # Reusable React components
│   ├── profiles/      # Profile-related pages
│   └── api/          # API routes
├── db/               # Database configuration and schemas
└── lib/              # Utility functions and shared logic
```

## Deployment

The application is deployed on [Vercel](https://vercel.com) with automatic deployments on every push to the main branch.

Live demo: [https://bynry-assignment-one.vercel.app/](https://bynry-assignment-one.vercel.app/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
