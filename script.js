/**
 * Mini GitHub Activity Analyzer
 * Core logic for fetching, processing, and rendering GitHub user data.
 */

// --- Constants & Config ---
const BASE_URL = 'https://api.github.com/users';

// --- DOM Elements ---
const usernameInput = document.getElementById('usernameInput');
const searchBtn = document.getElementById('searchBtn');
const appContent = document.getElementById('appContent');
const loader = document.getElementById('loader');
const errorState = document.getElementById('errorState');
const errorMessage = document.getElementById('errorMessage');
const dashboard = document.getElementById('dashboard');
const emptyState = document.getElementById('emptyState');

// --- State Management ---
const state = {
    loading: false,
    error: null,
    userData: null,
    repos: []
};

// --- API Service ---
async function fetchWithTimeout(url, options = {}, timeout = 8000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

async function getGitHubData(username) {
    try {
        const [userResp, reposResp] = await Promise.all([
            fetchWithTimeout(`${BASE_URL}/${username}`),
            fetchWithTimeout(`${BASE_URL}/${username}/repos?per_page=100`)
        ]);

        if (userResp.status === 404) throw new Error('User not found');
        if (!userResp.ok || !reposResp.ok) throw new Error('API request failed');

        const userData = await userResp.json();
        const repos = await reposResp.json();

        return { userData, repos };
    } catch (err) {
        if (err.name === 'AbortError') throw new Error('Request timed out');
        throw err;
    }
}

// --- Data Processing ---
function processRepoData(repos) {
    let totalStars = 0;
    const languages = {};

    repos.forEach(repo => {
        totalStars += repo.stargazers_count;
        if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
    });

    // Sort languages by count
    const sortedLanguages = Object.entries(languages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    // Sort repos by star count
    const topRepos = [...repos]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5);

    return { totalStars, sortedLanguages, topRepos };
}

// --- UI Rendering ---
function showLoader() {
    loader.classList.remove('hidden');
    errorState.classList.add('hidden');
    dashboard.classList.add('hidden');
    emptyState.classList.add('hidden');
}

function showError(msg) {
    loader.classList.add('hidden');
    errorState.classList.remove('hidden');
    dashboard.classList.add('hidden');
    emptyState.classList.add('hidden');
    errorMessage.textContent = msg;
}

function showDashboard() {
    loader.classList.add('hidden');
    errorState.classList.add('hidden');
    dashboard.classList.remove('hidden');
    emptyState.classList.add('hidden');
}

function renderUI(data, processed) {
    const { userData } = data;
    const { totalStars, sortedLanguages, topRepos } = processed;

    // Profile Card
    document.getElementById('userAvatar').src = userData.avatar_url;
    document.getElementById('userName').textContent = userData.name || userData.login;
    document.getElementById('userLogin').textContent = `@${userData.login}`;
    document.getElementById('profileLink').href = userData.html_url;
    document.getElementById('userBio').textContent = userData.bio || 'No bio available';

    // Stats
    document.getElementById('repoCount').textContent = userData.public_repos;
    document.getElementById('starCount').textContent = totalStars;
    document.getElementById('followerCount').textContent = userData.followers;

    // Languages
    const langContainer = document.getElementById('languageList');
    langContainer.innerHTML = '';
    
    if (sortedLanguages.length === 0) {
        langContainer.innerHTML = '<p class="text-dim">No language data available</p>';
    } else {
        const totalReposWithLang = Object.values(processed.sortedLanguages).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0); // Corrected calculation
        // Finding real total from all repos that have a language
        const totalWithAnyLang = data.repos.filter(r => r.language).length;

        sortedLanguages.forEach(([lang, count]) => {
            const percentage = ((count / totalWithAnyLang) * 100).toFixed(1);
            const div = document.createElement('div');
            div.className = 'language-item';
            div.innerHTML = `
                <span class="lang-name">${lang}</span>
                <span class="lang-percentage">${count} repos (${percentage}%)</span>
            `;
            langContainer.appendChild(div);
        });
    }

    // Repos
    const repoContainer = document.getElementById('repoList');
    repoContainer.innerHTML = '';
    
    if (topRepos.length === 0) {
        repoContainer.innerHTML = '<p class="text-dim">No repositories found</p>';
    } else {
        topRepos.forEach(repo => {
            const a = document.createElement('a');
            a.className = 'repo-item';
            a.href = repo.html_url;
            a.target = '_blank';
            a.innerHTML = `
                <span class="repo-name">${repo.name}</span>
                <div class="repo-meta">
                    <span>⭐ ${repo.stargazers_count}</span>
                    <span>🍴 ${repo.forks_count}</span>
                    <span>${repo.language || 'Plain Text'}</span>
                </div>
            `;
            repoContainer.appendChild(a);
        });
    }

    showDashboard();
}

// --- Main Action ---
async function handleSearch() {
    const username = usernameInput.value.trim();
    if (!username) return;

    showLoader();
    localStorage.setItem('lastGithubUser', username);

    try {
        const data = await getGitHubData(username);
        const processed = processRepoData(data.repos);
        renderUI(data, processed);
    } catch (err) {
        showError(err.message);
    }
}

// --- Event Listeners ---
searchBtn.addEventListener('click', handleSearch);
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// --- Initialize ---
window.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('lastGithubUser');
    if (savedUser) {
        usernameInput.value = savedUser;
        handleSearch();
    }
});
