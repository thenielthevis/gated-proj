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

const Buttons = () => {
  const [firestoreKey, setFirestoreKey] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [auditResults, setAuditResults] = useState({
    errors: [],
    warnings: [],
    good_practices: [],
  });

  // Handle file input
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsedKey = JSON.parse(e.target.result);
          setFirestoreKey(parsedKey);
        } catch (error) {
          alert('Invalid JSON file. Please upload a valid Firestore key file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleKeyUpload = async () => {
    if (!firestoreKey) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Key File',
        text: 'Please upload a Firestore key file first.',
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
      title: 'Scanning Firestore...',
      text: 'Please wait while we scan your Firestore configuration.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  
    try {
      // Send the Firestore key to the backend for scanning
      const response = await fetch('http://localhost:8000/firebase/firestore-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firestore_key: firestoreKey }),
      });
  
      const data = await response.json();
      console.log('Backend response:', data);
  
      // Check if the response contains audit results
      if (data.status === 'Scanning completed' && Array.isArray(data.audit_results)) {
        const categorizedResults = {
          errors: [],
          warnings: [],
          good_practices: [],
        };
  
        // Categorize the results based on the 'category' field
        data.audit_results.forEach((result) => {
          if (result.category === 'Danger') {
            categorizedResults.errors.push(result);
          } else if (result.category === 'Warning') {
            categorizedResults.warnings.push(result);
          } else if (result.category === 'Good') {
            categorizedResults.good_practices.push(result);
          }
        });
  
        setAuditResults(categorizedResults);
  
        Swal.fire({
          icon: 'success',
          title: 'Scan Completed',
          text: 'Your Firestore scan has been completed successfully!',
          timer: 2000, 
        });
      } else {
        console.error('Invalid or empty audit results', data);
        Swal.fire({
          icon: 'warning',
          title: 'No Results',
          text: 'The scan completed, but no valid results were found.',
        });
      }
    } catch (error) {
      console.error('Error uploading key:', error);
      Swal.fire({
        icon: 'error',
        title: 'Scan Failed',
        text: 'An error occurred while uploading the key. Please try again later.',
      });
    }
  };
  

  return (
    <>
      <CCallout color="primary">
        <h6 className="font-w-500">Notice!</h6>
        This Firestore scanning procedure may take a few seconds to finish. Please do not click the button multiple times.
        Upload a valid Firestore key JSON file. Enjoy using this feature while it's still free! - Gated Programming Team
      </CCallout>
  
      <CCard>
        <CCardHeader>Upload Firestore Key File</CCardHeader>
        <CCardBody>
          <input
            type="file"
            accept="application/json"
            onChange={handleFileUpload}
            className="form-control mb-3"
          />
          <CButton color="primary" onClick={handleKeyUpload}>
            Scan
          </CButton>
        </CCardBody>
      </CCard>

      <CCard className="p-0">
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
                Good
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

              {/* Good Tab */}
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
      </CCard>

    </>
  );
};

export default Buttons;