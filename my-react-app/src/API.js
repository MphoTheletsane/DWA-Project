// API.js

const API_URL = 'https://podcast-api.netlify.app/shows';

export const fetchShows = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching shows:', error);
    throw error;
  }
};


