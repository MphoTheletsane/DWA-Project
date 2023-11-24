// src/components/ShowDetails.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ShowDetails = () => {
  const { showId } = useParams();
  const [show, setShow] = useState(null);

  useEffect(() => {
    // Fetch individual show data from the API based on showId
    // Replace 'your-api-endpoint' with the actual API endpoint
    fetch(`your-api-endpoint/${showId}`)
      .then((response) => response.json())
      .then((data) => setShow(data));
  }, [showId]);

  if (!show) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Show Details</h1>
      <img src={show.image} alt={show.title} />
      <h2>{show.title}</h2>
      <p>{show.description}</p>
    </div>
  );
};

export default ShowDetails;
