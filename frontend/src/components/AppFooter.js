import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://coreui.io" target="_blank" rel="noopener noreferrer">
          GATED
        </a>
        <span className="ms-1">&copy; 2024 SAI & IAS 2</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Gated Tool Companion</span>
        {/* <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">
          Gated &amp; Tool Companion
        </a> */}
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
