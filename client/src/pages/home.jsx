import React from "react";
import { NavLink } from "react-router-dom";
import Todo from "../components/todo";

const home = () => {
    return (
        <>
        <div className="dashboard-flex">
            <div className="dashboard-section">
                <Todo />
                <div className="gratitude-container">
                    <h3>Today's Gratitude</h3>
                    <p>Time with friends...</p>
                </div>
                <div className="affirmation-container">
                    <h3>Affirmations</h3>
                    <p>"I am growing and I am going at my own pace"</p>
                </div>
            </div>
        </div>
        </>
    )
}

export default home;