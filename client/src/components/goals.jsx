import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const Goals = () => {
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [showGoalDetails, setShowGoalDetails] = useState(false);
    const [goal, setGoal] = useState('');
    const [goalTargetDate, setGoalTargetDate] = useState('');
    const [items, setItems] = useState([]);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [completedGoals, setCompletedGoals] = useState([]);
    const [showCompletedGoals, setShowCompletedGoals] = useState(false);
    const [goalTask, setGoalTask] = useState('');
    const { userId, loading } = useAuth();
    const listRef = useRef(null);

    const toggleAddGoal = () => setShowAddGoal(!showAddGoal);
    const handleCloseAddGoal = () => setShowAddGoal(false);

    const scrollToBottom = () => {
        listRef.current.scrollTop = listRef.current.scrollHeight;
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
                const allGoals = response.data.items;
                const incompleteGoals = allGoals.filter(item => item.is_complete === 0);
                const completeGoals = allGoals.filter(item => item.is_complete === 1);
                setItems(incompleteGoals);
                setCompletedGoals(completeGoals);
                scrollToBottom();
            } else {
                console.error('Error retrieving items:', response.data.error);
            }
        } catch (error) {
            console.error('Error retrieving items:', error);
        }
    };

    const handleAddGoal = async () => {
        try {
            const response = await axios.post('http://localhost:8000/postgoal', { goal, goal_target_date: goalTargetDate, userId });
            if (response.status === 200) {
                fetchGoals();
                setShowAddGoal(false);
            }
        } catch (error) {
            console.error('Error adding goal:', error);
        }
    };

    const handleCompleteGoal = async (goalId) => {
        try {
            const response = await axios.post('http://localhost:8000/completegoal', {
                goalId,
                isComplete: 1,
                userId
            });
            if (response.status === 200) {
                alert('Goal marked as complete!');
                fetchGoals();
            }
        } catch (error) {
            console.error('Error completing goal:', error);
            alert('Failed to mark goal as complete.');
        }
    };

    const toggleCompletedGoals = () => {
        setShowCompletedGoals(!showCompletedGoals);
    };

    const handleAddGoalTask = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/addgoaltask', { goalId: selectedGoal.goal_id, goal_task: goalTask, userId });
            if (response.status === 200) {
                //fetchGoals();
                //setShowAddGoal(false);
                console.log('task added');
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const formatDate = dateString => new Date(dateString).toLocaleDateString();

    const toggleGoalDetails = (item) => {
        setSelectedGoal(item);
        setShowGoalDetails(true);
    };

    const handleCloseGoalDetails = () => {
        setShowGoalDetails(false);
        setSelectedGoal(null);
    };

    return (
        <>
            <div className="goals-container">
                <h3>Current Goals</h3>
                <ul ref={listRef}>
                    {items.map((item, index) => (
                        <li key={index} onClick={() => toggleGoalDetails(item)}>
                            {item.goal}
                        </li>
                    ))}
                </ul>
                <div className="button-container">
                    <button onClick={toggleCompletedGoals} className="add-goal-button">View completed goals</button>
                    <button onClick={toggleAddGoal} className="add-goal-button">Add goal</button>
                </div>
            </div>

            {showAddGoal && (
                <div className="goal-form-overlay">
                    <div className="goal-form-container">
                        <button onClick={handleCloseAddGoal} className="grat-close-button"><b>X</b></button>
                        <h2>Add Goal</h2>
                        <form>
                            <label>Goal:</label>
                            <input type="text" className="goal-add-text" value={goal} onChange={e => setGoal(e.target.value)} placeholder="Enter goal" />
                            <label>Goal target date:</label>
                            <input type="date" className="goal-add-date" value={goalTargetDate} onChange={e => setGoalTargetDate(e.target.value)} placeholder="Enter target date" /><br/>
                            <button onClick={handleAddGoal} className="goal-add-submit">Submit</button>
                        </form>
                    </div>
                </div>
            )}
            
            {showGoalDetails && selectedGoal && (
            <div className="goal-form-overlay">
                <div className="single-goal-form-container">
                    <button onClick={handleCloseGoalDetails} className="grat-close-button"><b>X</b></button>
                    <h2>Goal Details</h2>
                    <p><strong>Goal:</strong> {selectedGoal.goal}</p>
                    <p><strong>Target Date:</strong> {formatDate(selectedGoal.goal_target_date)}</p>

                    <div>
                        <h3>Tasks for this Goal</h3>
                        <ul>
                            {/*{selectedGoal.tasks && selectedGoal.tasks.map((task, index) => (
                                <li key={index}>{task.description} - {task.completed ? 'Done' : 'Pending'}</li>
                            ))}*/}
                        </ul>
                        <form onSubmit={handleAddGoalTask}>
                            <input type="text" placeholder="Enter new task" value={goalTask} onChange={(e) => setGoalTask(e.target.value)} />
                            <button type="submit">Add Task</button>
                        </form>
                        {/*<form>
                            <input type="text" placeholder="Enter new task" />
                            <button type="submit">Add Task</button>
                        </form>*/}
                    </div>
                    
                    <div className="goal-complete-button">
                        <button
                        onClick={() => handleCompleteGoal(selectedGoal.goal_id)}
                        className="add-goal-button"
                        disabled={selectedGoal.is_complete}
                        >
                        Mark goal as complete
                        </button>
                    </div>
                </div>
            </div>
            )}

            
            {showCompletedGoals && (
            <div className="goal-form-overlay">
                <div className="completed-goal-container">
                    <button onClick={toggleCompletedGoals} className="grat-close-button"><b>X</b></button>
                    <h2>Completed Goals</h2>
                    <ul>
                        {completedGoals.map((item, index) => (
                        <li key={index}>{item.goal}</li>
                        ))}
                    </ul>
                </div>
            </div>
            )}
        </>
    );
};

export default Goals;

