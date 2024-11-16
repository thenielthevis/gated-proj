import React, { useState } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

const ButtonGroups = () => {
  const [file, setFile] = useState(null)
  const [analysisResults, setAnalysisResults] = useState(null)

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file first.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://localhost:8000/json/upload-json-file', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      })

      if (!response.ok) {
        console.error('Failed to upload file, status:', response.status)
        alert('File upload failed')
        return
      }

      const data = await response.json()
      setAnalysisResults(data.analysis)
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  return (
    <CRow>
      <CCol xs="12" lg="6">
        <CCard>
          <CCardHeader>Upload JSON Script File</CCardHeader>
          <CCardBody>
            <input type="file" accept=".txt" onChange={handleFileChange} />
            <CButton color="primary" onClick={handleFileUpload}>
              Upload and Scan
            </CButton>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs="12" lg="6">
        {analysisResults && (
          <div>
            <h5>Scan Results:</h5>

            {/* Display Errors */}
            {analysisResults.errors.length > 0 && (
              <>
                <h6>Danger:</h6>
                <ul>
                  {analysisResults.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </>
            )}

            {/* Display Warnings */}
            {analysisResults.warnings.length > 0 && (
              <>
                <h6>Warnings:</h6>
                <ul>
                  {analysisResults.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </>
            )}

            {/* Display Good Practices */}
            {analysisResults.good_practices.length > 0 && (
              <>
                <h6>Good</h6>
                <ul>
                  {analysisResults.good_practices.map((good, index) => (
                    <li key={index}>{good}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </CCol>
    </CRow>
  )
}
export default ButtonGroups