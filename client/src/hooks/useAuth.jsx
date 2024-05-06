import { useState, useEffect } from 'react';
import Axios from 'axios';

const useAuth = () => {
    // initialise authentication status
    const [authStatus, setAuthStatus] = useState({ loading: true, loggedIn: false, userId: null });

    useEffect(() => {
        // call the auth server route
        Axios.get('http://localhost:8000/auth', { withCredentials: true })
        .then(response => {
            console.log(response.data.userId);
            // update the authentication status with response data
            setAuthStatus({ loading: false, loggedIn: response.data.loggedIn, userId: response.data.userId });
        })
        .catch(error => {
            console.error('Auth check failed', error);
            setAuthStatus({ loading: false, loggedIn: false, userId: null });
        });
    }, []);

    return authStatus;
};

export default useAuth;
