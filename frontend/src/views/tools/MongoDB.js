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

const MongoDBScanner = () => {
  const [mongoUri, setMongoUri] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [auditResults, setAuditResults] = useState({
    errors: [],
    warnings: [],
    good_practices: [],
  });

  // Handle MongoDB URI input change
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

    // Show loading spinner
    Swal.fire({
      title: 'Scanning MongoDB...',
      text: 'Please wait while we scan your MongoDB configuration.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch('http://127.0.0.1:8000/scan/mongodb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mongodb_uri: mongoUri }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.audit_results && Array.isArray(data.audit_results)) {
        const categorizedResults = {
          errors: [],
          warnings: [],
          good_practices: [],
        };

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
        </CCardBody>
      </CCard>

      <CCard className="p-0">
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
            {/* Danger Tab */}
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

            {/* Warnings Tab */}
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

            {/* Good Practices Tab */}
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
