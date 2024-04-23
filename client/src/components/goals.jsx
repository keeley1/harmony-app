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
    const [tasks, setTasks] = useState([]);
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
                setShowGoalDetails(false);
                fetchGoals();
            }
        } catch (error) {
            console.error('Error completing goal:', error);
        }
    };

    const toggleCompletedGoals = () => {
        setShowCompletedGoals(!showCompletedGoals);
    };

    const fetchGoalTasks = async (goalId) => {
        try {
            const response = await axios.get(`http://localhost:8000/getgoaltasks?goalId=${goalId}&userId=${userId}`);
            if (response.data.tasks) {
                setTasks(response.data.tasks); // Update state with received data directly
                scrollToBottom();
                /*
                const allGoalTasks = response.data.tasks;
                console.log(allGoalTasks);
                const incompleteGoals = allGoalTasks.filter(task => task.is_complete === 0);
                const completeGoals = allGoalTasks.filter(task => task.is_complete === 1);
                setTasks(incompleteGoals);
                console.log(tasks);
                //setCompletedGoals(completeGoals);
                scrollToBottom();*/
            } else {
                console.error('Error retrieving items:', response.data.error);
            }
        } catch (error) {
            console.error('Error retrieving items:', error);
        }
    };

    const handleAddGoalTask = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/addgoaltask', { goalId: selectedGoal.goal_id, goal_task: goalTask, userId });
            if (response.status === 200) {
                fetchGoalTasks(selectedGoal.goal_id);
                setGoalTask('');
                console.log('task added');
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleCompleteGoalTask = async (goalId, goalTaskId) => {
        console.log('goal id' + goalId);
        console.log(goalTaskId);
        try {
            const response = await axios.post('http://localhost:8000/completegoaltask', {
                goalId,
                goalTaskId,
                isComplete: 1,
                userId
            });
            if (response.status === 200) {
                fetchGoalTasks(goalId);
            }
        } catch (error) {
            console.error('Error completing goal:', error);
        }
    };

    const formatDate = dateString => new Date(dateString).toLocaleDateString();

    const toggleGoalDetails = (item) => {
        setSelectedGoal(item);
        setShowGoalDetails(true);
        fetchGoalTasks(item.goal_id);
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
                    <h2>{selectedGoal.goal}</h2>
                    <div className="goal-tasks">
                        <h3>Tasks for this Goal</h3>
                        <ul>
                            {tasks
                            .sort((a, b) => b.goal_task_id - a.goal_task_id)
                            .filter(task => task.is_complete === 0) // Incomplete tasks
                            .map((task, index) => (
                            <li key={index} style={{ textDecoration: 'none' }}>
                                <div className="goal-tasks-flex">
                                    {task.goal_task}
                                    <span onClick={() => handleCompleteGoalTask(task.goal_id, task.goal_task_id)} className="goal-tasks-button">&#x2705;</span>
                                </div>
                            </li>
                            ))}
                            
                            {tasks
                            .filter(task => task.is_complete === 1) // Completed tasks
                            .map((task, index) => (
                            <li key={index} style={{ textDecoration: 'line-through' }}>
                                {task.goal_task}
                            </li>
                            ))}
                        </ul>
                    </div>
                    <form onSubmit={handleAddGoalTask} className="goal-task-flex">
                        <input type="text" className="goal-task-bar" placeholder="Enter new task" value={goalTask} onChange={(e) => setGoalTask(e.target.value)} />
                        <button type="submit" className="goal-task-button">Add Task</button>
                    </form>

                    <div className="goal-task-bottom-flex">
                        <p><strong>Target Date:</strong> {formatDate(selectedGoal.goal_target_date)}</p>
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

