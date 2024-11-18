// import React from 'react'
// import { CCard, CCardBody, CCardHeader, CCol, CFormSelect, CRow } from '@coreui/react'
// import { DocsExample } from 'src/components'

// const Select = () => {
//   return (
//     <CRow>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>React Select</strong> <small>Default</small>
//           </CCardHeader>
//           <CCardBody>
//             <DocsExample href="forms/select">
//               <CFormSelect aria-label="Default select example">
//                 <option>Open this select menu</option>
//                 <option value="1">One</option>
//                 <option value="2">Two</option>
//                 <option value="3">Three</option>
//               </CFormSelect>
//             </DocsExample>
//           </CCardBody>
//         </CCard>
//       </CCol>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>React Select</strong> <small>Sizing</small>
//           </CCardHeader>
//           <CCardBody>
//             <p className="text-body-secondary small">
//               You may also choose from small and large custom selects to match our similarly sized
//               text inputs.
//             </p>
//             <DocsExample href="forms/select#sizing">
//               <CFormSelect size="lg" className="mb-3" aria-label="Large select example">
//                 <option>Open this select menu</option>
//                 <option value="1">One</option>
//                 <option value="2">Two</option>
//                 <option value="3">Three</option>
//               </CFormSelect>
//               <CFormSelect size="sm" className="mb-3" aria-label="Small select example">
//                 <option>Open this select menu</option>
//                 <option value="1">One</option>
//                 <option value="2">Two</option>
//                 <option value="3">Three</option>
//               </CFormSelect>
//             </DocsExample>
//             <p className="text-body-secondary small">
//               The <code>multiple</code> attribute is also supported:
//             </p>
//             <DocsExample href="forms/select#sizing">
//               <CFormSelect size="lg" multiple aria-label="Multiple select example">
//                 <option>Open this select menu</option>
//                 <option value="1">One</option>
//                 <option value="2">Two</option>
//                 <option value="3">Three</option>
//               </CFormSelect>
//             </DocsExample>
//             <p className="text-body-secondary small">
//               As is the <code>htmlSize</code> property:
//             </p>
//             <DocsExample href="forms/select#sizing">
//               <CFormSelect size="lg" multiple aria-label="Multiple select example">
//                 <option>Open this select menu</option>
//                 <option value="1">One</option>
//                 <option value="2">Two</option>
//                 <option value="3">Three</option>
//               </CFormSelect>
//             </DocsExample>
//           </CCardBody>
//         </CCard>
//       </CCol>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>React Select</strong> <small>Disabled</small>
//           </CCardHeader>
//           <CCardBody>
//             <p className="text-body-secondary small">
//               Add the <code>disabled</code> boolean attribute on a select to give it a grayed out
//               appearance and remove pointer events.
//             </p>
//             <DocsExample href="forms/select#disabled">
//               <CFormSelect aria-label="Disabled select example" disabled>
//                 <option>Open this select menu</option>
//                 <option value="1">One</option>
//                 <option value="2">Two</option>
//                 <option value="3">Three</option>
//               </CFormSelect>
//             </DocsExample>
//           </CCardBody>
//         </CCard>
//       </CCol>
//     </CRow>
//   )
// }

// export default Select

import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';

const Select = () => {
  return (
    <CRow className="mx-auto" style={{ maxWidth: '800px' }}>
      {/* Page Header */}
      <CCol xs="12">
        <CCard className="mb-4">
          <CCardHeader style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
            <h2>Common Risks in Using MongoDB and Other NoSQL Databases</h2>
          </CCardHeader>
          <CCardBody>
            <p style={{ color: '#dcdcdc' }}>
              While NoSQL databases like MongoDB offer flexibility and scalability, they also come with specific risks that must be mitigated to ensure data security and integrity. Below are the most common risks and their implications.
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Section 1: Authentication Check */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>1. Authentication Check</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              **Risk:** By default, some NoSQL databases (like older versions of MongoDB) may not enforce authentication. This leaves the database exposed to unauthorized access.
            </p>
            <p>
              **Mitigation:** Always enable authentication and use strong, unique credentials for all users. Ensure that authentication mechanisms, such as SCRAM or LDAP, are properly configured.
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Section 2: IP Binding */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>2. IP Binding</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              **Risk:** If the database is bound to all network interfaces (`0.0.0.0`), it may be accessible over the internet, increasing the risk of attacks.
            </p>
            <p>
              **Mitigation:** Configure the database to bind only to trusted IPs or the localhost (`127.0.0.1`) unless external access is explicitly required.
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Section 3: User Roles and Permissions */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>3. User Roles and Permissions</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              **Risk:** Assigning overly permissive roles (e.g., admin access) to users can lead to unintended data modifications or breaches.
            </p>
            <p>
              **Mitigation:** Implement the principle of least privilege. Define specific roles and permissions for each user based on their tasks and responsibilities.
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Section 4: Encryption Check */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>4. Encryption Check</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              **Risk:** Data in transit or at rest may be left unencrypted, making it vulnerable to interception or unauthorized access.
            </p>
            <p>
              **Mitigation:** Enable TLS/SSL for encrypting data in transit and configure encryption at rest to protect sensitive information from breaches.
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Section 5: Default Port Check */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>5. Default Port Check</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              **Risk:** Running the database on the default port (e.g., MongoDB's `27017`) makes it easier for attackers to identify and target the service.
            </p>
            <p>
              **Mitigation:** Change the default port to a non-standard value and use firewalls to restrict access.
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Section 6: Logging Check */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>6. Logging Check</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              **Risk:** Inadequate logging and monitoring can lead to missed signs of breaches or operational issues.
            </p>
            <p>
              **Mitigation:** Enable detailed logging and set up monitoring tools to track access, queries, and system health.
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Section 7: Empty Fields Check */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>7. Empty Fields Check</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              **Risk:** Inserting documents with empty fields can lead to incomplete or inconsistent data.
            </p>
            <p>
              **Mitigation:** Implement validation rules or schemas to enforce the presence of required fields during data insertion.
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Section 8: Password Hash Check */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>8. Password Hash Check</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              **Risk:** Storing plain-text passwords exposes sensitive credentials if the database is breached.
            </p>
            <p>
              **Mitigation:** Always hash passwords using a strong algorithm like bcrypt before storing them in the database.
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Summary Section */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>Summary</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              Addressing these risks proactively ensures a secure and reliable NoSQL database environment. Implementing best practices for authentication, encryption, and access control will help mitigate vulnerabilities and maintain data integrity.
            </p>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Select;

