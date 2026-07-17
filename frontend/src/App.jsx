import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import PlacementGuide from './pages/PlacementGuide'
import CompanyPrep from './pages/CompanyPrep'
import Profile from './pages/Profile'
import AptitudeGuide from './pages/AptitudeGuide'
import CodingGuide from './pages/CodingGuide'
import TechnicalInterview from './pages/TechnicalInterview'
import ProfileReview from './pages/ProfileReview'
import PracticeZone from './pages/PracticeZone'
import AptitudePracticeTest from './pages/AptitudePracticeTest'
import AptitudeReport from './pages/AptitudeReport'
import CodingWorkspace from './pages/CodingWorkspace'

function AppLayout() {
  const location = useLocation()
  const hideLayout = ['/login', '/register'].includes(location.pathname)

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/placement-guide" element={<PlacementGuide />} />
          <Route path="/placement-guide/aptitude" element={<AptitudeGuide />} />
          <Route path="/placement-guide/coding" element={<CodingGuide />} />
          <Route path="/placement-guide/interview" element={<TechnicalInterview />} />
          <Route path="/placement-guide/profile-optimizer" element={<ProfileReview />} />
          <Route path="/company-prep" element={<CompanyPrep />} />

          <Route path="/practice-zone" element={<PracticeZone />} />
          <Route path="/practice-zone/aptitude/test" element={<AptitudePracticeTest />} />
          <Route path="/practice-zone/aptitude/report/:id" element={<AptitudeReport />} />
          <Route path="/practice-zone/coding/workspace" element={<CodingWorkspace />} />

          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  )
}

export default App
