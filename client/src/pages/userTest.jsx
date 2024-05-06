import React from 'react';

const UserTest = () => {
    return (
        <>
        <div className="usertest-container">
            <h2>User Testing</h2>
            <p>Thank you for taking part in the user test for Harmony!</p>
            <p>This study will be used to assess the effectiveness of the application in placing priority 
                on wellbeing and productivity. This is a not a complete version of the application and 
                has not been fully tested for robustness, there may be some bugs present. Usually these 
                issues can be resolved by refreshing the page or navigating back to  
                <a href="https://www.doc.gold.ac.uk/usr/201/" className="usertest-link"><b> this page</b></a>. Please 
                also note that the application has not yet been tested on all types of devices so some 
                elements may appear odd or different looking depending on device or browser type.
            </p>
            <p>The application will automatically log out after two hours of inactivity.</p>

            <p>Please read <a href="https://drive.google.com/file/d/15mgSbgaENx3sqnvZrMsdR_tWCVEi3IV-/view?usp=sharing" target="_blank" className="usertest-link"><b>the following information</b></a> about this study.</p>

            <h3>Surveys</h3>
            <p>The application should be tested across three days (24th - 26th of April). The surveys for 
                each day describe how the application should be tested. The testing process can take as little
                or as long as you would like, even if you only have 5 minutes to test. The main goal is to test
                the wellbeing features, so I would ask that you focus on testing the daily gratitude, affirmations,
                and mood check-in if you do not have time to test all features.
            </p>
            <ul>
                <li><a href="https://forms.gle/zKjSgQCwK7NgdTzY7" target="_blank"><b>Day one survey</b></a></li>
                <li><a href="https://forms.gle/rAZrxMryrbwfuy4k8" target="_blank"><b>Day two survey</b></a></li>
                <li><a href="https://forms.gle/zaCxriqPgunNdMVn7" target="_blank"><b>Day three survey</b></a></li>
            </ul>
            <p>If the application server appears to have gone down, please email <b>keeleygardner@icloud.com</b> so 
            that I can check everything is running.
            </p>

            <h3>User Testing Process</h3>
            <p>This process is also clearly stated on each survey.</p>
            <ul>
                <li>Register for the application - you do not need to use a real name and email for 
                    this (I suggest using email@email.com). The password must be at least 8 characters, 
                    and include a number, uppercase character, and special character (I suggest using 
                    something like Password01!)
                </li>
                <li>Log in to the application</li>
                <li>Test the application features - this can be done all at once or throughout the day. 
                    All of the application features are located on the home dashboard. The most important 
                    features to test are daily gratitude, daily affirmations, and daily check-in
                </li>
                <li>Log out of the application (Note that you may need to refresh the page for the log out 
                    button to appear)
                </li>
                <li>Complete the survey questions about the application for each day</li>
            </ul>

            <p>Again, thank you so much for taking part in the user testing for Harmony!!</p>
        </div>
        </>
    );
};

export default UserTest;