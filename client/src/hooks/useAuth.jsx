import { useState, useEffect } from "react";
import Axios from "axios";

const useAuth = () => {
    const [authStatus, setAuthStatus] = useState({ loading: true, loggedIn: false });

    useEffect(() => {
        Axios.get('http://localhost:8080/auth', { withCredentials: true })
        .then(response => {
            setAuthStatus({ loading: false, loggedIn: response.data.loggedIn });
        })
        .catch(error => {
            console.error('Auth check failed', error);
            setAuthStatus({ loading: false, loggedIn: false });
        });
    }, []);

    return authStatus;
};

export default useAuth;
