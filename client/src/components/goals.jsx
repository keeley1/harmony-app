import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const Goals = () => {
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
            const response = await axios.get(`http://localhost:8000/getgoals?userId=${userId}`);

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
            const response = await axios.post('http://localhost:8000/postgoal', { goal: goal, goal_target_date: goalTargetDate, userId: userId });

            if (response.status === 200) {
                console.log('Goal saved successfully');
                setShowAddGoal(false);
                fetchGoals();
            }
        } catch (error) {
            console.error('Error adding goal:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()}`;
    };

    return (
        <>
        <div className="goals-container">
            <h3>Goals</h3>
            <ul>
                {items.map((item, index) => (
                    <li key={index}>{item.goal}, Goal target date: {formatDate(item.goal_target_date)}</li>
                ))}
            </ul>
            <button onClick={toggleAddGoal} className="add-goal-button">Add goal</button>
        </div>

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

export default Goals;