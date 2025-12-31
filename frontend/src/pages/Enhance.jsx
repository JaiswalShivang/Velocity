import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { resumeApi, enhanceApi } from '../services/api'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'

export default function Enhance() {
  const { resumeId } = useParams()
  const navigate = useNavigate()
  
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enhancing, setEnhancing] = useState(false)
  
  // Enhancement preferences
  const [preferences, setPreferences] = useState({
    jobRole: '',
    yearsOfExperience: '',
    skills: '',
    industry: '',
    customInstructions: ''
  })

  useEffect(() => {
    fetchResume()
  }, [resumeId])

  const fetchResume = async () => {
    try {
      const response = await resumeApi.getById(resumeId)
      setResume(response.data)
      
      // Pre-fill preferences if available
      if (response.data.preferences) {
        setPreferences({
          jobRole: response.data.jobRole || '',
          yearsOfExperience: response.data.preferences.yearsOfExperience || '',
          skills: response.data.preferences.skills?.join(', ') || '',
          industry: response.data.preferences.industry || '',
          customInstructions: response.data.preferences.customInstructions || ''
        })
      }
    } catch (error) {
      toast.error('Failed to load resume')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target
    setPreferences(prev => ({ ...prev, [name]: value }))
  }

  const handleEnhance = async () => {
    if (!preferences.jobRole.trim()) {
      toast.error('Please enter a target job role')
      return
    }

    setEnhancing(true)
    try {
      // Prepare preferences for API
      const apiPreferences = {
        jobRole: preferences.jobRole,
        yearsOfExperience: parseInt(preferences.yearsOfExperience) || 0,
        skills: preferences.skills.split(',').map(s => s.trim()).filter(Boolean),
        industry: preferences.industry,
        customInstructions: preferences.customInstructions
      }

      // Call enhance API
      const enhanceResponse = await enhanceApi.enhance(
        resume.originalText, 
        apiPreferences
      )

      // Update resume with enhanced text
      await resumeApi.update(resumeId, {
        enhancedText: enhanceResponse.data.enhancedResume,
        jobRole: preferences.jobRole,
        preferences: apiPreferences
      })

      toast.success('Resume enhanced successfully!')
      navigate(`/resume/${resumeId}`)
    } catch (error) {
      toast.error(error.message || 'Failed to enhance resume')
    } finally {
      setEnhancing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Enhance Resume</h1>
          <p className="text-gray-600">{resume?.title}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Original Text */}
          <Card>
            <h2 className="text-lg font-medium mb-4">Original Resume</h2>
            <div className="bg-gray-50 rounded-md p-4 h-96 overflow-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                {resume?.originalText}
              </pre>
            </div>
          </Card>

          {/* Enhancement Options */}
          <Card>
            <h2 className="text-lg font-medium mb-4">Enhancement Settings</h2>
            
            <Input
              label="Target Job Role"
              name="jobRole"
              value={preferences.jobRole}
              onChange={handlePreferenceChange}
              placeholder="e.g., Senior Software Engineer"
              required
            />
            
            <Input
              label="Years of Experience"
              type="number"
              name="yearsOfExperience"
              value={preferences.yearsOfExperience}
              onChange={handlePreferenceChange}
              placeholder="e.g., 5"
            />
            
            <Input
              label="Key Skills (comma separated)"
              name="skills"
              value={preferences.skills}
              onChange={handlePreferenceChange}
              placeholder="e.g., React, Node.js, TypeScript"
            />
            
            <Input
              label="Industry"
              name="industry"
              value={preferences.industry}
              onChange={handlePreferenceChange}
              placeholder="e.g., Technology, Finance, Healthcare"
            />
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Instructions (optional)
              </label>
              <textarea
                name="customInstructions"
                value={preferences.customInstructions}
                onChange={handlePreferenceChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Any specific instructions for the AI..."
              />
            </div>

            <Button
              variant="primary"
              onClick={handleEnhance}
              loading={enhancing}
              className="w-full"
            >
              {enhancing ? 'Enhancing with AI...' : 'Enhance Resume'}
            </Button>
            
            {enhancing && (
              <p className="text-sm text-gray-500 text-center mt-2">
                This may take a minute...
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
