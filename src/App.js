import React from 'react';
import './App.css';
import Home from './screens/Home';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import About from './screens/About';
import Contact from './screens/Contact';
// import '../node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css'
import '../node_modules/bootstrap-dark-5/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
import Login from './screens/Login.jsx';
import Dashboard from './screens/Dashboard.jsx';
import Addnewpatient from './screens/Addnewpatient.jsx';
import Diagnose from './screens/Diagnose.jsx';
import DoctorConversation from './screens/DoctorConversation.jsx';
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/dashboard/:hospital_id" element={<Dashboard />} />
          <Route exact path="/addnewpatient/:hospital_id" element={<Addnewpatient />} /> 
          <Route exact path="/diagnose/:hospital_id/:patient_id" element={<Diagnose />} /> 
          <Route exact path="/doctorconversation/:hospital_id/:patient_id" element={<DoctorConversation />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
