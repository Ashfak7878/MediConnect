import React from "react";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  // If there is a token in localStorage, redirect user to Home
  if (localStorage.getItem("token")) {
    return <Navigate to="/" />;
  } else {
    // If no token, allow them to see Login/Register
    return children;
  }
}