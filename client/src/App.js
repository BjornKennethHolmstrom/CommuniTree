import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ErrorProvider } from './components/ErrorContext';
import ErrorBoundary from './components/ErrorBoundary';
import { useTranslation } from 'react-i18next';
import { ChakraProvider, ColorModeScript, Flex, Box, Spacer } from '@chakra-ui/react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import ThemeSwitcher from './components/ThemeSwitcher';
import LanguageSwitcher from './components/LanguageSwitcher';
import { getTheme } from './theme/locationThemes';
import './App.css';
import UserList from './components/UserList';
import ProjectList from './components/ProjectList';
import ProjectDetails from './components/ProjectDetails';
import CreateProject from './components/CreateProject';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import EventCalendar from './components/EventCalendar';
import { AuthProvider } from './components/AuthContext';
import UserProfile from './components/UserProfile';
import Navigation from './components/Navigation';

function AppContent() {
  const { t, ready } = useTranslation();
  const theme = useTheme();

  const safeTheme = theme && theme.config ? theme : getTheme('default', 'light');

  if (!ready) return <div>{t('common.loading')}</div>;

  return (
    <ChakraProvider theme={safeTheme}>
      <ColorModeScript initialColorMode={safeTheme.config.initialColorMode} />
      <ErrorProvider>
        <AuthProvider>
          <ErrorBoundary t={t}>
            <Router>
              <div className="App">
                <div className="tree-background"></div>
                <div className="content-wrapper">
                  <Flex as="header" className="App-header" align="center" wrap="wrap" padding="1.5rem">
                    <Box>
                      <h1>{t('appName')}</h1>
                    </Box>
                    <Spacer />
                    <Flex align="center">
                      <LanguageSwitcher />
                      <Box width="10px" /> {/* This adds a small space between the switchers */}
                      <ThemeSwitcher />
                    </Flex>
                  </Flex>
                  <Navigation />
                  <main>
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route element={<PrivateRoute />}>
                        <Route path="/" element={<UserList />} />
                        <Route path="/projects" element={<ProjectList />} />
                        <Route path="/projects/create" element={<CreateProject />} />
                        <Route path="/projects/:id" element={<ProjectDetails />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/events" element={<EventCalendar />} />
                      </Route>
                    </Routes>
                  </main>
                </div>
              </div>
            </Router>
          </ErrorBoundary>
        </AuthProvider>
      </ErrorProvider>
    </ChakraProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
