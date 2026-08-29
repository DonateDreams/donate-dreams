import React, { useEffect, useState } from 'react';

const LegalDocument = ({ title, fileName, icon }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDocument = async () => {
      try {
        const response = await fetch(`/contracts/${fileName}`);

        if (!response.ok) {
          throw new Error('Document could not be loaded.');
        }

        const text = await response.text();

        setContent(text);
      } catch (err) {
        console.error(err);
        setError(
          'This document could not be loaded. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [fileName]);

  return (
    <main
      style={{
        minHeight: 'calc(100vh - 150px)',
        padding: '50px 20px',
      }}
    >
      <article
        style={{
          maxWidth: '900px',
          margin: 'auto',
          padding: '45px',
          borderRadius: '30px',
          background: 'rgba(255,255,255,0.14)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          border: '1px solid rgba(255,255,255,0.25)',
          boxShadow: '0 25px 70px rgba(0,0,0,0.18)',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: '35px',
          }}
        >
          <div style={{ fontSize: '45px' }}>{icon}</div>

          <h1>{title}</h1>
        </div>

        {loading && (
          <p style={{ textAlign: 'center' }}>
            Loading document...
          </p>
        )}

        {error && (
          <p
            style={{
              textAlign: 'center',
              color: '#a00000',
            }}
          >
            {error}
          </p>
        )}

        {!loading && !error && (
          <div
            style={{
              whiteSpace: 'pre-wrap',
              lineHeight: '1.8',
              fontSize: '16px',
            }}
          >
            {content}
          </div>
        )}
      </article>
    </main>
  );
};

export default LegalDocument;