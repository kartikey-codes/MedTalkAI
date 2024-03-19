import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHospital, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Import hospital and sign-out icons from Font Awesome

export default function NavbarDashboard({ hospitalName }) {
  const navbarStyle = {
    // backgroundColor: 'white',
  };

  const navbarBrandStyle = {
    fontSize: '1.5rem', // Adjust the font size
    fontWeight: 'bold', // Make the font bold
    marginLeft: '15px', // Add some left margin
  };

  const iconStyle = {
    marginRight: '5px', // Add right margin to the icon
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Clear JWT token from local storage
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={navbarStyle}>
      <div className="container">
        <Link className="navbar-brand" to="/" style={navbarBrandStyle}>
          <FontAwesomeIcon icon={faHospital} style={iconStyle} /> {/* Add hospital icon */}
          {hospitalName ? hospitalName : 'MedTalk AI'}
        </Link>
        {/* Logout button */}
        <Link className="btn btn-danger ms-auto" to="/login" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} style={iconStyle} /> Logout
        </Link>
      </div>
    </nav>
  );
}
