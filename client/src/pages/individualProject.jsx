import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from 'axios';

const IndividualProject = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [projectLists, setProjectLists] = useState(null);
  const [newListName, setNewListName] = useState('');
  const listRef = useRef(null);
  const { userId, loading } = useAuth();

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

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <div className="board-container">
        <h2>{project[0].project_name}</h2>
        <p>{project[0].project_description}</p>

        {console.log(projectLists)}

        {projectLists && projectLists.length > 0 ? (
        <div>
            <p>project list</p>
            <ul ref={listRef}>
                {projectLists.map((list, index) => (
                <li key={index}>
                    {list.project_list_name}
                </li>
                ))}
            </ul>
        </div>
        ) : (
        <div>
            <p>no project list</p>
        </div>
        )}
        
        <input
        type="text"
        value={newListName}
        onChange={(e) => setNewListName(e.target.value)}
        placeholder="Enter new project list name"
        />
        <button onClick={addProjectList}>Add Project List</button>
        
    </div>
    </>
  );
};

export default IndividualProject;

