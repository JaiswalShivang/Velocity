import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { uploadApi, resumeApi } from '../services/api'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import FileUpload from '../components/FileUpload'

export default function Upload() {
  const navigate = useNavigate()
  
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [extractedText, setExtractedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: upload, 2: review

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile)
    setLoading(true)
    
    try {
      const response = await uploadApi.uploadPdf(selectedFile)
      setExtractedText(response.data.extractedText)
      setTitle(`Resume - ${new Date().toLocaleDateString()}`)
      setStep(2)
      toast.success('Text extracted successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to extract text from PDF')
      setFile(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!extractedText.trim()) {
      toast.error('No content to save')
      return
    }

    setLoading(true)
    try {
      const response = await resumeApi.create({
        originalText: extractedText,
        title: title || 'Untitled Resume'
      })
      
      toast.success('Resume saved!')
      navigate(`/enhance/${response.data.id}`)
    } catch (error) {
      toast.error(error.message || 'Failed to save resume')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setStep(1)
    setFile(null)
    setExtractedText('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Upload Resume</h1>
          <p className="text-gray-600">
            Upload your PDF resume to extract text and enhance it with AI
          </p>
        </div>

        {step === 1 && (
          <Card>
            <h2 className="text-lg font-medium mb-4">Select PDF File</h2>
            <FileUpload 
              onFileSelect={handleFileSelect}
              disabled={loading}
            />
            {loading && (
              <p className="text-center text-gray-600 mt-4">
                Extracting text from PDF...
              </p>
            )}
          </Card>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Review Extracted Text</h2>
                <Button variant="secondary" onClick={handleBack}>
                  Upload Different File
                </Button>
              </div>
              
              <Input
                label="Resume Title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Software Engineer Resume"
              />
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Extracted Content
                </label>
                <textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                  placeholder="Extracted text will appear here..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can edit the text before saving
                </p>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button
                variant="primary"
                onClick={handleSave}
                loading={loading}
                className="flex-1"
              >
                Save & Continue to Enhancement
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
