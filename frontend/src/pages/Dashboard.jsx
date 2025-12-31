import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { resumeApi } from '../services/api'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Card from '../components/Card'

export default function Dashboard() {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      const response = await resumeApi.getAll()
      setResumes(response.data.resumes || [])
    } catch (error) {
      toast.error('Failed to load resumes')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (resumeId) => {
    if (!confirm('Are you sure you want to delete this resume?')) return
    
    try {
      await resumeApi.delete(resumeId)
      toast.success('Resume deleted')
      setResumes(prev => prev.filter(r => r.id !== resumeId))
    } catch (error) {
      toast.error('Failed to delete resume')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
            <p className="text-gray-600">Manage your AI-enhanced resumes</p>
          </div>
          <Link to="/upload">
            <Button variant="primary">+ Upload New Resume</Button>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-5xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No resumes yet
            </h3>
            <p className="text-gray-600 mb-6">
              Upload your first resume to get started with AI enhancement
            </p>
            <Link to="/upload">
              <Button variant="primary">Upload Resume</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map(resume => (
              <Card key={resume.id}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-900 truncate">
                    {resume.title}
                  </h3>
                  {resume.enhancedText && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Enhanced
                    </span>
                  )}
                </div>
                
                {resume.jobRole && (
                  <p className="text-sm text-gray-600 mb-2">
                    Target: {resume.jobRole}
                  </p>
                )}
                
                <p className="text-xs text-gray-400 mb-4">
                  Created: {formatDate(resume.createdAt)}
                </p>
                
                <div className="flex gap-2">
                  <Link to={`/resume/${resume.id}`} className="flex-1">
                    <Button variant="outline" className="w-full text-sm">
                      View
                    </Button>
                  </Link>
                  <Link to={`/enhance/${resume.id}`} className="flex-1">
                    <Button variant="primary" className="w-full text-sm">
                      Enhance
                    </Button>
                  </Link>
                  <Button 
                    variant="danger" 
                    className="text-sm"
                    onClick={() => handleDelete(resume.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
