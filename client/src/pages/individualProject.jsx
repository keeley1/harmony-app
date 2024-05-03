import React, { useEffect, useState, useRef } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import "../appTwo.css";

const IndividualProject = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [projectLists, setProjectLists] = useState(null);
  const [projectTasks, setProjectTasks] = useState(null);
  const [newListName, setNewListName] = useState('');
  const listRef = useRef(null);
  const { userId, loading } = useAuth();

  const [showAddProjectTask, setShowAddProjectTask] = useState(false);
  const [activeListId, setActiveListId] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);

  const [newTaskName, setNewTaskName] = useState('');
const [newTaskDescription, setNewTaskDescription] = useState('');
const [newTaskDate, setNewTaskDate] = useState('');

  useEffect(() => {
    if (!loading && userId) {
        fetchProject();
        fetchProjectLists();
    }
}, [loading, userId, projectId]);
  

const fetchProject = async () => {
    try {
        console.log('user ' + userId);
        console.log('project ' + projectId)
        const response = await axios.get(`http://localhost:8000/getproject?userId=${userId}&projectId=${projectId}`);
        if (response.data.items) {
            console.log('fetch project');
            console.log(response.data.items);
            setProject(response.data.items);
        } else {
            console.error('Error retrieving items:', response.data.error);
        }
    } catch (error) {
        console.error('Error retrieving items:', error);
    }
};

  const fetchProjectLists = async () => {
    try {
        const response = await axios.get(`http://localhost:8000/getprojectlists?projectId=${projectId}`);
        if (response.data.items) {
            console.log('fetch project list');
            console.log(response.data.items);
            setProjectLists(response.data.items);

            response.data.items.forEach((list) => {
                fetchProjectTasks(list.project_list_id);
            });
        } else {
            console.error('Error retrieving items:', response.data.error);
        }
    } catch (error) {
        console.error('Error retrieving items:', error);
    }
};

const fetchProjectTasks = async (projectListId) => {
    try {
        const response = await axios.get(`http://localhost:8000/getprojecttasks?projectListId=${projectListId}`);
        if (response.data.items) {
            console.log('fetch project list tasks');
            console.log(response.data.items);
            
            // Update the state with fetched project tasks
            setProjectTasks(prevState => ({
                ...prevState,
                [projectListId]: response.data.items
            }));
        } else {
            console.error('Error retrieving items:', response.data.error);
        }
    } catch (error) {
        console.error('Error retrieving items:', error);
    }
};

  const addProjectList = async () => {
    if (!newListName.trim()) {
      alert('Please enter a name for the project list.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/addprojectlist', { project_list_name: newListName, project_id: projectId });
      if (response.status === 201) {
        fetchProject(); 
        fetchProjectLists();
        setNewListName('');
        alert('Project list added successfully.');
      }
    } catch (error) {
      console.error('Error adding project list:', error);
    }
  };

  const addProjectTask = async (projectListId) => {
    if (!newTaskName.trim()) {
      alert('Please enter a name for the task.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/addprojecttask', {
        projectTaskName: newTaskName,
        projectTaskDescription: newTaskDescription,
        projectTaskDate: newTaskDate,
        projectListId: projectListId
      });
      if (response.status === 201) {
        // Optionally, you can fetch the updated project lists after adding the task
        fetchProjectLists(projectListId); 
        setNewTaskName('');
        setNewTaskDescription('');
        setNewTaskDate('');
        alert('Task added successfully.');
        handleCloseAddProjectTask();
      }
    } catch (error) {
      console.error('Error adding task:', error);
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
    } catch (error) {
        console.error('Error deleting item:', error);
    }
};

const handleCompleteProjectTask = async (projectTaskId, projectListId) => {
    try {
        const response = await axios.post('http://localhost:8000/completeprojecttask', {
            projectTaskId,
            isComplete: 1,
        });
        if (response.status === 200) {
            fetchProjectLists(); 
            fetchProjectTasks(projectListId); 
            closeTaskDetails(); 
        }
    } catch (error) {
        console.error('Error completing goal:', error);
    }
};


const toggleAddProjectTask = (listId) => {
    if (activeListId === listId) {
        setActiveListId(null);  // Hide the form if it's already visible for this list
    } else {
        setActiveListId(listId); // Show the form for this list
    }
};

const handleCloseAddProjectTask = () => {
    setActiveListId(null); // Hide the form by setting the active list ID to null
};

const openTaskDetails = (taskId) => {
    setActiveTaskId(taskId);
};

const closeTaskDetails = (e) => {
    e.stopPropagation();
    setActiveTaskId(null);
}; 


const toggleTaskDetails = (taskId) => {
    setActiveTaskId(taskId === activeTaskId ? null : taskId);
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
        <div className="project-list-flex"> {/* Moved the project-list-flex class outside of the map function */}
            {projectLists.map((list, index) => (
                <div key={index} className="project-list-item">
                    <div className="project-list-name">
                        <h3>{list.project_list_name}</h3>
                    </div>
                    
                    <button onClick={() => toggleAddProjectTask(list.project_list_id)} className="btn-add-task">+</button>
                    
                    <ul className="task-list">
                    {projectTasks && projectTasks[list.project_list_id] && projectTasks[list.project_list_id].map((task, taskIndex) => (
                        <li key={taskIndex} className="task-item" onClick={() => openTaskDetails(task.project_task_id)}>
                            {task.project_task_name}
                            {activeTaskId === task.project_task_id && (
                            <div className="task-details-popup">
                                <div className="task-details-container">
                                    <p onClick={closeTaskDetails} className="close-task-details">X</p>
                                    <h2>{task.project_task_name}</h2>
                                    <p>{task.project_task_description}</p>
                                    <p>Due Date: {task.project_task_due_date}</p>
                                    <div className="task-details-buttons">
                                        <p onClick={() => handleDeleteProjectTask(task.project_task_id, list.project_list_id)}>&#128465; Delete task</p>
                                        <p onClick={() => alert('complete.')}>&#x2705; Mark as complete</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        </li>
                    ))}
                    </ul>
                    
                    {activeListId === list.project_list_id && (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            addProjectTask(list.project_list_id);
                        }} className="task-form">
                            <div className="task-form-container">
                            <p onClick={handleCloseAddProjectTask} className="btn-close-form">X</p>
                            
                            <h2>New Task</h2>

                            <label className="task-form-label">Task:</label>
                            <input
                                type="text"
                                value={newTaskName}
                                onChange={(e) => setNewTaskName(e.target.value)}
                                placeholder="Enter task name"
                                className="input-task-name"
                            />
                            
                            <label className="task-form-label">Task description:</label>
                            <input
                                type="text"
                                value={newTaskDescription}
                                onChange={(e) => setNewTaskDescription(e.target.value)}
                                placeholder="Enter task description"
                                className="input-task-description"
                            />
                            
                            <label className="task-form-label">Task due date:</label>
                            <input
                                type="date"
                                value={newTaskDate}
                                onChange={(e) => setNewTaskDate(e.target.value)}
                                placeholder="Enter task due date"
                                className="input-task-date"
                            />
                            
                            <button type="submit" className="btn-submit-task">Add Task</button>
                            </div>
                        </form>
                    )}
                </div>
            ))}
            <div className="new-list-container">
                <input
                type="text"
                className='input-new-list-name'
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Enter new project list name"
                /><br/>
                <button onClick={addProjectList} className="btn-add-list">+</button>
            </div>
        </div>
        ) : (
        <p>No project lists</p>
        )}
    </div>
</>

  );
};

export default IndividualProject;

