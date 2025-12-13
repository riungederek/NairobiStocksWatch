# AI Rules for Kenyan Stock Tracker Application

This document outlines the technical stack and specific library usage guidelines for developing and modifying the Kenyan Stock Tracker application. Adhering to these rules ensures consistency, maintainability, and leverages the strengths of our chosen technologies.

## Tech Stack Overview

The application is built with a modern web stack, focusing on performance, developer experience, and a clean user interface.

*   **Frontend Framework**: React.js for building interactive user interfaces.
*   **Language**: TypeScript for type safety and improved code quality across the entire codebase.
*   **Routing**: Wouter for lightweight and declarative client-side routing.
*   **State Management & Data Fetching**: React Query (`@tanstack/react-query`) for efficient server state management, caching, and data synchronization.
*   **Styling**: Tailwind CSS for utility-first CSS, enabling rapid and consistent UI development.
*   **UI Components**: shadcn/ui, a collection of re-usable components built on Radix UI and styled with Tailwind CSS.
*   **Icons**: Lucide React for a comprehensive and customizable icon set.
*   **Date Manipulation**: `date-fns` for efficient and immutable date operations.
*   **Charting**: Recharts for building responsive and interactive data visualizations.
*   **Backend Framework**: Express.js for building robust and scalable RESTful APIs.
*   **Database & ORM**: PostgreSQL with Drizzle ORM for type-safe database interactions and schema management.
*   **Build Tool**: Vite for a fast development server and optimized production builds.

## Library Usage Rules

To maintain consistency and leverage existing patterns, please follow these guidelines when implementing new features or modifying existing ones:

*   **UI Components**:
    *   **Always** prioritize using components from `shadcn/ui` (e.g., `Button`, `Card`, `Tabs`, `Badge`). These are imported from `@/components/ui/`.
    *   If a required component is not available in `shadcn/ui` or needs significant custom logic, create a **new component file** in `client/src/components/` and style it using Tailwind CSS. **Do not modify existing files within `client/src/components/ui/`**.
*   **Styling**:
    *   **Exclusively** use Tailwind CSS classes for all styling. Avoid inline styles or separate CSS files/modules.
    *   Utilize the `cn` utility function from `client/src/lib/utils.ts` for conditionally combining Tailwind classes.
*   **Icons**:
    *   Use icons from the `lucide-react` library for all visual representations.
*   **Routing**:
    *   Manage client-side routing using `wouter`. All main application routes should be defined in `client/src/App.tsx`.
*   **Data Fetching**:
    *   All interactions with the backend API for fetching, updating, creating, or deleting data **must** use `@tanstack/react-query` (e.g., `useQuery`, `useMutation`).
    *   The `apiRequest` and `getQueryFn` utilities in `client/src/lib/queryClient.ts` should be used for making API calls.
*   **Date & Time**:
    *   For any date formatting, parsing, or manipulation, use functions provided by `date-fns`.
*   **Charts**:
    *   When implementing data visualizations, use the `recharts` library.
*   **Backend API**:
    *   New API endpoints should be defined in `server/routes.ts` using Express.js.
*   **Database Interactions**:
    *   All database operations (CRUD) on the server-side **must** use Drizzle ORM, interacting with the schema defined in `shared/schema.ts`.
*   **Toast Notifications**:
    *   For displaying user feedback (success, error, loading messages), use the `useToast` hook and `Toaster` component provided by the application (from `client/src/hooks/use-toast.ts` and `client/src/components/ui/toaster.tsx`).