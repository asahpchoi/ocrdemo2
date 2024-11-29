import React from 'react';

export const Snow: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`snow-1-${i}`}
            className="absolute text-white opacity-70 animate-snowfall snowflake-1"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-20px`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            ❄️
          </div>
        ))}
      </div>
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`snow-2-${i}`}
            className="absolute text-white opacity-50 animate-snowfall snowflake-2"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-20px`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            ❄️
          </div>
        ))}
      </div>
    </div>
  );
};
