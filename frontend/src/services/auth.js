const API_URL = 'http://localhost:8080/api/auth';

export const loginUser = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid email or password');
    }
    
    const user = await response.json();
    localStorage.setItem('user', JSON.stringify(user));
    return user;
};

export const registerUser = async (email, password, role) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'User already exists with this email');
    }
    
    const newUser = await response.json();
    localStorage.setItem('user', JSON.stringify(newUser));
    return newUser;
};

export const logoutUser = () => {
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};