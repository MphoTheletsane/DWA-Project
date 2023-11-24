// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PodcastGrid from './PodcastGrid';
import ShowDetails from './ShowDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PodcastGrid />} />
        <Route path="/shows/:showId" element={<ShowDetails />} />
      </Routes>
    </Router>
  );
};

export default App;

