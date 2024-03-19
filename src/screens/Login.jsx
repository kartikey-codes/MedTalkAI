import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import './css/owl.carousel.min.css'; // Import owl.carousel CSS file
import './css/bootstrap.min.css'; // Import Bootstrap CSS file
import './css/style.css'; // Import your custom style CSS file
import Navbar from '../components/Navbar';
import WebDeveloper from '../Assets/WebDeveloper.png';

export default function Login() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(credentials) // Encode credentials as form data
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.detail);
      }
  
      const { access_token, hospital_id } = await response.json();
      // Store the access token in localStorage or sessionStorage
      localStorage.setItem('accessToken', access_token);
      // Redirect to dashboard
      navigate(`/dashboard/${hospital_id}`); // Use the hospital_id from the response
    } catch (error) {
      alert(error.message || "Something went wrong. Please try again.");
    }
  };

  const onChange = (event) =>
    setCredentials({ ...credentials, [event.target.name]: event.target.value });

  return (
    <>
      <Navbar />
      <section className="vh-100 d-flex justify-content-center align-items-center banner_part">
        <div className="container">
          <div className="row justify-content-start">
            <div className="col-md-6">
              <img src={WebDeveloper} alt="Web Developer" className="login-image" />
            </div>
            <div className="col-md-6 contents">
              <div className="row justify-content-center ">
                <div className="col-md-8">
                  <div className="mb-4">
                    <h3>Log In</h3>
                    <p className="mb-4">Log in to Medtalk AI and Simplify Your Medical Record Management.</p>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group first">
                      <label htmlFor="username">Username</label>
                      <input type="text" className="form-control" id="username" name="username" value={credentials.username} onChange={onChange} />
                    </div>
                    <div className="form-group last mb-4">
                      <label htmlFor="password">Password</label>
                      <input type="password" className="form-control" id="password" name="password" value={credentials.password} onChange={onChange} />
                    </div>
                    <button type="submit" className="btn btn-block btn-primary">Log In</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
