// import React from 'react'
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CForm,
//   CFormInput,
//   CFormLabel,
//   CFormTextarea,
//   CRow,
// } from '@coreui/react'
// import { DocsExample } from 'src/components'

// const FormControl = () => {
//   return (
//     <CRow>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>React Form Control</strong>
//           </CCardHeader>
//           <CCardBody>
//             <DocsExample href="forms/form-control">
//               <CForm>
//                 <div className="mb-3">
//                   <CFormLabel htmlFor="exampleFormControlInput1">Email address</CFormLabel>
//                   <CFormInput
//                     type="email"
//                     id="exampleFormControlInput1"
//                     placeholder="name@example.com"
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <CFormLabel htmlFor="exampleFormControlTextarea1">Example textarea</CFormLabel>
//                   <CFormTextarea id="exampleFormControlTextarea1" rows={3}></CFormTextarea>
//                 </div>
//               </CForm>
//             </DocsExample>
//           </CCardBody>
//         </CCard>
//       </CCol>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>React Form Control</strong> <small>Sizing</small>
//           </CCardHeader>
//           <CCardBody>
//             <p className="text-body-secondary small">
//               Set heights using <code>size</code> property like <code>size=&#34;lg&#34;</code> and{' '}
//               <code>size=&#34;sm&#34;</code>.
//             </p>
//             <DocsExample href="forms/form-control#sizing">
//               <CFormInput
//                 type="text"
//                 size="lg"
//                 placeholder="Large input"
//                 aria-label="lg input example"
//               />
//               <br />
//               <CFormInput
//                 type="text"
//                 placeholder="Default input"
//                 aria-label="default input example"
//               />
//               <br />
//               <CFormInput
//                 type="text"
//                 size="sm"
//                 placeholder="Small input"
//                 aria-label="sm input example"
//               />
//             </DocsExample>
//           </CCardBody>
//         </CCard>
//       </CCol>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>React Form Control</strong> <small>Disabled</small>
//           </CCardHeader>
//           <CCardBody>
//             <p className="text-body-secondary small">
//               Add the <code>disabled</code> boolean attribute on an input to give it a grayed out
//               appearance and remove pointer events.
//             </p>
//             <DocsExample href="forms/form-control#disabled">
//               <CFormInput
//                 type="text"
//                 placeholder="Disabled input"
//                 aria-label="Disabled input example"
//                 disabled
//               />
//               <br />
//               <CFormInput
//                 type="text"
//                 placeholder="Disabled readonly input"
//                 aria-label="Disabled input example"
//                 disabled
//                 readOnly
//               />
//               <br />
//             </DocsExample>
//           </CCardBody>
//         </CCard>
//       </CCol>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>React Form Control</strong> <small>Readonly</small>
//           </CCardHeader>
//           <CCardBody>
//             <p className="text-body-secondary small">
//               Add the <code>readOnly</code> boolean attribute on an input to prevent modification of
//               the input&#39;s value. Read-only inputs appear lighter (just like disabled inputs),
//               but retain the standard cursor.
//             </p>
//             <DocsExample href="forms/form-control#readonly">
//               <CFormInput
//                 type="text"
//                 placeholder="Readonly input here..."
//                 aria-label="readonly input example"
//                 readOnly
//               />
//             </DocsExample>
//           </CCardBody>
//         </CCard>
//       </CCol>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>React Form Control</strong> <small>Readonly plain text</small>
//           </CCardHeader>
//           <CCardBody>
//             <p className="text-body-secondary small">
//               If you want to have <code>&lt;input readonly&gt;</code> elements in your form styled
//               as plain text, use the <code>plainText</code> boolean property to remove the default
//               form field styling and preserve the correct margin and padding.
//             </p>
//             <DocsExample href="components/accordion">
//               <CRow className="mb-3">
//                 <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
//                   Email
//                 </CFormLabel>
//                 <div className="col-sm-10">
//                   <CFormInput
//                     type="text"
//                     id="staticEmail"
//                     defaultValue="email@example.com"
//                     readOnly
//                     plainText
//                   />
//                 </div>
//               </CRow>
//               <CRow className="mb-3">
//                 <CFormLabel htmlFor="inputPassword" className="col-sm-2 col-form-label">
//                   Password
//                 </CFormLabel>
//                 <div className="col-sm-10">
//                   <CFormInput type="password" id="inputPassword" />
//                 </div>
//               </CRow>
//             </DocsExample>
//             <DocsExample href="components/accordion">
//               <CForm className="row g-3">
//                 <div className="col-auto">
//                   <CFormLabel htmlFor="staticEmail2" className="visually-hidden">
//                     Email
//                   </CFormLabel>
//                   <CFormInput
//                     type="text"
//                     id="staticEmail2"
//                     defaultValue="email@example.com"
//                     readOnly
//                     plainText
//                   />
//                 </div>
//                 <div className="col-auto">
//                   <CFormLabel htmlFor="inputPassword2" className="visually-hidden">
//                     Password
//                   </CFormLabel>
//                   <CFormInput type="password" id="inputPassword2" placeholder="Password" />
//                 </div>
//                 <div className="col-auto">
//                   <CButton color="primary" type="submit" className="mb-3">
//                     Confirm identity
//                   </CButton>
//                 </div>
//               </CForm>
//             </DocsExample>
//           </CCardBody>
//         </CCard>
//       </CCol>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>React Form Control</strong> <small>File input</small>
//           </CCardHeader>
//           <CCardBody>
//             <DocsExample href="forms/form-control#file-input">
//               <div className="mb-3">
//                 <CFormLabel htmlFor="formFile">Default file input example</CFormLabel>
//                 <CFormInput type="file" id="formFile" />
//               </div>
//               <div className="mb-3">
//                 <CFormLabel htmlFor="formFileMultiple">Multiple files input example</CFormLabel>
//                 <CFormInput type="file" id="formFileMultiple" multiple />
//               </div>
//               <div className="mb-3">
//                 <CFormLabel htmlFor="formFileDisabled">Disabled file input example</CFormLabel>
//                 <CFormInput type="file" id="formFileDisabled" disabled />
//               </div>
//               <div className="mb-3">
//                 <CFormLabel htmlFor="formFileSm">Small file input example</CFormLabel>
//                 <CFormInput type="file" size="sm" id="formFileSm" />
//               </div>
//               <div>
//                 <CFormLabel htmlFor="formFileLg">Large file input example</CFormLabel>
//                 <CFormInput type="file" size="lg" id="formFileLg" />
//               </div>
//             </DocsExample>
//           </CCardBody>
//         </CCard>
//       </CCol>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>React Form Control</strong> <small>Color</small>
//           </CCardHeader>
//           <CCardBody>
//             <DocsExample href="forms/form-control#color">
//               <CFormLabel htmlFor="exampleColorInput">Color picker</CFormLabel>
//               <CFormInput
//                 type="color"
//                 id="exampleColorInput"
//                 defaultValue="#563d7c"
//                 title="Choose your color"
//               />
//             </DocsExample>
//           </CCardBody>
//         </CCard>
//       </CCol>
//     </CRow>
//   )
// }

// export default FormControl

import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';

const FormControl = () => {
  return (
    <CRow className="mx-auto" style={{ maxWidth: '800px' }}>
      {/* Page Header */}
      <CCol xs="12">
        <CCard className="mb-4">
          <CCardHeader style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
            <h2>Understanding NoSQL Databases</h2>
          </CCardHeader>
          <CCardBody>
            <p style={{ color: '#dcdcdc' }}>
              NoSQL databases, such as MongoDB, Couchbase, and Cassandra, are designed to handle unstructured or semi-structured data. They are widely used in modern applications requiring scalability, flexibility, and performance.
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Section 1: What Are NoSQL Databases? */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>1. What Are NoSQL Databases?</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              NoSQL (Not Only SQL) databases store, retrieve, and manage data in non-tabular formats. Unlike traditional relational databases, NoSQL databases use diverse data models, such as:
            </p>
            <ul>
              <li>
                <strong>Document Stores (e.g., MongoDB):</strong> Store data as JSON-like documents, ideal for hierarchical and nested data.
              </li>
              <li>
                <strong>Key-Value Stores (e.g., Redis):</strong> Simplistic data storage with unique keys and their corresponding values.
              </li>
              <li>
                <strong>Wide Column Stores (e.g., Cassandra):</strong> Store data in a tabular format but with flexible column arrangements.
              </li>
              <li>
                <strong>Graph Databases (e.g., Neo4j):</strong> Represent data as nodes and relationships, useful for interconnected datasets.
              </li>
            </ul>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Section 2: Differences Between NoSQL and SQL */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>2. Differences Between NoSQL and SQL</h3>
          </CCardHeader>
          <CCardBody>
            <p>Key differences between NoSQL and traditional SQL databases include:</p>
            <ul>
              <li>
                <strong>Schema:</strong> SQL databases have a fixed schema, while NoSQL databases are schema-less or have flexible schemas.
              </li>
              <li>
                <strong>Scalability:</strong> SQL scales vertically (adding resources to a single server), whereas NoSQL scales horizontally (adding more servers).
              </li>
              <li>
                <strong>Data Model:</strong> SQL uses structured tables with relationships; NoSQL uses various models like key-value, document, or graph.
              </li>
              <li>
                <strong>Query Language:</strong> SQL databases use structured query language (SQL); NoSQL databases use diverse query methods depending on the type.
              </li>
            </ul>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Section 3: Benefits of NoSQL Databases */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>3. Benefits of NoSQL Databases</h3>
          </CCardHeader>
          <CCardBody>
            <p>Some key advantages of NoSQL databases are:</p>
            <ul>
              <li>
                <strong>Scalability:</strong> Easily scale applications by adding more servers.
              </li>
              <li>
                <strong>Flexibility:</strong> Store unstructured, semi-structured, or structured data without predefined schemas.
              </li>
              <li>
                <strong>Performance:</strong> Handle high volumes of data with low latency.
              </li>
              <li>
                <strong>Agility:</strong> Rapid development and adaptability to changing requirements.
              </li>
            </ul>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Section 4: Use Cases of NoSQL Databases */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>4. Use Cases of NoSQL Databases</h3>
          </CCardHeader>
          <CCardBody>
            <p>NoSQL databases are ideal for:</p>
            <ul>
              <li>Real-time analytics and big data processing</li>
              <li>Content management and blogging platforms</li>
              <li>IoT applications and time-series data</li>
              <li>Social networks and graph-based relationships</li>
              <li>Mobile and web applications requiring fast iteration</li>
            </ul>
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
              NoSQL databases provide the flexibility, scalability, and performance needed for modern applications. Whether dealing with large-scale unstructured data or building agile, high-performance systems, NoSQL offers robust solutions tailored to evolving technological demands.
            </p>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default FormControl;
