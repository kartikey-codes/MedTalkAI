import React from 'react';
import { Link, useParams } from 'react-router-dom'; // Importing useParams to access route parameters
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHospital, faSignOutAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // Import hospital, sign-out, and arrow-left icons from Font Awesome

export default function NavbarDashboard({ hospitalName }) {
  const { hospital_id } = useParams(); // Accessing hospital_id from route parameters

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
          {hospitalName ? hospitalName : 'Medtalk AI'}
        </Link>
        {/* Buttons */}
        <div className="d-flex">
          {/* Dashboard button */}
          <Link className="btn btn-success me-2" to={`/dashboard/${hospital_id}`}>
            <FontAwesomeIcon icon={faArrowLeft} style={iconStyle} /> Dashboard
          </Link>
          {/* Logout button */}
          <Link className="btn btn-danger" to="/login" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} style={iconStyle} /> Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}
