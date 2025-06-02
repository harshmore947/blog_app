# Modern Blog Application

A full-stack blog platform built with Next.js 14, featuring a modern UI, real-time interactions, and a robust backend.

![Blog App Banner](public/banner.png)

## Features

- 🔐 **Authentication & Authorization**

  - Secure user authentication with Clerk
  - Role-based access control
  - Protected routes and API endpoints

- 📝 **Article Management**

  - Create, edit, and delete articles
  - Rich text editing
  - Image upload support
  - Category organization
  - Draft and publish workflow

- 💫 **Interactive Features**

  - Real-time likes and comments
  - Social sharing
  - User profiles
  - Article search and filtering

- 🎨 **Modern UI/UX**
  - Responsive design
  - Dark mode support
  - Clean and professional layout
  - Loading states and animations
  - Built with shadcn/ui components

## Tech Stack

- **Frontend**

  - Next.js 14 (App Router)
  - React
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - Lucide Icons

- **Backend**

  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL
  - Server Actions

- **Authentication**

  - Clerk

- **Deployment**
  - Vercel (Frontend & API)
  - Supabase (PostgreSQL)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm or yarn
- Clerk account

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/blog_app.git
cd blog_app
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables

```bash
# Create a .env file and add:
DATABASE_URL="your_postgresql_url"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
```

4. Run database migrations

```bash
npx prisma migrate dev
```

5. Start the development server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
blog_app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── articles/          # Article pages
│   └── dashboard/         # Dashboard pages
├── components/            # React components
├── lib/                   # Utility functions
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## API Routes

- `GET /api/articles` - Get all articles
- `GET /api/articles/[id]` - Get single article
- `POST /api/articles` - Create article
- `PUT /api/articles/[id]` - Update article
- `DELETE /api/articles/[id]` - Delete article

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.dev/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

