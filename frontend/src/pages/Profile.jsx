import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import profileService from '../services/profileService'
import resumeService from "../services/resumeService";

export default function Profile() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Data States
  const [profile, setProfile] = useState(null)
  const [resumes, setResumes] = useState([])
  const [portfolioHistory, setPortfolioHistory] = useState([])
  const [aptitudeAttempts, setAptitudeAttempts] = useState([])
  const [codingAttempts, setCodingAttempts] = useState([])
  
  // UI Tabs State
  const [activeTab, setActiveTab] = useState('personal') // 'personal', 'skills', 'education', 'audits', 'certificates', 'settings'
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingCareer, setIsEditingCareer] = useState(false)
  
  // Edit Form Inputs
  const [personalForm, setPersonalForm] = useState({
    name: '', phone: '', college: '', graduationYear: '', gpa: '', bio: '', branch: '', yearOfStudy: '', city: '', state: ''
  })
  const [careerForm, setCareerForm] = useState({
    targetRole: '', preferredStack: '', dreamCompany: '', expectedPackage: '', currentSkillLevel: 'Beginner', placementGoal: '', preferredLocation: ''
  })
  const [selectedAvatar, setSelectedAvatar] = useState(null)

  // Skill Form Inputs
  const [newSkill, setNewSkill] = useState({ skillName: '', proficiency: 'Beginner', category: 'Programming Languages', progress: 50 })
  // Education Form Inputs
  const [newEducation, setNewEducation] = useState({ institution: '', degree: '', field: '', graduationYear: '', gpa: '' })
  // Certificate Form Inputs
  const [newCert, setNewCert] = useState({ name: '', issuer: '', date: '' })
  const [selectedCertFile, setSelectedCertFile] = useState(null)

  // Settings Password Inputs
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [settingsForm, setSettingsForm] = useState({ notificationsEnabled: true, darkModeEnabled: false })
  const [linksForm, setLinksForm] = useState({ github: '', linkedin: '', portfolio: '', leetcode: '', codechef: '', hackerrank: '', codeforces: '' })

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    fetchDetails()
  }, [])

  const fetchDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await profileService.getProfileDetails()
      if (res.success) {
        setProfile(res.profile)
        setResumes(res.resumes || [])
        setPortfolioHistory(res.portfolioHistory || [])
        setAptitudeAttempts(res.aptitudeAttempts || [])
        setCodingAttempts(res.codingAttempts || [])
        
        // Initialize Forms
        setPersonalForm({
          name: res.profile.name || '',
          phone: res.profile.phone || '',
          college: res.profile.college || '',
          graduationYear: res.profile.graduationYear || '',
          gpa: res.profile.gpa || '',
          bio: res.profile.bio || '',
          branch: res.profile.personalInfo?.branch || '',
          yearOfStudy: res.profile.personalInfo?.yearOfStudy || '',
          city: res.profile.personalInfo?.city || '',
          state: res.profile.personalInfo?.state || ''
        })

        setCareerForm({
          targetRole: res.profile.careerInfo?.targetRole || 'MERN Stack Developer',
          preferredStack: res.profile.careerInfo?.preferredStack?.join(', ') || '',
          dreamCompany: res.profile.careerInfo?.dreamCompany || '',
          expectedPackage: res.profile.careerInfo?.expectedPackage || '',
          currentSkillLevel: res.profile.careerInfo?.currentSkillLevel || 'Beginner',
          placementGoal: res.profile.careerInfo?.placementGoal || '',
          preferredLocation: res.profile.careerInfo?.preferredLocation || ''
        })

        setLinksForm({
          github: res.profile.portfolioLinks?.github || '',
          linkedin: res.profile.portfolioLinks?.linkedin || '',
          portfolio: res.profile.portfolioLinks?.portfolio || '',
          leetcode: res.profile.portfolioLinks?.leetcode || '',
          codechef: res.profile.portfolioLinks?.codechef || '',
          hackerrank: res.profile.portfolioLinks?.hackerrank || '',
          codeforces: res.profile.portfolioLinks?.codeforces || ''
        })

        setSettingsForm({
          notificationsEnabled: res.profile.settings?.notificationsEnabled ?? true,
          darkModeEnabled: res.profile.settings?.darkModeEnabled ?? false
        })
      }
      setLoading(false)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to retrieve profile data from the server.')
      setLoading(false)
    }
  }

  // Update Personal Details Submit
  const handlePersonalSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('name', personalForm.name)
      formData.append('phone', personalForm.phone)
      formData.append('college', personalForm.college)
      formData.append('graduationYear', personalForm.graduationYear)
      formData.append('gpa', personalForm.gpa)
      formData.append('bio', personalForm.bio)
      formData.append('branch', personalForm.branch)
      formData.append('yearOfStudy', personalForm.yearOfStudy)
      formData.append('city', personalForm.city)
      formData.append('state', personalForm.state)
      if (selectedAvatar) {
        formData.append('profilePicture', selectedAvatar)
      }

      const res = await profileService.updatePersonalInfo(formData)
      if (res.success) {
        setProfile(res.profile)
        setIsEditingProfile(false)
        setSelectedAvatar(null)
        alert('Personal profile updated successfully!')
      }
    } catch (err) {
      alert(err.message || 'Personal info update failed')
    }
  }

  // Update Career Details Submit
  const handleCareerSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await profileService.updateCareerInfo(careerForm)
      if (res.success) {
        setProfile(res.profile)
        setIsEditingCareer(false)
        alert('Target placement and career details saved!')
      }
    } catch (err) {
      alert(err.message || 'Career info update failed')
    }
  }

  // Skills CRUD
  const handleAddSkill = async (e) => {
    e.preventDefault()
    if (!newSkill.skillName) return
    try {
      const res = await profileService.addSkill(newSkill)
      if (res.success) {
        setProfile(res.profile)
        setNewSkill({ skillName: '', proficiency: 'Beginner', category: 'Programming Languages', progress: 50 })
        alert('Skill added successfully!')
      }
    } catch (err) {
      alert(err.message || 'Skill addition failed')
    }
  }

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Delete this skill from your portfolio?')) return
    try {
      const res = await profileService.deleteSkill(id)
      if (res.success) {
        setProfile(res.profile)
      }
    } catch (err) {
      alert(err.message || 'Skill deletion failed')
    }
  }

  // Education CRUD
  const handleAddEducation = async (e) => {
    e.preventDefault()
    if (!newEducation.institution || !newEducation.degree) return
    try {
      const res = await profileService.addEducation(newEducation)
      if (res.success) {
        setProfile(res.profile)
        setNewEducation({ institution: '', degree: '', field: '', graduationYear: '', gpa: '' })
        alert('Education milestone added!')
      }
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDeleteEducation = async (id) => {
    if (!window.confirm('Delete this education record?')) return
    try {
      const res = await profileService.deleteEducation(id)
      if (res.success) {
        setProfile(res.profile)
      }
    } catch (err) {
      alert(err.message)
    }
  }

  // Certificates CRUD
  const handleUploadCert = async (e) => {
    e.preventDefault()
    if (!newCert.name || !newCert.issuer || !selectedCertFile) {
      alert('Please fill certificate name, issuer, and select a file to upload.')
      return
    }
    try {
      const formData = new FormData()
      formData.append('name', newCert.name)
      formData.append('issuer', newCert.issuer)
      if (newCert.date) {
        formData.append('date', newCert.date)
      }
      formData.append('certificate', selectedCertFile)

      const res = await profileService.uploadCertificate(formData)
      if (res.success) {
        setProfile(res.profile)
        setNewCert({ name: '', issuer: '', date: '' })
        setSelectedCertFile(null)
        // Reset file input element
        document.getElementById('certFileInput').value = ''
        alert('Certificate uploaded and categorized automatically by AI!')
      }
    } catch (err) {
      alert(err.message || 'Certificate upload failed')
    }
  }

  const handleDeleteCert = async (id) => {
    if (!window.confirm('Permanently delete this certificate from your locker?')) return
    try {
      const res = await profileService.deleteCertificate(id)
      if (res.success) {
        setProfile(res.profile)
      }
    } catch (err) {
      alert(err.message)
    }
  }

  // Links update
  const handleLinksSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await profileService.updatePortfolioLinks(linksForm)
      if (res.success) {
        setProfile(res.profile)
        alert('Portfolio urls and social links updated!')
      }
    } catch (err) {
      alert(err.message)
    }
  }

  // Settings submit
  const handleSettingsSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await profileService.updateSettings(settingsForm)
      if (res.success) {
        setProfile(res.profile)
        alert('Settings updated successfully!')
      }
    } catch (err) {
      alert(err.message)
    }
  }

  // Password submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match')
      return
    }
    try {
      const res = await profileService.changePassword(passwordForm)
      if (res.success) {
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
        alert('Password updated successfully!')
      }
    } catch (err) {
      alert(err.message || 'Password update failed')
    }
  }

  // Data export download
  const handleExportData = async () => {
    try {
      await profileService.exportProfileData()
    } catch (err) {
      alert('Failed to export data')
    }
  }

  // Account deletion
  const handleDeleteAccount = async () => {
    const confirm1 = window.confirm('DANGER: Are you absolutely sure you want to permanently delete your placement account? This action CANNOT be undone.')
    if (!confirm1) return
    const confirm2 = window.confirm('RE-CONFIRMATION: You will lose all your mock aptitude records, coding scores, resume analyses, and credentials. Type OK to delete.')
    if (!confirm2) return
    try {
      const res = await profileService.deleteAccount()
      alert(res.message)
      localStorage.clear()
      navigate('/login')
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Creating portfolio workspace...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-red-100 shadow-lg text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Portfolio Not Found</h2>
          <p className="text-gray-500 mb-6">{error || 'Could not retrieve profile statistics.'}</p>
          <button onClick={fetchDetails} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold">
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  // Group skills by category
  const skillsByCategory = {}
  profile.skills?.forEach(s => {
    if (!skillsByCategory[s.category]) {
      skillsByCategory[s.category] = []
    }
    skillsByCategory[s.category].push(s)
  })

  // Get active user initials
  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'JD'
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 animate-fadeIn">
      
      {/* Dynamic Header Frame */}
      <div className="relative bg-slate-900 h-44 flex items-end">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-40 bg-gradient-to-tr from-indigo-900 via-indigo-950 to-slate-950"></div>
        </div>
        <div className="max-w-7xl w-full mx-auto px-4 pb-6 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="flex items-end">
            {profile.profilePicture ? (
              <img 
                src={
                  profile.profilePicture.toString().startsWith('/uploads/')
                    ? `http://localhost:5000${profile.profilePicture}`
                    : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/profile/photo/${profile.profilePicture}`
                } 
                alt="Avatar" 
                className="w-24 h-24 rounded-full border-4 border-white object-cover bg-white shadow-md -mb-12"
              />
            ) : (
              <div className="w-24 h-24 bg-indigo-650 rounded-full border-4 border-white flex items-center justify-center text-white text-3xl font-black shadow-md -mb-12">
                {getInitials(profile.name)}
              </div>
            )}
            <div className="ml-6 mb-2 text-white">
              <h1 className="text-3xl font-black tracking-tight">{profile.name}</h1>
              <p className="text-xs font-bold text-indigo-300 mt-1">{profile.careerInfo?.targetRole || 'Full Stack Developer'}</p>
            </div>
          </div>
          
          <div className="text-white text-right md:mb-2 bg-slate-950/40 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/5">
            <span className="block text-xs text-slate-400 font-bold uppercase tracking-wide">Readiness Score</span>
            <span className="text-2xl font-black text-indigo-400">
              {resumes.length > 0 ? (resumes[0].atsScore || 70) : 0}%
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Tabs Menu Column */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-1">
          {[
            { id: 'personal', label: 'Personal & Career', icon: '👤' },
            { id: 'skills', label: 'Skills Manager', icon: '🛠️' },
            { id: 'education', label: 'Education & Resumes', icon: '🎓' },
            { id: 'audits', label: 'Portfolio Audits', icon: '🐙' },
            { id: 'certificates', label: 'Certifications', icon: '🎖️' },
            { id: 'settings', label: 'Account Settings', icon: '⚙️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-2xl text-xs font-extrabold transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right Details Work Content Column */}
        <div className="lg:col-span-9 space-y-8">
          
          {/* TAB 1: PERSONAL & CAREER INFORMATION */}
          {activeTab === 'personal' && (
            <div className="space-y-8">
              {/* Personal Info Form */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-center pb-3 border-b border-slate-50 mb-6">
                  <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                    <span>👤</span> Personal Information
                  </h3>
                  <button 
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    {isEditingProfile ? 'Cancel Edit' : 'Edit Details'}
                  </button>
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handlePersonalSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Full Name</label>
                        <input
                          type="text"
                          required
                          value={personalForm.name}
                          onChange={e => setPersonalForm({ ...personalForm, name: e.target.value })}
                          className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Phone Number</label>
                        <input
                          type="text"
                          value={personalForm.phone}
                          onChange={e => setPersonalForm({ ...personalForm, phone: e.target.value })}
                          className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-extrabold uppercase">College Name</label>
                        <input
                          type="text"
                          value={personalForm.college}
                          onChange={e => setPersonalForm({ ...personalForm, college: e.target.value })}
                          className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Branch</label>
                        <input
                          type="text"
                          value={personalForm.branch}
                          onChange={e => setPersonalForm({ ...personalForm, branch: e.target.value })}
                          className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                          placeholder="e.g. Computer Science Engineering"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Graduation Year</label>
                        <input
                          type="number"
                          value={personalForm.graduationYear}
                          onChange={e => setPersonalForm({ ...personalForm, graduationYear: e.target.value })}
                          className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-extrabold uppercase">CGPA / GPA</label>
                        <input
                          type="number"
                          step="0.01"
                          value={personalForm.gpa}
                          onChange={e => setPersonalForm({ ...personalForm, gpa: e.target.value })}
                          className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Year of Study</label>
                        <select
                          value={personalForm.yearOfStudy}
                          onChange={e => setPersonalForm({ ...personalForm, yearOfStudy: e.target.value })}
                          className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                        >
                          <option value="">Select Year</option>
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-slate-400 font-extrabold uppercase">City</label>
                          <input
                            type="text"
                            value={personalForm.city}
                            onChange={e => setPersonalForm({ ...personalForm, city: e.target.value })}
                            className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 font-extrabold uppercase">State</label>
                          <input
                            type="text"
                            value={personalForm.state}
                            onChange={e => setPersonalForm({ ...personalForm, state: e.target.value })}
                            className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Short Bio</label>
                      <textarea
                        value={personalForm.bio}
                        onChange={e => setPersonalForm({ ...personalForm, bio: e.target.value })}
                        className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 h-20"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Profile Picture (Image only)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => setSelectedAvatar(e.target.files[0])}
                        className="mt-1 block text-xs cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                    </div>
                    <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm">
                      Save Changes
                    </button>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
                    <div className="space-y-3.5">
                      <p><span className="font-extrabold text-slate-400 block uppercase text-[10px]">Email Address</span> {profile.email}</p>
                      <p><span className="font-extrabold text-slate-400 block uppercase text-[10px]">Phone Number</span> {profile.phone || 'N/A'}</p>
                      <p><span className="font-extrabold text-slate-400 block uppercase text-[10px]">College Name</span> {profile.college || 'N/A'}</p>
                      <p><span className="font-extrabold text-slate-400 block uppercase text-[10px]">Branch & Year</span> {profile.personalInfo?.branch || 'N/A'} ({profile.personalInfo?.yearOfStudy || 'N/A'})</p>
                    </div>
                    <div className="space-y-3.5">
                      <p><span className="font-extrabold text-slate-400 block uppercase text-[10px]">Graduation Year</span> {profile.graduationYear || 'N/A'}</p>
                      <p><span className="font-extrabold text-slate-400 block uppercase text-[10px]">GPA / CGPA</span> {profile.gpa || 'N/A'}</p>
                      <p><span className="font-extrabold text-slate-400 block uppercase text-[10px]">Location</span> {profile.personalInfo?.city || 'N/A'}, {profile.personalInfo?.state || 'N/A'}</p>
                      <p><span className="font-extrabold text-slate-400 block uppercase text-[10px]">Bio Summary</span> {profile.bio || 'N/A'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Career details forms */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-center pb-3 border-b border-slate-50 mb-6">
                  <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                    <span>💼</span> Placement Target details
                  </h3>
                  <button 
                    onClick={() => setIsEditingCareer(!isEditingCareer)}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    {isEditingCareer ? 'Cancel Edit' : 'Edit details'}
                  </button>
                </div>

                {isEditingCareer ? (
                  <form onSubmit={handleCareerSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Target Job Role</label>
                        <input
                          type="text"
                          required
                          value={careerForm.targetRole}
                          onChange={e => setCareerForm({ ...careerForm, targetRole: e.target.value })}
                          className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Dream Company</label>
                        <input
                          type="text"
                          value={careerForm.dreamCompany}
                          onChange={e => setCareerForm({ ...careerForm, dreamCompany: e.target.value })}
                          className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Expected Package (LPA)</label>
                        <input
                          type="text"
                          value={careerForm.expectedPackage}
                          onChange={e => setCareerForm({ ...careerForm, expectedPackage: e.target.value })}
                          className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Current Skill Level</label>
                        <select
                          value={careerForm.currentSkillLevel}
                          onChange={e => setCareerForm({ ...careerForm, currentSkillLevel: e.target.value })}
                          className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Preferred Stack (comma separated)</label>
                        <input
                          type="text"
                          value={careerForm.preferredStack}
                          onChange={e => setCareerForm({ ...careerForm, preferredStack: e.target.value })}
                          className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Preferred Location</label>
                        <input
                          type="text"
                          value={careerForm.preferredLocation}
                          onChange={e => setCareerForm({ ...careerForm, preferredLocation: e.target.value })}
                          className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Placement Goal / Notes</label>
                      <input
                        type="text"
                        value={careerForm.placementGoal}
                        onChange={e => setCareerForm({ ...careerForm, placementGoal: e.target.value })}
                        className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                        placeholder="e.g. Target product-tier roles with high DSA alignment."
                      />
                    </div>
                    <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm">
                      Save Career Goals
                    </button>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
                    <div className="space-y-3.5">
                      <p><span className="font-extrabold text-slate-400 block uppercase text-[10px]">Target Job Role</span> {profile.careerInfo?.targetRole || 'Full Stack Developer'}</p>
                      <p><span className="font-extrabold text-slate-400 block uppercase text-[10px]">Dream Company</span> {profile.careerInfo?.dreamCompany || 'N/A'}</p>
                      <p><span className="font-extrabold text-slate-400 block uppercase text-[10px]">Expected Package</span> {profile.careerInfo?.expectedPackage ? `${profile.careerInfo.expectedPackage} LPA` : 'N/A'}</p>
                    </div>
                    <div className="space-y-3.5">
                      <p><span className="font-extrabold text-slate-400 block uppercase text-[10px]">Current Skill Level</span> {profile.careerInfo?.currentSkillLevel || 'Beginner'}</p>
                      <p><span className="font-extrabold text-slate-400 block uppercase text-[10px]">Preferred Stack</span> {profile.careerInfo?.preferredStack?.join(', ') || 'N/A'}</p>
                      <p><span className="font-extrabold text-slate-400 block uppercase text-[10px]">Placement Goals</span> {profile.careerInfo?.placementGoal || 'N/A'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS MANAGEMENT */}
          {activeTab === 'skills' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Skill Add Form */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
                <h3 className="font-extrabold text-gray-900 text-base pb-3 border-b border-slate-50 mb-6 flex items-center gap-2">
                  <span>🛠️</span> Add Skill
                </h3>
                <form onSubmit={handleAddSkill} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end text-xs">
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Skill Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. React.js, Python, AWS"
                      value={newSkill.skillName}
                      onChange={e => setNewSkill({ ...newSkill, skillName: e.target.value })}
                      className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Category</label>
                    <select
                      value={newSkill.category}
                      onChange={e => setNewSkill({ ...newSkill, category: e.target.value })}
                      className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                    >
                      <option value="Programming Languages">Programming Languages</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Databases">Databases</option>
                      <option value="Frameworks">Frameworks</option>
                      <option value="Cloud">Cloud</option>
                      <option value="AI & Machine Learning">AI & ML</option>
                      <option value="Data Analytics">Data Analytics</option>
                      <option value="Tools">Tools</option>
                      <option value="Soft Skills">Soft Skills</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Proficiency</label>
                    <select
                      value={newSkill.proficiency}
                      onChange={e => setNewSkill({ ...newSkill, proficiency: e.target.value })}
                      className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Progress ({newSkill.progress}%)</label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={newSkill.progress}
                      onChange={e => setNewSkill({ ...newSkill, progress: Number(e.target.value) })}
                      className="w-full mt-3 cursor-pointer accent-indigo-650"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm text-xs">
                      Add
                    </button>
                  </div>
                </form>
              </div>

              {/* Skills Catalog Listing */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
                <h3 className="font-extrabold text-gray-900 text-base pb-3 border-b border-slate-50 mb-6">Skills Locker</h3>
                
                {profile.skills?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-6">No skills added. Complete the form above to catalog your skills.</p>
                ) : (
                  <div className="space-y-6">
                    {Object.keys(skillsByCategory).map(catName => (
                      <div key={catName} className="space-y-3.5">
                        <h4 className="text-xs font-black text-indigo-650 bg-indigo-50 px-3 py-1 rounded-md uppercase tracking-wider inline-block">
                          {catName}
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {skillsByCategory[catName].map(skill => (
                            <div key={skill._id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center hover:border-slate-200 transition-all shadow-sm">
                              <div className="min-w-0 flex-grow mr-4">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs font-bold text-slate-800 truncate">{skill.skillName}</span>
                                  <span className="text-[9px] font-extrabold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded uppercase">
                                    {skill.proficiency}
                                  </span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${skill.progress || 50}%` }}></div>
                                </div>
                              </div>
                              <button 
                                onClick={() => handleDeleteSkill(skill._id)}
                                className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors flex-shrink-0"
                                title="Delete Skill"
                              >
                                🗑️
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ACADEMIC & RESUMES HISTORY */}
          {activeTab === 'education' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Education history Form */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
                <h3 className="font-extrabold text-gray-900 text-base pb-3 border-b border-slate-50 mb-6 flex items-center gap-2">
                  <span>🎓</span> Add Academic Milestone
                </h3>
                <form onSubmit={handleAddEducation} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end text-xs">
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Institution / College</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Stanford University"
                      value={newEducation.institution}
                      onChange={e => setNewEducation({ ...newEducation, institution: e.target.value })}
                      className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Degree</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. B.Tech, M.S."
                      value={newEducation.degree}
                      onChange={e => setNewEducation({ ...newEducation, degree: e.target.value })}
                      className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Field of Study</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Computer Science"
                      value={newEducation.field}
                      onChange={e => setNewEducation({ ...newEducation, field: e.target.value })}
                      className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Graduation Year</label>
                    <input
                      type="number"
                      required
                      placeholder="2026"
                      value={newEducation.graduationYear}
                      onChange={e => setNewEducation({ ...newEducation, graduationYear: e.target.value })}
                      className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] text-slate-400 font-extrabold uppercase">CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="8.5"
                      value={newEducation.gpa}
                      onChange={e => setNewEducation({ ...newEducation, gpa: e.target.value })}
                      className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm text-xs">
                      Add
                    </button>
                  </div>
                </form>

                {/* Education list */}
                {profile.educationHistory?.length > 0 && (
                  <div className="mt-6 space-y-3.5 border-t border-slate-50 pt-5">
                    {profile.educationHistory.map((edu) => (
                      <div key={edu._id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center text-xs text-slate-650">
                        <div>
                          <p className="font-bold text-slate-900">{edu.degree} in {edu.field}</p>
                          <p className="text-[11px] text-slate-500">{edu.institution} • Class of {edu.graduationYear}</p>
                          {edu.gpa && <p className="text-[10px] text-indigo-600 font-extrabold mt-0.5">CGPA: {edu.gpa}</p>}
                        </div>
                        <button 
                          onClick={() => handleDeleteEducation(edu._id)}
                          className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Resume History List */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
                <h3 className="font-extrabold text-gray-900 text-base pb-3 border-b border-slate-50 mb-6">Resume Analysis History</h3>
                
                {resumes.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-6">No resumes uploaded yet. Visit the Analyzer room.</p>
                ) : (
                  <div className="space-y-6">
                    {resumes.map((resItem, idx) => {
                      const prevResItem = resumes[idx + 1]
                      const diff = prevResItem ? (resItem.atsScore - prevResItem.atsScore) : 0
                      return (
                        <div key={resItem._id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-650 space-y-4">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <p className="font-extrabold text-slate-800 text-sm">{resItem.fileName}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                Uploaded on {new Date(resItem.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-xl font-black text-indigo-650 block">{resItem.atsScore}% Score</span>
                              <span className="text-[9px] font-black bg-white border border-slate-200 px-2 py-0.5 rounded uppercase tracking-wider">
                                Grade: {typeof resItem.grade === 'object' && resItem.grade !== null ? (resItem.grade.grade || 'C') : (resItem.grade || 'C')}
                              </span>
                              {diff !== 0 && (
                                <span className={`block text-[9px] font-bold mt-1 ${diff > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                  {diff > 0 ? `▲ +${diff}% Improvement` : `▼ ${diff}% Decrease`}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action links */}
                          <div className="flex gap-4 border-t border-slate-100/60 pt-3">
                            <button
                              onClick={() =>
                                resumeService.downloadResume(
                                  resItem._id,
                                  resItem.fileName
                                )
                              }
                              className="text-xs font-bold text-indigo-650 hover:underline"
                            >
                              📥 Download Original Resume
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PORTFOLIO AUDITS (GITHUB / LINKEDIN) */}
          {activeTab === 'audits' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Configure Social Links Form */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
                <h3 className="font-extrabold text-gray-900 text-base pb-3 border-b border-slate-50 mb-6 flex items-center gap-2">
                  <span>🔗</span> Portfolio & Social Links
                </h3>
                <form onSubmit={handleLinksSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase">GitHub URL</label>
                      <input
                        type="url"
                        value={linksForm.github}
                        onChange={e => setLinksForm({ ...linksForm, github: e.target.value })}
                        className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase">LinkedIn URL</label>
                      <input
                        type="url"
                        value={linksForm.linkedin}
                        onChange={e => setLinksForm({ ...linksForm, linkedin: e.target.value })}
                        className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Portfolio Website</label>
                      <input
                        type="url"
                        value={linksForm.portfolio}
                        onChange={e => setLinksForm({ ...linksForm, portfolio: e.target.value })}
                        className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                        placeholder="https://myportfolio.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase">LeetCode URL</label>
                      <input
                        type="url"
                        value={linksForm.leetcode}
                        onChange={e => setLinksForm({ ...linksForm, leetcode: e.target.value })}
                        className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                        placeholder="https://leetcode.com/username"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase">CodeChef URL</label>
                      <input
                        type="url"
                        value={linksForm.codechef}
                        onChange={e => setLinksForm({ ...linksForm, codechef: e.target.value })}
                        className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase">HackerRank URL</label>
                      <input
                        type="url"
                        value={linksForm.hackerrank}
                        onChange={e => setLinksForm({ ...linksForm, hackerrank: e.target.value })}
                        className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Codeforces URL</label>
                      <input
                        type="url"
                        value={linksForm.codeforces}
                        onChange={e => setLinksForm({ ...linksForm, codeforces: e.target.value })}
                        className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm">
                    Save URLs
                  </button>
                </form>
              </div>

              {/* Portfolio scan audits list */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
                <h3 className="font-extrabold text-gray-900 text-base pb-3 border-b border-slate-50 mb-6">LinkedIn & GitHub Audits History</h3>
                
                {portfolioHistory.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-6">No audits computed. Visit the Profile Optimizer room.</p>
                ) : (
                  <div className="space-y-6">
                    {portfolioHistory.map((scanItem) => (
                      <div key={scanItem._id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-650">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <span className="font-bold text-slate-800 text-sm uppercase">Audit Targeting: {scanItem.targetRole}</span>
                            <span className="block text-[10px] text-slate-400 mt-0.5">
                              Audited on {new Date(scanItem.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                          </div>
                          <span className="text-sm font-black text-indigo-650 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
                            Presence: {scanItem.scores?.overallPresenceScore}%
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 border-t border-slate-100/50 pt-4 text-center">
                          <div>
                            <span className="block text-indigo-600 font-extrabold text-sm">{scanItem.scores?.githubScore}%</span>
                            <span className="text-[9px] text-slate-400 uppercase font-bold">GitHub Score</span>
                          </div>
                          <div>
                            <span className="block text-indigo-600 font-extrabold text-sm">{scanItem.scores?.linkedinScore}%</span>
                            <span className="text-[9px] text-slate-400 uppercase font-bold">LinkedIn Score</span>
                          </div>
                          <div>
                            <span className="block text-indigo-600 font-extrabold text-sm">{scanItem.scores?.recruiterReadiness || 0}%</span>
                            <span className="text-[9px] text-slate-400 uppercase font-bold">Recruiter Match</span>
                          </div>
                          <div>
                            <span className="block text-indigo-600 font-extrabold text-sm">{scanItem.scores?.portfolioReadiness || 0}%</span>
                            <span className="text-[9px] text-slate-400 uppercase font-bold">README Score</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: CERTIFICATIONS LOCKER */}
          {activeTab === 'certificates' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Certificate upload form */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
                <h3 className="font-extrabold text-gray-900 text-base pb-3 border-b border-slate-50 mb-6 flex items-center gap-2">
                  <span>🎖️</span> Add Certificate (Image or PDF)
                </h3>
                <form onSubmit={handleUploadCert} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Certificate Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. AWS Solutions Architect"
                        value={newCert.name}
                        onChange={e => setNewCert({ ...newCert, name: e.target.value })}
                        className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Issuing Authority</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Amazon Web Services, Coursera"
                        value={newCert.issuer}
                        onChange={e => setNewCert({ ...newCert, issuer: e.target.value })}
                        className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Issue Date</label>
                      <input
                        type="date"
                        value={newCert.date}
                        onChange={e => setNewCert({ ...newCert, date: e.target.value })}
                        className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Upload File (PDF/JPG/PNG)</label>
                    <input
                      type="file"
                      id="certFileInput"
                      required
                      accept=".pdf,image/*"
                      onChange={e => setSelectedCertFile(e.target.files[0])}
                      className="mt-1 block text-xs cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                  </div>
                  <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm">
                    Upload & Categorize via AI (+150 XP)
                  </button>
                </form>
              </div>

              {/* Uploaded Certificate Locker display */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
                <h3 className="font-extrabold text-gray-900 text-base pb-3 border-b border-slate-50 mb-6">Certifications Vault</h3>
                
                {profile.certificates?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-6">No certificates uploaded yet. Use the upload panel to start.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.certificates.map(cert => (
                      <div key={cert._id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center text-xs">
                        <div className="min-w-0 flex-grow mr-4">
                          <span className="text-[8px] font-black uppercase text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded">
                            {cert.category || 'Others'}
                          </span>
                          <p className="font-bold text-slate-800 mt-1 truncate">{cert.name}</p>
                          <p className="text-[10px] text-slate-400">{cert.issuer}</p>
                          {cert.date && (
                            <p className="text-[9px] text-slate-400">
                              Issued: {new Date(cert.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${cert.fileUrl}`, '_blank')}
                            className="text-xs font-bold text-indigo-650 hover:underline"
                          >
                            📄 View Certificate
                          </button>
                          <button 
                            onClick={() => handleDeleteCert(cert._id)}
                            className="bg-white hover:bg-rose-50 text-rose-500 border border-slate-200 p-2 rounded-lg"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Settings configuration form */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
                <h3 className="font-extrabold text-gray-900 text-base pb-3 border-b border-slate-50 mb-6">User Preferences</h3>
                <form onSubmit={handleSettingsSubmit} className="space-y-5 text-xs text-slate-650">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="notifToggle"
                      checked={settingsForm.notificationsEnabled}
                      onChange={e => setSettingsForm({ ...settingsForm, notificationsEnabled: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-650 focus:ring-indigo-500 border-slate-350"
                    />
                    <label htmlFor="notifToggle" className="font-semibold cursor-pointer">Enable placement alert emails and notifications</label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="themeToggle"
                      checked={settingsForm.darkModeEnabled}
                      onChange={e => setSettingsForm({ ...settingsForm, darkModeEnabled: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-650 focus:ring-indigo-500 border-slate-350"
                    />
                    <label htmlFor="themeToggle" className="font-semibold cursor-pointer">Enable dark theme environment (Beta)</label>
                  </div>
                  
                  <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm">
                    Save Preferences
                  </button>
                </form>
              </div>

              {/* Change Password Form */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
                <h3 className="font-extrabold text-gray-900 text-base pb-3 border-b border-slate-50 mb-6">Change Password</h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Old Password</label>
                      <input
                        type="password"
                        required
                        value={passwordForm.oldPassword}
                        onChange={e => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                        className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase">New Password</label>
                      <input
                        type="password"
                        required
                        value={passwordForm.newPassword}
                        onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={passwordForm.confirmPassword}
                        onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <button type="submit" className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm">
                    Change Password
                  </button>
                </form>
              </div>

              {/* Data export / Delete account */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="font-extrabold text-gray-950 text-sm">Export Portfolio Details</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-normal">
                    Download a full backup of all your personal academic history, certificates metadata, streaks, coding attempts, and resume assessments as a portable JSON file.
                  </p>
                  <button 
                    onClick={handleExportData}
                    className="mt-3 px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl text-xs font-bold transition-colors"
                  >
                    📥 Export Data Backup
                  </button>
                </div>

                <div className="border-t border-slate-50 pt-5">
                  <h3 className="font-extrabold text-rose-600 text-sm">Dangerous Zone: Permanent Account Deletion</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-normal">
                    Permanently delete your profile account and purge all databases records (certificates files, mock test reports, streaks history). This action is irreversible.
                  </p>
                  <button 
                    onClick={handleDeleteAccount}
                    className="mt-3 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-rose-600/35"
                  >
                    🗑️ Permanently Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}
