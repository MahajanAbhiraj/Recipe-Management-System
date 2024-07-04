import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/LoginPage';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import Manager from './pages/Manager';
import Approvalpage from './pages/Approvals';
import FoodInventoryLog from './pages/FoodInventoryLog';
import FinishedGoods from './pages/FinishedGoods';
import Ingredients from './pages/Ingredients';
import Users from './pages/Users';
import { BACKEND_URL } from './constants';
import './App.css';

function App() {
    const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('username'));

    const handleLogin = (username) => {
        setLoggedInUser(username);
        localStorage.setItem('username', username);
    };

    const handleLogout = () => {
        setLoggedInUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/login'; // Redirect to login page
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Optionally, you can verify the token with a backend endpoint
        }
    }, []);

    return (
        <Router>
            <AppContent
                loggedInUser={loggedInUser}
                onLogin={handleLogin}
                onLogout={handleLogout}
            />
        </Router>
    );
}

function AppContent({ loggedInUser, onLogin, onLogout }) {
    // const [currentPage, setCurrentPage] = useState('home');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state

    const handlePageChange = (page) => {
        // setCurrentPage(page);
        // Navigate to the respective path based on the button clicked
        window.location.pathname = `/${page}`;
    };

    const location = useLocation();

    useEffect(() => {
        const fetchUserData = async () => {
            if (loggedInUser) {
                try {
                    const response = await fetch(`${BACKEND_URL}/users/${loggedInUser}`);
                    if (response.ok) {
                        const data = await response.json();
                        setUserData(data);
                        setLoading(false);
                    } else {
                        console.error('Failed to fetch user data');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };
    
        fetchUserData();
    }, [loggedInUser]);
    

    // Inside AppContent component
return (
    <div className="App">
        <Header/>
        {location.pathname !== '/login' && (
            <Navbar
                onPageChange={handlePageChange}
                loggedInUser={loggedInUser}
                onLogout={onLogout}
            />
        )}
        <div className="main-content">
            <Routes>
                <Route path="/login" element={<Login onLogin={onLogin} />} />
            </Routes>
            {loading ? (
                <div>Login to see...</div>
            ) : (
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/ingredients" element={<Ingredients userRole={userData.role}/>} />
                    <Route path="/manager" element={<Manager user={userData} />} />
                    <Route path="/recipes" element={<RecipeList />} />
                    <Route path="/recipes/:id" element={<RecipeDetail />} />
                    <Route path="/approvals" element={<Approvalpage />} />
                    <Route path="/foodinventorylog" element={<FoodInventoryLog />} />
                    <Route path="/finishedgoods" element={<FinishedGoods />} />

                    <Route path="/users" element={<Users />} />
                </Routes>
            )}
          </div>
    </div>
);

}

export default App;
