// import React from 'react'
// import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
// import CIcon from '@coreui/icons-react'
// import { brandSet } from '@coreui/icons'
// import { DocsCallout } from 'src/components'

// const toKebabCase = (str) => {
//   return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
// }

// export const getIconsView = (iconset) => {
//   return Object.entries(iconset).map(([name, value]) => (
//     <CCol className="mb-5" xs={6} sm={4} md={3} xl={2} key={name}>
//       <CIcon icon={value} size="xxl" />
//       <div>{toKebabCase(name)}</div>
//     </CCol>
//   ))
// }

// const CoreUIIcons = () => {
//   return (
//     <>
//       <DocsCallout
//         name="CoreUI Brand Icons"
//         href="components/chart"
//         content="CoreUI Brand Icons. CoreUI Icons package is delivered with more than 1500 icons in multiple formats SVG, PNG, and Webfonts. CoreUI Icons are beautifully crafted symbols for common actions and items. You can use them in your digital products for web or mobile app."
//       />
//       <CCard className="mb-4">
//         <CCardHeader>Brand Icons</CCardHeader>
//         <CCardBody>
//           <CRow className="text-center">{getIconsView(brandSet)}</CRow>
//         </CCardBody>
//       </CCard>
//     </>
//   )
// }

// export default CoreUIIcons

import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';

const FirebaseBenefitsChallenges = () => {
  return (
    <CRow className="mx-auto" style={{ maxWidth: '800px' }}>
      {/* Page Header */}
      <CCol xs="12">
        <CCard className="mb-4">
          <CCardHeader style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
            <h2>Benefits and Challenges of Firebase Firestore & Firebase Hosting</h2>
          </CCardHeader>
          <CCardBody>
            <p style={{ color: '#dcdcdc' }}>
              Firebase is a powerful platform with a wide range of services designed for modern web and mobile applications. Among these, Firebase Firestore and Firebase Hosting stand out for their real-time database capabilities and fast, secure content delivery. Below, we will explore the benefits and challenges of these services, along with practical tips and guides to make the most of them.
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Firebase Firestore: Benefits */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>Firebase Firestore: Benefits</h3>
          </CCardHeader>
          <CCardBody>
            <ul style={{ color: '#dcdcdc' }}>
              <li><strong>Real-Time Data Sync:</strong> Firebase Firestore provides real-time data synchronization across devices. This feature is perfect for apps that require real-time updates, like messaging platforms or collaborative tools.</li>
              <li><strong>Scalability:</strong> Firestore automatically scales as your application grows. You don't need to worry about managing the infrastructure or database scaling manually.</li>
              <li><strong>NoSQL Structure:</strong> Firestore’s NoSQL document database allows flexible data modeling, making it easier to structure data in a way that best fits your application’s needs.</li>
              <li><strong>Offline Support:</strong> Firestore provides built-in offline capabilities, enabling users to interact with the app even when they are disconnected from the internet. Changes are synced when the connection is restored.</li>
              <li><strong>Integrated Security:</strong> Firebase Firestore offers robust security via Firebase Authentication and Firestore security rules, ensuring that only authorized users can access specific data.</li>
            </ul>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Firebase Firestore: Challenges and Tips */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>Firebase Firestore: Challenges and Tips</h3>
          </CCardHeader>
          <CCardBody>
            <ul style={{ color: '#dcdcdc' }}>
              <li><strong>Cost Control:</strong> As your application scales, Firestore costs can rise based on usage (read/write operations and storage). To keep costs manageable, use Firestore’s built-in features like data indexing and carefully monitor usage.</li>
              <li><strong>Large Data Sets:</strong> Firestore can be less efficient when querying large datasets with complex structures. Avoid deeply nested collections and ensure your queries are optimized to reduce unnecessary read operations.</li>
              <li><strong>Data Modeling Challenges:</strong> While Firestore offers flexibility in data structuring, developers need to be careful in how data is modeled. Complex relationships may require additional read operations or structuring, which can impact performance.</li>
              <li><strong>Tip:</strong> Use Firestore’s offline persistence feature to ensure smooth user experiences, especially for mobile apps where intermittent connectivity is common.</li>
              <li><strong>Tip:</strong> Regularly audit your Firestore rules to ensure that they are secure, especially as your app’s user base grows.</li>
            </ul>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Firebase Hosting: Benefits */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>Firebase Hosting: Benefits</h3>
          </CCardHeader>
          <CCardBody>
            <ul style={{ color: '#dcdcdc' }}>
              <li><strong>Fast Content Delivery:</strong> Firebase Hosting uses a global CDN to serve static content like HTML, CSS, and JavaScript files, ensuring low-latency and quick load times worldwide.</li>
              <li><strong>Automatic SSL:</strong> Every Firebase Hosting project comes with free SSL certificates, enabling secure HTTPS connections for your site by default.</li>
              <li><strong>Easy Deployment:</strong> Firebase CLI simplifies the deployment process, allowing you to deploy your web app to Firebase Hosting with just a few commands.</li>
              <li><strong>Integrated with Firebase Ecosystem:</strong> Firebase Hosting seamlessly integrates with Firebase's other services, such as Firestore, Firebase Authentication, and Firebase Functions, enabling you to build dynamic web apps with minimal effort.</li>
              <li><strong>Custom Domains:</strong> Firebase Hosting allows you to connect your own custom domain to your project, making it easy to maintain a branded and professional web presence.</li>
            </ul>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Firebase Hosting: Challenges and Tips */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>Firebase Hosting: Challenges and Tips</h3>
          </CCardHeader>
          <CCardBody>
            <ul style={{ color: '#dcdcdc' }}>
              <li><strong>Scalability:</strong> While Firebase Hosting is highly scalable, handling dynamic content via Firebase Functions can introduce challenges around performance and function cold starts when traffic spikes.</li>
              <li><strong>Tip:</strong> Cache static content effectively by setting caching headers in the `firebase.json` configuration file to minimize server load.</li>
              <li><strong>Tip:</strong> Implement efficient routing for dynamic content, minimizing the number of cloud functions triggered by the Firebase Hosting setup.</li>
              <li><strong>Rate Limiting and Security:</strong> Without proper safeguards, your Firebase Hosting site can be vulnerable to DDoS attacks and other malicious activities, especially if you don't configure rate limiting.</li>
              <li><strong>Tip:</strong> Use Firebase Functions to handle rate limiting and implement security headers to ensure your app is protected from malicious requests.</li>
            </ul>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Conclusion */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>Conclusion</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              Firebase Firestore and Firebase Hosting are incredibly powerful tools that simplify development and provide excellent features like real-time synchronization, offline support, fast content delivery, and easy integration with the broader Firebase ecosystem. However, it’s important to understand the challenges associated with cost management, data modeling, and scalability. By following best practices, such as data indexing, optimized queries, and securing your hosting environment, you can maximize the benefits of Firebase and create high-performance, secure applications.
            </p>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default FirebaseBenefitsChallenges;