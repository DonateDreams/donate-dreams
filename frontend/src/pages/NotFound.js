import React from 'react';

import {
  Link,
} from 'react-router-dom';

import GlassCard from '../components/GlassCard';

const NotFound = () => {
  return (
    <div className="page centered-page">

      <GlassCard className="account-info-card">

        <span className="section-kicker">
          404
        </span>

        <h1>
          Page not found.
        </h1>

        <p>
          The page you're looking for
          doesn't exist.
        </p>

        <Link
          to="/"
          className="glass-button primary"
        >
          Return Home
          <span>→</span>
        </Link>

      </GlassCard>

    </div>
  );
};

export default NotFound;