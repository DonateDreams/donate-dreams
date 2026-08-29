import React from 'react';

const DreamCrystal = ({
  progress = 0,
  size = 'medium',
}) => {
  const safeProgress =
    Math.max(
      0,
      Math.min(
        100,
        Number(progress) || 0
      )
    );

  return (
    <div
      className={
        `dream-crystal dream-crystal-${size}`
      }
      style={{
        '--crystal-progress':
          `${safeProgress}%`,
      }}
    >
      <div className="crystal-aura" />

      <div className="crystal-orbit crystal-orbit-one" />
      <div className="crystal-orbit crystal-orbit-two" />

      <div className="crystal-core">
        <div className="crystal-facet crystal-facet-one" />
        <div className="crystal-facet crystal-facet-two" />
        <div className="crystal-facet crystal-facet-three" />
        <div className="crystal-facet crystal-facet-four" />

        <div className="crystal-percent">
          {Math.round(
            safeProgress
          )}
          %
        </div>
      </div>

      <div className="crystal-particle particle-one" />
      <div className="crystal-particle particle-two" />
      <div className="crystal-particle particle-three" />
    </div>
  );
};

export default DreamCrystal;