import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
} from '@coreui/react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';

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

const Dashboard = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch analytics data from the backend
    fetch('http://localhost:8000/dashboard/analytics')
      .then((response) => response.json())
      .then((data) => setAnalyticsData(data))
      .catch((error) => console.error('Error fetching analytics data:', error));

    // Fetch total users count from the backend
    fetch('http://localhost:8000/dashboard/users_count')
      .then((response) => response.json())
      .then((data) => setTotalUsers(data))
      .catch((error) => console.error('Error fetching users count:', error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Calculate total scans from findings_count
  const totalScans = analyticsData.reduce((total, item) => total + (item.findings_count || 0), 0);

  // Determine the most scanned service
  const mostScannedService = analyticsData.reduce(
    (max, item) => (item.findings_count > max.findings_count ? item : max),
    { service: '', findings_count: 0 }
  ).service;

  // Aggregate the total good, warning, and danger findings
  const mostFindingsResult = analyticsData.reduce(
    (acc, item) => {
      acc.good += item.good || 0;
      acc.warning += item.warning || 0;
      acc.danger += item.danger || 0;
      return acc;
    },
    { good: 0, warning: 0, danger: 0 }
  );

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
    labels: analyticsData.map(item => new Date(item.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Findings Count Over Time',
        data: analyticsData.map(item => item.findings_count),
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
    ],
  };

  // Prepare data for the stacked bar chart (Good, Warning, Danger findings)
  const stackedBarChartData = {
    labels: analyticsData.map(item => item.service),
    datasets: [
      {
        label: 'Good Findings',
        data: analyticsData.map(item => item.good || 0),
        backgroundColor: '#36A2EB',
      },
      {
        label: 'Warning Findings',
        data: analyticsData.map(item => item.warning || 0),
        backgroundColor: '#FFCD56',
      },
      {
        label: 'Danger Findings',
        data: analyticsData.map(item => item.danger || 0),
        backgroundColor: '#FF6384',
      },
    ],
  };

  // Bar chart for Service Scan Count
  const chartData = {
    labels: analyticsData.map(item => item.service),
    datasets: [
      {
        label: 'Scan Count',
        data: analyticsData.map(item => item.findings_count || 0),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Function to export Analytics Details table as PDF
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
      {/* Top Summary Cards */}
      <CRow className="mb-4">
        <CCol sm={6} md={3} className="mb-4">
          <CCard className="h-100">
            <CCardHeader>Total Users</CCardHeader>
            <CCardBody>
              <h3>{totalUsers}</h3>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6} md={3} className="mb-4">
          <CCard className="h-100">
            <CCardHeader>Total Scans</CCardHeader>
            <CCardBody>
              <h3>{totalScans}</h3>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6} md={3} className="mb-4">
          <CCard className="h-100">
            <CCardHeader>Most Scanned Service</CCardHeader>
            <CCardBody>
              <h3>{mostScannedService}</h3>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6} md={3} className="mb-4">
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

      {/* Pie Chart for Findings Distribution */}
      <CRow className="mb-4">
        <CCol sm={6} md={4}>
          <CCard className="mb-4 h-100">
            <CCardHeader>Findings Distribution</CCardHeader>
            <CCardBody className="d-flex align-items-center justify-content-center">
              <Pie data={pieChartData} options={{ responsive: true }} height={100} />
            </CCardBody>
          </CCard>
        </CCol>

        {/* Line Chart for Findings Count Over Time */}
        <CCol sm={12} md={8}>
          <CCard className="mb-4 h-100">
            <CCardHeader>Findings Over Time</CCardHeader>
            <CCardBody className="d-flex align-items-center justify-content-center">
              <Line data={lineChartData} options={{ responsive: true }} height={100} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Stacked Bar Chart for Good, Warning, Danger Findings */}
      <CRow>
        <CCol sm={12}>
          <CCard className="mb-4">
            <CCardHeader>Findings Breakdown by Service</CCardHeader>
            <CCardBody>
              <Bar data={stackedBarChartData} options={{ responsive: true, stacked: true }} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Service Scan Count Bar Chart */}
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={7}></CCol>
          </CRow>

          <CRow>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>Services Scan Count</CCardHeader>
                <CCardBody>
                  <Bar data={chartData} options={{ responsive: true }} />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

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
              {analyticsData.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{item.service}</CTableDataCell>
                  <CTableDataCell>{item.findings_count}</CTableDataCell>
                  <CTableDataCell>{new Date(item.timestamp).toLocaleString()}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </>
  );
};

export default Dashboard;
