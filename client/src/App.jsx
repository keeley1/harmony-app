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
import UserTest from "./pages/userTest";

const App = () => {
  return (
    <>
    <Navbar />
    <Routes>
    <Route element={<ProtectedRoute />}>
      <Route path="/usr/201/" element={<Home />} />
    </Route>
    <Route path="/usr/201/about" element={<About />}/>
    <Route path="/usr/201/tasks" element={<Tasks />}/>
    <Route path="/usr/201/register" element={<Register />}/>
    <Route path="/usr/201/login" element={<Login />}/>
    <Route path="/usr/201/todo" element={<TodoPage />}/>
    <Route path="/usr/201/goals" element={<GoalPage />}/>
    <Route path="/usr/201/usertest" element={<UserTest />}/>
    </Routes>
    </>
  );
};

export default App;
