import React, {
  useEffect,
  useState,
} from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Donate from './pages/Donate';
import EarningHope from './pages/EarningHope';
import SupportCreator from './pages/SupportCreator';

import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RiskDisclosure from './pages/RiskDisclosure';
import NotFound from './pages/NotFound';


const App = () => {

  /*
   * ========================================
   * THEME
   * ========================================
   */

  const [
    theme,
    setTheme,
  ] = useState(() => {
    return (
      localStorage.getItem(
        'donateDreams_theme'
      ) || 'dark'
    );
  });


  /*
   * ========================================
   * APPLY THEME
   * ========================================
   */

  useEffect(() => {

    document.documentElement.setAttribute(
      'data-theme',
      theme
    );

    localStorage.setItem(
      'donateDreams_theme',
      theme
    );

  }, [
    theme,
  ]);


  /*
   * ========================================
   * TOGGLE THEME
   * ========================================
   */

  const handleToggleTheme = () => {

    setTheme(
      (currentTheme) =>
        currentTheme === 'dark'
          ? 'light'
          : 'dark'
    );

  };


  /*
   * ========================================
   * PUBLIC APP
   * ========================================
   *
   * No sign up.
   * No login.
   * No logout.
   * No account page.
   *
   * Anyone can browse, create a dream,
   * and support a dream.
   */

  return (
    <Router>

      <Navbar
        theme={theme}
        onToggleTheme={
          handleToggleTheme
        }
      />

      <main className="main-content">

        <Routes>

          {/* =================================
              HOME
          ================================= */}

          <Route
            path="/"
            element={
              <Home />
            }
          />


          {/* =================================
              DISCOVER DREAMS
          ================================= */}

          <Route
            path="/supportcreator"
            element={
              <SupportCreator />
            }
          />


          {/* =================================
              CREATE DREAM
          ================================= */}

          <Route
            path="/earninghope"
            element={
              <EarningHope />
            }
          />


          {/* =================================
              DONATE
          ================================= */}

          <Route
            path="/donate"
            element={
              <Donate />
            }
          />


          {/* =================================
              LEGAL
          ================================= */}

          <Route
            path="/terms"
            element={
              <Terms />
            }
          />

          <Route
            path="/privacy"
            element={
              <PrivacyPolicy />
            }
          />

          <Route
            path="/risk-disclosure"
            element={
              <RiskDisclosure />
            }
          />


          {/* =================================
              404
          ================================= */}

          <Route
            path="*"
            element={
              <NotFound />
            }
          />

        </Routes>

      </main>

      <Footer />

    </Router>
  );
};


export default App;
