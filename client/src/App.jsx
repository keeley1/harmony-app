import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import About from "./pages/about";
import Tasks from "./pages/tasks";
import Register from "./pages/register";
import Login from "./pages/login";
import ProtectedRoute from "./hooks/protectedRoute";

const App = () => {
  return (
    <>
    <Navbar />
    <Routes>
    <Route element={<ProtectedRoute />}>
                    {/* Place protected routes here */}
                    <Route path="/" element={<Home />} />
    </Route>
      {/*<Route path="/" element={<Home />}/>*/}
      <Route path="/about" element={<About />}/>
      <Route path="/tasks" element={<Tasks />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/login" element={<Login />}/>
    </Routes>
    </>
  );
};

export default App;
