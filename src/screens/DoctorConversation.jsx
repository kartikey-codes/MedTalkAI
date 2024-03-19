import React, { useState, useEffect } from 'react';
import NavbarDashboard from '../components/NavbarDashboard';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import { FaFileAudio } from 'react-icons/fa'; // Import audio icon from react-icons library

export default function DoctorConversation() {
  const { hospital_id, patient_id } = useParams();
  const [hospitalName, setHospitalName] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

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

    fetchHospitalName();
  }, [hospital_id]);

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setLoading(true); // Set loading to true when submitting

    try {
      const formData = new FormData();
      formData.append('audio_file', audioFile);

      const response = await fetch(`http://127.0.0.1:8000/doctorconversation?patient_id=${patient_id}&hospital_id=${hospital_id}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const data = await response.json();
      setMessage(data.message);
      
      // Redirect to diagnose page on success
      if (response.ok) {
        window.location.href = `/diagnose/${hospital_id}/${patient_id}`;
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
      setMessage('Error uploading audio. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false after submitting
    }
  };

  return (
    <div>
      <NavbarDashboard hospitalName={hospitalName} />
      <div className="container mt-5">
        <h2 className="mb-4">Doctor's Conversation</h2>
        <div className="mb-3">
          <label htmlFor="audioFile" className="form-label">
            <FaFileAudio /> Upload Audio File:
          </label>
          <input
            className="form-control"
            type="file"
            id="audioFile"
            accept="audio/*"
            style={{ width: '300px' }} // Inline style to set width
            onChange={handleFileChange}
          />
        </div>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit
        </button>
        {loading && <p>Loading...</p>} {/* Render loader when loading */}
        {message && <p className="mt-3">{message}</p>}
      </div>
      <Footer />
    </div>
  );
}
