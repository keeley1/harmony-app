import React, { useEffect, useState } from 'react';
import axios from 'axios';

// note that this page was created for testing purposes

const DisplayDate = () => {
    // initialise date information
    const [dateInfo, setDateInfo] = useState({
        dayOfWeek: '',
        date: '',
        time: ''
    });

    useEffect(() => {
        fetchDate();
    }, []);

    const fetchDate = () => {
        axios.get('http://localhost:8000/getdate')
        .then(response => {
            setDateInfo({
                dayOfWeek: response.data.dayOfWeek,
                date: response.data.date,
                time: response.data.time
            });
        })
        .catch(error => {
            console.error('There was an error fetching the date:', error);
        });
    };

    return (
        <>
        <div className="date-container">
            <p>{dateInfo.dayOfWeek}</p>
            <p>{dateInfo.date}</p>
        </div>
        </>
    );
};

export default DisplayDate;