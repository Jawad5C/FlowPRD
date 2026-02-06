// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  GENERATE: `${API_BASE_URL}/api/generate`,
  UPLOAD: `${API_BASE_URL}/api/upload`,
  VALIDATE: `${API_BASE_URL}/api/validate`,
  SHARE: `${API_BASE_URL}/api/share`,
};

// Helper function for API calls with timeout
export const apiCall = async (endpoint: string, options: RequestInit = {}, timeoutMs: number = 30000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(endpoint, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      console.error('API call failed:', error.message);
    } else {
      console.error('API call failed:', error);
    }
    throw error;
  }
};
