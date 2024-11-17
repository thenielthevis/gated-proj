import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell
} from '@coreui/react';
import { jsPDF } from 'jspdf';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import html2canvas from 'html2canvas';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const UserDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Get the token from localStorage

    // Fetch analytics data for the logged-in user
    fetch('http://localhost:8000/dashboard/user/analytics', {
      headers: {
        Authorization: `Bearer ${token}`, // Send token for user authentication
      },
    })
      .then((response) => response.json())
      .then((data) => setAnalyticsData(data))
      .catch((error) => console.error('Error fetching analytics data:', error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // If no data is available, default to zero values
  const totalScans = analyticsData.length > 0
    ? analyticsData.reduce((total, item) => total + (item.findings_count || 0), 0)
    : 0;

  const mostScannedService = analyticsData.length > 0
    ? analyticsData.reduce(
        (max, item) => (item.findings_count > max.findings_count ? item : max),
        { service: '', findings_count: 0 }
      ).service
    : 'None';

  const mostFindingsResult = analyticsData.length > 0
    ? analyticsData.reduce(
        (acc, item) => {
          acc.good += item.good || 0;
          acc.warning += item.warning || 0;
          acc.danger += item.danger || 0;
          return acc;
        },
        { good: 0, warning: 0, danger: 0 }
      )
    : { good: 0, warning: 0, danger: 0 };

  // Prepare data for the pie chart
  const pieChartData = {
    labels: ['Good', 'Warning', 'Danger'],
    datasets: [
      {
        data: [mostFindingsResult.good, mostFindingsResult.warning, mostFindingsResult.danger],
        backgroundColor: ['#36A2EB', '#FFCD56', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FFCD56', '#FF6384'],
      },
    ],
  };

  // Prepare data for the line chart
  const lineChartData = {
    labels: analyticsData.length > 0 ? analyticsData.map((item) => new Date(item.timestamp).toLocaleDateString()) : ['No Data'],
    datasets: [
      {
        label: 'Findings Count Over Time',
        data: analyticsData.length > 0 ? analyticsData.map((item) => item.findings_count) : [0],
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
    ],
  };

  // Prepare data for the stacked bar chart
  const stackedBarChartData = {
    labels: analyticsData.length > 0 ? analyticsData.map((item) => item.service) : ['No Data'],
    datasets: [
      {
        label: 'Good Findings',
        data: analyticsData.length > 0 ? analyticsData.map((item) => item.good || 0) : [0],
        backgroundColor: '#36A2EB',
      },
      {
        label: 'Warning Findings',
        data: analyticsData.length > 0 ? analyticsData.map((item) => item.warning || 0) : [0],
        backgroundColor: '#FFCD56',
      },
      {
        label: 'Danger Findings',
        data: analyticsData.length > 0 ? analyticsData.map((item) => item.danger || 0) : [0],
        backgroundColor: '#FF6384',
      },
    ],
  };

    const exportPDF = () => {
      const input = document.getElementById('analytics-table');
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('Analytics_Details.pdf');
      });
    };

  return (
    <>
      <CRow className="mb-4 justify-content-center">
        {/* Summary Cards */}
        <CCol sm={3} md={3} className="mb-3">
          <CCard className="h-100">
            <CCardHeader>Total Scans</CCardHeader>
            <CCardBody>
              <h3>{totalScans}</h3>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={3} md={3} className="mb-3">
          <CCard className="h-100">
            <CCardHeader>Most Scanned Service</CCardHeader>
            <CCardBody>
              <h3>{mostScannedService}</h3>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={3} md={3} className="mb-3">
          <CCard className="h-100">
            <CCardHeader>Most Result Findings</CCardHeader>
            <CCardBody>
              <h5>Good: {mostFindingsResult.good}</h5>
              <h5>Warning: {mostFindingsResult.warning}</h5>
              <h5>Danger: {mostFindingsResult.danger}</h5>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Pie Chart and Line Chart in a Single Row */}
      <CRow className="mb-4">
        {/* Pie Chart */}
        <CCol sm={6} md={6}>
          <CCard className="mb-4 h-100">
            <CCardHeader>Findings Distribution</CCardHeader>
            <CCardBody
              className="d-flex align-items-center justify-content-center"
              style={{ width: '100%', height: '400px' }}
            >
              <Pie data={pieChartData} options={{ responsive: true }} />
            </CCardBody>
          </CCard>
        </CCol>

        {/* Line Chart */}
        <CCol sm={6} md={6}>
          <CCard className="mb-4 h-100">
            <CCardHeader>Findings Over Time</CCardHeader>
            <CCardBody
              className="d-flex align-items-center justify-content-center"
              style={{ width: '100%', height: '400px' }}
            >
              <Line data={lineChartData} options={{ responsive: true }} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Stacked Bar Chart */}
      <CRow style={{ marginBottom: '20px' }}>
        <CCol sm={12}>
          <CCard>
            <CCardHeader>Findings Breakdown by Service</CCardHeader>
            <CCardBody
              className="d-flex align-items-center justify-content-center"
              style={{ width: '100%', height: '500px' }}
            >
              <Bar data={stackedBarChartData} options={{ responsive: true, stacked: true }} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Analytics Table with Export PDF Button */}
      <CCard className="mb-4">
        <CCardHeader>
          Analytics Details
          <CButton color="primary" className="float-end" onClick={exportPDF}>
            Export PDF
          </CButton>
        </CCardHeader>
        <CCardBody id="analytics-table">
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Service</CTableHeaderCell>
                <CTableHeaderCell>Scan Count</CTableHeaderCell>
                <CTableHeaderCell>Latest Timestamp</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {analyticsData.length > 0 ? analyticsData.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{item.service}</CTableDataCell>
                  <CTableDataCell>{item.findings_count}</CTableDataCell>
                  <CTableDataCell>{new Date(item.timestamp).toLocaleString()}</CTableDataCell>
                </CTableRow>
              )) : (
                <CTableRow>
                  <CTableDataCell colSpan={3}>No data available</CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </>
  );
};

export default UserDashboard;
