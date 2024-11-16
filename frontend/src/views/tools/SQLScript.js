import React, { useState } from 'react'
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilLoopCircular, cilPlant, cilWarning } from '@coreui/icons'
import { bottom } from '@popperjs/core'

const Buttons = () => {
  const [file, setFile] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
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
      const response = await fetch('http://localhost:8000/sql/upload-sql-file', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      setAnalysisResults(data.analysis)
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  return (
    <>
      <CCallout color="primary">
        <h6 className="font-w-500">Notice!</h6>
        This SQL Script scanning procedure may take fewer moment to finished, rather than the MongoDB. Please note to not click the button twice. 
        Additionally, make sure that the file contains SQL Script. Enjoy using this feature while it's still free! - Gated Programming Team
      </CCallout>

      <CCard className="p-0 mb-50">
        <CCardHeader>Upload SQL Script</CCardHeader>
        <CCardBody>
          <input type="file" accept=".txt" onChange={handleFileChange} />
          <CButton color="primary" onClick={handleFileUpload}>
            Upload and Scan
          </CButton>
        </CCardBody>
      </CCard>

      <CCard className="p-0">
        {analysisResults && (
          <CTabs
            activeItemKey={activeTab}
            onActiveTabChange={setActiveTab}
            variant="underline-border"
            className="mt-10"
          >
            <CCardHeader>SQL Script Analysis Result</CCardHeader>
            <CTabList variant="underline-border">
              <CTab className="p-3" aria-controls="danger-tab-pane" itemKey="danger">Danger</CTab>
              <CTab className="p-3" aria-controls="warning-tab-pane" itemKey="warnings">Warnings</CTab>
              <CTab className="p-3" aria-controls="good-tab-pane" itemKey="good">Good</CTab>
            </CTabList>
            <CTabContent>
              {/* Danger Tab */}
              <CTabPanel aria-labelledby="danger-tab-pane" className="p-3" itemKey="danger">
                {analysisResults.errors.length > 0 ? (
                  <CAccordion activeItemKey={1}>
                    {analysisResults.errors.map((error, index) => (
                      <CAccordionItem itemKey={index + 1} key={index}>
                        <CAccordionHeader>
                          <CIcon icon={cilWarning} className="me-2" />
                          Danger #{index + 1}
                        </CAccordionHeader>
                        <CAccordionBody>{error}</CAccordionBody>
                      </CAccordionItem>
                    ))}
                  </CAccordion>
                ) : (
                  <p>No dangerous issues detected.</p>
                )}
              </CTabPanel>

              {/* Warnings Tab */}
              <CTabPanel aria-labelledby="warning-tab-pane" className="p-3" itemKey="warnings">
                {analysisResults.warnings.length > 0 ? (
                  <CAccordion activeItemKey={1}>
                    {analysisResults.warnings.map((warning, index) => (
                      <CAccordionItem itemKey={index + 1} key={index}>
                        {/* Add icon here */}
                        <CAccordionHeader>
                          <CIcon icon={cilLoopCircular} className="me-2" />
                          Warning #{index + 1}
                        </CAccordionHeader>
                        <CAccordionBody>{warning}</CAccordionBody>
                      </CAccordionItem>
                    ))}
                  </CAccordion>
                ) : (
                  <p>No warnings detected.</p>
                )}
              </CTabPanel>

              {/* Good Tab */}
              <CTabPanel aria-labelledby="good-tab-pane" className="p-3" itemKey="good">
                {analysisResults.good_practices.length > 0 ? (
                  <CAccordion activeItemKey={1}>
                    {analysisResults.good_practices.map((practice, index) => (
                      <CAccordionItem itemKey={index + 1} key={index}>
                        <CAccordionHeader>
                          <CIcon icon={cilCheckCircle} className="me-2" />
                          Good Practice #{index + 1}
                          </CAccordionHeader>
                        <CAccordionBody>{practice.replace('Good practice: ', '')}</CAccordionBody>
                      </CAccordionItem>
                    ))}
                  </CAccordion>
                ) : (
                  <p>No good practices found.</p>
                )}
              </CTabPanel>
            </CTabContent>
          </CTabs>
        )}
      </CCard>
    </>
  )
}

export default Buttons
