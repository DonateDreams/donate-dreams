import React from 'react';

import {
  Link
} from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="futuristic-footer">

      <div className="footer-glow" />

      <div className="footer-grid">

        <div className="footer-brand">

          <div className="footer-orb">
            ✦
          </div>

          <h3>
            Donate Dreams
          </h3>

          <p>
            A place where dreams meet
            people willing to help.
          </p>

        </div>

        <div className="footer-column">

          <h4>
            Explore
          </h4>

          <Link to="/">
            Home
          </Link>

          <Link to="/supportcreator">
            Discover Dreams
          </Link>

          <Link to="/donate">
            Donate
          </Link>

        </div>

        <div className="footer-column">

          <h4>
            Community
          </h4>

          <Link to="/earninghope">
            Earning Hope
          </Link>

          <Link to="/signuplogin">
            Create Account
          </Link>

          <Link to="/account">
            My Account
          </Link>

        </div>

        <div className="footer-column">

          <h4>
            Donate Dreams
          </h4>

          <span>
            Built for kindness.
          </span>

          <span>
            Powered by blockchain.
          </span>

          <span>
            Designed for people.
          </span>

        </div>

      </div>

      <div className="footer-bottom">

        <span>
          © {new Date().getFullYear()}
          {' '}
          Donate Dreams
        </span>

        <span className="footer-status">
          <span className="status-dot" />
          V1 Prototype
        </span>

      </div>

    </footer>
  );
};

export default Footer;