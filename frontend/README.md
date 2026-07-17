# AI Resume Analyzer - Frontend

A modern React-based frontend for an AI-powered resume analyzer and placement guide platform.

## Features

- **Resume Upload & Analysis**: Upload resumes and get instant AI-powered feedback
- **Resume Scoring**: Get a detailed score breakdown with recommendations
- **Skill Detection**: Automatically identify and display detected skills
- **Placement Guide**: Comprehensive guides for resume writing, interviews, and networking
- **Company Preparation**: Company-specific interview preparation and requirements
- **User Dashboard**: Track your progress and recent activities
- **User Profile**: Manage your profile, skills, and experience

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ResumeUpload.jsx
│   │   ├── ResumeScoreCard.jsx
│   │   ├── SkillCard.jsx
│   │   ├── RecommendationCard.jsx
│   │   └── CompanyCard.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ResumeAnalyzer.jsx
│   │   ├── PlacementGuide.jsx
│   │   ├── CompanyPrep.jsx
│   │   └── Profile.jsx
│   ├── services/
│   │   ├── authService.js
│   │   ├── resumeService.js
│   │   └── placementService.js
│   ├── App.js
│   ├── main.jsx
│   └── index.css
├── vite.config.js
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.cjs
└── .gitignore
```

## Tech Stack

- **React 18**: UI library
- **Vite**: Build tool and development server
- **React Router DOM**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **ESLint**: Code quality tool

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build

Build for production:
```bash
npm run build
```

### Preview

Preview the production build:
```bash
npm run preview
```

### Linting

Check code quality:
```bash
npm run lint
```

Fix linting issues:
```bash
npm run lint:fix
```

## Available Routes

- `/` - Home page
- `/login` - User login
- `/register` - User registration
- `/dashboard` - User dashboard
- `/resume-analyzer` - Resume analysis tool
- `/placement-guide` - Placement preparation guide
- `/company-prep` - Company-specific preparation
- `/profile` - User profile management

## Components

### Navbar
Main navigation component with links to all major sections.

### Footer
Footer with links to important pages and company information.

### ResumeUpload
Drag-and-drop component for resume file upload.

### ResumeScoreCard
Displays resume analysis score and feedback.

### SkillCard
Shows individual skill with proficiency level.

### RecommendationCard
Displays actionable recommendations for resume improvement.

### CompanyCard
Shows company details with interview preparation tips.

## Services

### authService
Handles user authentication, registration, and token management.

### resumeService
Manages resume upload, analysis, and retrieval operations.

### placementService
Provides placement guides, company information, and interview tips.

## Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## API Integration

The application communicates with a backend API (typically running on `http://localhost:5000`). Services use JWT tokens stored in localStorage for authentication.

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

MIT
