import React, { useState } from 'react';
import { Router } from 'react-router-dom'
import { AppContext } from "./contextLib";
import Main from './Main'
import { createBrowserHistory } from 'history'
import APIClient from './apiClient'
import Login from './Login'
import Register from './Register';

const history = createBrowserHistory();
global.apiClient = new APIClient();

function UnauthenticatedHeader() {
  return <p></p>
}

function UnauthenticatedContent() {
  return (
    <>
      <Login />
      <Register />
    </>
  );
}

function UnauthenticatedApp() {
  return (
    <>
      <UnauthenticatedHeader />
      <UnauthenticatedContent />
    </>
  )
}

function AuthenticatedApp() {
  return (
    <>
    <Router history={history}>
      <Main history={history} />
    </Router>
      </>
  )
}

function Home() {
  const username = global.apiClient.username;
  return username ? <AuthenticatedApp /> : <UnauthenticatedApp />
}

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  return (
    <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
      <div>
        <Home />
      </div>
    </AppContext.Provider>
  )
}

export default App
