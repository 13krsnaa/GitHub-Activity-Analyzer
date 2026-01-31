import React, { useState, useEffect } from 'react';

function SearchBar({ onSearch, isLoading }) {
    const [username, setUsername] = useState('');

    // Restore last searched username from localStorage on component mount
    useEffect(() => {
        const savedUser = localStorage.getItem("lastGithubUser");
        if (savedUser) {
            setUsername(savedUser);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim() && !isLoading) {
            onSearch(username.trim());
        }
    };

    return (
        <header>
            <h1>GitHub Activity Analyzer</h1>
            <p className="subtitle">Enter a username to dive into their public contributions</p>
            <form className="search-box" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter GitHub username..."
                    spellCheck={false}
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Analyzing...' : 'Analyze'}
                </button>
            </form>
        </header>
    );
}

export default SearchBar;
