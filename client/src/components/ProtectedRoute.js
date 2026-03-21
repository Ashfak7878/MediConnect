import React, { useEffect, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom"; // Added useNavigate
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook for programmatic navigation
  const { user } = useSelector((state) => state.user);

  const getUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Safety check: Don't call backend if there's no token
      if (!token) return;

      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/getUserData",
        { token },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(hideLoading());
      
      if (res.data.success) {
        dispatch(setUser(res.data.data));
      } else {
        // If backend says token is invalid
        localStorage.clear();
        navigate("/login"); 
      }
    } catch (error) {
      dispatch(hideLoading());
      localStorage.clear();
      navigate("/login");
      console.log("Auth Error:", error);
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (!user && localStorage.getItem("token")) {
      getUser();
    }
  }, [user, getUser]);

  // Final check for rendering
  if (localStorage.getItem("token")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}