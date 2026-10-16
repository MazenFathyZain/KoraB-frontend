import { apiSend } from './apiClient'

export function uploadImage(payload, token) {
  return apiSend('/api/admin/uploads', 'POST', payload, token)
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
