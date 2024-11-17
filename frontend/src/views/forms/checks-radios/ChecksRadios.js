// import React from 'react'
// import { CCard, CCardBody, CCardHeader, CCol, CFormCheck, CFormSwitch, CRow } from '@coreui/react'
// import { DocsExample } from 'src/components'

// const ChecksRadios = () => {
//   return (
//     <CRow>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>React Checkbox</strong>
//           </CCardHeader>
//           <CCardBody>
//             <DocsExample href="forms/checks-radios">
//               <CFormCheck id="flexCheckDefault" label="Default checkbox" />
//               <CFormCheck id="flexCheckChecked" label="Checked checkbox" defaultChecked />
//             </DocsExample>
//           </CCardBody>
//         </CCard>
//       </CCol>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>React Checkbox</strong> <small>Disabled</small>
//           </CCardHeader>
//           <CCardBody>
//             <p className="text-body-secondary small">
//               Add the <code>disabled</code> attribute and the associated <code>&lt;label&gt;</code>s
//               are automatically styled to match with a lighter color to help indicate the
//               input&#39;s state.
//             </p>
//             <DocsExample href="forms/checks-radios#disabled">
//               <CFormCheck label="Disabled checkbox" disabled />
//               <CFormCheck label="Disabled checked checkbox" defaultChecked disabled />
//             </DocsExample>
//           </CCardBody>
//         </CCard>
//       </CCol>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>React Radio</strong>
//           </CCardHeader>
//           <CCardBody>
//             <p className="text-body-secondary small">
//               Add the <code>disabled</code> attribute and the associated <code>&lt;label&gt;</code>s
//               are automatically styled to match with a lighter color to help indicate the
//               input&#39;s state.
//             </p>
//             <DocsExample href="forms/checks-radios#radios">
//               <CFormCheck
//                 type="radio"
//                 name="flexRadioDefault"
//                 id="flexRadioDefault1"
//                 label="Default radio"
//               />
//               <CFormCheck
//                 type="radio"
//                 name="flexRadioDefault"
//                 id="flexRadioDefault2"
//                 label="Checked radio"
//                 defaultChecked
//               />
//             </DocsExample>
//           </CCardBody>
//         </CCard>
//       </CCol>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>React Radio</strong> <small>Disabled</small>
//           </CCardHeader>
//           <CCardBody>
//             <DocsExample href="forms/checks-radios#disabled-1">
//               <CFormCheck
//                 type="radio"
//                 name="flexRadioDisabled"
//                 id="flexRadioDisabled"
//                 label="Disabled radio"
//                 disabled
//               />
//               <CFormCheck
//                 type="radio"
//                 name="flexRadioDisabled"
//                 id="flexRadioCheckedDisabled"
//                 label="Disabled checked radio"
//                 defaultChecked
//                 disabled
//               />
//             </DocsExample>
//           </CCardBody>
//         </CCard>
//       </CCol>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>React Switches</strong>
//           </CCardHeader>
//           <CCardBody>
//             <p className="text-body-secondary small">
//               A switch has the markup of a custom checkbox but uses the <code>switch</code> boolean
//               properly to render a toggle switch. Switches also support the <code>disabled</code>{' '}
//               attribute.
//             </p>
//             <DocsExample href="forms/checks-radios#switches">
//               <CFormSwitch label="Default switch checkbox input" id="formSwitchCheckDefault" />
//               <CFormSwitch
//                 label="Checked switch checkbox input"
//                 id="formSwitchCheckChecked"
//                 defaultChecked
//               />
//               <CFormSwitch
//                 label="Disabled switch checkbox input"
//                 id="formSwitchCheckDisabled"
//                 disabled
//               />
//               <CFormSwitch
//                 label="Disabled checked switch checkbox input"
//                 id="formSwitchCheckCheckedDisabled"
//                 defaultChecked
//                 disabled
//               />
//             </DocsExample>
//           </CCardBody>
//         </CCard>
//       </CCol>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>React Switches</strong> <small>Sizes</small>
//           </CCardHeader>
//           <CCardBody>
//             <DocsExample href="forms/checks-radios#sizes">
//               <CFormSwitch label="Default switch checkbox input" id="formSwitchCheckDefault" />
//               <CFormSwitch
//                 size="lg"
//                 label="Large switch checkbox input"
//                 id="formSwitchCheckDefaultLg"
//               />
//               <CFormSwitch
//                 size="xl"
//                 label="Extra large switch checkbox input"
//                 id="formSwitchCheckDefaultXL"
//               />
//             </DocsExample>
//           </CCardBody>
//         </CCard>
//       </CCol>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>React Checks and Radios</strong> <small>Default layout (stacked)</small>
//           </CCardHeader>
//           <CCardBody>
//             <p className="text-body-secondary small">
//               By default, any number of checkboxes and radios that are immediate sibling will be
//               vertically stacked and appropriately spaced.
//             </p>
//             <DocsExample href="forms/checks-radios#default-stacked">
//               <CFormCheck id="defaultCheck1" label="Default checkbox" />
//               <CFormCheck id="defaultCheck2" label="Disabled checkbox" disabled />
//             </DocsExample>
//             <DocsExample href="forms/checks-radios#default-stacked">
//               <CFormCheck
//                 type="radio"
//                 name="exampleRadios"
//                 id="exampleRadios1"
//                 value="option1"
//                 label="Default radio"
//                 defaultChecked
//               />
//               <CFormCheck
//                 type="radio"
//                 name="exampleRadios"
//                 id="exampleRadios2"
//                 value="option2"
//                 label="Second default radio"
//               />
//               <CFormCheck
//                 type="radio"
//                 name="exampleRadios"
//                 id="exampleRadios3"
//                 value="option3"
//                 label="Disabled radio"
//                 disabled
//               />
//             </DocsExample>
//           </CCardBody>
//         </CCard>
//       </CCol>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>React Checks and Radios</strong> <small>Inline</small>
//           </CCardHeader>
//           <CCardBody>
//             <p className="text-body-secondary small">
//               Group checkboxes or radios on the same horizontal row by adding <code>inline</code>{' '}
//               boolean property to any <code>&lt;CFormCheck&gt;</code>.
//             </p>
//             <DocsExample href="forms/checks-radios#inline">
//               <CFormCheck inline id="inlineCheckbox1" value="option1" label="1" />
//               <CFormCheck inline id="inlineCheckbox2" value="option2" label="2" />
//               <CFormCheck
//                 inline
//                 id="inlineCheckbox3"
//                 value="option3"
//                 label="3 (disabled)"
//                 disabled
//               />
//             </DocsExample>
//             <DocsExample href="forms/checks-radios#inline">
//               <CFormCheck
//                 inline
//                 type="radio"
//                 name="inlineRadioOptions"
//                 id="inlineCheckbox1"
//                 value="option1"
//                 label="1"
//               />
//               <CFormCheck
//                 inline
//                 type="radio"
//                 name="inlineRadioOptions"
//                 id="inlineCheckbox2"
//                 value="option2"
//                 label="2"
//               />
//               <CFormCheck
//                 inline
//                 type="radio"
//                 name="inlineRadioOptions"
//                 id="inlineCheckbox3"
//                 value="option3"
//                 label="3 (disabled)"
//                 disabled
//               />
//             </DocsExample>
//           </CCardBody>
//         </CCard>
//       </CCol>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>React Checks and Radios</strong> <small>Without labels</small>
//           </CCardHeader>
//           <CCardBody>
//             <p className="text-body-secondary small">
//               Remember to still provide some form of accessible name for assistive technologies (for
//               instance, using <code>aria-label</code>).
//             </p>
//             <DocsExample href="forms/checks-radios#without-labels">
//               <div>
//                 <CFormCheck id="checkboxNoLabel" value="" aria-label="..." />
//               </div>
//               <div>
//                 <CFormCheck
//                   type="radio"
//                   name="radioNoLabel"
//                   id="radioNoLabel"
//                   value=""
//                   aria-label="..."
//                 />
//               </div>
//             </DocsExample>
//           </CCardBody>
//         </CCard>
//       </CCol>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>Toggle buttons</strong>
//           </CCardHeader>
//           <CCardBody>
//             <p className="text-body-secondary small">
//               Create button-like checkboxes and radio buttons by using <code>button</code> boolean
//               property on the <code>&lt;CFormCheck&gt;</code> component. These toggle buttons can
//               further be grouped in a button group if needed.
//             </p>
//             <DocsExample href="forms/checks-radios#toggle-buttons">
//               <CFormCheck
//                 button={{ color: 'primary ' }}
//                 id="btn-check"
//                 autoComplete="off"
//                 label="Single toggle"
//               />
//             </DocsExample>
//             <DocsExample href="forms/checks-radios#toggle-buttons">
//               <CFormCheck
//                 button={{ color: 'primary ' }}
//                 id="btn-check-2"
//                 autoComplete="off"
//                 label="Checked"
//                 defaultChecked
//               />
//             </DocsExample>
//             <DocsExample href="forms/checks-radios#toggle-buttons">
//               <CFormCheck
//                 button={{ color: 'primary ' }}
//                 id="btn-check-3"
//                 autoComplete="off"
//                 label="Disabled"
//                 disabled
//               />
//             </DocsExample>
//             <h3>Radio toggle buttons</h3>
//             <DocsExample href="forms/checks-radios#toggle-buttons">
//               <CFormCheck
//                 button={{ color: 'secondary' }}
//                 type="radio"
//                 name="options"
//                 id="option1"
//                 autoComplete="off"
//                 label="Checked"
//                 defaultChecked
//               />
//               <CFormCheck
//                 button={{ color: 'secondary' }}
//                 type="radio"
//                 name="options"
//                 id="option2"
//                 autoComplete="off"
//                 label="Radio"
//               />
//               <CFormCheck
//                 button={{ color: 'secondary' }}
//                 type="radio"
//                 name="options"
//                 id="option3"
//                 autoComplete="off"
//                 label="Radio"
//                 disabled
//               />
//               <CFormCheck
//                 button={{ color: 'secondary' }}
//                 type="radio"
//                 name="options"
//                 id="option4"
//                 autoComplete="off"
//                 label="Radio"
//               />
//             </DocsExample>
//             <h3>Outlined styles</h3>
//             <p className="text-body-secondary small">
//               Different variants of button, such at the various outlined styles, are supported.
//             </p>
//             <DocsExample href="forms/checks-radios#toggle-buttons">
//               <div>
//                 <CFormCheck
//                   button={{ color: 'primary', variant: 'outline' }}
//                   id="btn-check-outlined"
//                   autoComplete="off"
//                   label="Single toggle"
//                 />
//               </div>
//               <div>
//                 <CFormCheck
//                   button={{ color: 'secondary', variant: 'outline' }}
//                   id="btn-check-2-outlined"
//                   autoComplete="off"
//                   label="Checked"
//                   defaultChecked
//                 />
//               </div>
//               <div>
//                 <CFormCheck
//                   button={{ color: 'success', variant: 'outline' }}
//                   type="radio"
//                   name="options-outlined"
//                   id="success-outlined"
//                   autoComplete="off"
//                   label="Radio"
//                   defaultChecked
//                 />
//                 <CFormCheck
//                   button={{ color: 'danger', variant: 'outline' }}
//                   type="radio"
//                   name="options-outlined"
//                   id="danger-outlined"
//                   autoComplete="off"
//                   label="Radio"
//                 />
//               </div>
//             </DocsExample>
//           </CCardBody>
//         </CCard>
//       </CCol>
//     </CRow>
//   )
// }

// export default ChecksRadios

import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';

const ChecksRadios = () => {
  return (
    <CRow className="mx-auto" style={{ maxWidth: '800px' }}>
      {/* Page Header */}
      <CCol xs="12">
        <CCard className="mb-4">
          <CCardHeader style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
            <h2>Best Practices for Securing NoSQL Databases</h2>
          </CCardHeader>
          <CCardBody>
            <p style={{ color: '#dcdcdc' }}>
              Following best practices is crucial to secure your NoSQL database from the risks of unauthorized access, data loss, and performance issues. The following practices aim to protect your data and ensure proper system functionality.
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Practice 1: Implement Strong Authentication */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>1. Implement Strong Authentication</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              **Best Practice:** Enable strong authentication mechanisms such as SCRAM (Salted Challenge Response Authentication Mechanism) or LDAP to verify user identity and prevent unauthorized access.
            </p>
            <p>
              **Why It Works:** Authentication ensures that only authorized users can access or modify the database. Make sure to enforce strong passwords and multi-factor authentication (MFA) where applicable.
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Practice 2: Use IP Binding to Restrict Access */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>2. Use IP Binding to Restrict Access</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              **Best Practice:** Bind your database to specific trusted IP addresses to prevent unauthorized users from accessing the database over the network.
            </p>
            <p>
              **Why It Works:** By restricting access to only trusted IPs, you can prevent malicious actors from connecting to your database from external or untrusted networks.
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Practice 3: Define Proper User Roles and Permissions */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>3. Define Proper User Roles and Permissions</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              **Best Practice:** Use the principle of least privilege by assigning the minimum required permissions to users based on their roles.
            </p>
            <p>
              **Why It Works:** Limiting user access ensures that users only have access to the data and actions necessary for their role, reducing the risk of unauthorized actions or data breaches.
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Practice 4: Enable Encryption for Data in Transit and at Rest */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>4. Enable Encryption for Data in Transit and at Rest</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              **Best Practice:** Enable SSL/TLS encryption to secure data during transmission and configure encryption at rest to protect stored data.
            </p>
            <p>
              **Why It Works:** Encryption ensures that sensitive data is protected from eavesdropping during transmission and prevents unauthorized access if the data is stored or backed up improperly.
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Practice 5: Change Default Port Numbers */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>5. Change Default Port Numbers</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              **Best Practice:** Change the default ports of your NoSQL database (e.g., MongoDB’s default port 27017) to a non-standard port to minimize the likelihood of automated attacks.
            </p>
            <p>
              **Why It Works:** Changing the default ports makes it more difficult for attackers to easily locate and target your database. It adds an additional layer of obscurity.
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Practice 6: Enable Detailed Logging and Monitoring */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>6. Enable Detailed Logging and Monitoring</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              **Best Practice:** Implement logging and monitoring solutions to track database access, query performance, and system errors.
            </p>
            <p>
              **Why It Works:** Logs and monitoring can help detect unusual activity, potential breaches, or performance degradation, allowing you to take corrective actions before issues become critical.
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Practice 7: Validate and Sanitize User Input */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>7. Validate and Sanitize User Input</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              **Best Practice:** Ensure that all data entered by users (or systems) is validated and sanitized to avoid injection attacks or data corruption.
            </p>
            <p>
              **Why It Works:** Input validation ensures that only correctly formatted and expected data is processed by the database, which helps prevent malicious data from being inserted.
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Practice 8: Use Password Hashing for User Authentication */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>8. Use Password Hashing for User Authentication</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              **Best Practice:** Store user passwords in a securely hashed form using a strong hashing algorithm like bcrypt, scrypt, or Argon2.
            </p>
            <p>
              **Why It Works:** Hashing passwords ensures that sensitive information is not stored in plain text. If the database is compromised, hashed passwords provide additional security.
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
              By following these best practices, you can significantly reduce the risks associated with using NoSQL databases. Ensuring strong security measures like authentication, encryption, access control, and monitoring will help protect your data from breaches and ensure database integrity.
            </p>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ChecksRadios;
