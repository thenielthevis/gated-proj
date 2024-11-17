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
  CCallout,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle, cilWarning, cilLoopCircular } from '@coreui/icons';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const MongoDBScanner = () => {
  const [mongoUri, setMongoUri] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [auditResults, setAuditResults] = useState({
    errors: [],
    warnings: [],
    good_practices: [],
  });

  const handleUriChange = (event) => {
    setMongoUri(event.target.value);
  };

  const handleUriUpload = async () => {
    if (!mongoUri) {
      Swal.fire({
        icon: 'error',
        title: 'Missing URI',
        text: 'Please enter a valid MongoDB URI before proceeding.',
      });
      return;
    }
  
    setAuditResults({
      errors: [],
      warnings: [],
      good_practices: [],
    });
  
    Swal.fire({
      title: 'Scanning MongoDB...',
      text: 'Please wait while we scan your MongoDB configuration.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/scan/mongodb', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mongodb_uri: mongoUri }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      // Log the API response to debug
      console.log('API Response:', data);
  
      if (data.findings) {
        const categorizedResults = {
          errors: data.findings.danger || [],
          warnings: data.findings.warning || [],
          good_practices: data.findings.good || [],
        };
  
        setAuditResults(categorizedResults);
  
        Swal.fire({
          icon: 'success',
          title: 'Scan Completed',
          text: 'Your MongoDB scan has been completed successfully!',
          timer: 2000,
        });
      } else {
        Swal.fire({
          icon: 'info',
          title: 'No Results',
          text: 'The scan completed, but no results were found.',
        });
      }
    } catch (error) {
      console.error('Error during scan:', error);
      Swal.fire({
        icon: 'error',
        title: 'Scan Failed',
        text: 'An error occurred during the scan.',
      });
    }
  };  

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(16);
    doc.text('MongoDB Analysis Report', pageWidth / 2, 20, { align: 'center' });

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
      body: createTableData('Danger', auditResults.errors),
      theme: 'grid',
      headStyles: { fillColor: [220, 53, 69], textColor: 255 },
    });

    // Warning Table
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 10,
      head: [['Type', 'Check', 'Description']],
      body: createTableData('Warning', auditResults.warnings),
      theme: 'grid',
      headStyles: { fillColor: [255, 193, 7], textColor: 0 },
    });

    // Good Practices Table
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 10,
      head: [['Type', 'Check', 'Description']],
      body: createTableData('Good Practice', auditResults.good_practices),
      theme: 'grid',
      headStyles: { fillColor: [40, 167, 69], textColor: 255 },
    });

    // Save PDF
    doc.save('MongoDB_Analysis_Report.pdf');
  };

  return (
    <>
      <CCallout color="primary">
        <h6 className="font-w-500">Notice!</h6>
        This MongoDB scanning procedure may take a few minutes. Please do not click the scan button multiple times. Ensure you provide a valid MongoDB URI.
      </CCallout>

      <CCard>
        <CCardHeader>Enter MongoDB URI</CCardHeader>
        <CCardBody>
          <input
            type="text"
            onChange={handleUriChange}
            value={mongoUri}
            placeholder="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>"
            className="form-control mb-3"
          />
          <CButton color="primary" onClick={handleUriUpload}>
            Scan
          </CButton>
          <CButton color="secondary" onClick={exportToPDF} style={{ marginLeft: '10px' }}>
          Export to PDF
        </CButton>
        </CCardBody>
      </CCard>

      <CCard className="p-0" style={{ marginBottom: '30px' }}>
        <CCardHeader>Scan Results</CCardHeader>
        <CTabs
          activeItemKey={activeTab}
          onActiveTabChange={setActiveTab}
          variant="underline-border"
        >
          <CTabList variant="underline-border">
            <CTab className="p-3" itemKey={0}>
              Danger
            </CTab>
            <CTab className="p-3" itemKey={1}>
              Warnings
            </CTab>
            <CTab className="p-3" itemKey={2}>
              Good
            </CTab>
          </CTabList>
          <CTabContent>
              <CTabPanel className="p-3" itemKey={0}>
                {auditResults.errors.length > 0 ? (
                  <CAccordion activeItemKey={1}>
                    {auditResults.errors.map((error, index) => (
                      <CAccordionItem itemKey={index + 1} key={index}>
                        <CAccordionHeader>
                          <CIcon icon={cilWarning} className="me-2" />
                          Danger #{index + 1}
                        </CAccordionHeader>
                        <CAccordionBody>
                          <strong>{error.check}:</strong> {error.result}
                        </CAccordionBody>
                      </CAccordionItem>
                    ))}
                  </CAccordion>
                ) : (
                  <p>No dangers detected.</p>
                )}
              </CTabPanel>

            <CTabPanel className="p-3" itemKey={1}>
              {auditResults.warnings.length > 0 ? (
                <CAccordion activeItemKey={1}>
                  {auditResults.warnings.map((warning, index) => (
                    <CAccordionItem itemKey={index + 1} key={index}>
                      <CAccordionHeader>
                        <CIcon icon={cilLoopCircular} className="me-2" />
                        Warning #{index + 1}
                      </CAccordionHeader>
                      <CAccordionBody>
                        <strong>{warning.check}:</strong> {warning.result}
                      </CAccordionBody>
                    </CAccordionItem>
                  ))}
                </CAccordion>
              ) : (
                <p>No warnings detected.</p>
              )}
            </CTabPanel>

            <CTabPanel className="p-3" itemKey={2}>
              {auditResults.good_practices.length > 0 ? (
                <CAccordion activeItemKey={1}>
                  {auditResults.good_practices.map((practice, index) => (
                    <CAccordionItem itemKey={index + 1} key={index}>
                      <CAccordionHeader>
                        <CIcon icon={cilCheckCircle} className="me-2" />
                        Good Practice #{index + 1}
                      </CAccordionHeader>
                      <CAccordionBody>
                        <strong>{practice.check}:</strong> {practice.result}
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
    </>
  );
};

export default MongoDBScanner;
