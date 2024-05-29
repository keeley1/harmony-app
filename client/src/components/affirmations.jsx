import React, { useState, useEffect, useContext } from 'react';
import affirmations from '../data/affirmations.json';
import { ThemeContext } from '../pages/themeChange';

const Affirmations = () => {
    const { theme } = useContext(ThemeContext);

    const [showAffirmations, setShowAffirmations] = useState(false);
    const [randomAffirmation, setRandomAffirmation] = useState('');
    const [repetitionCount, setRepetitionCount] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [displayedIndices, setDisplayedIndices] = useState([]);

    const toggleAffirmations = () => {
        setShowAffirmations(!showAffirmations);
        if (!showAffirmations) {
            setRepetitionCount(0);
            setRandomAffirmation('');
            setCompleted(false);
            setDisplayedIndices([]);
            setNextAffirmation();
        }
    };

    const handleCloseAffirmations = () => {
        setShowAffirmations(false);
        setDisplayedIndices([]);
    };

    const handleCountRepetition = () => {
        if (repetitionCount < 10) {
            setRepetitionCount(prevCount => prevCount + 1);
        }
    };

    const handleResetCount = () => {
        setRepetitionCount(0);
    };
    
    useEffect(() => {
        if (completed) {
            setNextAffirmation();
        }
    }, [completed]);

    const setNextAffirmation = () => {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * affirmations.length);
        } while (displayedIndices.includes(newIndex));

        if (displayedIndices.length >= 3) {
            setCompleted(true);
        } 
        else {
            setDisplayedIndices(prevIndices => [...prevIndices, newIndex]);
            setRandomAffirmation(affirmations[newIndex]);
        }
    };

    const handleNextAffirmation = () => {
        if (repetitionCount === 10) {
            setNextAffirmation();
            setRepetitionCount(0);
        }
    };

    return (
        <>
        <div className={`affirmation-container ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>
            <div className="gratitude-flex">
                <h3>Affirmations</h3>
                <div className={`plus-icon ${theme === 'light' ? 'light-theme' : 'dark-theme'}`} onClick={toggleAffirmations}>+</div>
            </div>
            <p className="affirmation-text">Complete your daily affirmations</p>
        </div>

        {showAffirmations && (
        <div className="affirmation-form-overlay">
            <div className={`affirmation-form-container ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>
                <button className={`grat-close-button ${theme === 'light' ? 'light-theme' : 'dark-theme'}`} onClick={handleCloseAffirmations}><b>X</b></button>
                {/*<h2>Repeat this Affirmation 10 Times:</h2>*/}
                {completed ? (
                    <h2>Affirmations Complete</h2>
                ) : (
                    <>
                    <h2>Repeat this Affirmation 10 Times:</h2>
                    <p>{randomAffirmation}</p>
                    </>
                )}
                {completed ? (
                    <button onClick={handleCloseAffirmations} className={`affirmations-close ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>Close</button>
                ) : (
                    <>
                    <h3 className="affirmation-repetitions">{repetitionCount}</h3>
                    <div className="affirmation-button-flex">
                        <button onClick={handleResetCount} className={`affirmation-reset-count ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>Reset count</button>
                        {repetitionCount === 10 ? ( <button onClick={handleNextAffirmation} className={`affirmation-next ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>Next</button> ) : ( <button onClick={handleCountRepetition} className={`affirmation-count-up ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>+</button> )}
                    </div>
                    </>
                )}
            </div>
        </div>
        )}
        </>
    );
};

export default Affirmations;



