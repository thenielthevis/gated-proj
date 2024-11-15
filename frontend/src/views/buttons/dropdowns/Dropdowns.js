import React, { useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';

const Buttons = () => {
  const [mongoUri, setMongoUri] = useState('');
  const [auditResults, setAuditResults] = useState({
    errors: [],
    warnings: [],
    good_practices: []
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

    // Reset audit results before starting new scan
    setAuditResults({
      errors: [],
      warnings: [],
      good_practices: []
    });

    try {
      const response = await fetch('http://localhost:8000/scan/mongodb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mongodb_uri: mongoUri }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from server:', errorText);
        alert(`Failed to upload URI: ${response.statusText}`);
        return;
      }

      const data = await response.json();
      console.log("Response data:", data);

      // Check if audit_results is an object and it contains audit_results as an array
      if (data.audit_results && data.audit_results.audit_results && Array.isArray(data.audit_results.audit_results)) {
        const auditResultsArray = data.audit_results.audit_results;

        // Separate the results based on category
        const categorizedResults = {
          errors: [],
          warnings: [],
          good_practices: [],
        };

        auditResultsArray.forEach(result => {
          if (result.category === 'Danger') {
            categorizedResults.errors.push(result);
          } else if (result.category === 'Warning') {
            categorizedResults.warnings.push(result);
          } else if (result.category === 'Good') {
            categorizedResults.good_practices.push(result);
          }
        });

        setAuditResults(categorizedResults);
      } else {
        console.warn('Unexpected response structure:', data);
        alert('Unexpected response from server. Check console logs for details.');
      }
    } catch (error) {
      console.error('Error uploading URI:', error);
      alert('An error occurred while uploading the URI. Please check the console for more details.');
    }
  };

  return (
    <CRow>
      <CCol xs="12" lg="6">
        <CCard>
          <CCardHeader>Enter MongoDB URL</CCardHeader>
          <CCardBody>
            <input
              type="text"
              onChange={handleUriChange}
              value={mongoUri}
              placeholder='mongodb+srv://<username>:<password>@<clustername>.lphgx.mongodb.net/<>'
            />
            <CButton color="primary" onClick={handleUriUpload}>
              Scan
            </CButton>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs="12" lg="6">
        {auditResults && (
          <div>
            <h5>Scan Results:</h5>

            {/* Display Errors (Dangers) */}
            {auditResults.errors.length > 0 && (
              <>
                <h6>Danger:</h6>
                <ul>
                  {auditResults.errors.map((error, index) => (
                    <li key={index}>
                      <strong>{error.check}:</strong> {error.result}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Display Warnings */}
            {auditResults.warnings.length > 0 && (
              <>
                <h6>Warnings:</h6>
                <ul>
                  {auditResults.warnings.map((warning, index) => (
                    <li key={index}>
                      <strong>{warning.check}:</strong> {warning.result}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Display Good Practices */}
            {auditResults.good_practices.length > 0 && (
              <>
                <h6>Good:</h6>
                <ul>
                  {auditResults.good_practices.map((practice, index) => (
                    <li key={index}>
                      <strong>{practice.check}:</strong> {practice.result}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </CCol>
    </CRow>
  );
};

export default Buttons;
