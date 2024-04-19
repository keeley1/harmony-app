import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import About from "./pages/about";
import Tasks from "./pages/tasks";
import Register from "./pages/register";
import Login from "./pages/login";
import ProtectedRoute from "./hooks/protectedRoute";
import TodoPage from "./pages/todo";
import GoalPage from "./pages/goals";

const App = () => {
  return (
    <>
    <Navbar />
    <Routes>
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<Home />} />
    </Route>
    <Route path="/about" element={<About />}/>
    <Route path="/tasks" element={<Tasks />}/>
    <Route path="/register" element={<Register />}/>
    <Route path="/login" element={<Login />}/>
    <Route path="/todo" element={<TodoPage />}/>
    <Route path="/goals" element={<GoalPage />}/>
    </Routes>
    </>
  );
};

export default App;
