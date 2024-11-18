import React, { useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CTabs,
  CTabContent,
  CTabPanel,
  CTabList,
  CTab,
} from '@coreui/react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JSONScript = () => {
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState({
    danger: [],
    warning: [],
    good: []
  });

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/json") {
      setFile(selectedFile);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please select a JSON file.',
      });
      setFile(null);
    }
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

        const response = await fetch('http://localhost:8000/json/upload-json-file', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',  // Explicitly accept JSON response
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'File upload failed');
        }

        const data = await response.json();
        setAnalysisResults(data.analysis || { danger: [], warning: [], good: [] });
        setIsAnalysisComplete(true);  // Set analysis as complete

        Swal.fire({
            icon: 'success',
            title: 'Upload Successful',
            text: 'Your file has been uploaded and processed successfully!',
            timer: 2000,
        });

        toast.success('JSON script scanning is complete!');
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
    doc.text('JSON Script Analysis Report', pageWidth / 2, 20, { align: 'center' });

    const createTableData = (title, items) => {
      if (items.length === 0) {
        return [[`${title} - No issues detected.`]];
      }
      return items.map((item, index) => [
        `${title} #${index + 1}`,
        item.check || 'N/A',
        item.result || 'N/A',
      ]);
    };

    const startY = 30;

    // Danger Table
    doc.autoTable({
      startY,
      head: [['Type', 'Check', 'Description']],
      body: createTableData('Danger', analysisResults.danger),
      theme: 'grid',
      headStyles: { fillColor: [220, 53, 69], textColor: 255 },
    });

    // Warning Table
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 10,
      head: [['Type', 'Check', 'Description']],
      body: createTableData('Warning', analysisResults.warning),
      theme: 'grid',
      headStyles: { fillColor: [255, 193, 7], textColor: 0 },
    });

    // Good Practices Table
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 10,
      head: [['Type', 'Check', 'Description']],
      body: createTableData('Good Practice', analysisResults.good),
      theme: 'grid',
      headStyles: { fillColor: [40, 167, 69], textColor: 255 },
    });

    doc.save('JSON_Script_Analysis_Report.pdf');
    toast.success('PDF export is complete!');
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <CCard className="p-0 mb-50">
        <CCardHeader>Upload JSON Script</CCardHeader>
        <CCardBody>
          <input type="file" accept=".json" onChange={handleFileChange} />
          <CButton color="primary" onClick={handleFileUpload}>
            Upload and Scan
          </CButton>
          <CButton color="secondary" onClick={exportToPDF} style={{margin:'10px'}}>
            Export to PDF
          </CButton>
        </CCardBody>
      </CCard>

      {analysisResults && (
        <>
          <CCard className="p-0">
            <CCardHeader>Scan Results</CCardHeader>
            <CTabs activeItemKey={activeTab} onActiveTabChange={setActiveTab}>
              <CTabList>
                <CTab itemKey={0}>Dangers</CTab>
                <CTab itemKey={1}>Warnings</CTab>
                <CTab itemKey={2}>Good Practices</CTab>
              </CTabList>

              <CTabContent style={{padding: '15px'}}>
                {/* Danger Section */}
                <CTabPanel itemKey={0}>
                  {analysisResults.danger.length > 0 ? (
                    <CAccordion flush>
                      {analysisResults.danger.map((item, index) => (
                        <CAccordionItem itemKey={index + 1} key={index}>
                          <CAccordionHeader>Danger #{index + 1}</CAccordionHeader>
                          <CAccordionBody>
                            <strong>{item.check}:</strong> {item.result}
                          </CAccordionBody>
                        </CAccordionItem>
                      ))}
                    </CAccordion>
                  ) : (
                    <p>No dangers detected.</p>
                  )}
                </CTabPanel>

                {/* Warnings Section */}
                <CTabPanel itemKey={1}>
                  {analysisResults.warning.length > 0 ? (
                    <CAccordion flush>
                      {analysisResults.warning.map((item, index) => (
                        <CAccordionItem itemKey={index + 1} key={index}>
                          <CAccordionHeader>Warning #{index + 1}</CAccordionHeader>
                          <CAccordionBody>
                            <strong>{item.check}:</strong> {item.result}
                          </CAccordionBody>
                        </CAccordionItem>
                      ))}
                    </CAccordion>
                  ) : (
                    <p>No warnings detected.</p>
                  )}
                </CTabPanel>

                {/* Good Practices Section */}
                <CTabPanel itemKey={2}>
                  {analysisResults.good.length > 0 ? (
                    <CAccordion flush>
                      {analysisResults.good.map((item, index) => (
                        <CAccordionItem itemKey={index + 1} key={index}>
                          <CAccordionHeader>Good Practice #{index + 1}</CAccordionHeader>
                          <CAccordionBody>
                            <strong>{item.check}:</strong> {item.result}
                          </CAccordionBody>
                        </CAccordionItem>
                      ))}
                    </CAccordion>
                  ) : (
                    <p>No good practices detected.</p>
                  )}
                </CTabPanel>
              </CTabContent>
            </CTabs>
          </CCard>

          {/* Educational Materials Section */}
          {isAnalysisComplete && (
            <CCard className="mt-4" style={{marginBottom: '30px'}}>
              <CCardBody>
                <h5>Educational Materials</h5>
                <h6>Learn how to mitigate these risks now before it's too late!</h6>
                <ul>
                  <li>
                    <a
                      href="http://localhost:3000/icons/coreui-icons#/buttons/buttons"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      About JSON
                    </a>
                  </li>
                  <li>
                    <a
                      href="/icons/coreui-icons#/buttons/button-groups"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Good Practices for Working with JSON
                    </a>
                  </li>
                  <li>
                    <a
                      href="/icons/coreui-icons#/buttons/dropdowns"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Common JSON Mistakes and How to Avoid Them
                    </a>
                  </li>
                </ul>
              </CCardBody>
            </CCard>
          )}
        </>
      )}
    </>
  );
};

export default JSONScript;
