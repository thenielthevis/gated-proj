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

const Buttons = () => {
  const [domain, setDomain] = useState('');  // Store the Firebase Hosting domain
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

  // Handle scan request for Firebase Hosting
  const handleScanHosting = async () => {
    if (!domain) {
      alert('Please enter the Firebase Hosting domain.');
      return;
    }

    // Reset audit results
    setAuditResults({
      errors: [],
      warnings: [],
      good_practices: [],
    });

    try {
      // Send the Firebase Hosting domain to the backend for scanning
      const response = await fetch('http://localhost:8000/firebase/hosting-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),  // Sending the domain instead of Firestore key
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

        // Set the categorized results in state
        setAuditResults(categorizedResults);
      } else {
        console.error('Invalid or empty audit results', data);
        alert('Invalid or empty audit results');
      }
    } catch (error) {
      console.error('Error scanning hosting:', error);
      alert('An error occurred while scanning the hosting domain.');
    }
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
      </CCard>
    </>
  );
};

export default Buttons;
