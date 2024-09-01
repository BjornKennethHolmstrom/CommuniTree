import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './App.css';
import UserList from './components/UserList';
import LanguageSwitcher from './components/LanguageSwitcher';
import ProjectList from './components/ProjectList';
import ProjectDetails from './components/ProjectDetails';

function App() {
  const { t, ready } = useTranslation();

  if (!ready) return <div>Loading...</div>;

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>{t('appName')}</h1>
          <LanguageSwitcher />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<UserList />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
