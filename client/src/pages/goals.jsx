import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const GoalPage = () => {
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [goal, setGoal] = useState('');
    const [goalTargetDate, setGoalTargetDate] = useState('');
    const [items, setItems] = useState([]);
    const { userId, loading } = useAuth();

    const toggleAddGoal = () => {
        setShowAddGoal(!showAddGoal);
    };

    const handleCloseAddGoal = () => {
        setShowAddGoal(false);
    };

    useEffect(() => {
        if (!loading && userId) {
            fetchGoals();
        }
    }, [loading, userId]);

    const fetchGoals = async () => {
        try {
            const response = await axios.get(`https://www.doc.gold.ac.uk/usr/201/getgoals?userId=${userId}`);

            if (response.data.items) {
                console.log(response.data.items);
                setItems(response.data.items);
            } else {
                console.error('Error retrieving items:', response.data.error);
            }
        } catch (error) {
            console.error('Error retrieving items:', error);
        }
    }; 

    const handleAddGoal = async () => {
        try {
            const response = await axios.post('https://www.doc.gold.ac.uk/usr/201/postgoal', { goal: goal, goal_target_date: goalTargetDate, userId: userId });

            if (response.status === 200) {
                console.log('Goal saved successfully');
                setShowAddGoal(false);
                fetchGoals();
            }
        } catch (error) {
            console.error('Error adding goal:', error);
        }
    };

    return (
        <>
        <h1>Goals</h1>
        <ul>
            {items.map((item, index) => (
                <li key={index}>{item.goal}, {item.is_complete}</li>
            ))}
        </ul>
        <button onClick={toggleAddGoal}>Add goal</button>

        {showAddGoal && (
        <div className="grat-form-overlay">
            <div className="grat-form-container">
                <button className="grat-close-button" onClick={handleCloseAddGoal}>X</button>
                <h2>Add Goal</h2>
                <input type="text" value={goal} onChange={e => setGoal(e.target.value)} placeholder="Enter goal" />
                <input type="date" value={goalTargetDate} onChange={e => setGoalTargetDate(e.target.value)} placeholder="Enter target date" />
                <button onClick={handleAddGoal}>Submit</button>
            </div>
        </div>
        )}
        </>
    );
};

export default GoalPage;

