import React from 'react'
import {
  CBreadcrumb,
  CBreadcrumbItem,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CLink,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import { useState } from 'react'

const Breadcrumbs = () => {
  const [activeTab, setActiveTab] = useState('GoogleSQL')

  return (
    <CRow>
      <CCol xs="12" md="10" className="mx-auto">
     

        {/* Page Header */}
        <CCard>
          <CCardHeader style={{ backgroundColor: '#2d2d2d', color: '#f8f8f2' }}>
            <h2>SQL Best Practices</h2>
          </CCardHeader>
          <CCardBody>
            <p>
              Writing efficient and maintainable SQL code is essential for achieving optimal database performance and ensuring long-term scalability. Proper use of SQL best practices can help reduce query execution time, minimize resource consumption, and improve data security. This guide provides essential tips and techniques to construct SQL statements that adhere to best practices, enhancing the performance and reliability of your database operations.
            </p>
            <p>
              The example SQL statements shown in this page use the following sample schema:
            </p>

            {/* Tab Navigation */}
            <CNav variant="tabs" role="tablist">
              <CNavItem>
                <CNavLink
                  active={activeTab === 'GoogleSQL'}
                  onClick={() => setActiveTab('GoogleSQL')}
                >
                  GoogleSQL
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 'PostgreSQL'}
                  onClick={() => setActiveTab('PostgreSQL')}
                >
                  PostgreSQL
                </CNavLink>
              </CNavItem>
            </CNav>

            {/* Tab Content */}
            <CTabContent>
              <CTabPane visible={activeTab === 'GoogleSQL'}>
                <pre style={{ backgroundColor: '#2d2d2d', padding: '1rem', color: '#f8f8f2' }}>
                  <code>
                    CREATE TABLE Singers (
                      {'\n'}  SingerId INT64 NOT NULL,
                      {'\n'}  FirstName STRING(1024),
                      {'\n'}  LastName STRING(1024),
                      {'\n'}  SingerInfo BYTES(MAX),
                      {'\n'}  BirthDate DATE
                      {'\n'});
                    {'\n\n'}
                    CREATE TABLE Albums (
                      {'\n'}  AlbumId INT64 NOT NULL,
                      {'\n'}  AlbumTitle STRING(1024),
                      {'\n'}  ReleaseDate DATE,
                      {'\n'}  SingerId INT64 NOT NULL
                      {'\n'});
                    {'\n\n'}
                    CREATE INDEX Idx_AlbumRelease ON Albums(ReleaseDate);
                  </code>
                </pre>
              </CTabPane>
              <CTabPane visible={activeTab === 'PostgreSQL'}>
                <pre style={{ backgroundColor: '#2d2d2d', padding: '1rem', color: '#f8f8f2' }}>
                  <code>
                    CREATE TABLE Singers (
                      {'\n'}  SingerId SERIAL PRIMARY KEY,
                      {'\n'}  FirstName VARCHAR(1024),
                      {'\n'}  LastName VARCHAR(1024),
                      {'\n'}  SingerInfo BYTEA,
                      {'\n'}  BirthDate DATE
                      {'\n'});
                    {'\n\n'}
                    CREATE TABLE Albums (
                      {'\n'}  AlbumId SERIAL PRIMARY KEY,
                      {'\n'}  AlbumTitle VARCHAR(1024),
                      {'\n'}  ReleaseDate DATE,
                      {'\n'}  SingerId INTEGER REFERENCES Singers(SingerId)
                      {'\n'});
                    {'\n\n'}
                    CREATE INDEX Idx_AlbumRelease ON Albums(ReleaseDate);
                  </code>
                </pre>
              </CTabPane>
            </CTabContent>

            {/* Best Practices Sections */}
            <h3 className="mt-4" style={{ color: '#f8f8f2' }}>Use Query Parameters</h3>
            <p style={{ color: '#dcdcdc' }}>
              Query parameters allow you to write queries that are more efficient and avoid SQL injection risks. Use placeholders for parameter values, which are filled in when the query is executed.
              <br />
              <code style={{ backgroundColor: '#2d2d2d', padding: '0.2rem', display: 'block', marginTop: '0.5rem' }}>
                SELECT * FROM Albums WHERE ReleaseDate = @release_date;
              </code>
            </p>

            <h3 className="mt-4" style={{ color: '#f8f8f2' }}>Understand How Spanner Executes Queries</h3>
            <p style={{ color: '#dcdcdc' }}>
              It's essential to understand how Spanner interprets SQL queries to optimize your code. Spanner’s query execution plans provide insight into the efficiency of your query.
              <br />
              Use the `EXPLAIN` command to view the query execution plan and optimize accordingly.
            </p>

            <h3 className="mt-4" style={{ color: '#f8f8f2' }}>Use Secondary Indexes</h3>
            <p style={{ color: '#dcdcdc' }}>
              Adding secondary indexes to frequently searched columns can speed up data retrieval, reducing execution time. Ensure to analyze the impact of indexes on write operations.
              <br />
              <code style={{ backgroundColor: '#2d2d2d', padding: '0.2rem', display: 'block', marginTop: '0.5rem' }}>
                CREATE INDEX AlbumsByTitle ON Albums(AlbumTitle);
              </code>
            </p>

            <h3 className="mt-4" style={{ color: '#f8f8f2' }}>Optimize Scans</h3>
            <p style={{ color: '#dcdcdc' }}>
              Efficient use of scans, especially when handling large datasets, is essential to prevent performance degradation. Use range keys and indexes to optimize scan queries.
              <br />
              <code style={{ backgroundColor: '#2d2d2d', padding: '0.2rem', display: 'block', marginTop: '0.5rem' }}>
                SELECT * FROM Albums WHERE AlbumTitle LIKE 'A%';
              </code>
            </p>

            <h3 className="mt-4" style={{ color: '#f8f8f2' }}>Optimize Range Key Lookups</h3>
            <p style={{ color: '#dcdcdc' }}>
              Range key lookups allow SQL queries to filter data using ranges. When optimized, range key lookups can enhance the performance of scan-heavy queries.
              <br />
              <code style={{ backgroundColor: '#2d2d2d', padding: '0.2rem', display: 'block', marginTop: '0.5rem' }}>
                SELECT * FROM Albums WHERE ReleaseDate BETWEEN '2020-01-01' AND '2021-01-01';
              </code>
            </p>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Breadcrumbs
