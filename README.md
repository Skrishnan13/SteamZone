
# StreamZone - Video Streaming Platform

StreamZone is a Next.js-based video streaming platform, designed to emulate a Netflix-like experience. It features a user-facing interface for browsing and viewing video content, and an admin panel for content management.

**Current Status:** This project is currently in a developmental phase. The frontend UI for both the main application and the admin panel is largely in place. However, it has recently been transitioned from using mock data to prepare for a backend integration with XAMPP (MySQL/MariaDB). **Backend functionalities, such as actual video/thumbnail uploads, live data fetching from the database, and real-time analytics, are not yet implemented.**

## Key Features

### User-Facing Application:
*   **Netflix-Inspired UI:** Dark theme with a familiar layout for browsing videos.
*   **Homepage:** Displays a featured video hero banner and horizontally scrollable rows of video categories.
*   **Video Cards:** Clickable cards that lead to video detail pages.
*   **Video Detail Pages (UI Placeholder):**
    *   Space for video playback (currently a placeholder image).
    *   Displays video title, description, year, duration, rating, cast, director, genres.
    *   Mock interaction buttons (Like, Dislike, Share, Save).
    *   Comment section UI with mock submission.
    *   "More Like This" and "Content Details" sections (UI placeholders).
*   **Navigation:** Links to Home, TV Shows, Movies, New & Popular.

### Admin Panel (`/admin`):
*   **Basic Authentication:** A prototype login system restricts access to admin pages (Username: `admin`, Password: `Pass@123` - **for prototype use ONLY**).
*   **Admin Dashboard:** Overview and quick links to management sections.
*   **Video Upload (`/admin/upload`):**
    *   Form to input video metadata (title, descriptions, genres, cast, director, year, duration, maturity rating, thumbnail URL, AI hint, categories, featured status).
    *   Category selection is dynamic (based on categories added in "Manage Categories").
    *   **Note:** Actual file upload for video/thumbnail and saving data to a database is **not yet implemented**. Submission is simulated.
*   **Manage Videos (`/admin/manage-videos`):**
    *   Lists videos (currently mock, will fetch from DB).
    *   Allows editing video metadata via a pre-filled form.
    *   Allows deleting videos (simulated, updates local mock state if applicable).
*   **Manage Categories (`/admin/manage-categories`):**
    *   Add, view, edit, and delete video categories.
    *   Changes here are reflected in the video upload/edit forms.
    *   **Note:** Actions are simulated until backend is integrated.
*   **View Analytics (`/admin/analytics`):**
    *   Displays mock analytics data with key metrics cards (Total Videos, Categories, Views, Users).
    *   Includes example charts (Bar, Line, Pie) for visual representation using mock data.

## Tech Stack

*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **UI Components:** ShadCN UI
*   **Styling:** Tailwind CSS
*   **State Management (Client):** React Context (for Auth), React Hooks (`useState`, `useEffect`)
*   **AI Integration (Setup):** Genkit (Google AI) - Initial setup is present, ready for implementing AI-powered features.
*   **Forms:** React Hook Form with Zod for validation.
*   **Charting:** Recharts (via ShadCN UI Charts)
*   **Linting/Formatting:** ESLint, Prettier (assumed default Next.js setup)
*   **Database (Planned):** MySQL/MariaDB via XAMPP.

## Getting Started

### Prerequisites
*   Node.js (v18.x or later recommended)
*   npm or yarn
*   XAMPP (or any MySQL/MariaDB server environment)

### Installation
1.  **Clone the repository (if applicable) or ensure you have the project files.**
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Environment Variables:**
    *   Create a `.env` file in the root of the project (if it doesn't exist).
    *   This file will be used for database connection strings and other sensitive keys once the backend is implemented. For now, it can be empty or contain placeholders.
    ```env
    # Example for future database connection (update with your actual credentials)
    # DB_HOST=localhost
    # DB_USER=root
    # DB_PASSWORD=your_password
    # DB_NAME=streamzone_db
    ```

### Database Setup (XAMPP - MySQL/MariaDB)
1.  **Start XAMPP:** Ensure your Apache and MySQL services are running.
2.  **Create Database:**
    *   Open phpMyAdmin (usually `http://localhost/phpmyadmin`).
    *   Create a new database (e.g., `streamzone_db`).
3.  **Import Schema:**
    *   Select the newly created database.
    *   Go to the "Import" tab.
    *   Choose the `database.sql` file located in the root of this project.
    *   Click "Go" to execute the SQL and create the tables.
4.  **Admin User (Manual Insert - Important):**
    *   The default admin credentials for the prototype are `admin` / `Pass@123`.
    *   To make this work with your database, you need to insert this user into the `users` table.
    *   **Crucially, you must hash the password `Pass@123` using a secure hashing algorithm (like bcrypt) before inserting it into the `password_hash` column.** This hashing should be done via a script or a temporary backend endpoint you create. **DO NOT store plaintext passwords.**
    *   Example (conceptual, assuming you have a hashed password):
        ```sql
        INSERT INTO users (username, password_hash, email, role)
        VALUES ('admin', 'your_bcrypt_hashed_password_for_Pass@123', 'admin@example.com', 'admin');
        ```

### Running the Development Server
```bash
npm run dev
# or
yarn dev
```
The application will be available at `http://localhost:9002` (or the port specified in your `package.json` dev script).

### Admin Login (Prototype)
*   Navigate to `/login`.
*   Username: `admin`
*   Password: `Pass@123`
    *   **Note:** This is a frontend-only mock authentication for prototype purposes. It is **NOT SECURE**.

## Folder Structure Overview

*   `database.sql`: SQL schema for creating database tables.
*   `public/`: Static assets (images, fonts if not using `next/font`).
*   `src/`: Main application code.
    *   `src/ai/`: Genkit configuration and AI flow definitions.
        *   `src/ai/genkit.ts`: Genkit global instance.
        *   `src/ai/dev.ts`: For local Genkit development.
    *   `src/app/`: Next.js App Router pages and layouts.
        *   `src/app/admin/`: Admin panel pages.
        *   `src/app/api/`: (To be created) Backend API routes for database interaction.
    *   `src/components/`: Reusable React components.
        *   `src/components/ui/`: ShadCN UI components.
    *   `src/context/`: React Context providers (e.g., `AuthContext.tsx`).
    *   `src/data/`:
        *   `src/data/mock.ts`: Previously held mock data. Now a placeholder for data service functions that will interact with your backend API.
    *   `src/hooks/`: Custom React hooks (e.g., `useToast.ts`, `use-mobile.ts`).
    *   `src/lib/`: Utility functions (e.g., `utils.ts` for `cn`).
    *   `src/types/`: TypeScript type definitions (`index.ts`).
*   `package.json`: Project dependencies and scripts.
*   `tailwind.config.ts`: Tailwind CSS configuration.
*   `next.config.ts`: Next.js configuration.
*   `tsconfig.json`: TypeScript configuration.

## Next Steps & Future Enhancements

*   **Backend API Implementation:** Develop API routes (`src/app/api/...` or a separate server) to:
    *   Connect to the XAMPP MySQL/MariaDB database.
    *   Handle CRUD operations for videos, categories, users, comments, ratings.
    *   Implement secure user authentication (e.g., using JWTs, session management).
    *   Securely hash passwords on registration and verify on login.
*   **Data Fetching Integration:** Update frontend pages and components to fetch data from the new backend APIs instead of relying on simulated data.
*   **Functional Video Playback:** Integrate a video player component (e.g., Plyr, React Player) and stream videos.
*   **File Uploads:** Implement robust file uploading for video files and thumbnails, likely using cloud storage (e.g., Firebase Storage, AWS S3).
*   **Real Comment & Rating System:** Connect the UI to the backend to save and display user comments and ratings.
*   **Enhanced User Features:**
    *   User profiles.
    *   Watchlists / My List.
    *   Viewing history.
*   **Advanced Search & Filtering.**
*   **Genkit AI Features:**
    *   AI-powered video recommendations.
    *   Automated content tagging or description generation.
    *   Smart search capabilities.
*   **Deployment:** Configure for deployment to a hosting platform (e.g., Vercel, Netlify, AWS).

This README provides a starting point. As the project evolves, keep it updated to reflect new features, setup instructions, and architectural changes.
