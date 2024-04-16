import React, { useState, useEffect } from "react";
import axios from 'axios';
import DisplayDate from '../components/displayDate';
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
            const response = await axios.get(`http://localhost:8080/retrieveitems?date=${formattedDate}&userId=${userId}`);
    
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
        try {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0]; // Format date as yyyy-mm-dd

            const response = await axios.post('http://localhost:8080/additem', { text: newItem, date: formattedDate, userId: userId });
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
            const response = await axios.post('http://localhost:8080/deleteitem', { itemId });
            if (response.status === 200) {
                console.log('Item deleted successfully');
                fetchItems();
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
        <>
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
                    placeholder="Add a new item"
                    className="todo-form"
                />
                <button onClick={handleAddItem} className="todo-button">Submit</button>
            </div>
        </div>
        </>
    );
};

export default Todo;