import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react'

const ButtonGroups = () => {
  return (
    <CRow className="mx-auto" style={{ maxWidth: '800px' }}>
      {/* Page Header */}
      <CCol xs="12">
        <CCard className="mb-4">
          <CCardHeader style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
            <h2>Good Practices for Working with JSON</h2>
          </CCardHeader>
          <CCardBody>
            <p style={{ color: '#dcdcdc' }}>
              JSON (JavaScript Object Notation) has become the go-to format for data interchange on the web, especially in APIs. However, to ensure smooth and consistent data handling, it's important to follow certain best practices when using JSON. This guide covers essential practices for structuring, publishing, and consuming JSON data effectively.
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* JSON Structure and Consistency */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>Structure and Consistency</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              Maintaining a consistent JSON structure is critical for interoperability and ease of use. Use standardized key names, data types, and structures across different API endpoints.
            </p>
            <p>Example of a structured JSON response:</p>
            <pre style={{ backgroundColor: '#333', padding: '1rem', color: '#f8f8f2' }}>
              <code>
                {`{
  "user": {
    "id": 123,
    "name": "Jane Doe",
    "email": "jane.doe@example.com"
  },
  "settings": {
    "theme": "dark",
    "notifications": true
  }
}`}
              </code>
            </pre>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Data Extensibility */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>Design for Extensibility</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              Design your JSON structure in a way that allows for future extension. Consider using nested structures or versioning to add new fields without breaking existing clients.
            </p>
            <p>Example of extensible JSON:</p>
            <pre style={{ backgroundColor: '#333', padding: '1rem', color: '#f8f8f2' }}>
              <code>
                {`{
  "user": {
    "id": 123,
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "metadata": {
      "signup_date": "2022-01-01",
      "referrer": "Google"
    }
  }
}`}
              </code>
            </pre>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Versioning of JSON APIs */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>API Versioning</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              To handle changes over time, include versioning in your JSON API. This can be achieved by specifying the version in the URL or within the JSON payload.
            </p>
            <p>Example of versioning in JSON:</p>
            <pre style={{ backgroundColor: '#333', padding: '1rem', color: '#f8f8f2' }}>
              <code>
                {`{
  "version": "1.0",
  "data": {
    "user": {
      "id": 123,
      "name": "Jane Doe"
    }
  }
}`}
              </code>
            </pre>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Consuming JSON */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>Consuming JSON</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              When consuming JSON data, handle potential inconsistencies by validating the structure and data types. Use libraries or built-in language features to parse JSON safely.
            </p>
            <p>Example of parsing JSON in JavaScript:</p>
            <pre style={{ backgroundColor: '#333', padding: '1rem', color: '#f8f8f2' }}>
              <code>
                {`try {
  const jsonData = JSON.parse('{"name": "John Doe"}');
  console.log(jsonData.name); // Output: John Doe
} catch (error) {
  console.error("Invalid JSON data", error);
}`}
              </code>
            </pre>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Serialization of Large Collections */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>Serializing Large Collections</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              For large datasets, paginate or batch your JSON responses to avoid overwhelming the client and server. This practice improves performance and reduces bandwidth usage.
            </p>
            <p>Example of a paginated JSON response:</p>
            <pre style={{ backgroundColor: '#333', padding: '1rem', color: '#f8f8f2' }}>
              <code>
                {`{
  "page": 1,
  "per_page": 10,
  "total": 100,
  "data": [
    { "id": 1, "name": "Alice" },
    { "id": 2, "name": "Bob" }
  ]
}`}
              </code>
            </pre>
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
              JSON is a powerful tool for data representation in modern web applications, and following best practices ensures efficiency, extensibility, and interoperability. Design with consistency, plan for future extensions, and handle data with care when consuming JSON. With these practices, you can build APIs that are easy to use and maintain.
            </p>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ButtonGroups
