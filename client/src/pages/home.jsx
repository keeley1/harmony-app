import React, {useState} from "react";
import Todo from "../components/todo";
import DisplayDate from '../components/displayDate';
import Gratitude from "../components/gratitude";

const Home = () => {

    return (
        <>
        <div className="dashboard-flex">
            <div className="dashboard-section">
                <DisplayDate />
                <Todo />
                <Gratitude />
                <div className="affirmation-container">
                    <h3>Affirmations</h3>
                    <p>"I am growing and I am going at my own pace"</p>
                </div>
            </div>
        </div>
        </>
    );
};

export default Home;

