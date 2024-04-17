import React, { useState, useEffect } from "react";
import affirmations from '../data/affirmations.json';

const Affirmations = () => {
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
        // Clear the displayed indices when affirmations are closed
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
        } else {
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
        <div className="affirmation-container">
            <h3>Affirmations</h3>
            <p onClick={toggleAffirmations}>Complete your daily affirmations</p>
        </div>

        {showAffirmations && (
        <div className="grat-form-overlay">
            <div className="grat-form-container">
                <button className="grat-close-button" onClick={handleCloseAffirmations}>X</button>
                <h2>Repeat this affirmation:</h2>
                {completed ? (
                    <p>Affirmations Complete</p>
                ) : (
                    <p>{randomAffirmation}</p>
                )}
                {completed ? (
                    <button onClick={handleCloseAffirmations}>Close</button>
                ) : (
                    <>
                        <p>Repetition count: {repetitionCount}</p>
                        <button onClick={handleCountRepetition}>Count</button>
                        {repetitionCount === 10 && <button onClick={handleNextAffirmation}>Next</button>}
                        <button onClick={handleResetCount}>Reset</button>
                    </>
                )}
            </div>
        </div>
        )}
        </>
    );
};

export default Affirmations;



