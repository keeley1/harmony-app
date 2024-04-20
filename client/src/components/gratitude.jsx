import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const Gratitude = () => {
    const [showGratForm, setShowGratForm] = useState(false);
    const [gratitudeText, setGratitudeText] = useState('');
    const [gratitudeItem, setGratitudeItem] = useState('');
    const { userId, loading } = useAuth();

    const toggleGratForm = () => {
        setShowGratForm(!showGratForm);
    };

    const handleCloseGratForm = () => {
        setShowGratForm(false);
    };

    const handleGratitudeChange = (event) => {
        setGratitudeText(event.target.value);
    };

    useEffect(() => {
        if (!loading && userId) {
            fetchGratitude();
        }
    }, [loading, userId]);

    const fetchGratitude = async () => {
        try {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0];

            const response = await axios.get(`http://localhost:8000/getgratitude?date=${formattedDate}&userId=${userId}`);
            if (response.data.items.length > 0) {
                setGratitudeItem(response.data.items[0].item);
            }
        } catch (error) {
            console.error('Error fetching gratitude item:', error);
        }
    };

    const handleSubmitGratitude = async (event) => {
        event.preventDefault();
        
        try {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0];

            console.log(userId);
            
            // Send gratitude data to server
            const response = await axios.post('http://localhost:8000/savegratitude', { text: gratitudeText, date: formattedDate, userId: userId });

            if (response.status === 200) {
                console.log('Gratitude item saved successfully');
                setShowGratForm(false);
                fetchGratitude();
            }
        } catch (error) {
            console.error('Error saving gratitude item:', error);
        }
    };

    return (
        <>
        <div className="gratitude-container">
            <div className="gratitude-flex">
                {gratitudeItem ? ( <h3>I am grateful for...</h3> ) : ( <h3>Today's Gratitude</h3> )}
                {gratitudeItem ? ( <div className="plus-icon"></div> ) : ( <div className="plus-icon" onClick={toggleGratForm}>+</div> )}
            </div>
            {gratitudeItem ? ( <p className="gratitude-item"> {gratitudeItem} </p> ) : ( <p className="gratitude-item">What are you grateful for today?</p> )}
        </div>

        {showGratForm && (
        <div className="grat-form-overlay">
            <div className="grat-form-container">
                <button className="grat-close-button" onClick={handleCloseGratForm}><b>X</b></button>
                <h2>What are you grateful for today?</h2>
                <form onSubmit={handleSubmitGratitude}>
                    <label>I am grateful for...</label><br/>
                    <input 
                    type="text" 
                    placeholder="Enter your gratitude"
                    value={gratitudeText}
                    onChange={handleGratitudeChange}
                    /><br/>
                    <button type="submit" className="grat-submit-button">Submit</button>
                </form>
            </div>
        </div>
        )}
        </>
    )
}

export default Gratitude;