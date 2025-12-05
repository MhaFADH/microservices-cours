# Backoffice Application

A modern, responsive backoffice application built with Vite, React, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- **Authentication**: Secure login with JWT tokens from the identity-player service
- **API Testing**: Interactive interface to test API endpoints across all microservices
- **User Management**: Create, view, edit, and delete users
- **Metrics Dashboard**: Real-time charts and analytics with Recharts
- **Modern UI**: Clean, professional interface using shadcn/ui components
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Vite**: Fast build tool and dev server
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components
- **React Router**: Client-side routing
- **Recharts**: Charting library
- **Lucide React**: Beautiful icons

## Prerequisites

- Node.js (v18 or higher)
- npm
- Backend microservices running:
  - identity-player: http://localhost:8081
  - matchmaking: http://localhost:8082
  - economy-community: http://localhost:8083

## Installation

1. Navigate to the backoffice directory:
   ```bash
   cd backoffice
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5173

## Building for Production

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
backoffice/
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn/ui components
│   │   └── Layout.tsx    # Main layout with navigation
│   ├── contexts/
│   │   └── AuthContext.tsx  # Authentication context
│   ├── pages/
│   │   ├── Dashboard.tsx    # Home dashboard
│   │   ├── Login.tsx        # Login page
│   │   ├── ApiTester.tsx    # API testing interface
│   │   ├── Users.tsx        # User management
│   │   └── Metrics.tsx      # Metrics dashboard
│   ├── services/
│   │   └── api.ts          # API service utilities
│   ├── lib/
│   │   └── utils.ts        # Utility functions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Default Login

To login, you'll need to create a user account through the identity-player service or use existing credentials from your backend.

The login form sends credentials to:
- **Endpoint**: `POST http://localhost:8081/auth/login`
- **Body**: `{ "username": "your-username", "password": "your-password" }`

## Features Overview

### Dashboard
- Quick access to all features
- System status overview
- Quick statistics
- Microservices information

### API Tester
- Select service (identity, matchmaking, economy)
- Choose HTTP method (GET, POST, PUT, DELETE, PATCH)
- Enter endpoint path
- Add custom headers
- Send request body (JSON)
- View formatted response

### User Management
- View all users in a table
- Create new users
- Edit existing users
- Delete users
- Refresh user list

### Metrics Dashboard
- Real-time metrics cards
- User activity line chart
- Service load bar chart
- User distribution pie chart
- System health status

## Configuration

### API Endpoints

The base URLs for services are configured in `/src/services/api.ts`:
```typescript
const BASE_URLS = {
  identity: "http://localhost:8081",
  matchmaking: "http://localhost:8082",
  economy: "http://localhost:8083",
}
```

Modify these URLs if your services run on different ports.

## Customization

### Theme Colors

Edit theme colors in `src/index.css` under the `:root` and `.dark` selectors.

### Components

All UI components are in `src/components/ui/` and can be customized as needed.

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your backend services allow requests from `http://localhost:5173`.

### Connection Refused
Make sure all backend microservices are running before using the backoffice.

### Authentication Failures
Verify the login endpoint at `http://localhost:8081/auth/login` is accessible and returns a JWT token.

## License

MIT
