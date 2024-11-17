import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

const Dropdown = () => {
  return (
    <CRow className="mx-auto" style={{ maxWidth: '800px' }}>
      {/* Page Header */}
      <CCol xs="12">
        <CCard className="mb-4">
          <CCardHeader style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
            <h2>Common JSON Mistakes and How to Avoid Them</h2>
          </CCardHeader>
          <CCardBody>
            <p style={{ color: '#dcdcdc' }}>
              JSON (JavaScript Object Notation) is a widely-used, open-standard format for representing structured data. It is human-readable, compact, and ideal for data interchange in web applications. However, it's common to make mistakes when working with JSON, impacting data consistency, readability, and performance. Here are some typical errors and ways to avoid them.
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Mistake Sections */}
      {/* 1. Inconsistent Key Naming Conventions */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>1. Inconsistent Key Naming Conventions</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              JSON keys should follow a consistent naming convention such as <code>camelCase</code>, <code>snake_case</code>, or <code>kebab-case</code>. Mixing naming conventions can lead to confusion and negatively impact readability and maintainability.
            </p>
            <p>Example of consistent naming convention:</p>
            <pre style={{ backgroundColor: '#333', padding: '1rem', color: '#f8f8f2' }}>
              <code>
                {`{
  "userName": "johndoe",
  "userEmail": "john@example.com",
  "userAge": 30
}`}
              </code>
            </pre>
          </CCardBody>
        </CCard>
      </CCol>

      {/* 2. Trailing Commas */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>2. Trailing Commas</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              JSON does not support trailing commas at the end of objects or arrays. Including a trailing comma will cause syntax errors. Ensure no extra commas are present in JSON data.
            </p>
            <p>Example of incorrect and correct syntax:</p>
            <pre style={{ backgroundColor: '#333', padding: '1rem', color: '#f8f8f2' }}>
              <code>
                {`// Incorrect
{
  "name": "John",
  "age": 30,
}

// Correct
{
  "name": "John",
  "age": 30
}`}
              </code>
            </pre>
          </CCardBody>
        </CCard>
      </CCol>

      {/* 3. Misuse of Data Types */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>3. Misuse of Data Types</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              JSON supports specific data types: strings, numbers, objects, arrays, booleans, and null. Using incorrect types, like wrapping numbers in quotes, can lead to errors or unexpected behavior.
            </p>
            <p>Example of correct data type usage:</p>
            <pre style={{ backgroundColor: '#333', padding: '1rem', color: '#f8f8f2' }}>
              <code>
                {`// Incorrect
{
  "age": "30" // age is a number, not a string
}

// Correct
{
  "age": 30
}`}
              </code>
            </pre>
          </CCardBody>
        </CCard>
      </CCol>

      {/* 4. Missing or Extra Quotation Marks */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>4. Missing or Extra Quotation Marks</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              In JSON, keys must be strings enclosed in double quotes. Avoid missing or extra quotes, as they can lead to syntax errors or misinterpretation of data.
            </p>
            <p>Example of correct key formatting:</p>
            <pre style={{ backgroundColor: '#333', padding: '1rem', color: '#f8f8f2' }}>
              <code>
                {`// Incorrect
{
  name: "John", // missing quotes around "name"
  "age": 30
}

// Correct
{
  "name": "John",
  "age": 30
}`}
              </code>
            </pre>
          </CCardBody>
        </CCard>
      </CCol>

      {/* 5. Duplicated Keys */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>5. Duplicated Keys</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              JSON does not support duplicate keys within the same object. Including duplicate keys can cause unexpected behavior as only the last occurrence is retained.
            </p>
            <p>Example showing the effect of duplicated keys:</p>
            <pre style={{ backgroundColor: '#333', padding: '1rem', color: '#f8f8f2' }}>
              <code>
                {`// Incorrect
{
  "name": "John",
  "name": "Jane" // duplicate key, only "Jane" will be retained
}

// Correct
{
  "firstName": "John",
  "lastName": "Doe"
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
              Avoiding common JSON mistakes is crucial for maintaining data consistency and preventing errors. By following best practices such as consistent naming, correct data types, and proper formatting, you can ensure that your JSON data is clean, reliable, and easy to work with across different systems.
            </p>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Dropdown;
