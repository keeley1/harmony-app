import React, { useState, useEffect } from "react";

const todo = () => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        fetch('http://localhost:8080/getitems')
            .then(response => response.json())
            .then(data => {
                if (data.items) {
                    setItems(data.items);
                } else {
                    console.error('Error retrieving items:', data.error);
                }
            })
            .catch(error => console.error('Error retrieving items:', error));
    };

    const handleNewItemChange = (event) => {
        setNewItem(event.target.value);
    };

    const handleAddItem = async () => {
        try {
            const response = await fetch('http://localhost:8080/additem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: newItem }),
            });

            if (response.ok) {
                console.log('Item added successfully');
                fetchItems();
                setNewItem('');
            } else {
                const errorMessage = await response.text();
                console.error('Error adding item:', errorMessage);
            }
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const handleDeleteItem = async (itemId) => {
        console.log(itemId);
        try {
            const response = await fetch('http://localhost:8080/deleteitem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId: itemId }),
            });

            if (response.ok) {
                console.log('Item deleted successfully');
                fetchItems();
            } else {
                const errorMessage = await response.text();
                console.error('Error deleting item:', errorMessage);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
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
    );
};

export default todo;