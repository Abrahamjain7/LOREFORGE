import API from './axios';

// Authentication
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const registerUser = (userData) => API.post('/auth/register', userData);

// Games
export const getGames = () => API.get('/games');
export const createGame = (gameData) => API.post('/games', gameData);

// Guides
export const getApprovedGuides = () => API.get('/guides');
export const submitGuide = (guideData) => API.post('/guides', guideData);
export const approveGuide = (guideId) => API.put(`/guides/${guideId}/approve`);
export const upvoteGuide = (id) => API.post(`/guides/${id}/upvote`);
export const downvoteGuide = (id) => API.post(`/guides/${id}/downvote`);