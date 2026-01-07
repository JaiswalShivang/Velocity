import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { resumeApi, enhanceApi } from '../services/api'
import Navbar from '../components/Navbar'
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles, 
  ArrowRight,
  BarChart3,
  Zap,
  FileText,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Award,
  AlertCircle
} from 'lucide-react'

// Score ring component
const ScoreRing = ({ score, size = 120, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference
  
  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e' // green
    if (score >= 60) return '#eab308' // yellow
    if (score >= 40) return '#f97316' // orange
    return '#ef4444' // red
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-neutral-700"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke={getScoreColor(score)}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="text-3xl font-bold text-white"
        >
          {score}
        </motion.span>
        <span className="text-xs text-neutral-400">ATS Score</span>
      </div>
    </div>
  )
}

// Score breakdown bar
const ScoreBar = ({ label, score, delay = 0 }) => {
  const getBarColor = (score) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    if (score >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-neutral-400">{label}</span>
        <span className="text-white font-medium">{score}%</span>
      </div>
      <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
          className={`h-full rounded-full ${getBarColor(score)}`}
        />
      </div>
    </div>
  )
}

// Improvement card
const ImprovementCard = ({ improvement, index }) => {
  const [expanded, setExpanded] = useState(false)
  
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4 hover:border-neutral-600 transition-colors"
    >
      <div 
        className="flex items-start justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(improvement.priority)}`}>
              {improvement.priority || 'Medium'} Priority
            </span>
            <span className="text-xs text-neutral-500">{improvement.category}</span>
          </div>
          <p className="text-white font-medium">{improvement.issue}</p>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-neutral-400 ml-2 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-neutral-400 ml-2 flex-shrink-0" />
        )}
      </div>
      
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 pt-3 border-t border-neutral-700"
        >
          <div className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-neutral-300">{improvement.suggestion}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default function Enhance() {
  const { resumeId } = useParams()
  const navigate = useNavigate()
  
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [enhancing, setEnhancing] = useState(false)
  const [atsAnalysis, setAtsAnalysis] = useState(null)
  
  // Job role input
  const [jobRole, setJobRole] = useState('')
  const [hasAnalyzed, setHasAnalyzed] = useState(false)

  useEffect(() => {
    fetchResume()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId])

  const fetchResume = async () => {
    try {
      const response = await resumeApi.getById(resumeId)
      setResume(response.data)
      
      // Pre-fill job role if available
      if (response.data.jobRole) {
        setJobRole(response.data.jobRole)
      }
    } catch (_error) {
      toast.error('Failed to load resume')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!jobRole.trim()) {
      toast.error('Please enter a target job role')
      return
    }

    setAnalyzing(true)
    try {
      const response = await enhanceApi.analyzeATS(resume.originalText, jobRole)
      setAtsAnalysis(response.data)
      setHasAnalyzed(true)
      
      // Save job role to resume
      await resumeApi.update(resumeId, { jobRole })
      
      toast.success('ATS analysis complete!')
    } catch (error) {
      toast.error(error.message || 'Failed to analyze resume')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleEnhanceWithAI = async () => {
    setEnhancing(true)
    try {
      // Prepare preferences for API
      const apiPreferences = {
        jobRole: jobRole,
        yearsOfExperience: 0,
        skills: atsAnalysis?.missingKeywords || [],
        industry: '',
        customInstructions: `Focus on improving: ${atsAnalysis?.improvements?.map(i => i.issue).join(', ') || 'general improvements'}`,
        profileInfo: {}
      }

      // Call enhance API
      const enhanceResponse = await enhanceApi.enhance(
        resume.originalText, 
        apiPreferences
      )

      // Update resume with enhanced text
      await resumeApi.update(resumeId, {
        enhancedText: enhanceResponse.data.enhancedResume,
        jobRole: jobRole,
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
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-4">
            <Target className="w-4 h-4" />
            ATS Score Analysis
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Resume Analysis</h1>
          <p className="text-neutral-400 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {resume?.title}
          </p>
        </motion.div>

        {/* Job Role Input */}
        {!hasAnalyzed && !analyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Enter Target Job Role</h2>
                <p className="text-sm text-neutral-500">We'll analyze your resume against this position</p>
              </div>
            </div>

            <div className="flex gap-4">
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g., Senior Software Engineer, Product Manager, Data Scientist"
                className="flex-1 px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              />
              <button
                onClick={handleAnalyze}
                disabled={analyzing || !jobRole.trim()}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-5 h-5" />
                    Analyze Resume
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Analyzing State */}
        {analyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-12 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/20 rounded-full mb-4">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Analyzing Your Resume</h3>
            <p className="text-neutral-400">
              Our AI is evaluating your resume against ATS systems for the {jobRole} position...
            </p>
            <div className="mt-4 flex justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="w-2 h-2 bg-indigo-500 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ATS Analysis Results */}
        {hasAnalyzed && atsAnalysis && (
          <div className="space-y-6">
            {/* Score Overview */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Score Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-1 bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6"
              >
                <div className="flex flex-col items-center">
                  <ScoreRing score={atsAnalysis.atsScore} size={160} strokeWidth={12} />
                  
                  <div className="mt-4 text-center">
                    <p className="text-lg font-medium text-white mb-1">
                      {atsAnalysis.atsScore >= 80 ? 'Excellent!' : 
                       atsAnalysis.atsScore >= 60 ? 'Good Progress' : 
                       atsAnalysis.atsScore >= 40 ? 'Needs Work' : 'Major Improvements Needed'}
                    </p>
                    <p className="text-sm text-neutral-400">for {jobRole}</p>
                  </div>

                  <button
                    onClick={() => {
                      setHasAnalyzed(false)
                      setAtsAnalysis(null)
                    }}
                    className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Analyze Different Role
                  </button>
                </div>
              </motion.div>

              {/* Score Breakdown */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2 bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  Score Breakdown
                </h3>
                <div className="space-y-4">
                  <ScoreBar label="Keyword Match" score={atsAnalysis.scoreBreakdown?.keywordMatch || 0} delay={0.1} />
                  <ScoreBar label="Formatting" score={atsAnalysis.scoreBreakdown?.formatting || 0} delay={0.2} />
                  <ScoreBar label="Experience Relevance" score={atsAnalysis.scoreBreakdown?.experienceRelevance || 0} delay={0.3} />
                  <ScoreBar label="Skills Alignment" score={atsAnalysis.scoreBreakdown?.skillsAlignment || 0} delay={0.4} />
                  <ScoreBar label="Education Match" score={atsAnalysis.scoreBreakdown?.educationMatch || 0} delay={0.5} />
                </div>
              </motion.div>
            </div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-indigo-400" />
                Analysis Summary
              </h3>
              <p className="text-neutral-300 leading-relaxed">{atsAnalysis.summary}</p>
            </motion.div>

            {/* Strengths & Missing Keywords */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Strengths */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Strengths
                </h3>
                <ul className="space-y-3">
                  {atsAnalysis.strengths?.map((strength, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <Award className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span className="text-neutral-300">{strength}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Missing Keywords */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {atsAnalysis.missingKeywords?.map((keyword, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-lg text-sm"
                    >
                      {keyword}
                    </motion.span>
                  ))}
                  {(!atsAnalysis.missingKeywords || atsAnalysis.missingKeywords.length === 0) && (
                    <p className="text-neutral-500 text-sm">No critical keywords missing!</p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Improvements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                Recommended Improvements
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {atsAnalysis.improvements?.map((improvement, index) => (
                  <ImprovementCard key={index} improvement={improvement} index={index} />
                ))}
              </div>
            </motion.div>

            {/* Enhance with AI Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-2xl p-8"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Ready to Improve Your Resume?</h3>
                    <p className="text-neutral-400">Let AI optimize your resume based on the analysis above</p>
                  </div>
                </div>
                <button
                  onClick={handleEnhanceWithAI}
                  disabled={enhancing}
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
                >
                  {enhancing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Enhancing with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Improve with AI
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
              
              {enhancing && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-neutral-400">
                    This may take a minute. We're optimizing your resume for {jobRole} position...
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
