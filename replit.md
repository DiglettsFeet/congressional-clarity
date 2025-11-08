# Congressional Clarity

## Overview
Congressional Clarity is a Next.js web application that provides information about U.S. Congress members, bills, votes, and state-specific congressional data. The application uses the Congress API to fetch and display legislative information.

**Current State:** Development environment is set up and running. The application is ready for use and further development.

**Last Updated:** November 7, 2025

## Project Architecture

### Technology Stack
- **Framework:** Next.js 14.1.0
- **Runtime:** Node.js 20
- **UI Library:** React 18.2.0
- **HTTP Client:** Axios 1.6.7

### Project Structure
```
congressional-clarity/
├── lib/
│   └── congress.js          # Congress API integration library
├── pages/
│   ├── api/
│   │   ├── bills.js         # API route for bill data
│   │   ├── members.js       # API route for member data
│   │   └── votes.js         # API route for vote data
│   ├── member/
│   │   ├── [id]/
│   │   │   └── [topic].js   # Dynamic route for member topics
│   │   └── [id].js          # Individual member page
│   ├── states/
│   │   └── [state].js       # State-specific congressional info
│   └── index.js             # Home page
├── next.config.js           # Next.js configuration
├── package.json             # Project dependencies
├── replit.nix              # Nix environment configuration
└── styles.css              # Global styles
```

### Key Features
- Browse Congress members by state
- View individual member profiles and their voting records
- Search and filter bills
- Track voting records
- API routes for data fetching

## Development

### Running the Application
The development server runs automatically via the configured workflow:
- **Command:** `npm run dev`
- **Port:** 5000
- **URL:** Available in the webview panel

### Configuration Details
- Server binds to `0.0.0.0:5000` for Replit compatibility
- Cache-Control headers set to prevent stale data in iframe
- Hot Module Replacement (HMR) enabled for development

### Environment
- Node.js toolchain installed via Nix
- Dependencies managed via npm
- Development server configured for Replit's proxy environment

## Recent Changes
- **November 7, 2025:** Initial setup
  - Extracted project from zip file
  - Updated Next.js configuration for Replit environment
  - Changed dev server to run on port 5000 with host binding to 0.0.0.0
  - Added Cache-Control headers to prevent caching issues
  - Installed all dependencies via npm
  - Created .gitignore for Node.js projects
  - Set up development workflow

## User Preferences
None documented yet.

## Notes
- Application requires Congress API access (check lib/congress.js for API configuration)
- Port 5000 is used for Replit's webview compatibility
- All API routes are serverless functions via Next.js API routes
