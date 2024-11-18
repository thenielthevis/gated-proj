import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
} from '@coreui/react'

const Accordion = () => {
  return (
    <CRow>
      <CCol xs="12" md="8" className="mx-auto">
        <CCard>
          <CCardHeader>
            <h2>What is SQL?</h2>
          </CCardHeader>
          <CCardBody>
            <p>
              Structured query language (SQL) is a programming language for storing and processing
              information in a relational database. A relational database stores information in
              tabular form, with rows and columns representing different data attributes and the
              various relationships between the data values. You can use SQL statements to store,
              update, remove, search, and retrieve information from the database. You can also use
              SQL to maintain and optimize database performance.
            </p>
            <CAccordion>
              <CAccordionItem itemKey="1">
                <CAccordionHeader>Why is SQL important?</CAccordionHeader>
                <CAccordionBody>
                  Structured query language (SQL) is a popular query language that is frequently
                  used in all types of applications. Data analysts and developers learn and use SQL
                  because it integrates well with different programming languages. For example, they
                  can embed SQL queries with the Java programming language to build high-performing
                  data processing applications with major SQL database systems such as Oracle or MS
                  SQL Server. SQL is also fairly easy to learn as it uses common English keywords in
                  its statements.
                </CAccordionBody>
              </CAccordionItem>

              <CAccordionItem itemKey="2">
                <CAccordionHeader>What are the components of an SQL system?</CAccordionHeader>
                <CAccordionBody>
                  SQL systems consist of multiple components such as the SQL Server, SQL Database
                  Engine, SQL Agent, and more. These components work together to help store, manage,
                  and retrieve data effectively, ensuring high availability and robust performance.
                </CAccordionBody>
              </CAccordionItem>

              <CAccordionItem itemKey="3">
                <CAccordionHeader>How does SQL work?</CAccordionHeader>
                <CAccordionBody>
                  SQL works by processing data through a series of commands and queries. You can use
                  SELECT statements to retrieve data, INSERT statements to add data, and UPDATE
                  statements to modify data. SQL engines interpret these commands and carry out the
                  necessary actions on the database.
                </CAccordionBody>
              </CAccordionItem>

              <CAccordionItem itemKey="4">
                <CAccordionHeader>What are SQL commands?</CAccordionHeader>
                <CAccordionBody>
                  SQL commands are categorized into DDL (Data Definition Language), DML (Data
                  Manipulation Language), DCL (Data Control Language), and TCL (Transaction Control
                  Language). DDL commands include CREATE, ALTER, and DROP; DML commands include
                  SELECT, INSERT, UPDATE, and DELETE.
                </CAccordionBody>
              </CAccordionItem>

              <CAccordionItem itemKey="5">
                <CAccordionHeader>What are SQL standards?</CAccordionHeader>
                <CAccordionBody>
                  SQL has been standardized by the American National Standards Institute (ANSI) and
                  the International Organization for Standardization (ISO). The standards define the
                  syntax and structure that SQL language should follow, ensuring compatibility
                  across different SQL database systems.
                </CAccordionBody>
              </CAccordionItem>

              <CAccordionItem itemKey="6">
                <CAccordionHeader>What is SQL injection?</CAccordionHeader>
                <CAccordionBody>
                  SQL injection is a security vulnerability that allows attackers to interfere with
                  SQL queries. By inserting malicious SQL code into the query, attackers can
                  retrieve, modify, or delete sensitive data from the database. Properly validating
                  user input and using parameterized queries can prevent SQL injection attacks.
                </CAccordionBody>
              </CAccordionItem>

              <CAccordionItem itemKey="7">
                <CAccordionHeader>What is MySQL?</CAccordionHeader>
                <CAccordionBody>
                  MySQL is an open-source relational database management system that is widely used
                  for web applications and data storage. It supports SQL and provides robust data
                  storage capabilities, allowing developers to store and retrieve data efficiently.
                </CAccordionBody>
              </CAccordionItem>

              <CAccordionItem itemKey="8">
                <CAccordionHeader>What is NoSQL?</CAccordionHeader>
                <CAccordionBody>
                  NoSQL refers to non-relational database systems designed to handle large volumes
                  of unstructured data. Unlike SQL databases, NoSQL systems use flexible data models
                  like document, key-value, and graph storage, making them suitable for large-scale
                  applications.
                </CAccordionBody>
              </CAccordionItem>

              <CAccordionItem itemKey="9">
                <CAccordionHeader>What is an SQL server?</CAccordionHeader>
                <CAccordionBody>
                  An SQL Server is a database management system that supports SQL for managing and
                  retrieving data. It serves as a central repository where data is stored, managed,
                  and processed. Microsoft SQL Server is one of the most popular SQL server
                  products.
                </CAccordionBody>
              </CAccordionItem>

              <CAccordionItem itemKey="10">
                <CAccordionHeader>How does AWS support SQL?</CAccordionHeader>
                <CAccordionBody>
                  AWS offers managed SQL database services such as Amazon RDS, Amazon Aurora, and
                  Amazon Redshift. These services simplify database management, scaling, and
                  performance optimization while integrating with SQL-based tools and applications.
                </CAccordionBody>
              </CAccordionItem>
            </CAccordion>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Accordion
