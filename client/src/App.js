import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './App.css';
import UserList from './components/UserList';
import LanguageSwitcher from './components/LanguageSwitcher';
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
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  const { t, ready } = useTranslation();

  if (!ready) return <div>{t('common.loading')}</div>;

  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <header className="App-header">
              <h1>{t('appName')}</h1>
              <LanguageSwitcher />
              <Navigation />
            </header>
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
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
