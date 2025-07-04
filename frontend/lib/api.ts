import axios, { AxiosResponse, AxiosError } from 'axios'

// API base URL - you can change this to your backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
})

// Request interceptor - no need for tokens in email-only auth
api.interceptors.request.use(
  (config) => {
    // No token needed for email-only auth
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear user data on auth error
      localStorage.removeItem('current_user')
      localStorage.removeItem('current_user_email')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const authAPI = {
  // Register new user (email-only)
  register: async (userData: {
    email: string
    full_name: string
  }) => {
    const response = await api.post('/api/v1/auth/register', {
      email: userData.email,
      full_name: userData.full_name,
    })
    return response.data
  },

  // Login user (email-only)
  login: async (credentials: { email: string }) => {
    const response = await api.post('/api/v1/auth/login', credentials)
    return response.data
  },

  // Get user by email
  getUserByEmail: async (email: string) => {
    const response = await api.get(`/api/v1/auth/user/${email}`)
    return response.data
  },

  // Get all users (for admin)
  getUsers: async () => {
    const response = await api.get('/api/v1/auth/users')
    return response.data
  },

  // Update user
  updateUser: async (email: string, userData: any) => {
    const response = await api.put(`/api/v1/auth/user/${email}`, userData)
    return response.data
  },

  // Logout (client-side only for email-only auth)
  logout: () => {
    localStorage.removeItem('current_user')
    localStorage.removeItem('current_user_email')
  },
}

export const companiesAPI = {
  // Create company
  create: async (companyData: { name: string }) => {
    const response = await api.post('/api/v1/companies/', companyData)
    return response.data
  },

  // Get user's companies
  list: async () => {
    const response = await api.get('/api/v1/companies/')
    return response.data
  },

  // Get specific company
  get: async (companyId: string) => {
    const response = await api.get(`/api/v1/companies/${companyId}`)
    return response.data
  },

  // Update company
  update: async (companyId: string, companyData: { name: string }) => {
    const response = await api.patch(`/api/v1/companies/${companyId}`, companyData)
    return response.data
  },

  // Delete company
  delete: async (companyId: string) => {
    const response = await api.delete(`/api/v1/companies/${companyId}`)
    return response.data
  },
}

// New API endpoint for Groq chat completions
export const groqAPI = {
  chatCompletion: async (
    messages: Array<{ role: string; content: string }>,
    apiKey: string
  ) => {
    if (!apiKey) {
      throw new Error("Groq API key is not provided.");
    }
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192', // Or another suitable Groq model
        messages: messages,
        temperature: 0.2,
        max_tokens: 1000,
        top_p: 0.9,
        presence_penalty: 0.0,
        frequency_penalty: 0.0,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data
  },
}

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health')
    return response.data
  },
}

// Generic API error handler
export const handleAPIError = (error: AxiosError) => {
  if (error.response) {
    // Server responded with error status
    const message = (error.response.data as any)?.detail || error.response.statusText
    return {
      message,
      status: error.response.status,
    }
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: 'Network error. Please check your connection.',
      status: 0,
    }
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: 0,
    }
  }
}

export default api