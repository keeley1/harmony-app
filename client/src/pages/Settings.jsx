import React, { useContext } from 'react';
import { ThemeContext } from './themeChange';

const Settings = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <>
            <h1>Settings</h1>
            <button onClick={toggleTheme}>
                Switch to {theme === 'light' ? 'dark' : 'light'} mode
            </button>
        </>
    );
};

export default Settings;