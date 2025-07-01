import React, { useEffect, useRef, useState } from "react";
import "./UploadModal.css";
import uploadImg from '../../assets/upload.png';
import axios from "axios";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const UploadModal = ({ onClose }) => {
   const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a CSV file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setVerifying(true);
      await axios.post(`${backendUrl}/api/leads/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });
      toast.success("CSV uploaded and leads assigned!", {
        position: "top-right"
      });

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.log(err);
      if (err.response?.data?.errors?.length > 0) {
        toast.error("Lead validation failed. Please check all lead information.");
      } else {
        toast.error("Upload failed. Please try again.");
      }
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <div className="modal-header">
          <h3>CSV Upload</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <p className="subtext">Add your documents here</p>

        <div
          className={`upload-box ${dragActive ? "drag-active" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="upload-area">
            {verifying ? (
              <div className="progress-section">
                <CircularProgressbar
                  value={uploadProgress}
                  text={`${uploadProgress}%`}
                  styles={buildStyles({
                    pathColor: "#0f2c2c",
                    textColor: "#0f2c2c",
                    trailColor: "#eee",
                    textSize: "20px"
                  })}
                />
                <p>Verifying...</p>
              </div>
            ) : file ? (
              <div className="file-info">
                <img src={uploadImg} alt="csv" width={30} />
                <p>{file.name}</p>
              </div>
            ) : (
              <>
                <img src={uploadImg} alt="upload" width={40} />
                <p>Drag your files to start uploading<br />or</p>
                <input
                  type="file"
                  accept=".csv"
                  id="upload-input"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="upload-input" className="browse-btn">Browse files</label>
                <p className="upload-instructions">
                  Please upload a `.csv` file in the following format: <br />
                  <strong>name, email, phone, receivedDate, status, type, language, location, assignedEmployee</strong>
                  <p style={{margin: '1px'}}>(assignedEmployee should be an employee id)</p>
                </p>

                <a href="/sample.csv" download className="sample-download-btn">
                  Download Sample CSV
                </a>
              </>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="next-btn" onClick={handleUpload} disabled={verifying || !file}>Upload</button>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default UploadModal;
