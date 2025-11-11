// src/api/axios.ts
import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '',
    // withCredentials: true, // dejalo comentado salvo que también uses cookies
})

api.interceptors.request.use((config) => {
    const entorno = localStorage.getItem('entorno') || 'qa'
    const token = localStorage.getItem('token')

    // Set headers with proper typing
    config.headers.set('X-Env', entorno)

    if (token) {
        config.headers.set('Authorization', `Bearer ${token}`)
    }

    // Debug: log the final request URL when baseURL may be missing
    try {
        const finalUrl = `${config.baseURL ?? ''}${config.url ?? ''}`
        // Only log when baseURL is not configured to avoid noise in prod
        if (!import.meta.env.VITE_API_URL) {
            console.error('VITE_API_URL is not set. Requests will be sent to same origin. Final request URL:', finalUrl)
        }
    } catch {
        // ignore errors in URL construction
    }

    return config
})

export default api