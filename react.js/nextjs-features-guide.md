# Next.js Features Guide: Making React Development Easier

## Table of Contents
1. [Introduction](#introduction)
2. [File-Based Routing](#file-based-routing)
3. [Server-Side Rendering (SSR)](#server-side-rendering-ssr)
4. [Static Site Generation (SSG)](#static-site-generation-ssg)
5. [API Routes](#api-routes)
6. [Image Optimization](#image-optimization)
7. [App Router (Next.js 13+)](#app-router-nextjs-13)
8. [Server Components](#server-components)
9. [Streaming and Suspense](#streaming-and-suspense)
10. [Data Fetching](#data-fetching)
11. [Middleware](#middleware)
12. [Built-in CSS Support](#built-in-css-support)
13. [Font Optimization](#font-optimization)
14. [Metadata Management](#metadata-management)
15. [Environment Variables](#environment-variables)
16. [Performance Features](#performance-features)
17. [Incremental Static Regeneration (ISR)](#incremental-static-regeneration-isr)
18. [TypeScript Support](#typescript-support)
19. [Deployment](#deployment)
20. [Best Practices](#best-practices)

---

## Introduction

**Next.js** is a React framework that provides a comprehensive solution for building production-ready web applications. It abstracts away many configuration complexities while offering powerful features out of the box.

### Why Next.js Makes React Easier

- **Zero Configuration**: Get started immediately without complex webpack/babel setup
- **Built-in Routing**: No need for react-router configuration
- **Automatic Code Splitting**: Optimized bundle sizes by default
- **SEO Friendly**: Server-side rendering out of the box
- **API Development**: Build full-stack applications in one codebase
- **Performance Optimized**: Image, font, and script optimizations included
- **Great Developer Experience**: Fast refresh, TypeScript support, and excellent error messages

### Installation

```bash
# Create a new Next.js app
npx create-next-app@latest my-app

# With TypeScript
npx create-next-app@latest my-app --typescript

# Navigate to project
cd my-app

# Start development server
npm run dev
```

---

## File-Based Routing

### Overview
Next.js uses a file-system based router where folders and files in the `pages` (Pages Router) or `app` (App Router) directory automatically become routes.

### Pages Router (Traditional)

**Directory Structure:**
```
pages/
├── index.js          → /
├── about.js          → /about
├── blog/
│   ├── index.js      → /blog
│   ├── [slug].js     → /blog/:slug
│   └── [...all].js   → /blog/* (catch-all)
└── api/
    └── users.js      → /api/users
```

**Example: Static Route**
```javascript
// pages/about.js
export default function About() {
  return (
    <div>
      <h1>About Page</h1>
      <p>This is automatically routed to /about</p>
    </div>
  );
}
```

**Example: Dynamic Route**
```javascript
// pages/blog/[slug].js
import { useRouter } from 'next/router';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;

  return <h1>Blog Post: {slug}</h1>;
}
```

**Example: Catch-All Route**
```javascript
// pages/blog/[...slug].js
import { useRouter } from 'next/router';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query; // slug is an array
  
  return (
    <div>
      <h1>Dynamic Route</h1>
      <p>Path segments: {slug?.join('/')}</p>
    </div>
  );
}
// Matches: /blog/a, /blog/a/b, /blog/a/b/c, etc.
```

### Navigation

**Using Link Component:**
```javascript
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/blog/my-post">Blog Post</Link>
      
      {/* With dynamic routes */}
      <Link href={`/blog/${postId}`}>
        Dynamic Link
      </Link>
      
      {/* With query parameters */}
      <Link href={{
        pathname: '/blog/[slug]',
        query: { slug: 'my-post', category: 'tech' }
      }}>
        Blog with Query
      </Link>
    </nav>
  );
}
```

**Programmatic Navigation:**
```javascript
import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();

  const handleNavigation = () => {
    router.push('/dashboard');
    // router.replace('/dashboard'); // No history entry
    // router.back(); // Go back
    // router.reload(); // Reload page
  };

  return <button onClick={handleNavigation}>Navigate</button>;
}
```

### App Router (Next.js 13+)

**Directory Structure:**
```
app/
├── page.js           → /
├── layout.js         → Root layout
├── about/
│   └── page.js       → /about
├── blog/
│   ├── page.js       → /blog
│   ├── [slug]/
│   │   └── page.js   → /blog/:slug
│   └── layout.js     → Blog layout
└── api/
    └── users/
        └── route.js  → /api/users
```

**Special Files in App Router:**
- `page.js` - Defines a route's UI
- `layout.js` - Shared UI for a segment and its children
- `loading.js` - Loading UI
- `error.js` - Error UI
- `not-found.js` - 404 UI
- `template.js` - Re-rendered layout
- `route.js` - API endpoint

---

## Server-Side Rendering (SSR)

### Overview
SSR renders pages on the server for each request, providing fresh data and better SEO.

### getServerSideProps (Pages Router)

```javascript
// pages/products.js
export default function Products({ products }) {
  return (
    <div>
      <h1>Products (Server-Side Rendered)</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps(context) {
  // Runs on every request
  const { req, res, query, params } = context;
  
  // Fetch data from API
  const response = await fetch('https://api.example.com/products');
  const products = await response.json();
  
  // Pass data to page component as props
  return {
    props: {
      products,
    },
  };
}
```

### With Authentication

```javascript
export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession(req);
  
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  
  const userData = await fetchUserData(session.user.id);
  
  return {
    props: {
      user: userData,
    },
  };
}
```

### Error Handling

```javascript
export async function getServerSideProps(context) {
  try {
    const data = await fetchData();
    return { props: { data } };
  } catch (error) {
    return {
      notFound: true, // Returns 404 page
    };
  }
}
```

### App Router SSR

```javascript
// app/products/page.js
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    cache: 'no-store', // Disable caching for SSR
  });
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();
  
  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Static Site Generation (SSG)

### Overview
SSG generates HTML at build time, resulting in faster page loads and better performance.

### getStaticProps (Pages Router)

```javascript
// pages/blog/index.js
export default function Blog({ posts }) {
  return (
    <div>
      <h1>Blog Posts (Static)</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}

export async function getStaticProps() {
  // Runs at build time
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();
  
  return {
    props: {
      posts,
    },
    revalidate: 60, // ISR: Revalidate every 60 seconds
  };
}
```

### Dynamic Static Pages

```javascript
// pages/blog/[slug].js
export default function BlogPost({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}

// Define which paths to pre-render
export async function getStaticPaths() {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();
  
  const paths = posts.map(post => ({
    params: { slug: post.slug },
  }));
  
  return {
    paths,
    fallback: false, // 404 for non-existent paths
    // fallback: true, // Generate on first request
    // fallback: 'blocking', // SSR on first request
  };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://api.example.com/posts/${params.slug}`);
  const post = await res.json();
  
  return {
    props: {
      post,
    },
    revalidate: 3600, // Revalidate every hour
  };
}
```

### Fallback Handling

```javascript
import { useRouter } from 'next/router';

export default function BlogPost({ post }) {
  const router = useRouter();
  
  // If fallback is true, show loading state
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  
  return <article>{/* render post */}</article>;
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { slug: 'post-1' } },
      { params: { slug: 'post-2' } },
    ],
    fallback: true, // Generate other pages on demand
  };
}
```

### App Router SSG

```javascript
// app/blog/[slug]/page.js
async function getPost(slug) {
  const res = await fetch(`https://api.example.com/posts/${slug}`, {
    next: { revalidate: 3600 }, // Revalidate every hour
  });
  return res.json();
}

export async function generateStaticParams() {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();
  
  return posts.map(post => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

---

## API Routes

### Overview
Next.js allows you to create API endpoints within your application, eliminating the need for a separate backend server.

### Basic API Route

```javascript
// pages/api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello World' });
}
```

### HTTP Methods

```javascript
// pages/api/users.js
export default async function handler(req, res) {
  const { method } = req;
  
  switch (method) {
    case 'GET':
      // Handle GET request
      const users = await fetchUsers();
      res.status(200).json(users);
      break;
      
    case 'POST':
      // Handle POST request
      const { name, email } = req.body;
      const newUser = await createUser(name, email);
      res.status(201).json(newUser);
      break;
      
    case 'PUT':
      // Handle PUT request
      const updatedUser = await updateUser(req.body);
      res.status(200).json(updatedUser);
      break;
      
    case 'DELETE':
      // Handle DELETE request
      await deleteUser(req.query.id);
      res.status(204).end();
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
```

### Dynamic API Routes

```javascript
// pages/api/users/[id].js
export default async function handler(req, res) {
  const { id } = req.query;
  
  if (req.method === 'GET') {
    const user = await getUserById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(user);
  }
}
```

### Request Parsing

```javascript
// pages/api/upload.js
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req, res) {
  // Access query parameters
  const { id } = req.query;
  
  // Access request body (JSON)
  const { name, email } = req.body;
  
  // Access headers
  const auth = req.headers.authorization;
  
  // Access cookies
  const token = req.cookies.token;
  
  res.status(200).json({ success: true });
}
```

### Middleware Pattern

```javascript
// lib/middleware.js
export function withAuth(handler) {
  return async (req, res) => {
    const token = req.headers.authorization;
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const user = await verifyToken(token);
      req.user = user;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

// pages/api/protected.js
import { withAuth } from '@/lib/middleware';

async function handler(req, res) {
  // req.user is available here
  res.status(200).json({ user: req.user });
}

export default withAuth(handler);
```

### App Router API Routes

```javascript
// app/api/users/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  const users = await fetchUsers();
  return NextResponse.json(users);
}

export async function POST(request) {
  const body = await request.json();
  const newUser = await createUser(body);
  
  return NextResponse.json(newUser, { status: 201 });
}
```

### Dynamic API Routes (App Router)

```javascript
// app/api/users/[id]/route.js
export async function GET(request, { params }) {
  const user = await getUserById(params.id);
  
  if (!user) {
    return new Response('Not Found', { status: 404 });
  }
  
  return Response.json(user);
}

export async function DELETE(request, { params }) {
  await deleteUser(params.id);
  return new Response(null, { status: 204 });
}
```

---

## Image Optimization

### Overview
Next.js provides automatic image optimization through the `next/image` component, handling resizing, optimization, and lazy loading.

### Basic Usage

```javascript
import Image from 'next/image';

export default function Profile() {
  return (
    <Image
      src="/profile.jpg"
      alt="Profile Picture"
      width={500}
      height={500}
    />
  );
}
```

### Remote Images

```javascript
import Image from 'next/image';

export default function Avatar() {
  return (
    <Image
      src="https://example.com/avatar.jpg"
      alt="Avatar"
      width={200}
      height={200}
    />
  );
}
```

**Configuration for remote images:**
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['example.com', 'cdn.example.com'],
    // Or use remotePatterns for more control
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};
```

### Fill Mode (Responsive)

```javascript
import Image from 'next/image';

export default function Banner() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <Image
        src="/banner.jpg"
        alt="Banner"
        fill
        style={{ objectFit: 'cover' }}
        priority // Load immediately (above fold)
      />
    </div>
  );
}
```

### Priority Loading

```javascript
// For images above the fold (LCP - Largest Contentful Paint)
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
/>
```

### Responsive Images

```javascript
import Image from 'next/image';

export default function ResponsiveImage() {
  return (
    <Image
      src="/photo.jpg"
      alt="Photo"
      width={800}
      height={600}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      style={{ width: '100%', height: 'auto' }}
    />
  );
}
```

### Quality and Format

```javascript
<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  quality={75} // Default is 75 (1-100)
  placeholder="blur" // Show blur while loading
  blurDataURL="/placeholder.jpg" // Custom placeholder
/>
```

### Blur Placeholder (Static Import)

```javascript
import Image from 'next/image';
import profilePic from '../public/profile.jpg';

export default function Profile() {
  return (
    <Image
      src={profilePic}
      alt="Profile"
      placeholder="blur" // Automatically generated
    />
  );
}
```

### Advanced Configuration

```javascript
// next.config.js
module.exports = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};
```

---

## App Router (Next.js 13+)

### Overview
The App Router is the new routing paradigm in Next.js 13+ built on React Server Components, providing improved performance and developer experience.

### Layouts

```javascript
// app/layout.js - Root Layout (Required)
export const metadata = {
  title: 'My App',
  description: 'App description',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>{/* Navigation */}</nav>
        </header>
        <main>{children}</main>
        <footer>{/* Footer */}</footer>
      </body>
    </html>
  );
}
```

**Nested Layouts:**
```javascript
// app/dashboard/layout.js
export default function DashboardLayout({ children }) {
  return (
    <div>
      <aside>
        {/* Dashboard Sidebar */}
      </aside>
      <section>{children}</section>
    </div>
  );
}
```

### Loading UI

```javascript
// app/dashboard/loading.js
export default function Loading() {
  return (
    <div>
      <p>Loading dashboard...</p>
      <Spinner />
    </div>
  );
}
```

### Error Handling

```javascript
// app/dashboard/error.js
'use client'; // Error components must be Client Components

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### Not Found Page

```javascript
// app/dashboard/not-found.js
export default function NotFound() {
  return (
    <div>
      <h2>Dashboard Not Found</h2>
      <p>Could not find the requested resource</p>
    </div>
  );
}
```

**Triggering 404:**
```javascript
// app/dashboard/[id]/page.js
import { notFound } from 'next/navigation';

export default async function Page({ params }) {
  const data = await fetchData(params.id);
  
  if (!data) {
    notFound(); // Renders not-found.js
  }
  
  return <div>{/* render data */}</div>;
}
```

### Templates

```javascript
// app/dashboard/template.js
// Re-renders on navigation (unlike layouts)
export default function Template({ children }) {
  return (
    <div className="fade-in">
      {children}
    </div>
  );
}
```

### Route Groups

```javascript
// Organize without affecting URL structure
app/
├── (marketing)/
│   ├── layout.js    // Marketing layout
│   ├── page.js      // / (home)
│   └── about/
│       └── page.js  // /about
└── (shop)/
    ├── layout.js    // Shop layout
    ├── products/
    │   └── page.js  // /products
    └── cart/
        └── page.js  // /cart
```

### Parallel Routes

```javascript
// app/dashboard/layout.js
export default function Layout({ children, analytics, notifications }) {
  return (
    <div>
      <div>{children}</div>
      <div>{analytics}</div>
      <div>{notifications}</div>
    </div>
  );
}

// Directory structure:
// app/dashboard/
// ├── @analytics/
// │   └── page.js
// ├── @notifications/
// │   └── page.js
// └── page.js
```

### Intercepting Routes

```javascript
// Show modal when navigating to photo, full page on direct visit
app/
├── photo/
│   └── [id]/
│       └── page.js      // /photo/123
└── feed/
    ├── (..)photo/       // Intercepts when from /feed
    │   └── [id]/
    │       └── page.js  // Modal
    └── page.js          // /feed
```

---

## Server Components

### Overview
React Server Components (RSC) render on the server by default in the App Router, improving performance and reducing bundle size.

### Server Component (Default)

```javascript
// app/products/page.js
// This is a Server Component by default
async function getProducts() {
  const res = await fetch('https://api.example.com/products');
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();
  
  return (
    <div>
      <h1>Products</h1>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Client Component

```javascript
// components/AddToCart.js
'use client'; // Mark as Client Component

import { useState } from 'react';

export default function AddToCart({ productId }) {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setCount(count + 1);
    // Add to cart logic
  };
  
  return (
    <button onClick={handleClick}>
      Add to Cart ({count})
    </button>
  );
}
```

### Mixing Server and Client Components

```javascript
// app/products/[id]/page.js - Server Component
import AddToCart from '@/components/AddToCart'; // Client Component

async function getProduct(id) {
  const res = await fetch(`https://api.example.com/products/${id}`);
  return res.json();
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>
      
      {/* Client Component for interactivity */}
      <AddToCart productId={product.id} />
    </div>
  );
}
```

### Benefits of Server Components

1. **Data Fetching**: Direct database/API access without exposing credentials
```javascript
// Server Component - Direct DB access
import { db } from '@/lib/database';

export default async function Users() {
  const users = await db.users.findMany();
  return <ul>{/* render users */}</ul>;
}
```

2. **Reduced Bundle Size**: Dependencies stay on server
```javascript
// Server Component - Large dependencies don't go to client
import { marked } from 'marked'; // Stays on server
import fs from 'fs'; // Node.js APIs available

export default async function BlogPost({ slug }) {
  const content = fs.readFileSync(`posts/${slug}.md`, 'utf-8');
  const html = marked(content);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

3. **Streaming**: Progressive rendering
```javascript
// app/dashboard/page.js
import { Suspense } from 'react';

async function SlowData() {
  const data = await fetchSlowData();
  return <div>{data}</div>;
}

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<Loading />}>
        <SlowData />
      </Suspense>
    </div>
  );
}
```

### When to Use Client Components

Use `'use client'` when you need:
- **Interactivity**: onClick, onChange, etc.
- **State**: useState, useReducer
- **Effects**: useEffect, useLayoutEffect
- **Browser APIs**: localStorage, window, document
- **Custom Hooks**: Any hook that uses the above
- **Class Components**: React.Component

```javascript
'use client';

import { useState, useEffect } from 'react';

export default function InteractiveComponent() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Fetch data on client side
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []);
  
  return <div>{/* render data */}</div>;
}
```

---

## Streaming and Suspense

### Overview
Streaming allows you to progressively render UI, showing content as it becomes available rather than waiting for everything.

### Basic Suspense

```javascript
// app/page.js
import { Suspense } from 'react';

async function DataComponent() {
  const data = await fetchData(); // Async fetch
  return <div>{data}</div>;
}

export default function Page() {
  return (
    <div>
      <h1>My Page</h1>
      <Suspense fallback={<div>Loading data...</div>}>
        <DataComponent />
      </Suspense>
    </div>
  );
}
```

### Multiple Suspense Boundaries

```javascript
import { Suspense } from 'react';

async function UserData() {
  const user = await fetchUser();
  return <div>{user.name}</div>;
}

async function PostsData() {
  const posts = await fetchPosts();
  return <ul>{posts.map(/* render posts */)}</ul>;
}

async function CommentsData() {
  const comments = await fetchComments();
  return <ul>{comments.map(/* render comments */)}</ul>;
}

export default function Dashboard() {
  return (
    <div>
      <Suspense fallback={<div>Loading user...</div>}>
        <UserData />
      </Suspense>
      
      <Suspense fallback={<div>Loading posts...</div>}>
        <PostsData />
      </Suspense>
      
      <Suspense fallback={<div>Loading comments...</div>}>
        <CommentsData />
      </Suspense>
    </div>
  );
}
```

### Automatic Loading UI

```javascript
// app/dashboard/loading.js
export default function Loading() {
  return <div>Loading dashboard...</div>;
}

// Automatically wraps page.js in Suspense
```

### Nested Loading States

```javascript
// app/dashboard/layout.js
export default function Layout({ children }) {
  return (
    <div>
      <Sidebar />
      {children}
    </div>
  );
}

// app/dashboard/loading.js - for /dashboard
export default function DashboardLoading() {
  return <div>Loading dashboard...</div>;
}

// app/dashboard/analytics/loading.js - for /dashboard/analytics
export default function AnalyticsLoading() {
  return <div>Loading analytics...</div>;
}
```

### Streaming with Skeleton UI

```javascript
// components/Skeleton.js
export function PostSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}

// app/blog/page.js
import { Suspense } from 'react';
import { PostSkeleton } from '@/components/Skeleton';

async function Posts() {
  const posts = await fetchPosts();
  return <div>{/* render posts */}</div>;
}

export default function Blog() {
  return (
    <Suspense fallback={<PostSkeleton />}>
      <Posts />
    </Suspense>
  );
}
```

---

## Data Fetching

### Overview
Next.js provides multiple ways to fetch data depending on your needs: server-side, static, or client-side.

### Server Component Data Fetching

```javascript
// app/posts/page.js
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();
  
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
        </article>
      ))}
    </div>
  );
}
```

### Caching Options

```javascript
// Force cache (default)
fetch('https://api.example.com/data', { cache: 'force-cache' });

// No caching (SSR)
fetch('https://api.example.com/data', { cache: 'no-store' });

// Revalidate after time
fetch('https://api.example.com/data', { 
  next: { revalidate: 60 } // 60 seconds
});

// Revalidate by tag
fetch('https://api.example.com/data', { 
  next: { tags: ['posts'] }
});
```

### Parallel Data Fetching

```javascript
async function getUser() {
  const res = await fetch('https://api.example.com/user');
  return res.json();
}

async function getPosts() {
  const res = await fetch('https://api.example.com/posts');
  return res.json();
}

export default async function Dashboard() {
  // Fetch in parallel
  const [user, posts] = await Promise.all([
    getUser(),
    getPosts(),
  ]);
  
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <Posts posts={posts} />
    </div>
  );
}
```

### Sequential Data Fetching

```javascript
async function getUser(id) {
  const res = await fetch(`https://api.example.com/users/${id}`);
  return res.json();
}

async function getUserPosts(userId) {
  const res = await fetch(`https://api.example.com/users/${userId}/posts`);
  return res.json();
}

export default async function UserProfile({ params }) {
  // Fetch sequentially when needed
  const user = await getUser(params.id);
  const posts = await getUserPosts(user.id);
  
  return (
    <div>
      <h1>{user.name}</h1>
      <Posts posts={posts} />
    </div>
  );
}
```

### Blocking vs Non-Blocking Data

```javascript
import { Suspense } from 'react';

async function CriticalData() {
  const data = await fetchCriticalData();
  return <div>{data}</div>;
}

async function NonCriticalData() {
  const data = await fetchNonCriticalData();
  return <div>{data}</div>;
}

export default function Page() {
  return (
    <div>
      {/* Blocks rendering */}
      <CriticalData />
      
      {/* Doesn't block, streams in */}
      <Suspense fallback={<div>Loading...</div>}>
        <NonCriticalData />
      </Suspense>
    </div>
  );
}
```

### Deduplication

```javascript
// Automatic request deduplication
// All three calls make only ONE request
async function getUser() {
  return fetch('https://api.example.com/user');
}

export default async function Page() {
  const user1 = await getUser(); // Makes request
  const user2 = await getUser(); // Deduped
  const user3 = await getUser(); // Deduped
  
  return <div>{/* render */}</div>;
}
```

### Revalidation

**Time-based Revalidation:**
```javascript
// pages/posts.js (Pages Router)
export async function getStaticProps() {
  const posts = await fetchPosts();
  
  return {
    props: { posts },
    revalidate: 60, // Revalidate every 60 seconds
  };
}
```

**On-demand Revalidation:**
```javascript
// pages/api/revalidate.js
export default async function handler(req, res) {
  try {
    await res.revalidate('/posts');
    await res.revalidate('/posts/my-post');
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}
```

**Tag-based Revalidation (App Router):**
```javascript
// app/posts/page.js
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { tags: ['posts'] },
  });
  return res.json();
}

// app/api/revalidate/route.js
import { revalidateTag } from 'next/cache';

export async function POST() {
  revalidateTag('posts');
  return Response.json({ revalidated: true });
}
```

### Client-Side Data Fetching

```javascript
'use client';

import { useState, useEffect } from 'react';

export default function ClientData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return <div>{data.value}</div>;
}
```

### Using SWR (Recommended for Client-Side)

```javascript
'use client';

import useSWR from 'swr';

const fetcher = url => fetch(url).then(r => r.json());

export default function Profile() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher);
  
  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;
  
  return <div>Hello {data.name}!</div>;
}
```

---

## Middleware

### Overview
Middleware runs before a request is completed, allowing you to modify the response, redirect, rewrite, or add headers.

### Basic Middleware

```javascript
// middleware.js (root of project)
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Log the request
  console.log('Request:', request.url);
  
  // Continue to the requested page
  return NextResponse.next();
}

// Specify which routes to run middleware on
export const config = {
  matcher: '/dashboard/:path*',
};
```

### Authentication Middleware

```javascript
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token');
  
  // Redirect to login if no token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Continue if authenticated
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};
```

### Rewriting URLs

```javascript
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Rewrite /old-blog/* to /blog/*
  if (request.nextUrl.pathname.startsWith('/old-blog')) {
    return NextResponse.rewrite(
      new URL(request.nextUrl.pathname.replace('/old-blog', '/blog'), request.url)
    );
  }
  
  return NextResponse.next();
}
```

### Adding Headers

```javascript
import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();
  
  // Add custom headers
  response.headers.set('x-custom-header', 'my-value');
  response.headers.set('x-request-time', Date.now().toString());
  
  return response;
}
```

### Setting Cookies

```javascript
import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();
  
  // Set a cookie
  response.cookies.set('theme', 'dark', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
  
  return response;
}
```

### Geolocation

```javascript
import { NextResponse } from 'next/server';

export function middleware(request) {
  const country = request.geo?.country || 'US';
  
  // Redirect based on country
  if (country === 'GB') {
    return NextResponse.redirect(new URL('/en-gb', request.url));
  }
  
  return NextResponse.next();
}
```

### A/B Testing

```javascript
import { NextResponse } from 'next/server';

export function middleware(request) {
  const bucket = request.cookies.get('bucket');
  
  if (!bucket) {
    // Assign random variant
    const variant = Math.random() < 0.5 ? 'a' : 'b';
    const response = NextResponse.next();
    response.cookies.set('bucket', variant);
    return response;
  }
  
  return NextResponse.next();
}
```

### Conditional Middleware

```javascript
import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl;
  
  // Different logic for different paths
  if (url.pathname.startsWith('/api')) {
    // API middleware
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey) {
      return new NextResponse('API key required', { status: 401 });
    }
  } else if (url.pathname.startsWith('/admin')) {
    // Admin middleware
    const isAdmin = checkAdminStatus(request);
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }
  
  return NextResponse.next();
}
```

### Multiple Matchers

```javascript
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

## Built-in CSS Support

### Overview
Next.js supports various CSS methodologies out of the box without additional configuration.

### Global Styles

```javascript
// app/layout.js
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

```css
/* app/globals.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

### CSS Modules

```css
/* components/Button.module.css */
.button {
  padding: 10px 20px;
  background-color: blue;
  color: white;
  border: none;
  border-radius: 4px;
}

.button:hover {
  background-color: darkblue;
}

.primary {
  background-color: green;
}
```

```javascript
// components/Button.js
import styles from './Button.module.css';

export default function Button({ primary, children }) {
  return (
    <button className={primary ? styles.primary : styles.button}>
      {children}
    </button>
  );
}
```

### Sass Support

```bash
npm install sass
```

```scss
// styles/variables.scss
$primary-color: #0070f3;
$secondary-color: #7928ca;

// components/Card.module.scss
@import '../styles/variables';

.card {
  padding: 20px;
  border: 1px solid $primary-color;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .title {
    color: $primary-color;
  }
}
```

### CSS-in-JS (Styled JSX)

```javascript
export default function StyledComponent() {
  return (
    <div>
      <h1>Hello</h1>
      
      <style jsx>{`
        h1 {
          color: blue;
          font-size: 24px;
        }
      `}</style>
      
      {/* Global styles */}
      <style jsx global>{`
        body {
          margin: 0;
        }
      `}</style>
    </div>
  );
}
```

### Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```javascript
// components/Card.js
export default function Card() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-bold text-gray-800">Card Title</h2>
      <p className="mt-2 text-gray-600">Card content</p>
    </div>
  );
}
```

### PostCSS

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
      features: {
        'custom-properties': false,
      },
    },
  },
};
```

---

## Font Optimization

### Overview
Next.js automatically optimizes fonts with the `next/font` package, eliminating external network requests and improving performance.

### Google Fonts

```javascript
// app/layout.js
import { Inter, Roboto, Playfair_Display } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

### Multiple Fonts

```javascript
// app/layout.js
import { Inter } from 'next/font/google';
import { Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

```css
/* globals.css */
body {
  font-family: var(--font-inter);
}

code {
  font-family: var(--font-roboto-mono);
}
```

### Local Fonts

```javascript
// app/layout.js
import localFont from 'next/font/local';

const myFont = localFont({
  src: './fonts/my-font.woff2',
  display: 'swap',
});

// Multiple weights
const customFont = localFont({
  src: [
    {
      path: './fonts/custom-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/custom-bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-custom',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={myFont.className}>
      <body>{children}</body>
    </html>
  );
}
```

### Font Options

```javascript
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap', // 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
  variable: '--font-inter',
});
```

### Using Fonts in Components

```javascript
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});

export default function SpecialText() {
  return (
    <p className={roboto.className}>
      This text uses Roboto font
    </p>
  );
}
```

---

## Metadata Management

### Overview
Next.js 13+ provides a powerful metadata API for managing SEO-related tags.

### Static Metadata

```javascript
// app/page.js
export const metadata = {
  title: 'My App',
  description: 'This is my awesome app',
  keywords: ['nextjs', 'react', 'app'],
};

export default function Page() {
  return <div>Home Page</div>;
}
```

### Dynamic Metadata

```javascript
// app/blog/[slug]/page.js
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default function BlogPost({ params }) {
  // Render post
}
```

### Complete Metadata Example

```javascript
// app/layout.js
export const metadata = {
  title: {
    default: 'My App',
    template: '%s | My App', // %s is replaced by child page title
  },
  description: 'My awesome application',
  keywords: ['nextjs', 'react', 'typescript'],
  authors: [{ name: 'John Doe', url: 'https://johndoe.com' }],
  creator: 'John Doe',
  publisher: 'My Company',
  metadataBase: new URL('https://myapp.com'),
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://myapp.com',
    siteName: 'My App',
    title: 'My App',
    description: 'My awesome application',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'My App',
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'My App',
    description: 'My awesome application',
    creator: '@johndoe',
    images: ['/og-image.jpg'],
  },
  
  // Icons
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification
  verification: {
    google: 'google-verification-code',
    yandex: 'yandex-verification-code',
  },
};
```

### JSON-LD Schema

```javascript
export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Product Name',
    image: 'https://example.com/product.jpg',
    description: 'Product description',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div>{/* Page content */}</div>
    </>
  );
}
```

### Metadata with Params

```javascript
// app/products/[id]/page.js
export async function generateMetadata({ params, searchParams }) {
  const product = await getProduct(params.id);
  
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [product.image],
    },
  };
}
```

---

## Environment Variables

### Overview
Next.js supports environment variables for configuration without hardcoding sensitive data.

### Environment Files

Create files in the root directory:
- `.env` - All environments
- `.env.local` - Local overrides (not committed)
- `.env.development` - Development only
- `.env.production` - Production only

```bash
# .env.local
DATABASE_URL=postgresql://localhost:5432/mydb
API_KEY=secret-key-123
NEXT_PUBLIC_API_URL=https://api.example.com
```

### Server-Side Variables

```javascript
// Can only be accessed on the server
export async function getServerSideProps() {
  const apiKey = process.env.API_KEY;
  const dbUrl = process.env.DATABASE_URL;
  
  const data = await fetchData(apiKey);
  
  return { props: { data } };
}
```

### Client-Side Variables

```javascript
// Must be prefixed with NEXT_PUBLIC_
export default function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  // Available in browser
  console.log(apiUrl);
  
  return <div>API URL: {apiUrl}</div>;
}
```

### Runtime Configuration

```javascript
// next.config.js
module.exports = {
  publicRuntimeConfig: {
    apiUrl: process.env.API_URL,
  },
  serverRuntimeConfig: {
    apiSecret: process.env.API_SECRET,
  },
};

// Access in components
import getConfig from 'next/config';

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();
```

### TypeScript Types

```typescript
// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    API_KEY: string;
    NEXT_PUBLIC_API_URL: string;
  }
}
```

### Example Usage

```javascript
// lib/db.js
const dbUrl = process.env.DATABASE_URL;

export async function connectDB() {
  // Connect using dbUrl
}

// app/page.js
'use client';

export default function Page() {
  const handleSubmit = async (data) => {
    await fetch(process.env.NEXT_PUBLIC_API_URL + '/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };
  
  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

---

## Performance Features

### Automatic Code Splitting

Next.js automatically splits code by route, loading only what's needed:

```javascript
// Each page is automatically code-split
// pages/home.js - Home bundle
// pages/about.js - About bundle
// pages/contact.js - Contact bundle
```

### Dynamic Imports

```javascript
import dynamic from 'next/dynamic';

// Lazy load component
const DynamicComponent = dynamic(() => import('@/components/Heavy'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable server-side rendering
});

export default function Page() {
  return (
    <div>
      <DynamicComponent />
    </div>
  );
}
```

### Conditional Loading

```javascript
import dynamic from 'next/dynamic';

const MobileMenu = dynamic(() => import('@/components/MobileMenu'), {
  ssr: false,
});

const DesktopMenu = dynamic(() => import('@/components/DesktopMenu'));

export default function Navigation() {
  const isMobile = useIsMobile();
  
  return isMobile ? <MobileMenu /> : <DesktopMenu />;
}
```

### Named Exports

```javascript
// components/Charts.js
export function LineChart() { /* ... */ }
export function BarChart() { /* ... */ }
export function PieChart() { /* ... */ }

// Only import what you need
const LineChart = dynamic(() => 
  import('@/components/Charts').then(mod => mod.LineChart)
);
```

### Script Optimization

```javascript
import Script from 'next/script';

export default function Page() {
  return (
    <>
      {/* Load after page is interactive */}
      <Script
        src="https://example.com/script.js"
        strategy="lazyOnload"
      />
      
      {/* Load before page is interactive */}
      <Script
        src="https://example.com/critical.js"
        strategy="beforeInteractive"
      />
      
      {/* Load after Next.js hydrates */}
      <Script
        src="https://example.com/analytics.js"
        strategy="afterInteractive"
        onLoad={() => console.log('Script loaded')}
      />
    </>
  );
}
```

### Analytics

```javascript
// app/layout.js
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Web Vitals

```javascript
// pages/_app.js
export function reportWebVitals(metric) {
  console.log(metric);
  
  // Send to analytics
  if (metric.label === 'web-vital') {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }
}
```

---

## Incremental Static Regeneration (ISR)

### Overview
ISR allows you to update static pages after build time without rebuilding the entire site.

### Basic ISR

```javascript
// pages/products.js
export default function Products({ products }) {
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}

export async function getStaticProps() {
  const products = await fetchProducts();
  
  return {
    props: { products },
    revalidate: 60, // Revalidate every 60 seconds
  };
}
```

### ISR with Dynamic Routes

```javascript
// pages/products/[id].js
export default function Product({ product }) {
  return <div>{product.name}</div>;
}

export async function getStaticPaths() {
  const products = await fetchProducts();
  
  return {
    paths: products.map(p => ({
      params: { id: p.id.toString() },
    })),
    fallback: 'blocking', // Generate on first request
  };
}

export async function getStaticProps({ params }) {
  const product = await fetchProduct(params.id);
  
  return {
    props: { product },
    revalidate: 3600, // Revalidate every hour
  };
}
```

### On-Demand Revalidation

```javascript
// pages/api/revalidate.js
export default async function handler(req, res) {
  // Verify request (optional)
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  
  try {
    // Revalidate specific pages
    await res.revalidate('/');
    await res.revalidate('/about');
    await res.revalidate(`/products/${req.query.id}`);
    
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}

// Trigger: POST /api/revalidate?secret=token&id=123
```

### ISR in App Router

```javascript
// app/products/page.js
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 60 }, // ISR with 60 second revalidation
  });
  return res.json();
}

export default async function Products() {
  const products = await getProducts();
  return <div>{/* render products */}</div>;
}
```

### Tag-based Revalidation (App Router)

```javascript
// app/products/page.js
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { tags: ['products'] },
  });
  return res.json();
}

// app/api/revalidate/route.js
import { revalidateTag } from 'next/cache';

export async function POST(request) {
  const tag = request.nextUrl.searchParams.get('tag');
  revalidateTag(tag);
  return Response.json({ revalidated: true, now: Date.now() });
}

// Trigger: POST /api/revalidate?tag=products
```

---

## TypeScript Support

### Overview
Next.js has built-in TypeScript support with zero configuration.

### Setup

```bash
# Create TypeScript project
npx create-next-app@latest my-app --typescript

# Or add to existing project
touch tsconfig.json
npm install --save-dev typescript @types/react @types/node
npm run dev # Auto-configures TypeScript
```

### Page Types

```typescript
// pages/index.tsx
import { GetStaticProps, GetServerSideProps, NextPage } from 'next';

interface Props {
  products: Product[];
}

const HomePage: NextPage<Props> = ({ products }) => {
  return <div>{/* render products */}</div>;
};

export default HomePage;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const products = await fetchProducts();
  
  return {
    props: { products },
  };
};
```

### API Routes Types

```typescript
// pages/api/users.ts
import type { NextApiRequest, NextApiResponse } from 'next';

interface User {
  id: number;
  name: string;
}

interface ErrorResponse {
  error: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<User | User[] | ErrorResponse>
) {
  if (req.method === 'GET') {
    const users: User[] = [{ id: 1, name: 'John' }];
    res.status(200).json(users);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
```

### App Router Types

```typescript
// app/blog/[slug]/page.tsx
interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function BlogPost({ params, searchParams }: PageProps) {
  const post = await getPost(params.slug);
  return <article>{post.title}</article>;
}

export async function generateMetadata({ params }: PageProps) {
  return {
    title: `Blog Post: ${params.slug}`,
  };
}
```

### Custom Types

```typescript
// types/index.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

// Using in components
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return <div>{product.name}</div>;
}
```

### Layout Types

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

**Or use Vercel Dashboard:**
1. Push code to GitHub/GitLab/Bitbucket
2. Import project in Vercel
3. Auto-deploys on push

### Environment Variables (Vercel)

```bash
# CLI
vercel env add VARIABLE_NAME

# Or in Vercel Dashboard > Settings > Environment Variables
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

```javascript
// next.config.js
module.exports = {
  output: 'standalone',
};
```

### Static Export

```javascript
// next.config.js
module.exports = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};
```

```bash
npm run build
# Output in 'out' directory - deploy to any static host
```

### Custom Server

```javascript
// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
```

```json
// package.json
{
  "scripts": {
    "dev": "node server.js",
    "build": "next build",
    "start": "NODE_ENV=production node server.js"
  }
}
```

---

## Best Practices

### 1. Route Organization

```
app/
├── (auth)/
│   ├── login/
│   └── register/
├── (marketing)/
│   ├── about/
│   └── pricing/
└── (dashboard)/
    ├── settings/
    └── profile/
```

### 2. Component Structure

```
components/
├── ui/           # Reusable UI components
│   ├── Button/
│   ├── Input/
│   └── Card/
├── features/     # Feature-specific components
│   ├── auth/
│   └── products/
└── layouts/      # Layout components
    ├── Header/
    └── Footer/
```

### 3. Data Fetching Strategy

```typescript
// ✅ Good: Server Component fetching
async function Products() {
  const products = await fetchProducts(); // Runs on server
  return <div>{/* render */}</div>;
}

// ❌ Bad: Unnecessary client-side fetching
'use client';
function Products() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);
}
```

### 4. Image Optimization

```javascript
// ✅ Always use next/image
import Image from 'next/image';

<Image
  src="/photo.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={isAboveFold}
/>

// ❌ Avoid regular img tags
<img src="/photo.jpg" alt="Description" />
```

### 5. Font Optimization

```javascript
// ✅ Use next/font
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

// ❌ Don't use external font links
<link href="https://fonts.googleapis.com/..." />
```

### 6. Error Handling

```javascript
// app/error.js
'use client';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log to error reporting service
    logError(error);
  }, [error]);
  
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### 7. Loading States

```javascript
// app/dashboard/loading.js
export default function Loading() {
  return <DashboardSkeleton />;
}
```

### 8. Metadata for SEO

```javascript
// Always provide metadata
export const metadata = {
  title: 'Page Title',
  description: 'Page description',
  openGraph: {
    images: ['/og-image.jpg'],
  },
};
```

### 9. Environment Variables

```bash
# ✅ Prefix client variables
NEXT_PUBLIC_API_URL=...

# ✅ Keep secrets server-side only
DATABASE_URL=...
API_SECRET=...
```

### 10. Performance Monitoring

```javascript
// pages/_app.js
export function reportWebVitals(metric) {
  // Send to analytics
  sendToAnalytics(metric);
}
```

---

## Key Takeaways

### What Next.js Provides Over Plain React:

1. **Zero Config** - Start coding immediately
2. **File-based Routing** - No router setup needed
3. **SSR/SSG** - SEO and performance out of the box
4. **API Routes** - Full-stack in one project
5. **Optimizations** - Images, fonts, scripts automatically optimized
6. **Great DX** - Fast refresh, TypeScript, error messages
7. **Server Components** - Better performance by default
8. **Streaming** - Progressive rendering with Suspense
9. **Middleware** - Request manipulation before rendering
10. **Deployment** - Easy deployment to Vercel or any platform

### When to Use Next.js:

- **E-commerce sites** - SEO and performance critical
- **Marketing sites** - Static generation benefits
- **Dashboards** - Server-side rendering for data
- **Blogs** - ISR for updated content
- **SaaS applications** - Full-stack capabilities
- **Any React project** - Better DX and performance

### When NOT to Use Next.js:

- **Pure SPAs** - If you don't need SSR/SSG
- **Mobile apps** - Use React Native instead
- **Simple static sites** - Might be overkill

---

## Additional Resources

### Official Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn Course](https://nextjs.org/learn)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)

### Community
- [Next.js Discord](https://nextjs.org/discord)
- [Next.js GitHub](https://github.com/vercel/next.js)
- [Next.js Discussions](https://github.com/vercel/next.js/discussions)

### Tools & Libraries
- [next-auth](https://next-auth.js.org/) - Authentication
- [Prisma](https://www.prisma.io/) - Database ORM
- [TanStack Query](https://tanstack.com/query) - Data fetching
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

**Last Updated:** January 2026  
**Next.js Version:** 14+  
**React Version:** 18+



