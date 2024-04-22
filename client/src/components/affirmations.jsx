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
        <div className="gratitude-flex">
        <h3>Affirmations</h3>
        <div className="plus-icon" onClick={toggleAffirmations}>+</div>
        </div>
            <p className="affirmation-text">Complete your daily affirmations</p>
        </div>

        {showAffirmations && (
        <div className="affirmation-form-overlay">
            <div className="affirmation-form-container">
                <button className="grat-close-button" onClick={handleCloseAffirmations}><b>X</b></button>
                <h2>Repeat this Affirmation 10 Times:</h2>
                {completed ? (
                    <p>Affirmations Complete</p>
                ) : (
                    <p>{randomAffirmation}</p>
                )}
                {completed ? (
                    <button onClick={handleCloseAffirmations} className="affirmations-close">Close</button>
                ) : (
                    <>
                        <h3 className="affirmation-repetitions">{repetitionCount}</h3>
                        <div className="affirmation-button-flex">
                        <button onClick={handleResetCount} className="affirmation-reset-count">Reset count</button>
                            {repetitionCount === 10 ? ( <button onClick={handleNextAffirmation} className="affirmation-next">Next</button> ) : ( <button onClick={handleCountRepetition} className="affirmation-count-up">+</button> )}
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



