import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Todo = () => {
    const { userId, loading } = useAuth();
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');
    const [errors, setErrors] = useState([]);

    const handleNewItemChange = (event) => {
        setNewItem(event.target.value);
        setErrors([]);
    };

    useEffect(() => {
        if (!loading && userId) {
            fetchItems();
        }
    }, [loading, userId]);

    const fetchItems = async () => {
        try {
            // get current date
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0]; // Format date as yyyy-mm-dd
    
            // make request to server route with the date and user ID as query parameters
            const response = await axios.get(`http://localhost:8000/retrieveitems?date=${formattedDate}&userId=${userId}`);
    
            if (response.data.items) {
                setItems(response.data.items);
            } 
            else {
                console.error('Error retrieving items:', response.data.error);
            }
        } 
        catch (error) {
            console.error('Error retrieving items:', error);
        }
    };    

    const handleAddItem = async () => {
        try {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0];

            const response = await axios.post('http://localhost:8000/additem', { text: newItem, date: formattedDate, userId: userId });
            if (response.status === 200) {
                fetchItems();
                setNewItem('');
                setErrors([]);
            }
        } 
        catch(error) {
            if (error.response && error.response.data.errors) {
              setErrors(error.response.data.errors);
            } 
            else {
              console.error("Error adding item:", error);
            }
        };
    };

    const handleDeleteItem = async (itemId) => {
        try {
            const response = await axios.post('http://localhost:8000/deleteitem', { itemId });
            if (response.status === 200) {
                console.log('Item deleted successfully');
                fetchItems();
            }
        } 
        catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleCompleteItem = async (taskId) => {
        try {
            const response = await axios.post('http://localhost:8000/completeitem', {
                // set task to complete in body parameter
                taskId,
                isComplete: 1,
                userId
            });
            if (response.status === 200) {
                fetchItems();
            }
        } 
        catch (error) {
            console.error('Error completing goal:', error);
        }
    };

    return (
        <>
        <div className="todo-container">
            <h2 className="todo-title">Today's Tasks</h2>
            <ul className="todo-list">
                {items
                // sort by task id and select incomplete tasks
                .sort((a, b) => b.task_id - a.task_id)
                .filter(item => item.is_complete === 0) 
                .map((item, index) => (
                <li key={index} style={{ textDecoration: 'none' }}>
                    <li key={index} className="todo-list-item">
                        {item.task}
                        <div className="todo-list-item-buttons">
                            <span className="tick-button" onClick={() => handleCompleteItem(item.task_id)}>&#x2705;</span>
                        </div>
                    </li>
                </li>
                ))}
                            
                {items
                // sort by task id and select complete tasks
                .filter(item => item.is_complete === 1)
                .map((item, index) => (
                <li key={index} style={{ textDecoration: 'line-through' }}>
                    <li key={index} className="todo-list-item">
                        {item.task}
                    </li>
                </li>
                ))}
            </ul>

            <p><NavLink to="/todo" className="view-all-button"><b>View all</b></NavLink></p>
            <div>
                <input
                    type="text"
                    value={newItem}
                    onChange={handleNewItemChange}
                    placeholder="Enter new task"
                    className="todo-form"
                />
                <button onClick={handleAddItem} className="todo-button">Submit</button>

                {console.log(errors)}
                {errors.length > 0 && (
                <div className="error-messages">
                    <p>{errors[0].msg}</p>
                </div>
                )}
            </div>
        </div>
        </>
    );
};

export default Todo;