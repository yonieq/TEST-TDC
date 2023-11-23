import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Logout from "./components/Logout";
import UserList from "./components/UserList";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check token on initial mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const isTokenValid = checkTokenValidity(token);
    setIsLoggedIn(isTokenValid);
  }, []);

  const checkTokenValidity = (token) => {
    // Your token validation logic here
    // For example, check expiration date
    // Return true if valid, false if expired
    return token && !isTokenExpired(token);
  };

  const isTokenExpired = (token) => {
    // Your token expiration check logic here
    // Return true if expired, false if not expired
    // You may need a library or custom logic to handle this
    return false; // Placeholder, replace with actual logic
  };

  const handleLogout = () => {
    // Perform logout logic here
    // For example, clear authentication tokens, etc.
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container mb-12">
            <Link className="navbar-brand" to={"/users"}>
              React Apps
            </Link>
            {isLoggedIn ? (
              <Link
                className="navbar-brand"
                to={"/logout"}
                onClick={handleLogout}
              >
                Logout
              </Link>
            ) : null}
          </div>
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/users" />
              ) : (
                <Login setIsLoggedIn={setIsLoggedIn} />
              )
            }
          />
          <Route path="/users" element={<UserList />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
