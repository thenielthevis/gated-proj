import React, { useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CAlert,
} from '@coreui/react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SQLScript = () => {
  const [file, setFile] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      Swal.fire({
        icon: 'error',
        title: 'No File Selected',
        text: 'Please select a file first.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');

    try {
      Swal.fire({
        title: 'Uploading File...',
        text: 'Please wait while your file is being uploaded.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await fetch('http://localhost:8000/sql/upload-sql-file', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'File upload failed');
      }

      const data = await response.json();
      setAnalysisResults(data.analysis);

      Swal.fire({
        icon: 'success',
        title: 'Upload Successful',
        text: 'Your file has been uploaded and processed successfully!',
        timer: 2000,
      });

      toast.success('SQL script scanning is complete!');
    } catch (error) {
      console.error('Error uploading file:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error Uploading File',
        text: error.message || 'Failed to upload file. Please try again.',
      });
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(16);
    doc.text('SQL Script Analysis Report', pageWidth / 2, 20, { align: 'center' });

    const createTableData = (title, items) => {
      if (items.length === 0) {
        return [[`${title} - No issues detected.`]];
      }
      return items.map((item, index) => [`${title} #${index + 1}`, item]);
    };

    const dangersTableData = createTableData('Danger', analysisResults?.danger || []);
    const warningsTableData = createTableData('Warning', analysisResults?.warning || []);
    const goodPracticesTableData = createTableData('Good Practice', analysisResults?.good || []);

    const startY = 30;

    doc.autoTable({
      startY,
      head: [['Type', 'Description']],
      body: dangersTableData,
      theme: 'grid',
      headStyles: { fillColor: [220, 53, 69], textColor: 255 },
      columnStyles: { 1: { cellWidth: 'auto' } },
    });

    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 10,
      head: [['Type', 'Description']],
      body: warningsTableData,
      theme: 'grid',
      headStyles: { fillColor: [255, 193, 7], textColor: 0 },
      columnStyles: { 1: { cellWidth: 'auto' } },
    });

    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 10,
      head: [['Type', 'Description']],
      body: goodPracticesTableData,
      theme: 'grid',
      headStyles: { fillColor: [40, 167, 69], textColor: 255 },
      columnStyles: { 1: { cellWidth: 'auto' } },
    });

    doc.save('SQL_Script_Analysis_Report.pdf');
    toast.success('PDF export is complete!');
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <CCard className="p-0 mb-50">
        <CCardHeader>Upload SQL Script</CCardHeader>
        <CCardBody>
          <input type="file" accept=".txt" onChange={handleFileChange} />
          <CButton color="primary" onClick={handleFileUpload}>
            Upload and Scan
          </CButton>
        </CCardBody>
      </CCard>

      {analysisResults && (
        <div>
          <h3>Analysis Results</h3>

          {/* Dangers Section */}
          {analysisResults.danger && analysisResults.danger.length > 0 && (
            <CCard className="p-0 mb-3">
              <CCardHeader>Danger</CCardHeader>
              <CCardBody>
                {analysisResults.danger.map((item, index) => (
                  <CAlert color="danger" key={index}>
                    {typeof item === 'string' ? item : JSON.stringify(item)}
                  </CAlert>
                ))}
              </CCardBody>
            </CCard>
          )}

          {/* Warnings Section */}
          {analysisResults.warning && analysisResults.warning.length > 0 && (
            <CCard className="p-0 mb-3">
              <CCardHeader>Warnings</CCardHeader>
              <CCardBody>
                {analysisResults.warning.map((item, index) => (
                  <CAlert color="warning" key={index}>
                    {typeof item === 'string' ? item : JSON.stringify(item)}
                  </CAlert>
                ))}
              </CCardBody>
            </CCard>
          )}

          {/* Good Practices Section */}
          {analysisResults.good && analysisResults.good.length > 0 && (
            <CCard className="p-0 mb-3">
              <CCardHeader>Good Practices</CCardHeader>
              <CCardBody>
                {analysisResults.good.map((item, index) => (
                  <CAlert color="success" key={index}>
                    {typeof item === 'string' ? item : JSON.stringify(item)}
                  </CAlert>
                ))}
              </CCardBody>
            </CCard>
          )}
        </div>
      )}

      {analysisResults && (
        <CCard className="mt-4" style={{ marginBottom: '30px' }}>
          <CCardBody>
            <h5>Educational Materials</h5>
            <h6>Learn how to mitigate these risks now before it's too late!</h6>
            <ul>
              {analysisResults.danger && analysisResults.danger.length > 0 && (
                <li>
                  <a
                    href="/icons/coreui-icons#/base/accordion"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    What is SQL?
                  </a>
                </li>
              )}
              {analysisResults.warning && analysisResults.warning.length > 0 && (
                <li>
                  <a
                    href="/icons/coreui-icons#/base/breadcrumbs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    SQL Best Practices
                  </a>
                </li>
              )}
              {analysisResults.good && analysisResults.good.length > 0 && (
                <li>
                  <a
                    href="/icons/coreui-icons#/base/cards"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Avoid these 7 SQL Mistakes for Better Database Management
                  </a>
                </li>
              )}
            </ul>
          </CCardBody>
        </CCard>
      )}
    </>
  );
};

export default SQLScript;
