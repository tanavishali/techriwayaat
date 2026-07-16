import api from './api'

export const getApplicationCounts = () => api.get('/careers/counts')

export const applyForJob = (jobId, formData) => api.post(`/careers/jobs/${jobId}/apply`, formData)
