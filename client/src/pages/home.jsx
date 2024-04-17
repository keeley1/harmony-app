import React, {useState} from "react";
import Todo from "../components/todo";
import DisplayDate from '../components/displayDate';
import Gratitude from "../components/gratitude";
import Affirmations from "../components/affirmations";

const Home = () => {

    return (
        <>
        <div className="dashboard-flex">
            <div className="dashboard-section">
                <DisplayDate />
                <Todo />
                <Gratitude />
                <Affirmations />
            </div>
        </div>
        </>
    );
};

export default Home;

