import React, {
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import ThemeToggle from './ThemeToggle';


const Navbar = ({
  theme,
  onToggleTheme,
}) => {

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);


  const closeMobile =
    () => {
      setMobileOpen(false);
    };


  return (

    <header className="navbar">

      <div className="navbar-inner">


        <Link
          to="/"
          className="brand"
          onClick={
            closeMobile
          }
        >

          <div className="brand-orb">
            <span>
              ✦
            </span>
          </div>


          <div className="brand-text">

            <strong>
              Donate Dreams
            </strong>


            <small>
              Give hope. Share dreams.
            </small>

          </div>

        </Link>


        <button
          className="mobile-menu-button"
          onClick={() =>
            setMobileOpen(
              !mobileOpen
            )
          }
          aria-label="Open navigation"
          type="button"
        >

          {mobileOpen
            ? '✕'
            : '☰'}

        </button>


        <nav
          className={
            mobileOpen
              ? 'nav-links open'
              : 'nav-links'
          }
        >


          <Link
            to="/"
            onClick={
              closeMobile
            }
          >
            Home
          </Link>


          <Link
            to="/supportcreator"
            onClick={
              closeMobile
            }
          >
            Discover Dreams
          </Link>


          <Link
            to="/earninghope"
            onClick={
              closeMobile
            }
          >
            Create a Dream
          </Link>


          <Link
            to="/donate"
            onClick={
              closeMobile
            }
          >
            Donate
          </Link>


          <ThemeToggle
            theme={theme}
            onToggle={
              onToggleTheme
            }
          />


        </nav>

      </div>

    </header>

  );

};


export default Navbar;

