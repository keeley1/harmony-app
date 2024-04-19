import { useState, useEffect } from "react";
import Axios from "axios";

const useAuth = () => {
    const [authStatus, setAuthStatus] = useState({ loading: true, loggedIn: false, userId: null });

    useEffect(() => {
        Axios.get('https://www.doc.gold.ac.uk/usr/201/auth', { withCredentials: true })
        .then(response => {
            console.log(response.data.userId);
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
