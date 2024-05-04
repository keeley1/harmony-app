import React from "react";

const autoResizeTextarea = (event) => {
    const textarea = event.target;
    textarea.style.height = 'auto'; // Reset height to recalculate
    textarea.style.height = textarea.scrollHeight + 'px'; // Set new height
} 

export default autoResizeTextarea;