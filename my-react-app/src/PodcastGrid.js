

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PodcastGrid = () => {
  const [shows, setShows] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('your-api-endpoint');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not in JSON format');
        }
  
        const data = await response.json();
        setShows(data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
  
    fetchData();
  }, []);
  
};

export default PodcastGrid;

