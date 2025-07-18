# In Lieu Official - Next.js & Shopify Migration Plan

This document outlines the steps to rebuild the In Lieu website using Next.js and Shopify, focusing on modern development practices and conventions based on the official Next.js Commerce starter.




## 📓 Work Log / Journal

### 09/07/2025

* **Completed:** Initialize Next.js Project (Ref: Roadmap - 1.1)
    * **Note:** 
    * **Discovery:** 

---

## 🗺️ Project Roadmap

### Phase 1: Project Setup & Shopify Integration

1.  **Initialize Next.js Project:**
    - [x] Use `npx create-next-app@latest in-lieu-official` to bootstrap the application.
    - [x] Select TypeScript, ESLint, and Tailwind CSS.

2.  **Project Structure:**
    - [ ] Create a clean and scalable folder structure inspired by Next.js Commerce:
      ```
    /src
    ├── /app/                      # <-- Routing logic
    │   ├── /api
    │   ├── /cart
    │   ├── /products
    │   └── /... (other routes)
    │
    ├── /components/               # <-- Reusable components
    │   ├── /cart
    │   ├── /layout
    │   └── /product
    │
    ├── /lib/                      # <-- Core logic, utils, etc.
    │   ├── /shopify
    │   └── /constants.ts
    │
    └── /styles/                   # <-- Global styles
      ```

3.  **Shopify Setup & Environment Variables:**
    - [x] Create a new private app in the Shopify admin dashboard.
    - [x] Create an `.env.local` file and add the Shopify credentials, following the `next.js-commerce` convention:
      ```
      COMPANY_NAME="In Lieu"
      SITE_NAME="In Lieu"
      SHOPIFY_REVALIDATION_SECRET=
      SHOPIFY_STOREFRONT_ACCESS_TOKEN=
      SHOPIFY_STORE_DOMAIN=
      ```

4.  **Install Dependencies:**
    - [ ] Install any necessary UI/utility libraries (e.g., `framer-motion`, `react-slick`, `clsx`, `@headlessui/react`, `@heroicons/react`).

5.  **Shopify API Layer:**
    - [] Copy the entire `/src/lib/shopify/` from the Next.js Commerce template.


6.  **Shopify API Layer:**
    - **Goal:** Replicate the entire data-fetching and backend communication layer from the `learning-shopify-nextjs/commerce` project. This ensures the new application uses the same robust and battle-tested logic for interacting with the Shopify API.
    - **Tasks**
    - [x] Copy the entire `/src/lib/shopify` directory, which includes:
        - `index.ts`: The main entry point for the Shopify API library.
        - `fragments`: GraphQL fragments for reusable data structures (products, carts, etc.).
        - `mutations`: GraphQL mutations for creating and updating data (e.g., adding to cart).
        - `queries`: GraphQL queries for fetching data (e.g., getting products, collections).
        - `types.ts`
    - [x] Copy the cart management logic from `/src/components/cart`, including server actions and context providers.
        * **Note:** I've copied the entire folder for `/src/components/cart`. This includes the actual front end client components too (like add-to-cart.tsx and delete-item-button.tsx) 
        This is still useful to see how they call these server actions. We will replicate this logic in your own UI components (as another todo item)
    - [x] Copy the revalidation API route from `/src/app/api/revalidate`, which is crucial for on-demand revalidation when products are updated in Shopify.
    - [x] **What NOT to Copy (and to build custom):**
        - Any UI components from the reference project (e.g., `Navbar`, `ProductGrid`, `ProductPage`). These will be custom-built to match the unique design of the In Lieu brand. The goal is to use the reference project for its backend architecture, not its frontend presentation.


## Phase 2: Core Component & Page Development


1.  **Layout & Navbar (New "Makurro" Floating Design)**
    - **Objective:** Build a responsive, modern, floating pill-shaped navigation bar based on the reference design. The initial focus will be on the mobile view.

    - [x] **Step 1: Scaffolding & Setup**
        - [x] Create the new component file structure:
            ```
            /src/components/layout/navbar/
            ├── Navbar.tsx         # Parent container ('use client')
            ├── NavLinks.tsx       # Navigation links (Server Component)
            ├── CartButton.tsx     # Cart icon button ('use client')
            └── MenuButton.tsx     # Menu icon button ('use client')
            ```
        - [x] Install any necessary dependencies for icons (e.g., `@heroicons/react`).

    - [x] **Step 2: `NavLinks.tsx` (Server Component)**
        - [x] Implement as a client Component.
        - [x] Accept navigation links via props (e.g., `[{ name: 'shop', href: '#shop' }]`).
        - [x] Render links: "makurro", "lookbook", "about", "shop".
        - [x] Style with Flexbox (`flex gap-x-5`).
        - [x] Implement logic/styling for the active link (underlined).

    - [x] **Step 3: `Navbar.tsx` (Parent Client Component)**
        - [x] Implement as a Client Component (`'use client'`).
        - [x] Create and manage state: `isCartOpen`, `isMenuOpen`.
        - [x] Define handler functions: `toggleCart`, `toggleMenu`.
        - [x] Assemble the layout:
            - Main "floating pill" container (`bg-white`, `rounded-full`, `shadow-lg`, etc.).
            - Use Flexbox to position `NavLinks` on the left and buttons on the right.
            - Add the vertical separator (`<div className="w-px h-6 bg-gray-200">`).
            - Ensure the navbar is horizontally centered on the page.

    - [x] **Step 4: Button Components (`CartButton.tsx` & `MenuButton.tsx`)**
        - [x] Implement `CartButton.tsx` as a Client Component.
        - [x] Pass `toggleCart` function to it as a prop and call it `onClick`.
        - [x] Style `CartButton` with a background color and specific rounding:
            - Left side: fully rounded (`rounded-l-full`).
            - Right side: 8pt radius (`rounded-r-lg`).
        - [x] Implement `MenuButton.tsx` similarly, passing `toggleMenu` as a prop.
        - [x] Style `MenuButton` with specific rounding:
            - Right side: fully rounded (`rounded-r-full`).
            - Left side: 8pt radius (`rounded-l-lg`).
        - [x] Ensure styling (background, hover states) is consistent between both buttons.

    - [ ] **Step 5: Cart Data Integration**
        - [ ] In `CartButton.tsx`, perform the GraphQL query to fetch the number of items in the cart.
        - [ ] Implement a badge to display the item count.
        - [ ] The badge should be positioned on the corner of the icon and only visible if the count > 0.

    - [ ] **Step 6: Final Integration**
        - [ ] Create placeholder modals for the cart and menu.
        - [ ] Conditionally render these modals in `Navbar.tsx` based on the `isCartOpen` and `isMenuOpen` states.
        - [ ] Add the final `Navbar` component to the root layout (`/src/app/layout.tsx`).


2.  **Cart Management:**
    - [ ] Implement a `CartProvider` using React Context (`/src/components/cart/cart-context.tsx`) to manage the cart state throughout the application.
    - [ ] Use React's `useOptimistic` hook for a better user experience when adding, updating, or removing items from the cart.
    - [ ] Create server actions in `/src/components/cart/actions.ts` to handle all cart operations (add, remove, update).

3.  **Dynamic Product Page:**
    - [ ] Create a dynamic route: `/src/app/product/[handle]/page.tsx`.
    - [ ] Fetch product data from Shopify using the `getProduct` function from the Shopify API library.
    - [ ] Implement the product gallery (`/src/components/product/gallery.tsx`).
    - [ ] Create the `VariantSelector` component (`/src/components/product/variant-selector.tsx`) to handle product options.
    - [ ] Use a `ProductProvider` and `useProduct` hook to manage the selected variant state.
    - [ ] Implement the `AddToCart` button, which will call the `addItem` server action.

4.  **Static Pages:**
    - [ ] Recreate the **Lookbook**, **About**, and **Delivery & Returns** pages as static pages within the `/app` directory.

5.  **Homepage (Departure Board):**
    - [ ] Recreate the unique split-flap departure board UI.
    - [ ] To fetch recent orders, we will need to use the Shopify Admin API, as the Storefront API does not expose order data. This will require a separate, secure API route that is *not* exposed to the client.
    - [ ] Create an API route (e.g., `/app/api/orders/route.ts`) that uses the Shopify Admin API to fetch recent orders. This route must be protected.
    - [ ] Connect the homepage component to this API route to display the order data.

6.  **Menu Modal**
    - **Objective:** Build a responsive pop-out menu modal with image, product tags, page navigation, social media icons, and brand logo. The layout adapts from mobile (stacked) to desktop (side-by-side).

    - [ ] **Step 1: MenuImage.tsx Component**
        - [ ] Create `/src/components/layout/menu/MenuImage.tsx` as a client component.
        - [ ] Integrate the existing `ResponsiveSafeImage.tsx` component for image display.
        - [ ] Accept props: `imageSrc`, `imageAlt`, and `productTags` array.
        - [ ] Implement container with relative positioning to support absolute-positioned product tags.
        - [ ] Mobile styling: Use `flex-1` to fill remaining vertical space in flex column layout.
        - [ ] Desktop styling: Use `lg:w-1/2` or `lg:w-3/5` for fixed width, `h-screen` for full height.
        - [ ] Render `ProductTag` components with absolute positioning based on tag coordinates.

    - [ ] **Step 2: ProductTag.tsx Component**
        - [ ] Create `/src/components/layout/menu/ProductTag.tsx` as a client component.
        - [ ] Accept props: `productName`, `productHandle`, `position` (x, y coordinates), `onClick` handler.
        - [ ] Implement clickable tag with clean styling (pill-shaped, subtle background).
        - [ ] Position absolutely within the image container using `position.x` and `position.y`.
        - [ ] Add hover states and smooth transitions.
        - [ ] Handle click events to navigate to product pages (`/product/[handle]`).
        - [ ] Ensure tags are responsive and scale appropriately on different screen sizes.

    - [ ] **Step 3: PageLinks.tsx Component**
        - [ ] Create `/src/components/layout/menu/PageLinks.tsx` as a server component.
        - [ ] Accept props: `pages` array with `{ name: string, href: string }` structure.
        - [ ] Render navigation links for main site pages ("collection", "delivery and returns").
        - [ ] Styling: Block-level elements with clean typography (`text-lg`, `font-medium`).
        - [ ] Implement hover states (`hover:opacity-75`).
        - [ ] Use Next.js `Link` component for client-side navigation.
        - [ ] Add proper spacing between links (`space-y-2` or similar).

    - [ ] **Step 4: Social Media & Logo Section**
        - [ ] Create `/src/components/layout/menu/SocialSection.tsx` as a server component.
        - [ ] Container: Use Flexbox (`flex`, `justify-between`, `items-center`).
        - [ ] **Social Icons (Left Side):**
            - [ ] Create Instagram and Facebook SVG icons or use icon library.
            - [ ] Wrap in `<a>` tags with proper `href` attributes.
            - [ ] Consistent sizing (`w-6`, `h-6`) and spacing (`space-x-4`).
            - [ ] Add hover states and accessibility attributes.
        - [ ] **Brand Logo (Right Side):**
            - [ ] Create or import "in lieu" SVG logo.
            - [ ] Ensure proper alignment with social icons.
            - [ ] Make logo clickable to navigate to homepage.

    - [ ] **Step 5: Enhanced MenuModal.tsx Integration**
        - [ ] Update existing `MenuModal.tsx` to implement the new layout structure.
        - [ ] **Main Container:**
            - [ ] Fixed positioning: `fixed inset-0 z-40`.
            - [ ] Background: `bg-white` or appropriate brand color.
            - [ ] Responsive layout: `flex flex-col lg:flex-row`.
            - [ ] Overall padding: `p-4` or `p-6`.
        - [ ] **Mobile Layout (Column):**
            - [ ] Image section: `flex-1` to fill remaining space.
            - [ ] Bottom content section: `h-auto` with proper spacing.
            - [ ] Vertical arrangement of PageLinks, SocialSection.
        - [ ] **Desktop Layout (Row):**
            - [ ] Image section: `lg:w-1/2` or `lg:w-3/5`, `h-screen`.
            - [ ] Content section: `lg:w-1/2` or `lg:w-2/5`, `h-screen`.
            - [ ] Content vertical arrangement: `flex flex-col justify-between` or `justify-center`.

    - [ ] **Step 6: Data Integration & Props**
        - [ ] Define TypeScript interfaces for all component props.
        - [ ] Create mock data structure for product tags with coordinates.
        - [ ] Implement data fetching for featured products (if needed).
        - [ ] Pass navigation pages data to PageLinks component.
        - [ ] Configure social media URLs and brand logo source.

    - [ ] **Step 7: Responsive Behavior & Breakpoints**
        - [ ] Test mobile view (iPhone 16 Pro reference).
        - [ ] Test desktop view (Frame 87 reference).
        - [ ] Implement smooth transitions between breakpoints.
        - [ ] Ensure proper touch interactions on mobile.
        - [ ] Verify image scaling and product tag positioning across devices.

    - [ ] **Step 8: Integration with Existing Components**
        - [ ] Ensure `SectionLinks.tsx` renders correctly in bottom-left (mobile) or appropriate position (desktop).
        - [ ] Verify `Navbar.tsx` integration and z-index layering.
        - [ ] Test modal open/close animations and body scroll locking.
        - [ ] Implement proper focus management for accessibility.

    - [ ] **Step 9: Final Polish & Testing**
        - [ ] Add loading states for image and product data.
        - [ ] Implement error handling for failed image loads.
        - [ ] Test keyboard navigation and screen reader compatibility.
        - [ ] Optimize performance (lazy loading, image optimization).
        - [ ] Cross-browser testing and mobile device testing.


## Phase 3: Styling & Finalization

1.  **Styling:**
    - [ ] Use Tailwind CSS for all styling.
    - [ ] Define global styles and import fonts in `/src/app/globals.css`.
    - [ ] Ensure all components are fully responsive.

2.  **Code Quality & Conventions:**
    - [ ] Use ESLint and Prettier to maintain a consistent code style.
    - [ ] Follow the architectural patterns from the `next.js-commerce` reference project.

3.  **Deployment & Revalidation:**
    - [ ] Configure the project for deployment on Vercel.
    - [ ] Add the environment variables to the Vercel project settings.
    - [ ] Set up a webhook in Shopify to call the `/api/revalidate` endpoint when products or collections are updated. This will use the `SHOPIFY_REVALIDATION_SECRET` to secure the endpoint.

## Phase 4: Post-Launch Tasks

- [ ] Set up analytics.
- [ ] Perform SEO optimizations.
- [ ] Final testing across multiple devices and browsers.