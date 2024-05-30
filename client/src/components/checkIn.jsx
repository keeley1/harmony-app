import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import emotions from '../data/emotions.json';
import { ThemeContext } from '../pages/themeChange';

const CheckIn = () => {
    const { theme } = useContext(ThemeContext);

    const [showCheckin, setShowCheckin] = useState(false);
    const [moodRating, setMoodRating] = useState(0);
    const [emotionOne, setEmotionOne] = useState('');
    const [emotionTwo, setEmotionTwo] = useState('');
    const [emotionThree, setEmotionThree] = useState('');
    const [checkinText, setCheckinText] = useState('How are you feeling today?');
    const { userId, loading } = useAuth();

    const toggleCheckin = () => {
        console.log('Toggling check-in');
        setShowCheckin(!showCheckin);
    };
    
    const handleCloseCheckin = () => {
        console.log('Closing check-in');
        setShowCheckin(false);
    };
    
    const onClickMoodButton = (e, i) => {
        e.stopPropagation();
        console.log(`Setting mood rating to ${i}`);
        setMoodRating(i);
    }

    const moodButtons = [];
    
    /*for (let i = 1; i <= 5; i++) {
        const hoverStyle = {
            // set hover background colour
            backgroundColor: '#c8cfef'
        };
        // set default styles
        const defaultStyle = {
            margin: '0 8px',
            backgroundColor: moodRating === i ? '#c8cfef' : '#AFBBF4',
            color: 'black',
            border: 'none',
            padding: '18px 20px',
            cursor: 'pointer',
            borderRadius: '5px',
            transition: '0.4s ease'
        };
        
        // create mood buttons
        moodButtons.push(
        <button
        key={i}
        style={defaultStyle}
        onMouseEnter={(e) => e.target.style.backgroundColor = hoverStyle.backgroundColor}
        onMouseLeave={(e) => e.target.style.backgroundColor = moodRating === i ? '#c8cfef' : '#AFBBF4'}
        onClick={(e) => onClickMoodButton(e, i)}
        >{i}
        </button>
        );
    };*/

    for (let i = 1; i <= 5; i++) {
        const isSelected = moodRating === i;
        moodButtons.push(
            <button
                key={i}
                className={`mood-button ${isSelected ? 'selected' : ''}`}
                onClick={(e) => onClickMoodButton(e, i)}
            >
                {i}
            </button>
        );
    };

    useEffect(() => {
        if (!loading && userId) {
            fetchCheckinText();
        }
    }, [loading, userId]);

    const fetchCheckinText = async () => {
        console.log('fetch check-in text');
        try {
            // get date and format
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0];
    
            // call server route and save data
            const response = await axios.get(`http://localhost:8000/checkinresponse?date=${formattedDate}&userId=${userId}`);
            if (response.data.mood_rating) {
                const moodRatingFromResponse = response.data.mood_rating;
                setMoodRating(moodRatingFromResponse);
                setCheckinText(getCheckinText(moodRatingFromResponse));
            }
        } 
        catch (error) {
            console.error('Error fetching check-in response', error);
        }
    };
    

    const getCheckinText = (moodRating) => {
        switch (moodRating) {
            case 1:
                return 'Mood check-in complete. You seem to be having a tough day. Is there anything I can do to help?';
            case 2:
                return 'Mood check-in complete. Seems like you are not feeling very well. Would you like to talk about it?';
            case 3:
                return 'Mood check-in complete. It looks like your mood is neutral today. Anything on your mind?';
            case 4:
                return 'Mood check-in complete. You seem to be in a good mood today!';
            case 5:
                return 'Mood check-in complete. Looks like you\'re having a great day! Keep up the good work!';
            default:
                return 'How are you feeling today?';
        }
    };

    const handleCheckinSubmit = async (event) => {
        event.preventDefault();
        try {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0];

            // get check in data from form
            const checkinData = {
                mood_rating: moodRating,
                date: formattedDate,
                emotion_one: emotionOne,
                emotion_two: emotionTwo,
                emotion_three: emotionThree,
                userId: userId
            };

            const response = await axios.post('http://localhost:8000/postcheckin', checkinData);
            if (response.status === 200) {
                setShowCheckin(false);
                fetchCheckinText();
            }
        } 
        catch (error) {
            console.error('Failed to post check-in:', error);
        }
    };

    return (
        <>
        <div className={`checkin-container ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>
            <div className="gratitude-flex">
                <h3>Daily Check In</h3>
                {moodRating == 0 ? ( <div className={`plus-icon ${theme === 'light' ? 'light-theme' : 'dark-theme'}`} onClick={toggleCheckin}>+</div> ) : ( <div className={`plus-icon ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}></div> )}
            </div>
            <p className="checkin-text">{checkinText}</p>
        </div>

        {showCheckin && (
        <div className="checkin-form-overlay">
            <div className={`checkin-form-container ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>
                <button className="grat-close-button" onClick={handleCloseCheckin}>X</button>
                <h2>Complete check in</h2>
                <form onSubmit={(e) => e.preventDefault()}>

                    <label>Please Rate Your Mood:</label>
                    <div className="moodbuttons-container">
                        {moodButtons}
                    </div>
                    <p>1 = low mood, 5 = good mood</p>

                    <h3 className="check-in-feeling">How are you feeling?</h3>
                    <label>Emotion One:</label>
                    <select value={emotionOne} onChange={e => setEmotionOne(e.target.value)}>
                        <option value="">--Please choose an emotion--</option>
                        {emotions.map(emotion => (
                            <option key={emotion} value={emotion}>{emotion}</option>
                        ))}
                    </select>

                    <label>Emotion Two:</label>
                    <select value={emotionTwo} onChange={e => setEmotionTwo(e.target.value)}>
                        <option value="">--Please choose an emotion--</option>
                        {emotions.map(emotion => (
                            <option key={emotion} value={emotion}>{emotion}</option>
                        ))}
                    </select>

                    <label>Emotion Three:</label>
                    <select value={emotionThree} onChange={e => setEmotionThree(e.target.value)}>
                        <option value="">--Please choose an emotion--</option>
                        {emotions.map(emotion => (
                            <option key={emotion} value={emotion}>{emotion}</option>
                        ))}
                    </select>

                    <button type="submit" onClick={handleCheckinSubmit} className={`checkin-submit-button ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>Submit</button>
                </form>
            </div>
        </div>
        )}
        </>
    );
};

export default CheckIn;