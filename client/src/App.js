import React from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';
import UserList from './components/UserList';
import LanguageSwitcher from './components/LanguageSwitcher';

function App() {
  const { t, ready } = useTranslation();

  if (!ready) return <div>Loading...</div>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>{t('appName')}</h1>
        <LanguageSwitcher />
      </header>
      <main>
        <UserList />
      </main>
    </div>
  );
}

export default App;
