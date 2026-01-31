import React from 'react';

function ErrorState({ message }) {
    return (
        <div className="error-container">
            <div className="error-icon"> ERROR !!!!</div>
            <p id="errorMessage">{message}</p>
        </div>
    );
}

export default ErrorState;
