// import React from 'react'
// import { CCard, CCardBody, CCardHeader, CRow } from '@coreui/react'
// import { getIconsView } from '../brands/Brands.js'
// import { flagSet } from '@coreui/icons'
// import { DocsCallout } from 'src/components'

// const CoreUIIcons = () => {
//   return (
//     <>
//       <DocsCallout
//         name="CoreUI Flag Icons"
//         href="components/chart"
//         content="CoreUI Flag Icons. CoreUI Icons package is delivered with more than 1500 icons in multiple formats SVG, PNG, and Webfonts. CoreUI Icons are beautifully crafted symbols for common actions and items. You can use them in your digital products for web or mobile app."
//       />
//       <CCard className="mb-4">
//         <CCardHeader>Flag Icons</CCardHeader>
//         <CCardBody>
//           <CRow className="text-center">{getIconsView(flagSet)}</CRow>
//         </CCardBody>
//       </CCard>
//     </>
//   )
// }

// export default CoreUIIcons

import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';

const FirebaseHostingOverview = () => {
  return (
    <CRow className="mx-auto" style={{ maxWidth: '800px' }}>
      {/* Page Header */}
      <CCol xs="12">
        <CCard className="mb-4">
          <CCardHeader style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
            <h2>Firebase Hosting Overview</h2>
          </CCardHeader>
          <CCardBody>
            <p style={{ color: '#dcdcdc' }}>
              Firebase Hosting is a fast, secure, and reliable web hosting service designed for modern web applications. It provides developers with a platform to host static assets like HTML, CSS, JavaScript files, and dynamic content through serverless functions. Firebase Hosting also supports custom domains, SSL certificates, automatic scaling, and easy integration with Firebase services like Firestore, Realtime Database, and Cloud Functions.
            </p>
            <p style={{ color: '#dcdcdc' }}>
              Firebase Hosting offers a simple workflow with its CLI, allowing developers to deploy and manage websites with just a few commands. It uses a global content delivery network (CDN) to deliver content with low latency, ensuring fast loading times for users across the world.
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Functions of Firebase Hosting */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>Functions of Firebase Hosting</h3>
          </CCardHeader>
          <CCardBody>
            <ul style={{ color: '#dcdcdc' }}>
              <li><strong>Fast and Secure Content Delivery:</strong> Firebase Hosting serves static and dynamic content from a global CDN, ensuring low-latency and secure access to your website.</li>
              <li><strong>Automatic SSL Certificates:</strong> Every Firebase Hosting project is provided with a free SSL certificate for your custom domain, ensuring secure HTTPS access.</li>
              <li><strong>Easy Deployment:</strong> Firebase CLI allows you to easily deploy your website and keep it up-to-date with minimal effort.</li>
              <li><strong>Custom Domains:</strong> Firebase Hosting supports custom domains, allowing you to connect your own domain to your Firebase project.</li>
              <li><strong>Serverless Functions Integration:</strong> Firebase Hosting can work seamlessly with Firebase Cloud Functions to deliver dynamic content on the same domain as static assets.</li>
            </ul>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Common Risks in Firebase Hosting */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>Common Risks in Firebase Hosting</h3>
          </CCardHeader>
          <CCardBody>
            <p style={{ color: '#dcdcdc' }}>
              Despite its ease of use, Firebase Hosting still comes with common risks related to security, performance, and configuration that developers should address to ensure optimal functioning.
            </p>

            {/* 1. HTTPS Enforcement Check */}
            <p><strong>1. HTTPS Enforcement Check:</strong> Ensuring that HTTPS is enabled for your site is essential for secure data transmission, protecting user data from being intercepted.</p>
            <ul style={{ color: '#dcdcdc' }}>
              <li><strong>Tip:</strong> Firebase Hosting enforces HTTPS by default for all domains. However, make sure to check that HTTPS is correctly enabled for any custom domains and that redirects from HTTP to HTTPS are working properly.</li>
            </ul>

            {/* 2. Security Headers */}
            <p><strong>2. Security Headers:</strong> Missing or incorrectly configured HTTP security headers can expose your site to attacks such as clickjacking, XSS, or CSRF.</p>
            <ul style={{ color: '#dcdcdc' }}>
              <li><strong>Tip:</strong> Add security headers like Content-Security-Policy (CSP), X-Content-Type-Options, X-Frame-Options, and X-XSS-Protection in your Firebase Hosting configuration to improve security.</li>
            </ul>

            {/* 3. Caching Headers */}
            <p><strong>3. Caching Headers:</strong> Incorrect caching configurations can lead to stale or outdated content being served to users, causing performance issues or incorrect display of data.</p>
            <ul style={{ color: '#dcdcdc' }}>
              <li><strong>Tip:</strong> Set proper caching headers for static files to leverage the CDN effectively. Use Firebase Hosting's configuration to set cache expiration times for different file types (e.g., images, scripts, stylesheets).</li>
            </ul>

            {/* 4. Performance */}
            <p><strong>4. Performance:</strong> Slow website performance can result in higher bounce rates and poor user experience.</p>
            <ul style={{ color: '#dcdcdc' }}>
              <li><strong>Tip:</strong> Optimize images, minimize JavaScript and CSS files, and use the Firebase CDN to deliver content quickly from servers closer to the user. Firebase Hosting automatically optimizes performance, but manual optimization can further improve speed.</li>
            </ul>

            {/* 5. Redirects */}
            <p><strong>5. Redirects:</strong> Incorrect redirects or infinite redirect loops can prevent users from accessing your website properly and negatively impact SEO.</p>
            <ul style={{ color: '#dcdcdc' }}>
              <li><strong>Tip:</strong> Configure redirects correctly in Firebase Hosting’s `firebase.json` file to ensure users and search engines are directed to the correct URLs without causing loops.</li>
            </ul>

            {/* 6. HTTP Security Headers */}
            <p><strong>6. HTTP Security Headers:</strong> Missing HTTP security headers can expose your site to various vulnerabilities, including man-in-the-middle attacks or data tampering.</p>
            <ul style={{ color: '#dcdcdc' }}>
              <li><strong>Tip:</strong> Ensure that headers like Strict-Transport-Security (HSTS) and Referrer-Policy are set to secure your site against attacks. You can add these headers in Firebase Hosting configuration.</li>
            </ul>

            {/* 7. Rate Limiting */}
            <p><strong>7. Rate Limiting:</strong> Without proper rate limiting, your site could be vulnerable to DDoS attacks or abuse, where excessive requests overwhelm the server.</p>
            <ul style={{ color: '#dcdcdc' }}>
              <li><strong>Tip:</strong> Use Firebase Functions in conjunction with Firebase Hosting to implement rate limiting or throttle API calls to prevent abuse. Additionally, use Firebase's built-in protections to mitigate common attack vectors.</li>
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
              Firebase Hosting is a powerful tool for hosting modern web applications with fast content delivery, easy deployment, and integrated security features. However, to fully benefit from its capabilities and ensure a secure and optimized site, developers must mitigate risks such as improper HTTPS enforcement, misconfigured security headers, slow performance, and improper caching strategies. By following the best practices outlined in this post, you can maximize Firebase Hosting’s potential while minimizing vulnerabilities.
            </p>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default FirebaseHostingOverview;
