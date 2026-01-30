const API_URL = 'https://chemp2026.hafn.ru'
const CLIENT_ID = 'artem-alim2' 

/**
 * Скачать файл с сервера
 * @param {number} id - id файла
 * @param {string} name - имя файла
 */
export async function downloadFile(id, name = 'file') {
  const token = localStorage.getItem('token')

  try {
    const response = await fetch(
      `${API_URL}/files/${id}/download`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'ClientId': CLIENT_ID
        }
      }
    )

    if (!response.ok) {
      throw new Error('Download failed')
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()

    a.remove()
    window.URL.revokeObjectURL(url)
  } catch (e) {
    console.error(e)
    alert('Ошибка скачивания файла')
  }
}
