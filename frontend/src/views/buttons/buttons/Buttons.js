import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react'

const Buttons = () => {
  const [jsonExample] = useState({
    name: "John Doe",
    age: 30,
    city: "New York",
  })

  const jsonString = JSON.stringify(jsonExample, null, 2)

  return (
    <CRow className="mx-auto" style={{ maxWidth: '800px' }}>
      {/* Page Header */}
      <CCol xs="12">
        <CCard className="mb-4">
          <CCardHeader style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
            <h2>Working with JSON</h2>
          </CCardHeader>
          <CCardBody>
            <p style={{ color: '#dcdcdc' }}>
              JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write, and easy for machines to parse and generate. It is based on a subset of JavaScript, but it is a language-independent format supported by many programming environments.
            </p>
            <p style={{ color: '#dcdcdc' }}>
              JSON is primarily used to transmit data between a server and web application as text. Its simplicity and readability have made it one of the most widely used formats for data interchange in modern web applications.
            </p>
          </CCardBody>
        </CCard>
      </CCol>

      {/* JSON Syntax Section */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>What is JSON?</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              JSON is a format for structuring data. It is lightweight, easy to read and write, and language-independent, which makes it an ideal format for transmitting data in web applications.
            </p>
            <p>Here’s an example of a JSON object:</p>
            <pre style={{ backgroundColor: '#333', padding: '1rem', color: '#f8f8f2' }}>
              <code>
                {jsonString}
              </code>
            </pre>
          </CCardBody>
        </CCard>
      </CCol>

      {/* JSON Syntax and Data Types Section */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>JSON Syntax and Data Types</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              JSON data is written as key-value pairs within curly braces. Keys must be strings, and values can be a variety of types:
            </p>
            <ul>
              <li>Strings</li>
              <li>Numbers</li>
              <li>Booleans (true/false)</li>
              <li>Arrays</li>
              <li>Objects</li>
              <li>Null</li>
            </ul>
            <p>Example JSON structure with different data types:</p>
            <pre style={{ backgroundColor: '#333', padding: '1rem', color: '#f8f8f2' }}>
              <code>
                {`{
  "name": "Alice",
  "age": 25,
  "isStudent": false,
  "subjects": ["Math", "Science"],
  "address": { "city": "New York", "zipcode": "10001" },
  "graduationYear": null
}`}
              </code>
            </pre>
          </CCardBody>
        </CCard>
      </CCol>

      {/* JSON Parsing Section */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>Parsing JSON in JavaScript</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              JSON data received from an API or other source is often in string format. To work with this data in JavaScript, you can parse it into a JavaScript object.
            </p>
            <p>Use <code>JSON.parse()</code> to convert a JSON string into a JavaScript object:</p>
            <pre style={{ backgroundColor: '#333', padding: '1rem', color: '#f8f8f2' }}>
              <code>
                {`const jsonData = '{"name": "John Doe", "age": 30, "city": "New York"}';\nconst obj = JSON.parse(jsonData);\nconsole.log(obj.name); // Output: John Doe`}
              </code>
            </pre>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Stringifying JSON Section */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>Converting JavaScript Objects to JSON</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              To send data in JSON format or store it, you may need to convert a JavaScript object to a JSON string.
            </p>
            <p>Use <code>JSON.stringify()</code> to convert a JavaScript object into a JSON string:</p>
            <pre style={{ backgroundColor: '#333', padding: '1rem', color: '#f8f8f2' }}>
              <code>
                {`const obj = { name: "John Doe", age: 30, city: "New York" };\nconst jsonString = JSON.stringify(obj);\nconsole.log(jsonString); // Output: {"name":"John Doe","age":30,"city":"New York"}`}
              </code>
            </pre>
          </CCardBody>
        </CCard>
      </CCol>

      {/* JSON in Web APIs Section */}
      <CCol xs="12">
        <CCard className="mb-4" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
          <CCardHeader>
            <h3>JSON in Web APIs</h3>
          </CCardHeader>
          <CCardBody>
            <p>
              JSON is extensively used in web APIs. Many APIs return data in JSON format, making it easy for frontend applications to consume and display the data. For example, a GET request to a user API might return JSON data like this:
            </p>
            <pre style={{ backgroundColor: '#333', padding: '1rem', color: '#f8f8f2' }}>
              <code>
                {`{
  "id": 1,
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "isActive": true
}`}
              </code>
            </pre>
            <p>JavaScript code can then parse this JSON and use the data directly in the application.</p>
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
              JSON is a versatile and commonly-used data format in web development. It enables seamless data exchange between clients and servers, facilitating the communication needed for dynamic web applications. By understanding how to parse and stringify JSON, as well as how JSON is utilized in web APIs, developers can effectively work with structured data in JavaScript.
            </p>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Buttons
