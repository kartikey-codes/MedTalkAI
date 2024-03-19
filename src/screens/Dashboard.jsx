import React, { useState, useEffect } from 'react';
import NavbarDashboard from '../components/NavbarDashboard';
import Footer from '../components/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch, FaNotesMedical } from 'react-icons/fa';

export default function Dashboard() {
  const { hospital_id } = useParams();
  const [hospitalName, setHospitalName] = useState('');
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken'); // Retrieve JWT token from localStorage

  useEffect(() => {
    const fetchHospitalNameAndPatients = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/fetch_hospital_name?hospital_id=${hospital_id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}` // Include JWT token in request headers
          }
        });

        if (!response.ok) {
          if (response.status === 403) {
            setErrorMessage('Invalid request. Please log in or check your credentials.');
          } else {
            setErrorMessage('Something went wrong. Please try again later.');
          }
          return;
        }

        const data = await response.json();
        setHospitalName(data.hospital_name);

        const patientsResponse = await fetch(`http://127.0.0.1:8000/patients/${hospital_id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}` // Include JWT token in request headers
          }
        });

        if (!patientsResponse.ok) {
          if (patientsResponse.status === 403) {
            setErrorMessage('Invalid request. Please log in or check your credentials.');
          } else {
            setErrorMessage('Something went wrong. Please try again later.');
          }
          return;
        }

        const patientsData = await patientsResponse.json();
        setPatients(patientsData.patients);
      } catch (error) {
        console.error('Error fetching hospital name and patients:', error);
        setErrorMessage('Something went wrong. Please try again later.');
      }
    };

    fetchHospitalNameAndPatients();
  }, [hospital_id, accessToken]); // Include accessToken in dependencies array

  const handlePatientClick = (patientId) => {
    navigate(`/diagnose/${hospital_id}/${patientId}`);
  };

  const handleAddNewPatient = () => {
    navigate(`/addnewpatient/${hospital_id}`);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name && patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <NavbarDashboard hospitalName={hospitalName} />
      <div className="container mt-5 ">
        {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
        {!errorMessage && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Patients List</h2>
              <div className="input-group w-50">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by patient name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleAddNewPatient}>
                  <FaSearch />
                </button>
              </div>
              <button className="btn btn-primary d-flex align-items-center" onClick={handleAddNewPatient}>
                <FaPlus className="me-2" /> Add New Patient
              </button>
            </div>
            <div>
              <p>Total Patients: {patients.length}</p>
            </div>
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Date of Admission</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient, index) => (
                  <tr 
                    key={index} 
                    onClick={() => handlePatientClick(patient.id)} 
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{index + 1}</td>
                    <td>{patient.name}</td>
                    <td>{patient.doa}</td>
                    <td>
                      <button className="btn btn-sm btn-primary me-2" onClick={(e) => {
                        e.stopPropagation();
                        handlePatientClick(patient.id);
                      }}>
                        <FaNotesMedical  /> Diagnose
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
