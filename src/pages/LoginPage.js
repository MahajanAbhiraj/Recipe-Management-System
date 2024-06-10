import React, { useEffect, useState } from 'react';
import './LoginPage.css';
import userIcon from './usericon.jpg'; // Ensure this path is correct
import { BACKEND_URL } from '../constants';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        document.body.classList.add('login-body');

        return () => {
            document.body.classList.remove('login-body');
        };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BACKEND_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', username);
                onLogin(username); // Pass the username to the parent component
                window.location.href = '/home'; // Redirect to home page
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Login failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="loginpagecontainer">
            <div className="login1-box">
                <div className="logo-container">
                    <img src={userIcon} alt="User Icon" className="user-icon"/>
                </div>
                <h2>Member Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="textbox">
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="textbox">
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn">Login</button>
                    {error && <div className="error-message">{error}</div>}
                    <div className="forgot-password">
                        <a href="#">Forgot Password? Click Here</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
