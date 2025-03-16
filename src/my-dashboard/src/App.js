import React, { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Callback from './components/Callback';
import Dashboard from './components/Dashboard';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import './App.css';
import { UserRoleProvider } from './UserContext';

// Auth0 configuration
const domain = 'dev-aue4pbx1550zv4m3.us.auth0.com';
const clientId = 'X2iJYUuZWuexN86VhBGxDSd0yl7iW8Nm';
const audience = 'https://mature-lizard-51.hasura.app/v1/graphql';
const redirectUri = 'http://localhost:3000/';
const scope = "openid profile user email token";

const httpLink = createHttpLink({
  uri: audience, 
});

function AuthApolloProvider({ children }) {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const [client, setClient] = useState(
    new ApolloClient({
      link: httpLink,
      audience: audience,
      cache: new InMemoryCache(),
    })
  );

  useEffect(() => {
    const setAuthLink = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          console.log(`Access Token: ${token}`);

          const authLink = setContext((_, { headers }) => ({
            headers: {
              ...headers,
              "Authorization" : `Bearer ${token}`,
              'x-hasura-user-id': user?.['https://hasura.io/jwt/claims']?.['x-hasura-user-id'],
            },
          }));

          const httpLink = createHttpLink({
            uri: audience, 
          });
          setClient(
            new ApolloClient({
              link: authLink.concat(httpLink),
              cache: new InMemoryCache(),
              connectToDevTools: true
            })
          );
        } catch (error) {
          console.error('Error getting access token:', error);
        }
      }
    };

    setAuthLink();
  }, [isAuthenticated, getAccessTokenSilently, user]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

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
    <Auth0Provider domain={domain} clientId={clientId} authorizationParams={{redirectUri: redirectUri, scope: scope,audience:audience}} useRefreshTokens={true}>
      <AuthApolloProvider>
        <Router>
          <UserRoleProvider>
            <div className="app-container">
              <Navbar bg="dark" variant="dark">
                <Container>
                  <Navbar.Brand href="/">CMSC 319 Project</Navbar.Brand>
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

              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/profile" element={<Profile />} />
                <Route exact path="/callback" element={<Callback />} />
                <Route exact path="/dashboard" element={<Dashboard />} />
              </Routes>
            </div>
          </UserRoleProvider>
        </Router>
      </AuthApolloProvider>
    </Auth0Provider>
  );
}

export default App;