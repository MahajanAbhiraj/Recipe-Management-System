import React, { useEffect, useState } from 'react';
import './LoginPage.css';
import userIcon from './instabites.avif'; // Ensure this path is correct
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
        <div className="login-container">
            <div className="login-branding">
                <img src={userIcon} alt="User Icon" className="user-icon"/>
                <h1>Instabites</h1>
                <p>The point where management of kitchen is streamlines and packaged.</p>
            </div>
            <div className="login-form-container">
                <div className="login-box">
                    <h2>Log in</h2>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="username">Email</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                placeholder="joe@email.com"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter your Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">Login</button>
                        {error && <div className="alert alert-danger mt-3">{error}</div>}
                        <div className="forgot-password mt-3">
                            <a href="#">Forgot Password?</a>
                        </div>
                        <div className="mt-3">
                            Don't have an account? <a href="#">Register here</a>.
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
