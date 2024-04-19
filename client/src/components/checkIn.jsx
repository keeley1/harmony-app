import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import emotions from '../data/emotions.json';

const CheckIn = () => {
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
    for (let i = 1; i <= 5; i++) {
        moodButtons.push(
        <button
            key={i}
            style={{
                margin: '0 2px',
                backgroundColor: moodRating === i ? 'lightblue' : 'gray',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                cursor: 'pointer'
            }}
            onClick={(e) => onClickMoodButton(e, i)}
        >
            {i}
        </button>
        );
    }

    useEffect(() => {
        if (!loading && userId) {
            fetchCheckinText();
        }
    }, [loading, userId]);

    const fetchCheckinText = async () => {
        console.log('fetch check-in text');
        try {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0];
    
            const response = await axios.get(`https://www.doc.gold.ac.uk/usr/201/checkinresponse?date=${formattedDate}&userId=${userId}`);
            if (response.data.mood_rating) {
                const moodRatingFromResponse = response.data.mood_rating;
                console.log('mood rating:' + moodRatingFromResponse);
                setMoodRating(moodRatingFromResponse);
                setCheckinText(getCheckinText(moodRatingFromResponse));
            }
        } catch (error) {
            console.error('Error fetching check-in response', error);
        }
    };
    

    const getCheckinText = (moodRating) => {
        switch (moodRating) {
            case 1:
                return 'You seem to be having a tough day. Is there anything I can do to help?';
            case 2:
                return 'Seems like you are not feeling very well. Would you like to talk about it?';
            case 3:
                return 'It looks like your mood is neutral today. Anything on your mind?';
            case 4:
                return 'You seem to be in a good mood today! What\'s making you happy?';
            case 5:
                return 'Looks like you\'re having a great day! Keep up the good work!';
            default:
                return 'How are you feeling today?';
        }
    };

    const handleCheckinSubmit = async (event) => {
        event.preventDefault();
        console.log('check in submit');
        try {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0];

            const checkinData = {
                mood_rating: moodRating,
                date: formattedDate,
                emotion_one: emotionOne,
                emotion_two: emotionTwo,
                emotion_three: emotionThree,
                userId: userId
            };

            const response = await axios.post('https://www.doc.gold.ac.uk/usr/201/postcheckin', checkinData);
            if (response.status === 200) {
                console.log('Check-in saved successfully');
                setShowCheckin(false);
                fetchCheckinText();
            }
        } catch (error) {
            console.error('Failed to post check-in:', error);
        }
    };

    return (
        <>
        <div className="checkin-container">
        <div className="gratitude-flex">
        <h3>Daily Check In</h3>
            {console.log('mood:' + moodRating)}
            {moodRating == 0 ? ( <div className="plus-icon" onClick={toggleCheckin}>+</div> ) : ( <div className="plus-icon"></div> )}
        </div>
            <p>{checkinText}</p>
        </div>

        {showCheckin && (
        <div className="grat-form-overlay">
            <div className="grat-form-container">
                <button className="grat-close-button" onClick={handleCloseCheckin}>X</button>
                <h2>Complete check in</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <label>Mood Rating:</label>
                    <div className="moodbuttons-container">
                        {moodButtons}
                    </div>

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

                    <button type="submit" onClick={handleCheckinSubmit}>Submit</button>
                </form>
            </div>
        </div>
        )}
        </>
    )
}

export default CheckIn;