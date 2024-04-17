import React, {useState} from "react";

const Gratitude = () => {

    const [showGratForm, setShowGratForm] = useState(false);

    const toggleGratForm = () => {
        setShowGratForm(!showGratForm);
    };

    const handleCloseGratForm = () => {
        setShowGratForm(false);
    };

    return (
        <>
        <div className="gratitude-container">
            <div className="gratitude-flex">
                <h3>Today's Gratitude</h3>
                <div className="plus-icon" onClick={toggleGratForm}>+</div>
            </div>
            <p>What are you grateful for today?</p>
        </div>

        {showGratForm && (
        <div className="form-overlay">
            <div className="form-container">
                <button className="close-button" onClick={handleCloseGratForm}>X</button>
                <h2>What are you grateful for today?</h2>
                <form>
                    <label>I am grateful for...</label><br/>
                    <input type="text" placeholder="Enter your gratitude"/><br/>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
        )}
        </>
    )
}

export default Gratitude;