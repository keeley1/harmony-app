import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { NavLink } from 'react-router-dom';

const Projects = () => {
    const [showAddProject, setShowAddProject] = useState(false);
    const [project, setProject] = useState('');
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [items, setItems] = useState([]);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const { userId, loading } = useAuth();
    const listRef = useRef(null);
    const [errors, setErrors] = useState([]);

    const toggleAddProject = () => setShowAddProject(!showAddProject);
    const handleCloseAddProject = () => setShowAddProject(false);

    useEffect(() => {
        if (!loading && userId) {
            fetchProjects();
        }
    }, [loading, userId]);

    const fetchProjects = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/getprojects?userId=${userId}`);
            // set the projects from the response data
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

    const handleAddProject = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/postproject', { project_name: projectName, project_description: projectDescription, userId });
            if (response.status === 200) {
                fetchProjects();
                setShowAddProject(false);
                setErrors([]);
                setProjectName(''); 
                setProjectDescription('');
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

    return (
        <>
        <div className="projects-container">
            <h2 className="projects-title">Projects</h2>
            <div className="project-flex">
                <ul ref={listRef}>
                    {items.map((item, index) => (
                    <li key={index}>
                        <NavLink to={`/individualproject/${item.project_id}`} className="project-item">
                            {item.project_name}
                        </NavLink>
                    </li>
                    ))}
                </ul>
            </div>
            
            <div className="project-button-container">
                <button onClick={toggleAddProject} className="add-project-button">Add project</button>
            </div>
        </div>
        
        {showAddProject && (
        <div className="goal-form-overlay">
            <div className="goal-form-container">
                <button onClick={handleCloseAddProject} className="grat-close-button"><b>X</b></button>
                <h2>Add Project</h2>
                <form>
                    <label>Project:</label>
                    <input type="text" className="goal-add-text" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Enter project name" />
                    <label>Project description:</label>
                    <input type="text" className="goal-add-date" value={projectDescription} onChange={e => setProjectDescription(e.target.value)} placeholder="Enter project description" /><br/>
                    <button onClick={handleAddProject} className="goal-add-submit">Submit</button>
                </form>

                {errors.length > 0 && (
                <div className="error-messages">
                    <p>{errors[0].msg}</p>
                </div>
                )}
            </div>
        </div>
        )}   
    </>
    );
};

export default Projects;