import React, { useEffect, useState } from 'react';
const STORAGE_KEY = 'donateDreams_theme';
const getInitialTheme = () => {
const saved =
localStorage.getItem(STORAGE_KEY);
if (saved === 'light' || saved === 'dark') {
return saved;
}
return window.matchMedia &&
window.matchMedia(
'(prefers-color-scheme: dark)'
).matches
? 'dark'
: 'light';
};
const ThemeToggle = () => {
const [theme, setTheme] =
useState(getInitialTheme);
useEffect(() => {
document.documentElement.setAttribute(
'data-theme',
theme
);
document.body.setAttribute(
  'data-theme',
  theme
);

localStorage.setItem(
  STORAGE_KEY,
  theme
);
}, [theme]);
const toggleTheme = () => {
setTheme((currentTheme) =>
currentTheme === 'dark'
? 'light'
: 'dark'
);
};
return (
<button
type="button"
className="theme-toggle"
onClick={toggleTheme}
aria-label={
theme === 'dark'
? 'Switch to light mode'
: 'Switch to dark mode'
}
title={
theme === 'dark'
? 'Switch to light mode'
: 'Switch to dark mode'
}
>

{theme === 'dark' ? '☀' : '☾'}
  <span className="theme-toggle-label">
    {theme === 'dark'
      ? 'Light'
      : 'Dark'}
  </span>
</button>
);
};
export default ThemeToggle;

