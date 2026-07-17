# AI Resume Analyzer - Setup & Integration Guide

## Project Structure

```
AI RESUME/
├── frontend/          (React + Vite)
│   ├── src/
│   ├── .env          (API configuration)
│   └── package.json
│
└── backend/          (Node.js + Express + MongoDB)
    ├── config/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middleware/
    ├── utils/
    ├── .env          (Database & server config)
    └── package.json
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Edit `.env` file and update:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ai-resume-analyzer

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_secure_secret_key_here
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### 3. Start MongoDB

Make sure MongoDB is running:

**Windows (if installed locally):**
```bash
mongod
```

**Or use MongoDB Atlas (cloud):**
- Create account at https://www.mongodb.com/cloud/atlas
- Create cluster and connection string
- Update `MONGODB_URI` in `.env`

### 4. Start Backend Server

```bash
npm run dev
```

Server will start on: `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

The `.env` file is already configured with:

```env
VITE_API_URL=http://localhost:5000/api
```

Change this if your backend runs on a different address.

### 3. Start Frontend Development Server

```bash
npm run dev
```

Application will open at: `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Resume Management
- `POST /api/resume/upload` - Upload resume
- `GET /api/resume` - Get all user resumes
- `GET /api/resume/:id` - Get resume by ID
- `POST /api/resume/:id/recommendations` - Generate recommendations
- `PUT /api/resume/:id/feedback` - Update feedback
- `DELETE /api/resume/:id` - Delete resume

### Placement & Progress
- `GET /api/placement/progress` - Get user progress
- `PUT /api/placement/progress` - Update progress
- `POST /api/placement/progress/milestone` - Add milestone
- `PUT /api/placement/progress/milestone/:id` - Complete milestone
- `GET /api/placement/summary` - Get progress summary

### Company Directory
- `GET /api/company` - Get all companies (paginated)
- `GET /api/company/top` - Get top companies
- `GET /api/company/search?query=...` - Search companies
- `GET /api/company/:id` - Get company details
- `POST /api/company/skills` - Get companies by skills
- `GET /api/company/:id/resources` - Get company resources

## Frontend Services

### Use the services in your components:

```javascript
// Authentication
import authService from '@/services/authService'
await authService.login(email, password)
await authService.register(firstName, lastName, email, password, confirmPassword)
await authService.logout()

// Resume
import resumeService from '@/services/resumeService'
await resumeService.uploadResume(file)
await resumeService.getUserResumes()
await resumeService.generateRecommendations(resumeId)

// Placement
import placementService from '@/services/placementService'
await placementService.getUserProgress()
await placementService.updateProgress(targetRole, targetCompanies, status)
await placementService.getAllCompanies(page, limit)
```

## API Client Utility

Use the centralized API client for direct API calls:

```javascript
import apiClient from '@/utils/apiClient'

// GET request
const data = await apiClient.get('/resume')

// POST request
const result = await apiClient.post('/resume/upload', { /* data */ })

// PUT request
const updated = await apiClient.put('/resume/:id/feedback', { feedback: '...' })

// DELETE request
await apiClient.delete('/resume/:id')

// Form data (for file uploads)
const formData = new FormData()
formData.append('resume', file)
await apiClient.postFormData('/resume/upload', formData)
```

## Common Issues & Solutions

### CORS Error
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Clear browser cache and restart servers

### MongoDB Connection Error
- Check if MongoDB is running: `mongod`
- Verify `MONGODB_URI` in `.env`
- Check MongoDB is accessible on `localhost:27017`

### API Not Found
- Verify backend is running on `http://localhost:5000`
- Check `VITE_API_URL` in frontend `.env`
- Ensure routes are properly configured in backend

### Token Errors
- Clear localStorage: Open DevTools > Application > Local Storage > Clear All
- Re-login to generate new token
- Verify `JWT_SECRET` is set in backend `.env`

## Testing the Integration

### 1. Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Get Protected Resource
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Development Workflow

1. **Start MongoDB** (if local)
2. **Start Backend**: `npm run dev` (from backend folder)
3. **Start Frontend**: `npm run dev` (from frontend folder)
4. **Open Browser**: http://localhost:3000

## Build for Production

### Frontend
```bash
cd frontend
npm run build
```

### Backend
Set `NODE_ENV=production` in `.env` before deployment

## Additional Features to Implement

- [ ] Email verification for registration
- [ ] Password reset functionality
- [ ] Resume PDF export
- [ ] Real-time notifications
- [ ] Company ratings & reviews
- [ ] Interview preparation videos
- [ ] Skill recommendations based on job market
- [ ] Placement statistics dashboard

## Support

For issues or questions, check the logs in browser DevTools (Frontend) and terminal (Backend).
