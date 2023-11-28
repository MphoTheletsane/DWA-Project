// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ShowView from './ShowView'; 
import ShowDetails from './ShowDetails';

const App = () => {
  return (
    <Router>
      <div>
        <h1>Podcast App</h1>
        <Switch>
          <Route path="/shows/:showId" component={ShowDetails} />
          <Route path="/shows" component={ShowView} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;


