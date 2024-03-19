import React, { useState } from 'react';
import NavbarDashboard from '../components/NavbarDashboard';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import { FaFileAudio } from 'react-icons/fa';

export default function AddNewPatient() {
  const { hospital_id } = useParams();
  const [hospitalName, setHospitalName] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setLoading(true); // Set loading to true when submitting
    try {
      const formData = new FormData();
      formData.append('audio_file', audioFile);

      const response = await fetch(`http://127.0.0.1:8000/newpatient?hospital_id=${hospital_id}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // Include JWT token in request headers
        }
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.message);
        setErrorMessage('');
      } else {
        setSuccessMessage('');
        setErrorMessage('Error adding new patient. Please try again later.');
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
      setSuccessMessage('');
      setErrorMessage('Error adding new patient. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false after response
    }
  };

  return (
    <div>
      <NavbarDashboard hospitalName={hospitalName} />
      <div className="container mt-5">
        <h2>Add New Patient</h2>
        <div className="mb-3">
          <label htmlFor="audioFile" className="form-label">
            <FaFileAudio /> Upload Audio File:
          </label>
          <input
            className="form-control"
            type="file"
            id="audioFile"
            accept="audio/*"
            onChange={handleFileChange}
          />
        </div>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        {successMessage && <p className="mt-3 text-success">{successMessage}</p>}
        {errorMessage && <p className="mt-3 text-danger">{errorMessage}</p>}
      </div>
      <Footer />
    </div>
  );
}
