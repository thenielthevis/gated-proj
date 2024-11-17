import React from 'react'

import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilFile,
  cilFingerprint,
  cilFire,
  cilLayers,
  cilNotes,
  cilPencil,
  cilPlant,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilAccountLogout,
  cilUser
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
// Function to handle logout action
const handleLogout = () => {
  localStorage.removeItem('token') // Clear the token from local storage
  window.location.href = '/login'  // Redirect to the login page
}

const _nav = [
  ...(localStorage.getItem('role') === 'admin'
    ? [
        {
          component: CNavItem,
          name: 'Dashboard',
          to: '/dashboard',
          icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
          badge: {
            color: 'info',
            text: 'NEW',
          },
        },
      ]
    : []), // If the user is not an admin, this section will not be included in the navigation menu
  {
    component: CNavTitle,
    name: 'Tools',
  },
  {
    component: CNavItem,
    name: 'MongoDB',
    to: '/tools/MongoDB',
    icon: <CIcon icon={cilPlant} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'SQL Script',
    to: '/tools/SQLScript',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'JSON Script',
    to: '/tools/JSONScript', // Change path
    icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Firebase',
    to: '/Firebase',
    icon: <CIcon icon={cilFire} customClassName="nav-icon" />,
    items: [
    {
      component: CNavItem,
      name: 'Firestore',
      to: '/tools/Firestore', // Change path
      icon: <CIcon icon={cilFire} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Hosting',
      to: '/tools/Hosting', // Change path
      icon: <CIcon icon={cilFire} customClassName="nav-icon" />,
    },
  ]},
  {
    component: CNavTitle,
    name: 'Analytics',
  },
  {
    component: CNavItem,
    name: 'Charts',
    to: '/charts', 
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Report',
    to: '/', // Change path
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },
  ...(localStorage.getItem('role') === 'user'
  ? [
      {
        component: CNavTitle,
        name: 'Educational Materials',
      },
      {
        component: CNavGroup,
        name: 'SQL',
        to: '/base',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'About SQL',
            to: '/base/accordion',
          },
          {
            component: CNavItem,
            name: 'Good Practices',
            to: '/base/breadcrumbs',
          },
          {
            component: CNavItem,
            name: 'Mistakes to Avoid',
            to: '/base/cards',
          },
        ],
      },
      {
        component: CNavGroup,
        name: 'JSON',
        to: '/buttons',
        icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'About JSON',
            to: '/buttons/buttons',
          },
          {
            component: CNavItem,
            name: 'Good Practices',
            to: '/buttons/button-groups',
          },
          {
            component: CNavItem,
            name: 'Mistakes to Avoid',
            to: '/buttons/dropdowns',
          },
        ],
      },
      {
        component: CNavGroup,
        name: 'MongoDB',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'What is NoSQL?',
            to: '/forms/form-control',
          },
          {
            component: CNavItem,
            name: 'Common Risks',
            to: '/forms/select',
          },
          {
            component: CNavItem,
            name: 'Good Practices',
            to: '/forms/checks-radios',
          },
        ],
      },
  {
    component: CNavGroup,
    name: 'Firebase',
    icon: <CIcon icon={cilFire} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Firestore',
        to: '/icons/coreui-icons',
        // badge: {
        //   color: 'success',
        //   text: 'NEW',
        // },
      },
      {
        component: CNavItem,
        name: 'Hosting',
        to: '/icons/flags',
      },
      {
        component: CNavItem,
        name: 'Benefits and Challenges',
        to: '/icons/brands',
      },
    ],
  },
  ]
  : []),
  {
    component: CNavTitle,
    name: 'Profile',
  },
  {
    component: CNavGroup,
    name: 'Account',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Logout',
        icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
        to: '#',
        onClick: handleLogout,
      },
      // {
      //   component: CNavItem,
      //   name: 'Badges',
      //   to: '/notifications/badges',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Modal',
      //   to: '/notifications/modals',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Toasts',
      //   to: '/notifications/toasts',
      // },
    ],
  },
  // {
  //   component: CNavItem,
  //   name: 'Widgets',
  //   to: '/widgets',
  //   icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },
  // // {
  // //   component: CNavTitle,
  // //   name: 'Extras',
  // // },
  // // {
  // //   component: CNavGroup,
  // //   name: 'Pages',
  // //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  // //   items: [
  // //     {
  // //       component: CNavItem,
  // //       name: 'Login',
  // //       to: '/login',
  // //     },
  // //     {
  // //       component: CNavItem,
  // //       name: 'Register',
  // //       to: '/register',
  // //     },
  // //     {
  // //       component: CNavItem,
  // //       name: 'Error 404',
  // //       to: '/404',
  // //     },
  // //     {
  // //       component: CNavItem,
  // //       name: 'Error 500',
  // //       to: '/500',
  // //     },
  // //   ],
  // // },
  // {
  //   component: CNavItem,
  //   name: 'Docs',
  //   href: 'https://coreui.io/react/docs/templates/installation/',
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  // },
]

export default _nav
