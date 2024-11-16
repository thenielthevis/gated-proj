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
  const [mongoUri, setMongoUri] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [auditResults, setAuditResults] = useState({
    errors: [],
    warnings: [],
    good_practices: [],
  });

  // Handle URI input
  const handleUriChange = (event) => {
    setMongoUri(event.target.value);
  };

  const handleUriUpload = async () => {
    if (!mongoUri) {
      alert('Please enter a MongoDB URI first.');
      return;
    }

    setAuditResults({
      errors: [],
      warnings: [],
      good_practices: [],
    });

    try {
      const response = await fetch('http://localhost:8000/scan/mongodb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mongodb_uri: mongoUri }),
      });

      const data = await response.json();

      const categorizedResults = {
        errors: [],
        warnings: [],
        good_practices: [],
      };

      if (data.audit_results && Array.isArray(data.audit_results.audit_results)) {
        data.audit_results.audit_results.forEach((result) => {
          if (result.category === 'Danger') {
            categorizedResults.errors.push(result);
          } else if (result.category === 'Warning') {
            categorizedResults.warnings.push(result);
          } else if (result.category === 'Good') {
            categorizedResults.good_practices.push(result);
          }
        });
      }

      setAuditResults(categorizedResults);
    } catch (error) {
      console.error('Error uploading URI:', error);
      alert('An error occurred while uploading the URI.');
    }
  };

  return (
    <>
      <CCallout color="primary">
        <h6 className="font-w-500">Notice!</h6>
        This MongoDB scanning procedure may take minutes to finished. Please note to not click the button twice. 
        Additionally, make sure that the string is existing and has a valid format. Enjoy using this feature while it's still free! - Gated Programming Team
      </CCallout>

      <CCard>
        <CCardHeader>Enter MongoDB URL</CCardHeader>
        <CCardBody>
          <input
            type="text"
            onChange={handleUriChange}
            value={mongoUri}
            placeholder="mongodb+srv://<username>:<password>@<clustername>.lphgx.mongodb.net/<>"
            className="form-control mb-3"
          />
          <CButton color="primary" onClick={handleUriUpload}>
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
