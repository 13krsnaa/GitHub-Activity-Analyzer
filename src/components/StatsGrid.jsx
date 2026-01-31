import React from 'react';

function StatsGrid({ userData, totalStars }) {
    return (
        <section className="stats-grid">
            <div className="stat-card">
                <span className="stat-label">Public Repos</span>
                <span id="repoCount" className="stat-value">{userData.public_repos}</span>
            </div>
            <div className="stat-card">
                <span className="stat-label">Total Stars</span>
                <span id="starCount" className="stat-value">{totalStars}</span>
            </div>
            <div className="stat-card">
                <span className="stat-label">Followers</span>
                <span id="followerCount" className="stat-value">{userData.followers}</span>
            </div>
        </section>
    );
}

export default StatsGrid;
