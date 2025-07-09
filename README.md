# In Lieu Official

This is the official repository for the In Lieu e-commerce website, built with Next.js and using Shopify as a headless CMS for products and checkout.

## Overview

This project is a complete rebuild of the original In Lieu website, moving from a Create React App and Snipcart setup to a modern, scalable solution using the Next.js App Router and the Shopify Storefront API. The goal is to improve performance, maintainability, and developer experience while retaining the unique design and user experience of the brand.

## Features

-   **Next.js App Router:** For optimized rendering and a clear project structure.
-   **Headless Shopify:** Products, inventory, and checkout are managed through Shopify.
-   **Dynamic Product Pages:** A single, reusable component for all product pages.
-   **Responsive Design:** Fully responsive layouts for all pages, including a unique mobile and desktop experience for product pages.
-   **Unique Homepage:** A custom-built split-flap departure board that displays recent orders.
-   **Styled with Tailwind CSS:** For a utility-first and consistent styling workflow.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v18.x or later)
-   npm, yarn, or pnpm
-   A Shopify account with a configured private app.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd in-lieu-official
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of the project and add the following variables:

    ```env
    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-shop-domain.myshopify.com
    NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
    ```

    You can get these values from your private app in the Shopify admin dashboard.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

In the project directory, you can run:

-   `npm run dev`: Runs the app in development mode.
-   `npm run build`: Builds the app for production.
-   `npm run start`: Starts a production server.
-   `npm run lint`: Runs ESLint to check for code quality issues.

## Project Structure

The project uses the Next.js App Router, with the following structure:

```
/src
├── /app
│   ├── /api                # API routes (e.g., for Shopify order fetching)
│   ├── /components         # Reusable UI components
│   ├── /lib                # Helper functions and Shopify client
│   ├── /styles             # Global styles and Tailwind CSS configuration
│   ├── /products/[slug]    # Dynamic product page route
│   ├── page.jsx            # Homepage
│   └── layout.jsx          # Root layout
├── .env.local              # Environment variables
├── next.config.js          # Next.js configuration
└── tailwind.config.js      # Tailwind CSS configuration
```

## Deployment

This application is optimized for deployment on [Vercel](https://vercel.com/), the platform from the creators of Next.js.

To deploy:

1.  Push your code to a Git repository (e.g., GitHub).
2.  Import the repository into Vercel.
3.  Add the required environment variables (`NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` and `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`) in the Vercel project settings.
4.  Vercel will automatically build and deploy the application.

## Technologies Used

-   [Next.js](https://nextjs.org/) - React Framework
-   [Shopify Storefront API](https://shopify.dev/docs/api/storefront) - Headless e-commerce backend
-   [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
-   [Framer Motion](https://www.framer.com/motion/) - Animations
-   [ESLint](https://eslint.org/) - Code Linting
