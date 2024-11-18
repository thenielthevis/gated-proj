import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
  CCardTitle,
  CCol,
  CRow,
  CLink,
  CCardFooter,
} from '@coreui/react'

const Cards = () => {
  const mistakes = [
    {
      title: '1. Avoid Using SELECT * in Queries',
      description:
        'Using SELECT * is inefficient as it fetches all columns, even those not needed. This increases memory usage and slows down query performance, especially on large tables.',
      example: `
        -- Bad Practice
        SELECT * FROM Users;
        
        -- Good Practice
        SELECT UserID, UserName FROM Users;
      `,
    },
    {
      title: '2. Not Using Indexes Properly',
      description:
        'Indexes speed up data retrieval but can slow down write operations. Avoid adding indexes to columns rarely queried, and analyze query plans to see where indexes can improve performance.',
      example: `
        -- Creating an Index for Faster Retrieval
        CREATE INDEX idx_user_email ON Users(Email);
        
        -- Query that benefits from the index
        SELECT * FROM Users WHERE Email = 'example@example.com';
      `,
    },
    {
      title: '3. Ignoring Database Normalization',
      description:
        'Skipping normalization can lead to data redundancy and update anomalies. Follow normalization principles to organize data efficiently, reducing redundancy and improving data integrity.',
      example: `
        -- Normalize to avoid redundancy
        CREATE TABLE Orders (
          OrderID INT PRIMARY KEY,
          UserID INT,
          OrderDate DATE
        );

        CREATE TABLE Users (
          UserID INT PRIMARY KEY,
          UserName VARCHAR(50)
        );
      `,
    },
    {
      title: '4. Not Using Query Parameters',
      description:
        'Hardcoding values in queries is risky and can lead to SQL injection vulnerabilities. Use parameterized queries to enhance security and prevent SQL injection.',
      example: `
        -- Vulnerable to SQL Injection
        SELECT * FROM Users WHERE UserName = 'admin';
        
        -- Secure approach with parameterized query
        SELECT * FROM Users WHERE UserName = ?;
      `,
    },
    {
      title: '5. Failing to Optimize Joins',
      description:
        'Joining large tables without proper indexing can lead to significant performance issues. Ensure that foreign keys are indexed and avoid unnecessary joins.',
      example: `
        -- Unoptimized Join
        SELECT * FROM Orders
        JOIN Users ON Orders.UserID = Users.UserID;
        
        -- Optimized Join with indexes
        CREATE INDEX idx_orders_userid ON Orders(UserID);
        SELECT * FROM Orders
        JOIN Users ON Orders.UserID = Users.UserID;
      `,
    },
    {
      title: '6. Using Cursors for Large Data Sets',
      description:
        'Cursors are slow and should be avoided for large data sets. Use set-based operations to handle large data more efficiently.',
      example: `
        -- Avoid cursors
        DECLARE userCursor CURSOR FOR SELECT UserID FROM Users;
        
        -- Use set-based operation instead
        UPDATE Users SET IsActive = 1 WHERE LastLogin < '2021-01-01';
      `,
    },
    {
      title: '7. Not Handling NULL Values Properly',
      description:
        'Ignoring NULL values in queries can lead to unexpected results. Use IS NULL and IS NOT NULL to handle NULLs properly and avoid potential issues.',
      example: `
        -- Incorrect NULL handling
        SELECT * FROM Users WHERE Age > 25;
        
        -- Correct NULL handling
        SELECT * FROM Users WHERE Age > 25 OR Age IS NULL;
      `,
    },
  ]

  return (
    <CRow className="mx-auto" style={{ maxWidth: '800px' }}>
      <CCol xs="12">
        <CCard className="mb-4">
          <CCardHeader style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
            <h2>Avoid these 7 SQL Mistakes for Better Database Management</h2>
          </CCardHeader>
          <CCardBody>
            <CCardText style={{ color: '#dcdcdc' }}>
              SQL errors are common due to SQL's deceptively simple syntax, leading to oversights in query design. Developers often neglect performance optimization for faster initial results, but this can degrade database performance over time. Here’s a guide to avoiding common SQL mistakes.
            </CCardText>
          </CCardBody>
        </CCard>
      </CCol>

      {mistakes.map((mistake, index) => (
        <CCol xs="12" key={index} className="mb-4">
          <CCard className="h-100" style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
            <CCardBody>
              <CCardTitle className="h5">{mistake.title}</CCardTitle>
              <CCardText>{mistake.description}</CCardText>
              <pre style={{ backgroundColor: '#333', padding: '1rem', color: '#f8f8f2', overflowX: 'auto' }}>
                <code>{mistake.example}</code>
              </pre>
            </CCardBody>
          </CCard>
        </CCol>
      ))}

   
    </CRow>
  )
}

export default Cards
