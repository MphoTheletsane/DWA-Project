// api.js

const API_BASE_URL = 'https://podcast-api.netlify.app';

export const getAllShows = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/shows`);
    if (!response.ok) {
      throw new Error('Failed to fetch shows');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching shows:', error);
    throw error;
  }
};

export const getShowById = async (showId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/id/${showId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch show');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching show:', error);
    throw error;
  }
};
