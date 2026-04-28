export const api = {
  getCasts: async () => {
    const response = await fetch('/api/casts')
    if (!response.ok) throw new Error('Failed to fetch casts')
    return response.json()
  },

  createCast: async (text, viewPosition) => {
    
    const response = await fetch('/api/cast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text, 
        x: viewPosition?.x || 0, 
        y: viewPosition?.y || 0 
      }),
    })
    
    if (!response.ok) {
      const err = new Error('Failed to create cast')
      err.status = response.status
      throw err
    }
    
    return response.json()
  },

  getSSEUrl: () => '/api/sse',
}