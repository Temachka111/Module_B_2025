const API_URL = 'https://chemp2026.hafn.ru'
const CLIENT_ID = 'artem-alim2'

export async function api(url, options = {}) {
  const token = localStorage.getItem('token')

  const response = await fetch(API_URL + url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      'ClientId': CLIENT_ID,
      ...(token && { Authorization: `Bearer ${token}` })
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw error
  }

  return response.json()
}
