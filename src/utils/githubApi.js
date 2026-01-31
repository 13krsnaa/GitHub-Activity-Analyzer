// GitHub API utility functions with timeout handling
const BASE_URL = "https://api.github.com/users";

/**
 * Fetch with timeout using AbortController
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @param {number} timeout - Request timeout in milliseconds
 * @returns {Promise<Response>} - Fetch response
 */
export async function fetchTimeout(url, options = {}, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * Fetch GitHub user data and repositories in parallel
 * @param {string} username - GitHub username
 * @returns {Promise<Object>} - User data and repositories
 */
export async function getGitHubData(username) {
  try {
    // Fetch user profile and repositories simultaneously for better performance
    const [userResp, reposResp] = await Promise.all([
      fetchTimeout(`${BASE_URL}/${username}`),
      fetchTimeout(`${BASE_URL}/${username}/repos?per_page=100`),
    ]);

    if (userResp.status === 404) throw new Error("User not found");
    if (!userResp.ok || !reposResp.ok) throw new Error("API request failed");

    const userData = await userResp.json();
    const repos = await reposResp.json();

    return { userData, repos };
  } catch (err) {
    if (err.name === "AbortError") throw new Error("Request timed out");
    throw err;
  }
}

/**
 * Process repository data to extract statistics
 * @param {Array} repos - Array of repository objects
 * @returns {Object} - Processed data including total stars, languages, and top repos
 */
export function processRepoData(repos) {
  let totalStars = 0;
  const languages = {};

  // Calculate total stars and language distribution
  repos.forEach((repo) => {
    totalStars += repo.stargazers_count;
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  });

  // Sort languages by usage count and get top 5
  const sortedLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Sort repositories by star count and get top 5
  const topRepos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5);

  return { totalStars, sortedLanguages, topRepos };
}
