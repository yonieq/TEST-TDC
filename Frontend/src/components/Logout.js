// Logout.js

import React, { useEffect } from "react";
import axios from "axios";

const Logout = () => {
  useEffect(() => {
    const handleLogout = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/logout`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response && response.status === 200) {
          // Handle logout success, redirect to login, clear user data, etc.
          localStorage.removeItem("token");
          window.location.href = "/sign-in";
        } else {
          // Handle logout failure, show error message, etc.
          console.error("Logout failed");
        }
      } catch (error) {
        console.error("Error during logout:", error);
        // Handle error, show error message, etc.
      }
    };

    handleLogout();
  }, []); // Auto-logout on component mount

  return <div>Logging out...</div>;
};

export default Logout;
