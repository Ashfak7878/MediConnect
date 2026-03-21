import React from "react";
// 1. Import the image file and give it a variable name (like 'BrandLogo')
// The '../' means "go up one folder level", then into 'assets'
import BrandLogo from "../assets/1.jpg"; 

const MyGenericNavbar = () => {
  return (
    <nav style={{ padding: "10px", backgroundColor: "#333", color: "white" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        
        {/* 2. Pass that variable directly into the src attribute inside curly braces */}
        <img 
          src={BrandLogo} 
          alt="Company Logo" 
          style={{ 
            height: "50px",       /* Lock the height so it fits the navbar */
            width: "auto",        /* Let the width adjust to keep the aspect ratio */
            borderRadius: "8px",  /* Optional: curve the corners slightly */
            marginRight: "15px"   /* Add space between the logo and the text */
          }} 
        />
        
        <h2 style={{ margin: 0 }}>My Application</h2>
      </div>
    </nav>
  );
};
console.log("My image path is:", BrandLogo);


export default MyGenericNavbar;