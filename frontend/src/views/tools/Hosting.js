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

const Buttons = () => {
  const [domain, setDomain] = useState(''); // Store the Firebase Hosting domain
  const [activeTab, setActiveTab] = useState(0);
  const [auditResults, setAuditResults] = useState({
    errors: [],
    warnings: [],
    good_practices: [],
  });

// Handle domain input change
const handleDomainInput = (event) => {
  setDomain(event.target.value);
};

const handleScanHosting = async () => {
  if (!domain) {
    Swal.fire({
      icon: 'error',
      title: 'Missing Domain',
      text: 'Please enter the Firebase Hosting domain before proceeding.',
    });
    return;
  }

  // Reset audit results
  setAuditResults({
    errors: [],
    warnings: [],
    good_practices: [],
  });

  // Show loading spinner using SweetAlert2
  Swal.fire({
    title: 'Scanning Application...',
    text: 'Please wait while we scan your Firebase Hosting configuration.',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/firebase/hosting-scan', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ domain }),
    });

    const data = await response.json();
    console.log('Backend response:', data);

    // Handle specific backend error response
    if (data.detail && data.detail.startsWith('Error:')) {
      Swal.fire({
        icon: 'error',
        title: 'Scan Failed',
        text: data.detail, // Show backend-provided error message
      });
      return;
    }

    // Validate and parse the findings
    if (data.status === 'Scanning completed' && data.findings && typeof data.findings === 'object') {
      const { danger = [], warning = [], good = [] } = data.findings;

      // Update the state with categorized results
      setAuditResults({
        errors: danger,
        warnings: warning,
        good_practices: good,
      });

      Swal.fire({
        icon: 'success',
        title: 'Scan Completed',
        text: 'Your Firebase Hosting scan has been completed successfully!',
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      console.error('Invalid or empty findings:', data.findings);
      Swal.fire({
        icon: 'warning',
        title: 'No Results',
        text: 'The scan completed, but no results were found.',
      });
    }
  } catch (error) {
    console.error('Error scanning hosting:', error);

    // Show error alert
    Swal.fire({
      icon: 'error',
      title: 'Scan Failed',
      text: 'An error occurred while scanning the hosting domain. Please try again later.',
    });
  }
};

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
  
    // Title
    doc.setFontSize(16);
    doc.text('Firebase Hosting Analysis Report', pageWidth / 2, 20, { align: 'center' });
  
    // Function to create table data format for each section
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
  
    // Data for Danger Table
    const dangersTableData = createTableData('Danger', auditResults.errors);
    // Data for Warnings Table
    const warningsTableData = createTableData('Warning', auditResults.warnings);
    // Data for Good Practices Table
    const goodPracticesTableData = createTableData('Good Practice', auditResults.good_practices);
  
    // Add tables to PDF
    const startY = 30; // Initial Y position for the first table
  
    // Add Danger table
    doc.autoTable({
      startY,
      head: [['Type', 'Check', 'Description']],
      body: dangersTableData,
      theme: 'grid',
      headStyles: { fillColor: [220, 53, 69], textColor: 255 }, // Red for Danger
      columnStyles: { 1: { cellWidth: 'auto' }, 2: { cellWidth: 'auto' } }, // Auto wrap
    });
  
    // Add Warning table
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 10,
      head: [['Type', 'Check', 'Description']],
      body: warningsTableData,
      theme: 'grid',
      headStyles: { fillColor: [255, 193, 7], textColor: 0 }, // Yellow for Warning
      columnStyles: { 1: { cellWidth: 'auto' }, 2: { cellWidth: 'auto' } },
    });
  
    // Add Good Practices table
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 10,
      head: [['Type', 'Check', 'Description']],
      body: goodPracticesTableData,
      theme: 'grid',
      headStyles: { fillColor: [40, 167, 69], textColor: 255 }, // Green for Good Practices
      columnStyles: { 1: { cellWidth: 'auto' }, 2: { cellWidth: 'auto' } },
    });
  
    // Save the PDF
    doc.save('FirebaseHosting_Analysis_Report.pdf');
  };  

  return (
    <>
      <CCallout color="primary">
        <h6 className="font-w-500">Notice!</h6>
        This Firebase-Hosted website scanning procedure may take a few minutes to finish. Please do not click the button multiple times.
        Upload the link of the website without "http, https, etc. ". Enjoy using this feature while it's still free! - Gated Programming Team
      </CCallout>
  
      <CCard>
        <CCardHeader>Upload Firebase-Hosted Website Link</CCardHeader>
        <CCardBody>
          <input
            type="text"
            onChange={handleDomainInput}
            className="form-control mb-3"
            value={domain}
          />
          <CButton color="primary" onClick={handleScanHosting}>
            Scan
          </CButton>
          <CButton color="secondary" onClick={exportToPDF} style={{ marginLeft: '10px' }}>
          Export to PDF
        </CButton>
        </CCardBody>
      </CCard>

      <CCard className="p-0" style={{marginBottom: '30px'}}>
        {auditResults && (
          <CTabs
            activeItemKey={activeTab}
            onActiveTabChange={setActiveTab}
            variant="underline-border"
            className="mt-10"
          >
            <CCardHeader>Scan Results</CCardHeader>
            <CTabList variant="underline-border">
              <CTab className="p-3" aria-controls="danger-tab-pane" itemKey={0}>
                Danger
              </CTab>
              <CTab className="p-3" aria-controls="warning-tab-pane" itemKey={1}>
                Warnings
              </CTab>
              <CTab className="p-3" aria-controls="good-tab-pane" itemKey={2}>
                Good Practices
              </CTab>
            </CTabList>
            <CTabContent>
              {/* Danger Tab */}
              <CTabPanel aria-labelledby="danger-tab-pane" className="p-3" itemKey={0}>
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

              {/* Warnings Tab */}
              <CTabPanel aria-labelledby="warning-tab-pane" className="p-3" itemKey={1}>
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

              {/* Good Practices Tab */}
              <CTabPanel aria-labelledby="good-tab-pane" className="p-3" itemKey={2}>
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
        )}
        
        {/* Educational Links Section */}
        {(auditResults.errors.length > 0 || auditResults.warnings.length > 0 || auditResults.good_practices.length > 0) && (
          <CCard className="mt-4">
            <CCardBody>
              <h5>Learn how to mitigate these risks now before it's too late!</h5>
              <ul>
                <li>
                  <a href="/icons/coreui-icons#/icons/flags" target="_blank" rel="noopener noreferrer">
                    What is Firebase Hosting?
                  </a>
                </li>
                <li>
                  <a href="/icons/coreui-icons#/icons/brands" target="_blank" rel="noopener noreferrer">
                    Benefits and Challenges
                  </a>
                </li>
              </ul>
            </CCardBody>
          </CCard>
        )}
      </CCard>
    </>
  );
};

export default Buttons;
