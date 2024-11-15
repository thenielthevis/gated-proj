import React, { useState } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CTabList, CTab, CTabContent, CTabPanel, CTabs } from '@coreui/react'

const Buttons = () => {
  const [file, setFile] = useState(null)
  const [activeTab, setActiveTab] = useState('danger')
  const [analysisResults, setAnalysisResults] = useState(null)

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  // Send file to backend
  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file first.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://localhost:8000/sql/upload-sql-file', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      setAnalysisResults(data.analysis) // Expecting 'analysis' object from the backend
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  return (
    <CRow>
      <CCol xs="12" lg="6">
        <CCard>
          <CCardHeader>Upload SQL File</CCardHeader>
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
          <CTabs activeItemKey={activeTab} onActiveTabChange={setActiveTab}>
            <CTabList>
              <CTab itemKey="danger">Danger</CTab>
              <CTab itemKey="warnings">Warnings</CTab>
              <CTab itemKey="good">Good</CTab>
            </CTabList>
            <CTabContent>
              {/* Danger Tab */}
              <CTabPanel className="p-3" itemKey="danger">
                {analysisResults.errors.length > 0 ? (
                  <ul>
                    {analysisResults.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No dangerous issues detected.</p>
                )}
              </CTabPanel>

              {/* Warnings Tab */}
              <CTabPanel className="p-3" itemKey="warnings">
                {analysisResults.warnings.length > 0 ? (
                  <ul>
                    {analysisResults.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No warnings detected.</p>
                )}
              </CTabPanel>

              {/* Good Tab */}
              <CTabPanel className="p-3" itemKey="good">
                {analysisResults.good_practices.length > 0 ? (
                  <ul>
                    {analysisResults.good_practices.map((practice, index) => (
                      <li key={index}>{practice.replace('Good practice: ', '')}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No good practices found.</p>
                )}
              </CTabPanel>
            </CTabContent>
          </CTabs>
        )}
      </CCol>
    </CRow>
  )
}

export default Buttons
