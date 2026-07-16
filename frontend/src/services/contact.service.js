import api from './api'

export const submitContactForm = (data) => api.post('/contact', data)
