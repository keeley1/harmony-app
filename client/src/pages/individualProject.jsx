import React, { useEffect, useState, useRef } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import '../appTwo.css';
import autoResizeTextarea from '../components/autoResizeTextArea';

const IndividualProject = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [projectLists, setProjectLists] = useState(null);
    const [projectTasks, setProjectTasks] = useState(null);
    const [newListName, setNewListName] = useState('');
    const [activeListId, setActiveListId] = useState(null);
    const [activeTaskId, setActiveTaskId] = useState(null);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskDate, setNewTaskDate] = useState('');
    const { userId, loading } = useAuth();
    const [errors, setErrors] = useState([]);

    const toggleAddProjectTask = (listId) => {
        if (activeListId === listId) {
            setActiveListId(null);  
        } 
        else {
            setActiveListId(listId); 
        }
    };

    const handleCloseAddProjectTask = () => {
        setActiveListId(null); 
    };

    const openTaskDetails = (taskId) => {
        setActiveTaskId(taskId);
    };

    const closeTaskDetails = (e) => {
        if (e) {
            e.stopPropagation();
        }
        setActiveTaskId(null);
    };


    const toggleTaskDetails = (taskId) => {
        setActiveTaskId(taskId === activeTaskId ? null : taskId);
    };
    
    useEffect(() => {
        if (!loading && userId) {
            fetchProject();
            fetchProjectLists();
        }
    }, [loading, userId, projectId]);
    
    const fetchProject = async () => {
        try {
            // call server get project route
            const response = await axios.get(`http://localhost:8000/getproject?userId=${userId}&projectId=${projectId}`);
            if (response.data.items) {
                setProject(response.data.items);
            } 
            else {
                console.error('Error retrieving items:', response.data.error);
            }
        } 
        catch (error) {
            console.error('Error retrieving items:', error);
        }
    };

    const fetchProjectLists = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/getprojectlists?projectId=${projectId}`);
            if (response.data.items) {
                setProjectLists(response.data.items);
                
                response.data.items.forEach((list) => {
                    fetchProjectTasks(list.project_list_id);
                });
            } 
            else {
                console.error('Error retrieving items:', response.data.error);
            }
        } 
        catch (error) {
            console.error('Error retrieving items:', error);
        }
    };

    const fetchProjectTasks = async (projectListId) => {
        try {
            const response = await axios.get(`http://localhost:8000/getprojecttasks?projectListId=${projectListId}`);
            if (response.data.items) {
                // update the state with fetched project tasks
                setProjectTasks(prevState => ({
                    ...prevState,
                    [projectListId]: response.data.items
                }));
            } 
            else {
                console.error('Error retrieving items:', response.data.error);
            }
        } 
        catch (error) {
            console.error('Error retrieving items:', error);
        }
    };
    
    const addProjectList = async (event) => {
        event.preventDefault();
        /*if (!newListName.trim()) {
            alert('Please enter a name for the project list.');
            return;
        }*/
        try {
            const response = await axios.post('http://localhost:8000/addprojectlist', { project_list_name: newListName, project_id: projectId });
            if (response.status === 201) {
                fetchProject(); 
                fetchProjectLists();
                setNewListName('');
                setErrors([]);
                alert('Project list added successfully.');
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

    const addProjectTask = async (projectListId) => {
        /*if (!newTaskName.trim()) {
            alert('Please enter a name for the task.');
            return;
        }*/
        try {
            const response = await axios.post('http://localhost:8000/addprojecttask', {
                projectTaskName: newTaskName,
                projectTaskDescription: newTaskDescription,
                projectTaskDate: newTaskDate,
                projectListId: projectListId
            });
            if (response.status === 201) {
                // fetch project lists and update form input states
                fetchProjectLists(projectListId); 
                setNewTaskName('');
                setNewTaskDescription('');
                setNewTaskDate('');
                setErrors([]);
                alert('Task added successfully.');
                handleCloseAddProjectTask();
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
    
    const handleDeleteProjectList = async (projectListId) => {
        try {
            const response = await axios.post('http://localhost:8000/deleteprojectlist', { projectListId });
            if (response.status === 201) {
                fetchProjectLists(); 
            }
        } 
        catch (error) {
            console.error('Error deleting list:', error);
        }
    };
    
    const handleDeleteProjectTask = async (projectTaskId, projectListId) => {
        try {
            const response = await axios.post('http://localhost:8000/deleteprojecttask', { projectTaskId });
            if (response.status === 200) {
                console.log('Item deleted successfully');
                fetchProjectLists(); 
                fetchProjectTasks(projectListId); 
                closeTaskDetails(); 
            }
        } 
        catch (error) {
            console.error('Error deleting item:', error);
        }
    };
    
    const handleCompleteProjectTask = async (projectTaskId, projectListId) => {
        try {
            const response = await axios.post('http://localhost:8000/completeprojecttask', {
                // set project task to complete in body parameters
                projectTaskId,
                isComplete: 1,
            });
            if (response.status === 200) {
                fetchProjectLists(); 
                fetchProjectTasks(projectListId); 
                closeTaskDetails(); 
            }
        } 
        catch (error) {
            console.error('Error completing goal:', error);
        }
    };
    
    if (!project) {
        return <div>Loading...</div>;
    }
    
    return (
    <>
    <div className="board-container">
        <div className="board-title-flex">
            <NavLink to={'/projects'} className="single-project-back">&#11013; &#65039;</NavLink>
            <h2>{project[0].project_name}</h2>
        </div>
        <p className="single-project-desc">{project[0].project_description}</p>
        
        {projectLists && projectLists.length > 0 ? (
        <div className="project-list-flex"> 
            {projectLists.map((list, index) => (
                <div key={index} className="project-list-item">
                    <div className="project-list-name">
                        <h3>{list.project_list_name}</h3>
                    </div>
                    
                    <button onClick={() => handleDeleteProjectList(list.project_list_id)} className="btn-add-task">&#128465;</button>
                    
                    <div className="project-tasks">
                        <ul className="task-list">

                            {projectTasks && projectTasks[list.project_list_id] && projectTasks[list.project_list_id]
                            // sort by project task id and select incomplete project tasks
                            .sort((a, b) => b.project_task_id - a.project_task_id)
                            .filter(task => task.project_task_is_complete === 0)
                            .map((task, taskIndex) => (
                            <li key={taskIndex} className="task-item" onClick={() => openTaskDetails(task.project_task_id)}>
                                {task.project_task_name}
                                {activeTaskId === task.project_task_id && (
                                <div className="task-details-popup">
                                    <div className="task-details-container">
                                        <p onClick={closeTaskDetails} className="close-task-details">X</p>
                                        <h2>{task.project_task_name}</h2>
                                        <p><b>Description</b></p>
                                        <p>{task.project_task_description}</p>
                                        <p><b>Due Date:</b></p>
                                        <p>{task.project_task_due_date}</p>
                                        <div className="task-details-buttons">
                                            <p onClick={() => handleDeleteProjectTask(task.project_task_id, list.project_list_id)} className="complete-delete-button">&#128465; Delete task</p>
                                            <p onClick={() => handleCompleteProjectTask(task.project_task_id, list.project_list_id)} className="complete-delete-button">&#x2705; Mark as complete</p>
                                        </div>
                                    </div>
                                </div>
                                )}
                            </li>
                            ))}
                            
                            {projectTasks && projectTasks[list.project_list_id] && projectTasks[list.project_list_id]
                            .filter(task => task.project_task_is_complete === 1)
                            .map((task, taskIndex) => (
                            <li key={taskIndex} className="task-item" onClick={() => openTaskDetails(task.project_task_id)}>
                                <span style={{ opacity: '50%' }}>{task.project_task_name}</span>
                                {activeTaskId === task.project_task_id && (
                                <div className="task-details-popup">
                                    <div className="task-details-container">
                                        <p onClick={closeTaskDetails} className="close-task-details">X</p>
                                        <h2>{task.project_task_name}</h2>
                                        <p><b>Description</b></p>
                                        <p>{task.project_task_description}</p>
                                        <p><b>Due Date:</b></p>
                                        <p>{task.project_task_due_date}</p>
                                        <div className="task-details-buttons">
                                            <p onClick={() => handleDeleteProjectTask(task.project_task_id, list.project_list_id)} className="complete-delete-button">&#128465; Delete task</p>
                                        </div>
                                    </div>
                                </div>
                                )}
                            </li>
                            ))}

                        </ul>
                    </div>
                    <p onClick={() => toggleAddProjectTask(list.project_list_id)} className="task-add-card">+ Add Card</p>
                    
                    {activeListId === list.project_list_id && (
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        addProjectTask(list.project_list_id);
                    }} className="task-form">
                        <div className="task-form-container">
                            <p onClick={handleCloseAddProjectTask} className="btn-close-form">X</p>
                            <h2>New Card</h2>

                            <label className="task-form-label">Card title:</label>
                            <textarea
                            className='input-task-name'
                            value={newTaskName}
                            onChange={(e) => {
                                setNewTaskName(e.target.value);
                                autoResizeTextarea(e);
                            }}
                            placeholder="Enter card name"
                            rows="1"
                            ></textarea>
                            
                            <label className="task-form-label">Card details:</label>
                            <textarea
                            className='input-task-name'
                            value={newTaskDescription}
                            onChange={(e) => {
                                setNewTaskDescription(e.target.value);
                                autoResizeTextarea(e);
                            }}
                            placeholder="Enter card details"
                            rows="1"
                            ></textarea>
                            
                            <label className="task-form-label">Card due date:</label>
                            <input
                                type="date"
                                value={newTaskDate}
                                onChange={(e) => setNewTaskDate(e.target.value)}
                                placeholder="Enter task due date"
                                className="input-task-date"
                            />
                            
                            <button type="submit" className="btn-submit-task">Add Task</button>

                            {errors.length > 0 && (
                            <div className="error-messages">
                                <p>{errors[0].msg}</p>
                            </div>
                            )}
                        </div>
                    </form>
                    )}
                </div>
            ))}
            
            <div className="new-list-container">
                <div className="project-list-name">
                    <h3>Add New List</h3>
                </div>
                
                <textarea
                className='input-new-list-name'
                value={newListName}
                onChange={(e) => {
                    setNewListName(e.target.value);
                    autoResizeTextarea(e);
                }}
                placeholder="Enter new project list name"
                rows="1"
                ></textarea><br/>
                <button onClick={addProjectList} className="btn-add-list">+ Add List</button>

                {errors.length > 0 && (
                <div className="error-messages">
                    <p>{errors[0].msg}</p>
                </div>
                )}
            </div>
        </div>
        ) : (
        <div className="new-list-container">
            <div className="project-list-name">
                <h3>Add New List</h3>
            </div>

            <textarea
            className='input-new-list-name'
            value={newListName}
            onChange={(e) => {
                setNewListName(e.target.value);
                autoResizeTextarea(e);
            }}
            placeholder="Enter new project list name"
            rows="1"
            ></textarea><br/>
            <button onClick={addProjectList} className="btn-add-list">+ Add List</button>

            {errors.length > 0 && (
                <div className="error-messages">
                    <p>{errors[0].msg}</p>
                </div>
            )}
        </div>
        )}
    </div>
    </>
  );
};

export default IndividualProject;

