import React from "react";
import Todo from "../components/todo";
import DisplayDate from '../components/displayDate'

const Home = () => {
    return (
        <>
        <div className="dashboard-flex">
            <div className="dashboard-section">
                <DisplayDate />
                <Todo />
                <div className="gratitude-container">
                    <h3>Today's Gratitude</h3>
                    <p>Time with friends...</p>
                </div>
                <div className="affirmation-container">
                    <h3>Affirmations</h3>
                    <p>"I am growing and I am going at my own pace"</p>
                </div>
                <div className="date-container">
                    <h3>Today's Date</h3>
                </div>
            </div>
        </div>
        </>
    );
};

export default Home;

