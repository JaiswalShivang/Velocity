import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Button from '../components/Button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Build Your Perfect Resume with AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload your resume, get AI-powered enhancements, and create ATS-optimized 
            resumes tailored for your dream job.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register">
              <Button variant="primary">Get Started Free</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-3xl mb-4">📄</div>
            <h3 className="text-lg font-semibold mb-2">Upload Resume</h3>
            <p className="text-gray-600">
              Upload your existing resume in PDF format. Our system extracts the text automatically.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold mb-2">AI Enhancement</h3>
            <p className="text-gray-600">
              Get AI-powered suggestions to improve your resume for specific job roles.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-3xl mb-4">✅</div>
            <h3 className="text-lg font-semibold mb-2">ATS Optimized</h3>
            <p className="text-gray-600">
              Download resumes optimized to pass Applicant Tracking Systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
