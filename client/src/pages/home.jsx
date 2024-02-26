import React from "react";
import { NavLink } from "react-router-dom";
import Todo from "../components/todo";

const home = () => {
    return (
        <>
        <div className="home-cont">
        <div className="todo-container">
            <h2 className="todo-title">Today's Tasks</h2>
            <p className="todo-item">Do laundry</p>
            <p className="todo-item">Start writing essay</p>
            <p className="todo-item">Meal prep for the week</p>

            <p className="todo-view-all-p"><NavLink to="/tasks" className="todo-view-all"><b>View all</b></NavLink></p>
        </div>
        <Todo />
        </div>
        <div className="todo-container">
            <h2 className="todo-title">Today's Tasks</h2>
            <p className="todo-item">Do laundry</p>
            <p className="todo-item">Start writing essay</p>
            <p className="todo-item">Meal prep for the week</p>

            <p className="todo-view-all-p"><NavLink to="/tasks" className="todo-view-all"><b>View all</b></NavLink></p>
        </div>
        <Todo />
        </>
    )
}

export default home;