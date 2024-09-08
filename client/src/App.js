import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './App.css';
import UserList from './components/UserList';
import LanguageSwitcher from './components/LanguageSwitcher';
import ProjectList from './components/ProjectList';
import ProjectDetails from './components/ProjectDetails';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider, useAuth } from './components/AuthContext';
import UserProfile from './components/UserProfile'; // Import the UserProfile component

function Navigation() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to="/">{t('home')}</Link>
      <Link to="/projects">{t('projects')}</Link>
      {user ? (
        <>
          <Link to="/profile">{t('myProfile')}</Link>
          <button onClick={logout}>{t('logout')}</button>
        </>
      ) : (
        <Link to="/login">{t('login')}</Link>
      )}
    </nav>
  );
}

function App() {
  const { t, ready } = useTranslation();

  if (!ready) return <div>Loading...</div>;

  return (
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
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/profile" element={<UserProfile />} />
              </Route>
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
