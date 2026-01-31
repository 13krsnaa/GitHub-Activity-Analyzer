import React from 'react';

function Loader() {
    return (
        <div className="loader-container">
            <div className="loader"></div>
            <p>Fetching data from GitHub...</p>
        </div>
    );
}

export default Loader;
