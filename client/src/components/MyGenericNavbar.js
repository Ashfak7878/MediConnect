import React from "react";import BrandLogo from "../assets/1.jpg"; 

const MyGenericNavbar = () => {
  return (
    <nav style={{ padding: "10px", backgroundColor: "#333", color: "white" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        
        {}
        <img 
          src={BrandLogo} 
          alt="Company Logo" 
          style={{ 
            height: "50px",       
            width: "auto",        
            borderRadius: "8px",  
            marginRight: "15px"   
          }} 
        />
        
        <h2 style={{ margin: 0 }}>My Application</h2>
      </div>
    </nav>
  );
};
console.log("My image path is:", BrandLogo);


export default MyGenericNavbar;