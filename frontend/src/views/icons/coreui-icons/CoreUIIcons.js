// import React from 'react'
// import { CCard, CCardBody, CCardHeader, CRow } from '@coreui/react'
// import { freeSet } from '@coreui/icons'
// import { getIconsView } from '../brands/Brands.js'
// import { DocsCallout } from 'src/components'

// const CoreUIIcons = () => {
//   return (
//     <>
//       <DocsCallout
//         name="CoreUI Icons"
//         href="components/chart"
//         content="CoreUI Icons. CoreUI Icons package is delivered with more than 1500 icons in multiple formats SVG, PNG, and Webfonts. CoreUI Icons are beautifully crafted symbols for common actions and items. You can use them in your digital products for web or mobile app."
//       />
//       <CCard className="mb-4">
//         <CCardHeader>Free Icons</CCardHeader>
//         <CCardBody>
//           <CRow className="text-center">{getIconsView(freeSet)}</CRow>
//         </CCardBody>
//       </CCard>
//     </>
//   )
// }

// export default CoreUIIcons

import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';

const CoreUIIcons = () => {
  return (
    <CRow className="mx-auto" style={{ maxWidth: '800px' }}>
      {/* Page Header */}
      <CCol xs="12">
        <CCard className="mb-4">
          <CCardHeader style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
            <h2>Firebase Firestore Overview</h2>
          </CCardHeader>
          <CCardBody>
            <p style={{ color: '#dcdcdc' }}>
              Firebase Firestore is a flexible, scalable NoSQL cloud database for mobile, web, and server development. It provides real-time synchronization, offline support, and a document-based data model that is perfect for web and mobile apps. With Firebase's integration into the Google Cloud ecosystem, Firestore is a great solution for handling backend services such as user authentication, file storage, and analytics. However, like any database service, there are potential risks and challenges that need to be addressed to ensure optimal performance and security.
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Advantages of Firebase Firestore */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>Advantages of Firebase Firestore</h3>
          </CCardHeader>
          <CCardBody>
            <ul style={{ color: '#dcdcdc' }}>
              <li><strong>Real-Time Sync:</strong> Firestore offers real-time data synchronization across connected clients, ensuring all users have the most up-to-date data.</li>
              <li><strong>Scalable and Flexible:</strong> Firestore scales automatically with growing app needs and allows you to handle large datasets efficiently.</li>
              <li><strong>Offline Support:</strong> Firestore provides offline persistence, allowing users to interact with the app and keep data locally until online connectivity is restored.</li>
              <li><strong>Integrated Security Rules:</strong> Firestore enables you to set detailed security rules for read and write operations, ensuring data is only accessible to authorized users.</li>
              <li><strong>Automatic Indexing:</strong> Firestore automatically indexes your data, helping improve query performance out-of-the-box.</li>
            </ul>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Common Risks in Firebase Firestore */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>Common Risks in Firebase Firestore</h3>
          </CCardHeader>
          <CCardBody>
            <p style={{ color: '#dcdcdc' }}>
              While Firebase Firestore offers significant advantages, there are some common risks and challenges that developers should be aware of to avoid potential pitfalls.
            </p>

            {/* 1. Rules Config Check */}
            <p><strong>1. Rules Config Check:</strong> Incorrect or overly permissive security rules can expose your Firestore database to unauthorized access.</p>
            <ul style={{ color: '#dcdcdc' }}>
              <li><strong>Tip:</strong> Review and implement fine-grained security rules to ensure proper access control. Use Firebase Emulator Suite to test rules locally before deploying them.</li>
            </ul>

            {/* 2. Open Access Check */}
            <p><strong>2. Open Access Check:</strong> Having open or misconfigured access rules can inadvertently expose sensitive data to the public.</p>
            <ul style={{ color: '#dcdcdc' }}>
              <li><strong>Tip:</strong> Always restrict access based on user roles. Use Firebase Authentication to control who has access to the data and enforce user-specific rules.</li>
            </ul>

            {/* 3. Unused Indexes Check */}
            <p><strong>3. Unused Indexes Check:</strong> Firestore creates indexes automatically, but if unused indexes accumulate, they can lead to unnecessary storage costs and performance degradation.</p>
            <ul style={{ color: '#dcdcdc' }}>
              <li><strong>Tip:</strong> Regularly review and remove unused or redundant indexes. Use Firebase Console to view and manage indexes.</li>
            </ul>

            {/* 4. Large Documents Check */}
            <p><strong>4. Large Documents Check:</strong> Storing large amounts of data in a single document can result in slower read times and increased latency.</p>
            <ul style={{ color: '#dcdcdc' }}>
              <li><strong>Tip:</strong> Break up large documents into smaller, more manageable pieces. Avoid excessive nesting of large arrays or objects within a single document.</li>
            </ul>

            {/* 5. Encryption Check */}
            <p><strong>5. Encryption Check:</strong> Not enabling encryption for sensitive data could expose it to unauthorized access if not handled properly.</p>
            <ul style={{ color: '#dcdcdc' }}>
              <li><strong>Tip:</strong> Enable Firestore's built-in encryption for data both at rest and in transit. Firestore automatically encrypts data at rest, but always use SSL to encrypt data in transit.</li>
            </ul>

            {/* 6. Empty Fields Check */}
            <p><strong>6. Empty Fields Check:</strong> Storing empty or null fields in documents can cause unnecessary data bloat and decrease query efficiency.</p>
            <ul style={{ color: '#dcdcdc' }}>
              <li><strong>Tip:</strong> Avoid storing empty fields. Implement validation checks to ensure fields are only included when populated with valid data.</li>
            </ul>

            {/* 7. Query Performance Check */}
            <p><strong>7. Query Performance Check:</strong> Poorly optimized queries can result in slow performance and unnecessary reads, increasing costs.</p>
            <ul style={{ color: '#dcdcdc' }}>
              <li><strong>Tip:</strong> Optimize queries by using composite indexes and avoid querying large datasets unnecessarily. Leverage Firestore’s "limit" and "orderBy" functions to retrieve only the necessary data.</li>
            </ul>

            {/* 8. Data Redundancy Check */}
            <p><strong>8. Data Redundancy Check:</strong> Storing redundant data can lead to inconsistencies, increased storage costs, and more complex update operations.</p>
            <ul style={{ color: '#dcdcdc' }}>
              <li><strong>Tip:</strong> Apply normalization techniques where appropriate. Use references to other documents instead of duplicating data across multiple places.</li>
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
              Firebase Firestore provides developers with a powerful, flexible, and scalable NoSQL database solution. However, to make the most of Firestore and avoid common risks, it is essential to implement robust security rules, regularly review configurations, and ensure that data is stored and queried efficiently. By following the best practices outlined in this post, developers can secure their Firestore databases, reduce costs, and maintain high performance.
            </p>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default CoreUIIcons;

