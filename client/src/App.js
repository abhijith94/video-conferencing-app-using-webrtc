import React from 'react';
import Home from './components/Home/Home';
import Chat from './components/Chat/Chat';
import { Switch, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact>
          <Home></Home>
        </Route>
        <Route path="/*">
          <Chat />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
