import Axios from "axios";
import { useState, useEffect } from "react";

const useAuth = () => {
    const [authStatus, setAuthStatus] = useState({ loading: true, loggedIn: false });

    useEffect(() => {
        Axios.get('http://localhost:8080/auth', { withCredentials: true })
        .then(response => {
            if (response.data.loggedIn) {
                console.log('logged in');
                setAuthStatus({ loading: false, loggedIn: true });
            }
            else {
                console.log('not logged');
                setAuthStatus({loading: false, loggedIn: false });
            }
        })
        .catch(error => {
            console.error('Auth check failed', error);
            setAuthStatus({ loading: false, loggedIn: false });
        });
    }, []);
    return authStatus;
};

export default useAuth;