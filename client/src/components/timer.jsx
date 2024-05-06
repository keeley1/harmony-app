import React, { useState, useRef } from 'react';
import countdownEnd from '../sounds/countdownEnd.mp3';

const Timer = () => {
    const [time, setTime] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const intervalRef = useRef();

    const startTimer = () => {
        if (!timerRunning && time > 0) {
            intervalRef.current = setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000);
            setTimerRunning(true);
        }
    };

    const pauseTimer = () => {
        clearInterval(intervalRef.current);
        setTimerRunning(false);
    };

    const resetTimer = () => {
        clearInterval(intervalRef.current);
        setTime(0);
        setTimerRunning(false);
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const handleTimeChange = (event) => {
        setTime(parseInt(event.target.value, 10));
    };

    const handleCountdownComplete = () => {
        const audio = new Audio(countdownEnd);
        audio.play()
    };

    React.useEffect(() => {
        if (time === 0 && timerRunning) {
            handleCountdownComplete();
            pauseTimer();
        }
    }, [time, timerRunning]);

    const timerOptions = [
        { label: '5 mins', value: 300 },
        { label: '10 mins', value: 600 },
        { label: '15 mins', value: 900 },
        { label: '20 mins', value: 1200 },
        { label: '25 mins', value: 1500 },
        { label: '30 mins', value: 1800 },
        { label: '45 mins', value: 2700 },
        { label: '1 hour', value: 3600 },
        { label: '1.5 hours', value: 5400 },
        { label: '2 hours', value: 7200 }
    ];

    return (
        <>
        <div className="timer-container">
            <div className="timer-flex">
                <h3>Task Timer</h3>
                <div className="timer-input">
                    <select value={time} onChange={handleTimeChange} className="timer-dropdown">
                        <option value="">--Select a time--</option>
                        {timerOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <h1 className="timer-time">{formatTime(time)}</h1>
            
            <div className="timer-controls">
                <button onClick={startTimer} className="timer-button">Start</button>
                <button onClick={pauseTimer} className="timer-button">Pause</button>
                <button onClick={resetTimer} className="timer-button">Reset</button>
            </div>
        </div>
        </>
    );
};

export default Timer;




