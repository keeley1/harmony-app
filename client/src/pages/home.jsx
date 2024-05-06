import React from 'react';
import Todo from '../components/todo';
import DisplayDate from '../components/displayDate';
import Gratitude from '../components/gratitude';
import Affirmations from '../components/affirmations';
import Timer from '../components/timer';
import CheckIn from '../components/checkIn';
import Goals from '../components/goals';

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
                    <Timer />
                    <CheckIn />
                    <Goals />
                </div>
            </div>
        </div>
        </>
    );
};

export default Home;

