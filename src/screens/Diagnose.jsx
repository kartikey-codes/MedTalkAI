import React, { useState, useEffect } from 'react';
import NavbarDoc from '../components/NavbarDoc';
import Footer from '../components/Footer';
import { useParams, useNavigate } from 'react-router-dom';

export default function Diagnose() {
  const { hospital_id, patient_id } = useParams();
  const [hospitalName, setHospitalName] = useState('');
  const [patient, setPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchHospitalName = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/fetch_hospital_name?hospital_id=${hospital_id}`);
        const data = await response.json();
        setHospitalName(data.hospital_name);
      } catch (error) {
        console.error('Error fetching hospital name:', error);
      }
    };

    const fetchPatientAndDoctors = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/patients_and_doctors/${hospital_id}/${patient_id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        if (response.status === 403) {
          setErrorMessage('You do not have permission to access this resource.');
          return;
        }
        const data = await response.json();
        if (data && data.patient) {
          setPatient(data.patient);
        }
        if (data && data.doctors) {
          setDoctors(data.doctors);
        }
      } catch (error) {
        console.error('Error fetching patient and doctors:', error);
        setErrorMessage('Error fetching patient and doctors. Please try again later.');
      }
    };

    fetchHospitalName();
    fetchPatientAndDoctors();
  }, [hospital_id, patient_id, accessToken]);

  const handleDiagnosePatient = () => {
    navigate(`/doctorconversation/${hospital_id}/${patient_id}`);
  };

  const handleGeneratePDF = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/generate_pdf/${hospital_id}/${patient_id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `patient_${patient_id}_report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setErrorMessage('Error generating PDF. Please try again later.');
    }
  };

  return (
    <div>
      <NavbarDoc hospitalName={hospitalName} />
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Patient Details</h2>
          <div>
            <button className="btn btn-primary me-2" onClick={handleDiagnosePatient}>Diagnose Patient</button>
            <button className="btn btn-primary" onClick={handleGeneratePDF}>Generate PDF</button>
          </div>
        </div>

        {errorMessage && (
          <div className="alert alert-warning" role="alert">
            {errorMessage}
          </div>
        )}

        {patient && (
          <div className="mb-5">
            <table className="table">
              <tbody>
                <tr>
                  <td>
                    <strong>Name:</strong>
                  </td>
                  <td>{patient.name}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Age:</strong>
                  </td>
                  <td>{patient.age}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Weight:</strong>
                  </td>
                  <td>{patient.weight}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Contact No:</strong>
                  </td>
                  <td>{patient.contact_no || 'Not available'}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Address:</strong>
                  </td>
                  <td>{patient.address || 'Not available'}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Date of Admission:</strong>
                  </td>
                  <td>{patient.doa}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {doctors && doctors.length > 0 && (
          <div>
            <h2>Doctor's Diagnosis</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Symptoms</th>
                  <th>Disease</th>
                  <th>Medicine</th>
                  <th>Diagnosis</th>
                  <th>Medicine Time</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor, index) => (
                  <tr key={index}>
                    <td>{doctor.symptoms}</td>
                    <td>{doctor.disease}</td>
                    <td>{doctor.medicine}</td>
                    <td>{doctor.diagnosis}</td>
                    <td>{doctor.med_time}</td>
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
