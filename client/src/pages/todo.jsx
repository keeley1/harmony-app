import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import DisplayDate from '../components/displayDate';

const TodoPage = () => {
    const { userId, loading } = useAuth();
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');

    const handleNewItemChange = (event) => {
        setNewItem(event.target.value);
    };

    useEffect(() => {
        if (!loading && userId) {
            fetchItems();
        }
    }, [loading, userId]);

    const fetchItems = async () => {
        try {
            // get current date and format
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0]; 

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
                console.log('Item added successfully');
                fetchItems();
                setNewItem('');
            }
        } 
        catch (error) {
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
        } 
        catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
        <>
        <DisplayDate />
        <p className="todo-back-button"><NavLink to="/">Back</NavLink></p>
        <div className="todo-container">
            <h2 className="todo-title">Today's Tasks</h2>

            <ul className="todo-list">
                {items.map((item, index) => (
                    <li key={index} className="todo-list-item">
                        {console.log(item.task_id)}
                        {item.task}
                        <button onClick={() => handleDeleteItem(item.task_id)} className="delete-button">X</button>
                    </li>
                ))}
            </ul>
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

export default TodoPage;