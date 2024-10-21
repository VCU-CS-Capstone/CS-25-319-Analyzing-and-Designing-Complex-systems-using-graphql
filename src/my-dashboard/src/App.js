import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'; // Import Auth0Provider and useAuth0
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Callback from './components/Callback';
import Dashboard from './components/Dashboard';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import './App.css'; // Import the CSS file
import { UserRoleProvider } from './UserContext';

// Auth0 configuration
const domain = 'dev-byipzqt258d4q0mu.us.auth0.com';
const clientId = '9jikgTK25ywA1SImTuXDs46cRlMsF0L3';
const audience = 'https://clean-wasp-50.hasura.app/v1/graphql'; // Hasura GraphQL endpoint
const redirectUri = 'http://localhost:3000/';

const httpLink = createHttpLink({
  uri: 'https://clean-wasp-50.hasura.app/v1/graphql', // Hasura GraphQL endpoint
});

// Create an auth link that adds the Auth0 access token to the request headers
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function LoginButton() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    <Button variant="primary" onClick={() => loginWithRedirect()} disabled={isAuthenticated}>
      {isAuthenticated ? 'Logged In' : 'Log In'}
    </Button>
  );
}

function LogoutButton() {
  const { logout } = useAuth0();

  return (
    <Button variant="secondary" onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
    </Button>
  );
}

function App() {
  return (
    <Auth0Provider
    domain={domain}
    clientId={clientId}
    audience={audience}
    redirectUri={redirectUri}
  >
    <ApolloProvider client={client}>
      <Router>
      <UserRoleProvider>
        <div className="app-container">
          {/* Navigation */}
          <Navbar bg="dark" variant="dark">
            <Container>
              <Navbar.Brand href="/">AirBnb Data</Navbar.Brand>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
              </Nav>
              <Nav>
                <LoginButton />
                <LogoutButton />
              </Nav>
            </Container>
          </Navbar>

          {/* Routes */}
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/callback" element={<Callback />} />
            <Route exact path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
        </UserRoleProvider>
      </Router>
    </ApolloProvider>
  </Auth0Provider>
  );
}

export default App;