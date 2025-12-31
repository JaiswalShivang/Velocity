import { auth } from '../config/firebase'

const API_BASE = '/api'

// Helper to get auth headers
async function getAuthHeaders() {
  const user = auth.currentUser
  if (!user) throw new Error('Not authenticated')
  
  const token = await user.getIdToken()
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

// Helper to handle API responses
async function handleResponse(response) {
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong')
  }
  return data
}

// ============ AUTH API ============
export const authApi = {
  // Verify token
  async verifyToken() {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/auth/verify`, {
      method: 'POST',
      headers
    })
    return handleResponse(response)
  },

  // Get user profile
  async getProfile() {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/auth/profile`, {
      method: 'GET',
      headers
    })
    return handleResponse(response)
  }
}

// ============ UPLOAD API ============
export const uploadApi = {
  // Upload PDF and extract text
  async uploadPdf(file) {
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')
    
    const token = await user.getIdToken()
    const formData = new FormData()
    formData.append('resume', file)
    
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    return handleResponse(response)
  },

  // Extract text from PDF (re-process)
  async extractText(file) {
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')
    
    const token = await user.getIdToken()
    const formData = new FormData()
    formData.append('resume', file)
    
    const response = await fetch(`${API_BASE}/upload/extract-text`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    return handleResponse(response)
  }
}

// ============ RESUME API ============
export const resumeApi = {
  // Get all resumes
  async getAll() {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/resumes`, {
      method: 'GET',
      headers
    })
    return handleResponse(response)
  },

  // Get single resume
  async getById(resumeId) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/resumes/${resumeId}`, {
      method: 'GET',
      headers
    })
    return handleResponse(response)
  },

  // Create resume
  async create(data) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/resumes`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  // Update resume
  async update(resumeId, data) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/resumes/${resumeId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  // Delete resume
  async delete(resumeId) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/resumes/${resumeId}`, {
      method: 'DELETE',
      headers
    })
    return handleResponse(response)
  }
}

// ============ ENHANCE API ============
export const enhanceApi = {
  // Enhance resume with AI
  async enhance(resumeText, preferences) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/enhance`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ resumeText, preferences })
    })
    return handleResponse(response)
  },

  // Generate summary only
  async generateSummary(resumeText, jobRole) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/enhance/summary`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ resumeText, jobRole })
    })
    return handleResponse(response)
  },

  // Get improvement suggestions
  async getSuggestions(resumeText, jobRole) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE}/enhance/suggestions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ resumeText, jobRole })
    })
    return handleResponse(response)
  }
}
