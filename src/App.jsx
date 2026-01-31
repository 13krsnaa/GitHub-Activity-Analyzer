import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import Loader from './components/Loader';
import ErrorState from './components/ErrorState';
import ProfileCard from './components/ProfileCard';
import StatsGrid from './components/StatsGrid';
import LanguageList from './components/LanguageList';
import RepoList from './components/RepoList';
import { getGitHubData, processRepoData } from './utils/githubApi';
import './style.css';

function App() {
    // Application state management
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [processedData, setProcessedData] = useState(null);

    // Handle user search functionality
    const handleSearch = async (username) => {
        setLoading(true);
        setError(null);

        // Save username to localStorage for persistence
        localStorage.setItem("lastGithubUser", username);

        try {
            // Fetch user data and repositories
            const data = await getGitHubData(username);

            // Process repository data for statistics
            const processed = processRepoData(data.repos);

            // Update component state
            setUserData(data.userData);
            setProcessedData(processed);
        } catch (err) {
            setError(err.message);
            setUserData(null);
            setProcessedData(null);
        } finally {
            setLoading(false);
        }
    };

    // Auto-search for saved user on component mount
    useEffect(() => {
        const savedUser = localStorage.getItem("lastGithubUser");
        if (savedUser) {
            handleSearch(savedUser);
        }
    }, []); // Empty dependency array ensures this runs only once

    // Calculate total repos with languages for percentage calculations
    const totalReposWithLang = processedData
        ? processedData.sortedLanguages.reduce((sum, [, count]) => sum + count, 0)
        : 0;

    return (
        <div className="container">
            <SearchBar onSearch={handleSearch} isLoading={loading} />

            <main id="appContent">
                {/* Loading state */}
                {loading && <Loader />}

                {/* Error state */}
                {error && <ErrorState message={error} />}

                {/* Success state - Dashboard */}
                {!loading && !error && userData && processedData && (
                    <div className="dashboard">
                        <ProfileCard userData={userData} />
                        <StatsGrid userData={userData} totalStars={processedData.totalStars} />

                        <div className="details-grid">
                            <section className="card language-section">
                                <h3>Top Languages</h3>
                                <div id="languageList" className="language-list">
                                    <LanguageList
                                        sortedLanguages={processedData.sortedLanguages}
                                        totalReposWithLang={totalReposWithLang}
                                    />
                                </div>
                            </section>

                            <section className="card repo-section">
                                <h3>Top 5 Repositories</h3>
                                <div id="repoList" className="repo-list">
                                    <RepoList topRepos={processedData.topRepos} />
                                </div>
                            </section>
                        </div>
                    </div>
                )}

                {/* Empty state - no search performed yet */}
                {!loading && !error && !userData && (
                    <div className="empty-state">
                        <div className="empty-icon"></div>
                        <p>Search for a user to see their activity analytics</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
