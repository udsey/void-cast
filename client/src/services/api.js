export const api = {
  getCasts: async () => {
    const response = await fetch('/api/casts')
    if (!response.ok) throw new Error('Failed to fetch casts')
    return response.json()
  },

  createCast: async (text) => {
    const response = await fetch('/api/cast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    if (!response.ok) throw new Error('Failed to create cast')
    return response.json()
  },

  getSSEUrl: () => '/api/sse',
}