import React from 'react';

function ProfileCard({ userData }) {
    return (
        <section className="profile-card">
            <div className="profile-header">
                <img
                    id="userAvatar"
                    src={userData.avatar_url}
                    alt={`${userData.login}'s avatar`}
                />
                <div className="profile-info">
                    <h2 id="userName">{userData.name || userData.login}</h2>
                    <p id="userLogin">@{userData.login}</p>
                    <a
                        id="profileLink"
                        href={userData.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="github-link"
                    >
                        View Profile
                    </a>
                </div>
            </div>
            <p id="userBio" className="bio">
                {userData.bio || "No bio available"}
            </p>
        </section>
    );
}

export default ProfileCard;
