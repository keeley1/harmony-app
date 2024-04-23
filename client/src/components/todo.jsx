import React, { useState, useEffect } from "react";
import axios from 'axios';
import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Todo = () => {
    const { userId, loading } = useAuth();
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');

    useEffect(() => {
        if (!loading && userId) {
            fetchItems();
        }
    }, [loading, userId]);

    const fetchItems = async () => {
        try {
            // Get the current date
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0]; // Format date as yyyy-mm-dd
    
            console.log(userId);
            console.log(formattedDate);
            // Make the GET request with the date and user ID as query parameters
            const response = await axios.get(`http://localhost:8000/retrieveitems?date=${formattedDate}&userId=${userId}`);
    
            if (response.data.items) {
                setItems(response.data.items);
            } else {
                console.error('Error retrieving items:', response.data.error);
            }
        } catch (error) {
            console.error('Error retrieving items:', error);
        }
    };    

    const handleNewItemChange = (event) => {
        setNewItem(event.target.value);
    };

    const handleAddItem = async () => {
        console.log(newItem);
        try {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0]; // Format date as yyyy-mm-dd

            const response = await axios.post('http://localhost:8000/additem', { text: newItem, date: formattedDate, userId: userId });
            if (response.status === 200) {
                console.log('Item added successfully');
                fetchItems();
                setNewItem('');
            }
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            const response = await axios.post('http://localhost:8000/deleteitem', { itemId });
            if (response.status === 200) {
                console.log('Item deleted successfully');
                fetchItems();
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleCompleteItem = async (taskId) => {
        try {
            const response = await axios.post('http://localhost:8000/completeitem', {
                taskId,
                isComplete: 1,
                userId
            });
            if (response.status === 200) {
                fetchItems();
            }
        } catch (error) {
            console.error('Error completing goal:', error);
        }
    };

    return (
        <>
        <div className="todo-container">
            <h2 className="todo-title">Today's Tasks</h2>
            <ul className="todo-list">
                {items
                .sort((a, b) => b.task_id - a.task_id)
                .filter(item => item.is_complete === 0) // Incomplete tasks
                .map((item, index) => (
                <li key={index} style={{ textDecoration: 'none' }}>
                    <li key={index} className="todo-list-item">
                        {item.task}
                        <div className="todo-list-item-buttons">
                            {/*<button onClick={() => handleDeleteItem(item.task_id)} className="delete-button"><b>X</b></button>*/}
                            <span className="tick-button" onClick={() => handleCompleteItem(item.task_id)}>&#x2705;</span>
                        </div>
                    </li>
                </li>
                ))}
                            
                {items
                .filter(item => item.is_complete === 1) // Completed tasks
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
            </div>
        </div>
        </>
    );
};

export default Todo;