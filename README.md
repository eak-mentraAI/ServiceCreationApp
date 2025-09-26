# Service Creation App - Enrollment UI POC

A React-based proof of concept for service catalog management and enrollment workflow automation at Rackspace.

## Overview

This application demonstrates an end-to-end service management flow where administrators can define services, submit them for approval, and track enrollments with automatic billing and ticketing integration.

## Features

### Service Definition
- **Product Catalog Details**: Service name, category, tags, and descriptions
- **Billing Configuration**: Unit of measure, cost, and billing codes
- **Service Limits**: Max enrollments and minimum device requirements
- **Device Eligibility**: Filter by device type and operating system
- **Ticket Workflow**: Queue routing and customizable ticket templates with dynamic variables

### Approval Workflow
- Submit services for approval
- View LDAP-based approver groups
- Track pending approval status
- Contact approvers directly via email

### Service Management
- View approved add-ons with enrollment counts
- Export enrollment data (CSV/JSON)
- Track service expiration dates
- Monitor billing and tag associations

### Dynamic Features
- **Device Type Filtering**: VMs, Hosts, Networking, Storage, Containers
- **OS-Specific Eligibility**: Dynamic OS options based on device type
- **Template Variables**: @customerId, @customerName, @deviceId, @deviceName
- **Real-time Tag Application**: Automatic billing and ticket generation

## Installation

```bash
# Clone the repository
git clone https://github.com/eak-mentraAI/ServiceCreationApp.git
cd ServiceCreationApp

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at http://localhost:5173/

## Technology Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **JavaScript** - Programming language

## Project Structure

```
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Tailwind CSS imports
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── postcss.config.js    # PostCSS configuration
```

## Key Components

### Service Definition Form
- Multi-section form with tooltips
- Dynamic field validation
- Conditional OS selection based on device type

### Approval System
- LDAP group integration (mocked)
- Approver contact information
- Status tracking

### Export Functionality
- CSV export for enrollment data
- JSON export with full service details
- Customer and device enrollment tracking

## Integration Points (Production Requirements)

For production deployment, the following systems need to be integrated:

1. **LDAP/Active Directory** - User authentication and approver groups
2. **Billing System (ITS)** - Billing code validation and usage tracking
3. **Ticketing System** - ServiceNow/Remedy integration
4. **CMDB** - Device and asset management
5. **Tag Management** - Automated tag application and removal
6. **Customer Portal** - Service consumption visibility
7. **Workflow Engine** - Approval and enrollment orchestration

## Development Notes

- All data is currently mocked in client-side state
- No backend persistence - refreshing resets all data
- Designed as a proof of concept for stakeholder review

## Future Enhancements

- Backend API integration
- Real-time updates via WebSocket
- Advanced reporting and analytics
- Self-service customer enrollment
- Automated renewal workflows
- Multi-level approval chains

## License

Internal Rackspace project - proprietary