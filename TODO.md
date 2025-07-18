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

    - [x] **Step 1: MenuImage.tsx Component**
        - [x] Create `/src/components/layout/menu/MenuImage.tsx` as a client component.
        - [x] Integrate the existing `ResponsiveSafeImage.tsx` component for image display.
        - [ ] Accept props: `imageSrc`, `imageAlt`, and `productTags` array.
        - [ ] Implement container with relative positioning to support absolute-positioned product tags.
        - [x] Mobile styling: Use `flex-1` to fill remaining vertical space in flex column layout.
        - [x] Desktop styling: Use `lg:w-1/2` or `lg:w-3/5` for fixed width, `h-screen` for full height.
        - [x] Render `ProductTag` components with absolute positioning based on tag coordinates.

    - [ ] **Step 2: ProductTag.tsx Component**
        - [ ] Create `/src/components/layout/menu/ProductTag.tsx` as a client component.
        - [ ] Accept props: `productName`, `productHandle`, `position` (x, y coordinates), `onClick` handler.
        - [ ] Implement clickable tag with clean styling (pill-shaped, subtle background).
        - [ ] Position absolutely within the image container using `position.x` and `position.y`.
        - [ ] Add hover states and smooth transitions.
        - [ ] Handle click events to navigate to product pages (`/product/[handle]`).
        - [ ] Ensure tags are responsive and scale appropriately on different screen sizes.

    - [x] **Step 3: PageLinks.tsx Component**
        - [x] Create `/src/components/layout/menu/PageLinks.tsx` as a server component.
        - [x] Accept props: `pages` array with `{ name: string, description: string, href: string }` structure.
        - [x] Accept prop: `currentPath` string to determine which page is currently active.
        - [x] Render navigation links for main site pages ("collection", "delivery and returns").
        - [x] **Each page link structure:**
            - [x] Title: Clean typography (`text-lg`, `font-medium` or similar).
            - [x] Description: Smaller, lighter text below the title (`text-sm`, `text-gray-600` or similar).
        - [x] **Dynamic styling based on current page:**
            - [x] Active page: Different text color, font weight, or highlighting.
            - [x] Inactive pages: Default styling with hover states (`hover:opacity-75`).
        - [x] Use Next.js `Link` component for client-side navigation.
        - [x] Add proper spacing between link groups (`space-y-4` or similar).
        - [x] Ensure responsive behavior and proper touch targets on mobile.

    - [x] **Step 4: Social Media & Logo Section**
        - [x] Create `/src/components/layout/menu/SocialSection.tsx` as a server component.
        - [x] **Mobile Layout (Vertical Stack):**
            - [x] Container: Use Flexbox (`flex flex-col items-center space-y-4`).
            - [x] **Social Icons (Top Section):**
                - [x] Create Instagram and TikTok SVG icons or use icon library.
                - [x] Container for icons: `flex space-x-4` to place them side by side.
                - [x] Wrap in `<a>` tags with proper `href` attributes.
                - [x] Consistent sizing (`w-6`, `h-6`) and center alignment.
                - [x] Add hover states and accessibility attributes.
            - [x] **Brand Logo (Bottom Section):**
                - [x] Create or import "in lieu" SVG logo.
                - [x] Center-aligned below the social icons.
                - [x] Make logo clickable to navigate to homepage.
        - [x] **Desktop Layout (Horizontal):**
            - [x] Container: Use Flexbox (`lg:flex-row lg:justify-between lg:items-center`).
            - [x] **Social Icons (Left Side):**
                - [x] Instagram and TikTok icons side by side (`flex space-x-4`).
                - [x] Aligned to the left of the container.
            - [x] **Brand Logo (Right Side):**
                - [x] Aligned to the right of the container.
                - [x] Maintains proper alignment with social icons.
        - [x] **Responsive Behavior:**
            - [x] Seamless transition between mobile (vertical) and desktop (horizontal) layouts.
            - [x] Ensure proper spacing and alignment at all breakpoints.
            - [x] Test touch interactions on mobile and hover states on desktop.

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

7.  **SectionLinks Update**
    - **Objective:** Transform SectionLinks into a global component that appears on every page (including when menu modal is open), with dynamic sections based on the current page and smooth animations when transitioning between pages.

    - [x] **Step 1: Integrate SectionLinks into Navbar Component**
        - [x] Move SectionLinks logic from individual pages into the Navbar component
        - [x] Update Navbar.tsx to include SectionLinks as a child component
        - [x] Adjust z-index to ensure SectionLinks appears above MenuModal (set to `z-[70]`)
        - [x] Remove SectionLinks from individual pages (starting with `/src/app/page.tsx`)
        - [x] Test that SectionLinks appears on all pages through the global navbar

    - [x] **Step 2: Create Sections Context Provider**
        - [x] Create `/src/components/layout/SectionsContext.tsx` with:
            - Context for managing current page sections
            - Provider component that wraps the app
            - Hook `useSections()` for consuming sections
            - Method `setSections(sections: Section[])` for updating sections
        - [x] Add SectionsProvider to the root layout (`/src/app/layout.tsx`)
        - [x] Define TypeScript interfaces for Section and SectionsContext

    - [x] **Step 3: Make SectionLinks Context-Aware**
        - [x] Update SectionLinks component to consume sections from context instead of props
        - [x] Add state management for tracking section changes
        - [x] Implement detection when sections array changes (page navigation)
        - [x] Add loading state while sections are being updated

    - [ ] **Step 4: Implement Page-to-Page Transition Animations**
        - [ ] **Exit Animation (Current sections sliding out):**
            - [ ] Animate current section links sliding to the left and fading out
            - [ ] Animate vertical indicator shrinking and moving off-screen
            - [ ] Duration: ~300ms with easing function
        - [ ] **Enter Animation (New sections sliding in):**
            - [ ] New section links slide in from the left with fade-in effect
            - [ ] Vertical indicator animates to new position and grows to fit first section
            - [ ] Duration: ~300ms with easing function, delayed by ~150ms after exit
        - [ ] Use Framer Motion or CSS transitions for smooth animations
        - [ ] Ensure animations don't interfere with scroll-based indicator movement

    - [ ] **Step 5: Update Individual Pages to Use Context**
        - [x] **Homepage (`/src/app/page.tsx`):**
            - [x] Add `useEffect` to call `setSections()` with homepage sections on mount
            - [x] Remove direct SectionLinks component usage
            - [x] Sections: `[{ id: 'makurro', name: 'makurro' }, { id: 'lookbook', name: 'lookbook' }, { id: 'about', name: 'about' }, { id: 'shop', name: 'shop' }]`
        - [ ] **Other Pages (when created):**
            - [ ] Delivery page: Set appropriate sections for that page's content
            - [ ] Product pages: Set sections relevant to product content
            - [ ] About page: Set sections for about page content

    - [ ] **Step 6: Handle Edge Cases & States**
        - [ ] **No Sections State:** Hide SectionLinks component when no sections are set
        - [ ] **Single Section:** Handle case where only one section exists (no indicator animation)
        - [ ] **Menu Modal Open:** Ensure SectionLinks remains visible and functional when menu is open
        - [ ] **Page Load:** Handle initial page load with proper section initialization
        - [ ] **Navigation Interruption:** Handle rapid page changes during animations

    - [ ] **Step 7: Styling & Visual Polish**
        - [ ] Ensure consistent positioning across all pages (`fixed bottom-6 left-8`)
        - [ ] Maintain `mix-blend-difference` styling for visibility over varied backgrounds
        - [ ] Add smooth hover states that work with the new animation system
        - [ ] Test contrast and readability across different page backgrounds
        - [ ] Ensure animations are performant and don't cause layout shifts

    - [ ] **Step 8: Testing & Refinement**
        - [ ] Test SectionLinks functionality on all existing pages
        - [ ] Verify smooth animations during page transitions
        - [ ] Test scroll behavior and indicator tracking on different screen sizes
        - [ ] Ensure proper interaction with MenuModal (visibility and z-index)
        - [ ] Test accessibility with keyboard navigation and screen readers
        - [ ] Performance testing for animation smoothness

    - [ ] **Step 9: Documentation & Cleanup**
        - [ ] Update component documentation with new usage patterns
        - [ ] Create examples of how pages should implement section setting
        - [ ] Remove old SectionLinks usage patterns from codebase
        - [ ] Add TypeScript types for better developer experience

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