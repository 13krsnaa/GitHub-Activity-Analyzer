import React from 'react';

function RepoList({ topRepos }) {
    if (topRepos.length === 0) {
        return <p className="text-dim">No repositories found</p>;
    }

    return (
        <>
            {topRepos.map((repo) => (
                <a
                    key={repo.id}
                    className="repo-item"
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span className="repo-name">{repo.name}</span>
                    <div className="repo-meta">
                        <span>⭐ {repo.stargazers_count}</span>
                        <span>🍴 {repo.forks_count}</span>
                        <span>{repo.language || "Plain Text"}</span>
                    </div>
                </a>
            ))}
        </>
    );
}

export default RepoList;
