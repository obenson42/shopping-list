import React, { useState } from 'react';
import { Router } from 'react-router-dom'
import { AppContext } from "./contextLib";
import Main from './Main'
import { createBrowserHistory } from 'history'
import APIClient from './apiClient'
import APITescoPrices from './apiTescoPrices'
import Login from './Login'

const history = createBrowserHistory();
global.apiClient = new APIClient();
global.apiTescoPrices = new APITescoPrices("ca58f691ff944fd59a27347a944d9254");

function UnauthenticatedHeader() {
  return <p></p>
}

function UnauthenticatedContent() {
  return (
      <Login />
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
