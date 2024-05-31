import React, { useContext } from 'react';
import { ThemeContext } from './themeChange';

const Settings = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <>
        <div className="settings-container">
            <h1>Settings</h1>
            <button onClick={toggleTheme} className="theme-toggle">
                Switch to {theme === 'light' ? 'dark' : 'light'} mode
            </button>
        </div>
        </>
    );
};

export default Settings;