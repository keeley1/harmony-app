import React, {useState} from "react";
import Todo from "../components/todo";
import DisplayDate from '../components/displayDate';
import Gratitude from "../components/gratitude";
import Affirmations from "../components/affirmations";
import CheckIn from "../components/checkIn";

const Home = () => {

    return (
        <>
    <div className="dashboard-flex">
        <DisplayDate />
        <div className="dashboard-container">
            <div className="dashboard-left">
                    <Todo />
                    <Gratitude />
                    <Affirmations />
            </div>
            <div className="dashboard-right">
                <div className="timer-container">
            <h2>Timer</h2>
    </div>
                    <CheckIn />
                    <Gratitude />
                    <Affirmations />
            </div>
        </div>
    </div>
</>

    );
};

export default Home;

