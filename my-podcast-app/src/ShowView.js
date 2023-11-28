// ShowView.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllShows } from './api';

const ShowView = () => {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const data = await getAllShows();
        setShows(data);
      } catch (error) {
        // Handle error
      }
    };

    fetchShows();
  }, []);

  return (
    <div>
      <h2>All Shows</h2>
      {shows.map((show) => (
        <div key={show.id}>
          <h3>{show.title}</h3>
          <p>{show.description}</p>
          <Link to={`/shows/${show.id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
};

export default ShowView;
