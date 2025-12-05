# Quick Start Guide

## Getting Started

1. **Start the Backend Services**
   
   Make sure all three microservices are running:
   - Identity Player on port 8081
   - Matchmaking on port 8082
   - Economy Community on port 8083

2. **Install Dependencies**
   ```bash
   cd backoffice
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   
   Navigate to http://localhost:5173

5. **Login**
   
   Use credentials from your identity-player service.
   
   Example login request:
   ```json
   POST http://localhost:8081/auth/login
   {
     "username": "your-username",
     "password": "your-password"
   }
   ```

## Available Pages

- **Dashboard** (`/`) - Overview of the system
- **API Tester** (`/api-tester`) - Test API endpoints
- **Users** (`/users`) - Manage users
- **Metrics** (`/metrics`) - View analytics and charts

## Tips

- The JWT token is automatically included in all API requests
- Use the API Tester to quickly test endpoints without leaving the UI
- Refresh buttons are available to reload data manually
- All forms validate input before submission

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Environment

- **Dev Server**: http://localhost:5173
- **Identity Service**: http://localhost:8081
- **Matchmaking Service**: http://localhost:8082
- **Economy Service**: http://localhost:8083

## Troubleshooting

**Problem**: Cannot connect to backend services

**Solution**: Verify all backend services are running on the correct ports

---

**Problem**: CORS errors in console

**Solution**: Configure your backend services to allow requests from http://localhost:5173

---

**Problem**: Login fails

**Solution**: Check that the identity-player service is running and the `/auth/login` endpoint is working

---

**Problem**: Missing environment variables

**Solution**: This app doesn't require environment variables. API URLs are configured in `src/services/api.ts`
