import React, { useState } from "react";
import rackspaceLogo from "./rackspace-logo.png";
import rxtIcon from "./rxt_icon.png";

// Lightweight mock app to demonstrate service definition flow:
// 1) Racker defines a service (name, category, billing, ticket queue, tag, ticket details)
// 2) Service is sent for approval with pending state
// 3) Service definition includes customizable ticket details with dynamic variables
// No backend — purely client-side state to visualize the flow.

export default function App() {
  // --- App State ---
  const [services, setServices] = useState([]);
  const [showApprovers, setShowApprovers] = useState(false);
  const [selectedServiceForApproval, setSelectedServiceForApproval] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [showVariablesGuide, setShowVariablesGuide] = useState(false);
  const [showApprovedAddOns, setShowApprovedAddOns] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showApprovedAddOnsTooltip, setShowApprovedAddOnsTooltip] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [lastSubmittedService, setLastSubmittedService] = useState(null);
  const [showHealthTab, setShowHealthTab] = useState(false);
  const [showFleetDashboard, setShowFleetDashboard] = useState(false);
  const [selectedEnrollmentHealth, setSelectedEnrollmentHealth] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState("all");
  const [customerSearch, setCustomerSearch] = useState("");
  const [fleetServiceFilter, setFleetServiceFilter] = useState("all");

  // Mock logged in user
  const currentUser = {
    name: "Edward Kerr",
    email: "edward.kerr@rackspace.com",
    role: "Service Architect",
    avatar: rxtIcon
  };

  // --- Form state: Define Service ---
  const [svcName, setSvcName] = useState("");
  const [svcCategory, setSvcCategory] = useState("Observability");
  const [svcDescription, setSvcDescription] = useState("");
  const [unit, setUnit] = useState("per device");
  const [unitCost, setUnitCost] = useState("20.00");
  const [billingCode, setBillingCode] = useState("OBS-001");
  const [ticketQueue, setTicketQueue] = useState("Implementation");
  const [tag, setTag] = useState("svc:observability");
  const [ticketDetails, setTicketDetails] = useState("");

  // --- Health Check State ---
  const [healthCheckEnabled, setHealthCheckEnabled] = useState(false);
  const [linuxScript, setLinuxScript] = useState("#!/bin/bash\nset -euo pipefail\n\n# Check service status\nsystemctl is-active myservice\nexit $?");
  const [windowsScript, setWindowsScript] = useState("$ErrorActionPreference = 'Stop'\n\n# Check service status\nGet-Service -Name 'MyService' | Where-Object {$_.Status -eq 'Running'}\nif ($?) { exit 0 } else { exit 1 }");
  const [scheduleFrequency, setScheduleFrequency] = useState("monthly");
  const [customCron, setCustomCron] = useState("");
  const [scheduleTime, setScheduleTime] = useState("02:00");
  const [dayOfMonth, setDayOfMonth] = useState("1");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [timeoutSeconds, setTimeoutSeconds] = useState("300");
  const [successExitCodes, setSuccessExitCodes] = useState("0");
  const [consecutiveFailures, setConsecutiveFailures] = useState("1");
  const [gracePeriodHours, setGracePeriodHours] = useState("0");
  const [suspendBilling, setSuspendBilling] = useState(true);
  const [notifyChannels, setNotifyChannels] = useState(["email"]);
  const [ticketSystem, setTicketSystem] = useState("ServiceNOW");
  const [emailRecipients, setEmailRecipients] = useState("");
  const [teamsChannel, setTeamsChannel] = useState("");
  const [pagerdutyService, setPagerdutyService] = useState("");
  const [additionalRecipients, setAdditionalRecipients] = useState("");
  const [showNavDropdown, setShowNavDropdown] = useState(false);
  const [targetOS, setTargetOS] = useState(["linux", "windows"]);
  const [linuxScriptVersion, setLinuxScriptVersion] = useState(1);
  const [windowsScriptVersion, setWindowsScriptVersion] = useState(1);
  const [scriptApprovedBy, setScriptApprovedBy] = useState("");

  // Service limits
  const [maxEnrollments, setMaxEnrollments] = useState("");
  const [minDevices, setMinDevices] = useState("");

  // Device type filtering
  const [applicableDeviceTypes, setApplicableDeviceTypes] = useState(["All"]);
  const [applicableOS, setApplicableOS] = useState([]);

  // OS options based on device type selection
  const osOptionsByDeviceType = {
    "VMs": ["Windows Server 2019", "Windows Server 2022", "Ubuntu 20.04", "Ubuntu 22.04", "RHEL 8", "RHEL 9", "CentOS", "Debian"],
    "Hosts": ["VMware ESXi 7.0", "VMware ESXi 8.0", "OpenStack", "KVM", "Hyper-V", "Bare Metal"],
    "Networking": ["Cisco IOS", "Juniper Junos", "Arista EOS", "F5 BIG-IP", "Palo Alto PAN-OS"],
    "Storage": ["NetApp ONTAP", "Pure Storage", "Dell EMC", "HPE 3PAR", "IBM Spectrum"],
    "Containers": ["Kubernetes", "Docker", "OpenShift", "Rancher", "EKS", "GKE", "AKS"],
    "All": []
  };

  // Update OS options when device types change
  React.useEffect(() => {
    if (applicableDeviceTypes.includes("All")) {
      setApplicableOS([]);
    } else {
      // Get unique OS options for selected device types
      const availableOS = [...new Set(
        applicableDeviceTypes.flatMap(type => osOptionsByDeviceType[type] || [])
      )];
      // Reset OS selection if current selection not valid for new device types
      setApplicableOS(prev => prev.filter(os => availableOS.includes(os)));
    }
  }, [applicableDeviceTypes]);

  // Mock LDAP group data
  const approverGroup = {
    ldapGroup: "CN=ServiceCatalog-Approvers,OU=Groups,DC=rackspace,DC=com",
    groupName: "Service Catalog Approvers",
    members: [
      { name: "Sarah Chen", email: "sarah.chen@rackspace.com", role: "Service Delivery Manager" },
      { name: "Michael Rodriguez", email: "michael.rodriguez@rackspace.com", role: "Technical Lead" },
      { name: "Jennifer Walsh", email: "jennifer.walsh@rackspace.com", role: "Operations Director" },
      { name: "David Kumar", email: "david.kumar@rackspace.com", role: "Product Manager" },
    ]
  };

  // Mock health check runs data
  const mockHealthCheckRuns = [
    { runId: "run-001", enrollmentId: "enr-001", deviceId: "dev-101", deviceName: "acme-app-01", customerName: "Acme Health", serviceId: "svc-001", os: "linux", startedAt: "2025-02-01T02:00:00Z", finishedAt: "2025-02-01T02:00:15Z", exitCode: 0, status: "PASS", logSnippet: "Service is running normally", billingStatus: "active" },
    { runId: "run-002", enrollmentId: "enr-002", deviceId: "dev-102", deviceName: "acme-db-01", customerName: "Acme Health", serviceId: "svc-001", os: "linux", startedAt: "2025-02-01T02:00:00Z", finishedAt: "2025-02-01T02:05:00Z", exitCode: 1, status: "FAIL", logSnippet: "Service not responding. Exit code 1.", billingStatus: "suspended", failureCount: 1 },
    { runId: "run-003", enrollmentId: "enr-003", deviceId: "dev-201", deviceName: "bluefin-edge-01", customerName: "Bluefin Markets", serviceId: "svc-001", os: "windows", startedAt: "2025-02-01T02:00:00Z", finishedAt: "2025-02-01T02:00:45Z", exitCode: 0, status: "PASS", logSnippet: "All systems operational", billingStatus: "active" },
    { runId: "run-004", enrollmentId: "enr-002", deviceId: "dev-102", deviceName: "acme-db-01", customerName: "Acme Health", serviceId: "svc-001", os: "linux", startedAt: "2025-01-01T02:00:00Z", finishedAt: "2025-01-01T02:00:12Z", exitCode: 0, status: "PASS", logSnippet: "Service health check passed", billingStatus: "active" },
    { runId: "run-005", enrollmentId: "enr-003", deviceId: "dev-201", deviceName: "bluefin-edge-01", customerName: "Bluefin Markets", serviceId: "svc-002", os: "windows", startedAt: "2025-01-15T02:00:00Z", finishedAt: "2025-01-15T02:05:00Z", exitCode: -1, status: "TIMEOUT", logSnippet: "Health check timed out after 300 seconds", billingStatus: "suspended", failureCount: 2 },
  ];

  // Mock approved add-ons data with associated customers/devices
  const approvedAddOns = [
    {
      id: "svc-001",
      name: "Datadog Monitoring",
      category: "Observability",
      requestedBy: "John Smith",
      approvedDate: "2024-01-15",
      expiryDate: "2025-01-15",
      status: "Active",
      tag: "svc:datadog",
      healthCheck: {
        enabled: true,
        lastRun: "2025-02-01T02:00:00Z",
        passRate: "66%",
        mttr: "2.5 hours",
        suspendedCount: 1
      },
      enrollments: [
        { customerId: "cust-1", customerName: "Acme Health", deviceId: "dev-101", deviceName: "acme-app-01", healthStatus: "healthy", lastCheckPassed: true },
        { customerId: "cust-1", customerName: "Acme Health", deviceId: "dev-102", deviceName: "acme-db-01", healthStatus: "suspended", lastCheckPassed: false },
        { customerId: "cust-2", customerName: "Bluefin Markets", deviceId: "dev-201", deviceName: "bluefin-edge-01", healthStatus: "healthy", lastCheckPassed: true }
      ]
    },
    {
      id: "svc-002",
      name: "Vault Enterprise",
      category: "Security",
      requestedBy: "Emma Wilson",
      approvedDate: "2024-02-20",
      expiryDate: "2025-02-20",
      status: "Active",
      tag: "svc:vault",
      enrollments: [
        { customerId: "cust-2", customerName: "Bluefin Markets", deviceId: "dev-202", deviceName: "bluefin-api-01" }
      ]
    },
    {
      id: "svc-003",
      name: "CloudFlare WAF",
      category: "Security",
      requestedBy: "Michael Chen",
      approvedDate: "2024-03-10",
      expiryDate: "2025-03-10",
      status: "Active",
      tag: "svc:cloudflare",
      enrollments: [
        { customerId: "cust-1", customerName: "Acme Health", deviceId: "dev-101", deviceName: "acme-app-01" }
      ]
    },
    {
      id: "svc-004",
      name: "S3 Backup Solution",
      category: "Backup",
      requestedBy: "Sarah Johnson",
      approvedDate: "2023-12-01",
      expiryDate: "2024-12-01",
      status: "Expiring Soon",
      tag: "svc:s3backup",
      enrollments: [
        { customerId: "cust-1", customerName: "Acme Health", deviceId: "dev-102", deviceName: "acme-db-01" },
        { customerId: "cust-2", customerName: "Bluefin Markets", deviceId: "dev-201", deviceName: "bluefin-edge-01" },
        { customerId: "cust-2", customerName: "Bluefin Markets", deviceId: "dev-202", deviceName: "bluefin-api-01" }
      ]
    }
  ];

  // Export functions
  // Export customer list as CSV
  function exportCustomerListCSV(addon) {
    // Group enrollments by customer
    const customerMap = new Map();
    addon.enrollments.forEach(e => {
      if (!customerMap.has(e.customerId)) {
        customerMap.set(e.customerId, {
          customerId: e.customerId,
          customerName: e.customerName,
          devices: []
        });
      }
      customerMap.get(e.customerId).devices.push({
        deviceId: e.deviceId,
        deviceName: e.deviceName
      });
    });

    const headers = ["Customer ID", "Customer Name", "Device ID", "Device Name", "Service", "Tag"];
    const rows = [];

    customerMap.forEach(customer => {
      customer.devices.forEach(device => {
        rows.push([
          customer.customerId,
          customer.customerName,
          device.deviceId,
          device.deviceName,
          addon.name,
          addon.tag
        ]);
      });
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${addon.name.replace(/\s+/g, '-')}-customer-list.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    setActiveDropdown(null);
  }

  // Export service contract as CSV
  function exportServiceContractCSV(addon) {
    const data = [
      ["Field", "Value"],
      ["Service Name", addon.name],
      ["Category", addon.category],
      ["Tag", addon.tag],
      ["Description", addon.description || ""],
      ["Billing Unit", addon.billing?.unit?.replace(' ', '_') || "per_device"],
      ["Unit Cost", addon.billing?.unitCost || 0],
      ["Billing Code", addon.billing?.code || ""],
      ["Max Enrollments", addon.limits?.maxEnrollments || "Unlimited"],
      ["Min Devices Per Customer", addon.limits?.minDevices || "No minimum"],
      ["Device Types", (addon.eligibility?.deviceTypes || ["All"]).join("; ")],
      ["Operating Systems", (addon.eligibility?.operatingSystems || []).join("; ") || "Any"],
      ["Ticket Queue", addon.workflow?.ticketQueue || "Implementation"],
      ["Approval Status", addon.status === "Active" ? "Approved" : "Pending"],
      ["Requested By", addon.requestedBy || ""],
      ["Approved Date", addon.approvedDate || ""],
      ["Expiry Date", addon.expiryDate || ""],
      ["Total Enrollments", addon.enrollments.length],
      ["Contract Version", "1.0"]
    ];

    const csvContent = data.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${addon.name.replace(/\s+/g, '-')}-service-contract.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    setActiveDropdown(null);
  }

  // Export customer list and devices with tags
  function exportCustomerList(addon) {
    // Get unique customers
    const customerMap = new Map();
    addon.enrollments.forEach(e => {
      if (!customerMap.has(e.customerId)) {
        customerMap.set(e.customerId, {
          customerId: e.customerId,
          customerName: e.customerName,
          devices: []
        });
      }
      customerMap.get(e.customerId).devices.push({
        deviceId: e.deviceId,
        deviceName: e.deviceName,
        tag: addon.tag
      });
    });

    const data = {
      service: addon.name,
      tag: addon.tag,
      totalEnrollments: addon.enrollments.length,
      customers: Array.from(customerMap.values()),
      exportedAt: new Date().toISOString()
    };

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${addon.name.replace(/\s+/g, '-')}-customer-list.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    setActiveDropdown(null);
  }

  // Export service definition as per contract spec
  function exportServiceContract(addon) {
    const data = {
      name: addon.name,
      category: addon.category,
      tag: addon.tag,
      description: addon.description || "",
      billing: {
        unit: addon.billing?.unit?.replace(' ', '_') || "per_device",
        unit_cost: addon.billing?.unitCost || 0,
        code: addon.billing?.code || ""
      },
      limits: {
        max_enrollments: addon.limits?.maxEnrollments || null,
        min_devices_per_customer: addon.limits?.minDevices || null
      },
      eligibility: {
        device_types: addon.eligibility?.deviceTypes?.map(type => {
          if (type === "All") return "*";
          if (type === "VMs") return "vm";
          if (type === "Hosts") return "host";
          if (type === "Networking") return "network";
          if (type === "Storage") return "storage";
          if (type === "Containers") return "container";
          return type.toLowerCase();
        }) || ["*"]
      },
      ticketing: {
        queue: addon.workflow?.ticketQueue || "Implementation",
        template: addon.workflow?.ticketDetails || "",
        template_tokens_supported: ["customerId", "customerName", "deviceId", "deviceName"]
      },
      approvals: {
        status: addon.status === "Active" ? "approved" : "pending",
        requested_by: addon.requestedBy || currentUser.email,
        requested_at: addon.approvedDate ? new Date(addon.approvedDate).toISOString() : new Date().toISOString()
      },
      contract_version: "1.0"
    };

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${addon.name.replace(/\s+/g, '-')}-service-contract.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    setActiveDropdown(null);
  }

  // Legacy export for backward compatibility
  function exportToJSON(addon) {
    // Match ServiceDefinition v1.1 data contract
    const data = {
      version: "1.1",
      serviceDefinition: {
        id: addon.id,
        metadata: {
          name: addon.name,
          category: addon.category,
          description: addon.description || "",
          tags: [addon.tag],
          createdBy: addon.requestedBy || currentUser.email,
          createdAt: addon.approvedDate ? new Date(addon.approvedDate).toISOString() : new Date().toISOString(),
          lastModified: new Date().toISOString()
        },
        billing: {
          unitOfMeasure: addon.billing?.unit || "per device",
          costPerUnit: addon.billing?.unitCost || 0,
          billingCode: addon.billing?.code || "",
          currency: "USD"
        },
        workflow: {
          ticketQueue: addon.workflow?.ticketQueue || "Implementation",
          ticketTemplate: addon.workflow?.ticketDetails || "",
          automationTag: addon.tag,
          approvalRequired: true,
          approverGroup: addon.approverGroup || approverGroup.ldapGroup
        },
        eligibility: {
          deviceTypes: addon.eligibility?.deviceTypes || ["All"],
          operatingSystems: addon.eligibility?.operatingSystems || [],
          minimumDevices: addon.limits?.minDevices || 0,
          maximumEnrollments: addon.limits?.maxEnrollments || null
        },
        status: {
          state: addon.status === "Active" ? "approved" : "pending",
          approvedBy: addon.status === "Active" ? approverGroup.members[0].email : null,
          approvedAt: addon.status === "Active" ? addon.approvedDate : null,
          expiryDate: addon.expiryDate || null
        },
        enrollments: {
          count: addon.enrollments.length,
          devices: addon.enrollments.map(e => ({
            customerId: e.customerId,
            customerName: e.customerName,
            deviceId: e.deviceId,
            deviceName: e.deviceName,
            enrolledAt: new Date().toISOString(),
            billingActive: true,
            tagApplied: true
          }))
        }
      }
    };

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${addon.name.replace(/\s+/g, '-')}-service-definition-v1.1.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    setActiveDropdown(null);
  }

  // Form validation
  function formIsValid() {
    return svcName.trim() !== '';
  }

  // Send for approval handler
  function handleSendForApproval() {
    if (!svcName.trim()) return alert("Service name is required");

    const id = `svc-${Date.now()}`;
    const newService = {
      id,
      name: svcName.trim(),
      category: svcCategory,
      description: svcDescription.trim(),
      billing: { unit, unitCost: parseFloat(unitCost || "0"), code: billingCode.trim() },
      workflow: { ticketQueue, tag: tag.trim(), ticketDetails: ticketDetails.trim() },
      limits: {
        maxEnrollments: maxEnrollments ? parseInt(maxEnrollments) : null,
        minDevices: minDevices ? parseInt(minDevices) : null,
      },
      eligibility: {
        deviceTypes: applicableDeviceTypes,
        operatingSystems: applicableOS,
      },
      health_check: healthCheckEnabled ? {
        enabled: true,
        targets: targetOS,
        scripts: {
          linux_bash: linuxScript,
          windows_powershell: windowsScript,
          linux_version: linuxScriptVersion,
          windows_version: windowsScriptVersion,
          approved_by: scriptApprovedBy || currentUser.email,
          approved_at: new Date().toISOString()
        },
        schedule: {
          frequency: scheduleFrequency,
          cron: scheduleFrequency === "cron" ? customCron : null,
          time_utc: scheduleTime,
          day_of_month: scheduleFrequency === "monthly" ? parseInt(dayOfMonth) : null,
          day_of_week: scheduleFrequency === "weekly" ? (dayOfWeek || 0) : null,
          timezone: timezone,
          timeout_seconds: parseInt(timeoutSeconds)
        },
        success_exit_codes: successExitCodes.split(",").map(c => parseInt(c.trim())),
        failure_policy: {
          consecutive_failures: parseInt(consecutiveFailures),
          grace_period_hours: parseInt(gracePeriodHours),
          suspend_billing: suspendBilling,
          notify: {
            channels: notifyChannels,
            email_recipients: notifyChannels.includes("email") ? emailRecipients.split(",").map(e => e.trim()).filter(e => e) : [],
            teams_webhook: notifyChannels.includes("teams") ? teamsChannel : null,
            pagerduty_key: notifyChannels.includes("pagerduty") ? pagerdutyService : null,
            ticket_system: notifyChannels.includes("ticket") ? ticketSystem : null,
            roles: ["account_team"],
            additional_recipients: additionalRecipients.split(",").map(e => e.trim()).filter(e => e)
          }
        }
      } : null,
      status: "Pending Approval",
      submittedAt: new Date().toISOString(),
      approverGroup: approverGroup.ldapGroup,
      contract_version: "1.2"
    };

    setServices((prev) => [newService, ...prev]);
    setLastSubmittedService(newService);
    setShowApprovalModal(true);

    // Reset some fields for clarity (keep defaults for faster iteration)
    setSvcName("");
    setSvcDescription("");
    setTicketDetails("");
    setMaxEnrollments("");
    setMinDevices("");
    setApplicableDeviceTypes(["All"]);
    setApplicableOS([]);
    setHealthCheckEnabled(false);
    setAdditionalRecipients("");
  }

  // Mock API Operations for Health Checks
  function runHealthCheckTest(serviceId) {
    alert(`🧪 Running dry-run health check test for service ${serviceId}...\n\nMock API: POST /api/services/${serviceId}/healthcheck/test\n\nResponse: Test passed successfully. Scripts validated and ready for deployment.`);
  }

  function runAdHocHealthCheck(enrollmentId) {
    alert(`▶️ Running ad-hoc health check for enrollment ${enrollmentId}...\n\nMock API: POST /api/enrollments/${enrollmentId}/healthcheck/run\n\nResponse: Health check initiated. Check status in Health Monitor.`);
  }

  function viewHealthCheckStatus(enrollmentId) {
    alert(`📊 Fetching health check status for enrollment ${enrollmentId}...\n\nMock API: GET /api/enrollments/${enrollmentId}/healthcheck/status\n\nResponse: Last 10 runs retrieved. Overall state: ACTIVE. See Health Monitor for full details.`);
  }

  // Function to generate example ticket with dynamic variables
  function generateExampleTicket(service) {
    if (!service) return null;

    // Example values to show how the template would work
    const exampleCustomer = { id: "cust-XXXX", name: "[Customer Name]" };
    const exampleDevice = { id: "dev-XXXX", name: "[Device Name]" };

    // Replace dynamic variables in ticket details
    let processedDetails = service.workflow.ticketDetails || "";
    processedDetails = processedDetails.replace(/@customerId/g, exampleCustomer.id);
    processedDetails = processedDetails.replace(/@customerName/g, exampleCustomer.name);
    processedDetails = processedDetails.replace(/@deviceId/g, exampleDevice.id);
    processedDetails = processedDetails.replace(/@deviceName/g, exampleDevice.name);

    return {
      id: `TCKT-EXAMPLE`,
      queue: service.workflow.ticketQueue,
      status: "Open",
      createdAt: new Date().toISOString(),
      title: `${service.name} Service Request`,
      details: processedDetails,
      payload: {
        customerId: exampleCustomer.id,
        customerName: exampleCustomer.name,
        deviceId: exampleDevice.id,
        deviceName: exampleDevice.name,
        serviceId: service.id,
        serviceName: service.name,
        tag: service.workflow.tag,
      },
    };
  }

  // My Services view - shows logged-in user's service enrollments
  if (showHealthTab) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="px-3 sm:px-6 py-2 sm:py-3">
            <div className="flex items-center justify-between">
              {/* Navigation Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNavDropdown(!showNavDropdown)}
                  className="flex items-center gap-3 px-5 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg transition hover:bg-gray-50 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="text-sm font-semibold">Menu</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showNavDropdown && (
                  <div className="absolute left-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowHealthTab(false);
                          setShowFleetDashboard(false);
                          setShowNavDropdown(false);
                        }}
                        className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Service Portal
                      </button>
                      <button
                        onClick={() => {
                          setShowHealthTab(true);
                          setShowFleetDashboard(false);
                          setShowNavDropdown(false);
                        }}
                        className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        My Services
                      </button>
                      <button
                        onClick={() => {
                          setShowFleetDashboard(true);
                          setShowHealthTab(false);
                          setShowNavDropdown(false);
                        }}
                        className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Fleet Dashboard
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 text-center px-2">
                <h1 className="text-sm sm:text-xl font-semibold">My Services</h1>
                <p className="text-xs text-gray-600">Your Service Enrollments and Health Status</p>
              </div>

              {/* User Menu on right */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 sm:space-x-3 hover:bg-gray-50 rounded-lg p-1 sm:p-2 transition-colors"
                  >
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
                      <div className="text-xs text-gray-500">{currentUser.role}</div>
                    </div>
                    <svg className="hidden sm:block w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                      <div className="p-4 border-b">
                        <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                        <p className="text-xs text-gray-500">{currentUser.email}</p>
                      </div>
                      <div className="py-1">
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile Settings</button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Service History</button>
                        <button
                          onClick={() => {
                            setShowHealthTab(false);
                            setShowFleetDashboard(false);
                            setShowUserMenu(false);
                          }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Service Portal
                        </button>
                        <button
                          onClick={() => {
                            setShowFleetDashboard(true);
                            setShowHealthTab(false);
                            setShowUserMenu(false);
                          }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Fleet Dashboard (Ops)
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Documentation</button>
                        <hr className="my-1" />
                        <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Sign Out</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-6 py-6 max-w-6xl mx-auto">
          <Card title="My Services - Health Status">
            <div className="space-y-3">
              {approvedAddOns.filter(a => a.healthCheck?.enabled).map(addon => {
                // Show all enrollments for the logged-in user
                const filteredEnrollments = addon.enrollments;

                return (
                <div key={addon.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{addon.name}</h3>
                      <p className="text-sm text-gray-600">{addon.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Pass Rate</div>
                      <div className="text-2xl font-bold text-green-600">{addon.healthCheck.passRate}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3 p-3 bg-gray-50 rounded">
                    <div>
                      <div className="text-xs text-gray-600">Last Run</div>
                      <div className="text-sm font-medium">{new Date(addon.healthCheck.lastRun).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">MTTR</div>
                      <div className="text-sm font-medium">{addon.healthCheck.mttr}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Suspended</div>
                      <div className="text-sm font-medium text-red-600">{addon.healthCheck.suspendedCount} devices</div>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="text-sm font-semibold mb-2">Device Status ({filteredEnrollments.length} devices)</div>
                    <div className="space-y-2">
                      {filteredEnrollments.map(enrollment => (
                        <div key={enrollment.deviceId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${enrollment.healthStatus === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <div>
                              <div className="text-sm font-medium">{enrollment.deviceName}</div>
                              <div className="text-xs text-gray-600">{enrollment.deviceId} • {enrollment.customerName}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              enrollment.healthStatus === 'healthy'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {enrollment.healthStatus === 'healthy' ? 'Healthy' : 'Suspended'}
                            </span>
                            <button
                              onClick={() => setSelectedEnrollmentHealth(enrollment)}
                              className="text-xs text-blue-600 hover:text-blue-700 underline"
                            >
                              View Runs →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </Card>

          {selectedEnrollmentHealth && (
            <Card title={`Health Check History - ${selectedEnrollmentHealth.deviceName}`}>
              <div className="space-y-2">
                {mockHealthCheckRuns
                  .filter(run => run.deviceId === selectedEnrollmentHealth.deviceId)
                  .map(run => (
                    <div key={run.runId} className="border rounded-lg p-3 bg-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              run.status === 'PASS' ? 'bg-green-100 text-green-700' :
                              run.status === 'FAIL' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {run.status}
                            </span>
                            <span className="text-sm text-gray-600">Exit Code: {run.exitCode}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(run.startedAt).toLocaleString()} → {new Date(run.finishedAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs px-2 py-1 rounded ${
                            run.billingStatus === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                          }`}>
                            Billing: {run.billingStatus}
                          </div>
                        </div>
                      </div>
                      {run.logSnippet && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono">
                          {run.logSnippet}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </Card>
          )}
        </main>
      </div>
    );
  }

  // Fleet Dashboard view - operations view across all services and customers
  if (showFleetDashboard) {
    // Filter services based on selection - include ALL approved services
    let filteredServices = fleetServiceFilter === "all"
      ? approvedAddOns
      : approvedAddOns.filter(a => a.id === fleetServiceFilter);

    // Filter services by customer if customer filter or search is active
    if (selectedCustomer !== "all" || customerSearch) {
      filteredServices = filteredServices.map(service => {
        const filteredEnrollments = service.enrollments.filter(enrollment => {
          const matchesCustomer = selectedCustomer === "all" || enrollment.customerId === selectedCustomer;
          const matchesSearch = !customerSearch ||
            enrollment.customerName.toLowerCase().includes(customerSearch.toLowerCase()) ||
            enrollment.customerId.toLowerCase().includes(customerSearch.toLowerCase());
          return matchesCustomer && matchesSearch;
        });

        // Only include services that have enrollments matching the customer filter
        return filteredEnrollments.length > 0 ? { ...service, enrollments: filteredEnrollments } : null;
      }).filter(service => service !== null);
    }

    const totalEnrollments = filteredServices.reduce((sum, a) => sum + a.enrollments.length, 0);
    const healthyCount = filteredServices.reduce((sum, a) =>
      sum + a.enrollments.filter(e => e.healthStatus === 'healthy' || !e.healthStatus).length, 0);
    const suspendedCount = filteredServices.reduce((sum, a) =>
      sum + a.enrollments.filter(e => e.healthStatus === 'suspended').length, 0);
    const overallPassRate = totalEnrollments > 0 ? ((healthyCount / totalEnrollments) * 100).toFixed(1) : '0';

    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="px-3 sm:px-6 py-2 sm:py-3">
            <div className="flex items-center justify-between">
              {/* Navigation Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNavDropdown(!showNavDropdown)}
                  className="flex items-center gap-3 px-5 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg transition hover:bg-gray-50 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="text-sm font-semibold">Menu</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showNavDropdown && (
                  <div className="absolute left-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowHealthTab(false);
                          setShowFleetDashboard(false);
                          setShowNavDropdown(false);
                        }}
                        className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Service Portal
                      </button>
                      <button
                        onClick={() => {
                          setShowHealthTab(true);
                          setShowFleetDashboard(false);
                          setShowNavDropdown(false);
                        }}
                        className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        My Services
                      </button>
                      <button
                        onClick={() => {
                          setShowFleetDashboard(true);
                          setShowHealthTab(false);
                          setShowNavDropdown(false);
                        }}
                        className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Fleet Dashboard
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 text-center px-2">
                <h1 className="text-sm sm:text-xl font-semibold">Fleet Health Dashboard</h1>
                <p className="text-xs text-gray-600">Operations Center - Service Health Metrics</p>
              </div>

              {/* User Menu on right */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 sm:space-x-3 hover:bg-gray-50 rounded-lg p-1 sm:p-2 transition-colors"
                  >
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
                      <div className="text-xs text-gray-500">{currentUser.role}</div>
                    </div>
                    <svg className="hidden sm:block w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                      <div className="p-4 border-b">
                        <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                        <p className="text-xs text-gray-500">{currentUser.email}</p>
                      </div>
                      <div className="py-1">
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile Settings</button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Service History</button>
                        <button
                          onClick={() => {
                            setShowHealthTab(false);
                            setShowFleetDashboard(false);
                            setShowUserMenu(false);
                          }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Service Portal
                        </button>
                        <button
                          onClick={() => {
                            setShowHealthTab(true);
                            setShowFleetDashboard(false);
                            setShowUserMenu(false);
                          }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          My Services (Customer)
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Documentation</button>
                        <hr className="my-1" />
                        <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Sign Out</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-6 py-6 max-w-7xl mx-auto">
          {/* Filters */}
          <div className="bg-white rounded-lg border p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Service</label>
                <select
                  value={fleetServiceFilter}
                  onChange={(e) => setFleetServiceFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="all">All Services</option>
                  {approvedAddOns.map(addon => (
                    <option key={addon.id} value={addon.id}>{addon.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Customer</label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="all">All Customers</option>
                  <option value="cust-1">Acme Health (cust-1)</option>
                  <option value="cust-2">Bluefin Markets (cust-2)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Search Customer</label>
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Account # or customer name..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border p-4">
              <div className="text-sm text-gray-600 mb-1">Total Enrollments</div>
              <div className="text-3xl font-bold text-gray-900">{totalEnrollments}</div>
              <div className="text-xs text-gray-500 mt-1">Across all services</div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="text-sm text-gray-600 mb-1">Overall Pass Rate</div>
              <div className="text-3xl font-bold text-green-600">{overallPassRate}%</div>
              <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="text-sm text-gray-600 mb-1">Healthy Devices</div>
              <div className="text-3xl font-bold text-green-600">{healthyCount}</div>
              <div className="text-xs text-gray-500 mt-1">Active billing</div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="text-sm text-gray-600 mb-1">Suspended Devices</div>
              <div className="text-3xl font-bold text-red-600">{suspendedCount}</div>
              <div className="text-xs text-gray-500 mt-1">Billing paused</div>
            </div>
          </div>

          {/* Health Check Failures Over Time */}
          <Card title="Health Check Failures Over Time">
            <div className="p-4">
              <div className="text-xs text-gray-600 mb-4">Last 30 days • Failed health checks per day</div>
              <div className="flex items-end justify-between h-48 gap-1 border-b border-gray-300">
                {/* Mock data: showing last 30 days with varying failure counts */}
                {[2, 1, 3, 0, 1, 2, 4, 1, 0, 1, 2, 1, 3, 5, 2, 1, 0, 2, 1, 3, 2, 1, 0, 1, 4, 2, 1, 0, 2, 1].map((failures, idx) => {
                  const maxFailures = 5;
                  const heightPercent = (failures / maxFailures) * 100;
                  const isAnomaly = failures >= 4;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end group relative h-full">
                      <div
                        className={`w-full rounded-t transition-all ${
                          isAnomaly ? 'bg-red-500' : failures > 0 ? 'bg-orange-400' : 'bg-green-400'
                        } hover:opacity-80 min-h-[8px]`}
                        style={{ height: failures === 0 ? '8px' : `${heightPercent}%` }}
                      ></div>
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                        Day -{30-idx}: {failures} {failures === 1 ? 'failure' : 'failures'}
                        {isAnomaly && <div className="text-red-300">⚠️ Anomaly</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>30 days ago</span>
                <span>Today</span>
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded"></div>
                  <span className="text-gray-600">No failures</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-400 rounded"></div>
                  <span className="text-gray-600">1-3 failures</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-gray-600">4+ failures (Anomaly)</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Service Breakdown */}
          <Card title="Service Health Breakdown">
            <div className="space-y-3">
              {filteredServices.map(addon => {
                const healthy = addon.enrollments.filter(e => e.healthStatus === 'healthy' || !e.healthStatus).length;
                const total = addon.enrollments.length;
                const passRate = total > 0 ? ((healthy / total) * 100).toFixed(0) : '0';

                return (
                  <div key={addon.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{addon.name}</h3>
                        <p className="text-xs text-gray-600">{addon.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Pass Rate</div>
                        <div className={`text-xl font-bold ${passRate >= 80 ? 'text-green-600' : passRate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {passRate}%
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 text-sm">
                      <div>
                        <div className="text-gray-600 text-xs">Healthy</div>
                        <div className="font-semibold text-green-600">{healthy}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Suspended</div>
                        <div className="font-semibold text-red-600">{addon.healthCheck?.suspendedCount || 0}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">MTTR</div>
                        <div className="font-semibold">{addon.healthCheck?.mttr || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Last Run</div>
                        <div className="font-semibold text-xs">{addon.healthCheck?.lastRun ? new Date(addon.healthCheck.lastRun).toLocaleDateString() : 'N/A'}</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{width: `${passRate}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Recent Health Check Runs */}
          <Card title="Recent Health Check Runs">
            <div className="space-y-2">
              {mockHealthCheckRuns.slice(0, 10).map(run => (
                <div key={run.runId} className="flex items-center justify-between p-3 border rounded bg-white text-sm">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      run.status === 'PASS' ? 'bg-green-100 text-green-700' :
                      run.status === 'FAIL' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {run.status}
                    </span>
                    <div>
                      <div className="font-medium">{run.deviceName}</div>
                      <div className="text-xs text-gray-600">{run.customerName} • {run.os}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600">{new Date(run.startedAt).toLocaleString()}</div>
                    <div className={`text-xs ${run.billingStatus === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                      Billing: {run.billingStatus}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </main>
      </div>
    );
  }

  if (showApprovers) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="px-3 sm:px-6 py-2 sm:py-3">
            <div className="flex items-center justify-between">
              {/* Navigation Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNavDropdown(!showNavDropdown)}
                  className="flex items-center gap-3 px-5 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg transition hover:bg-gray-50 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="text-sm font-semibold">Menu</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showNavDropdown && (
                  <div className="absolute left-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowApprovers(false);
                          setShowNavDropdown(false);
                        }}
                        className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Service Portal
                      </button>
                      <button
                        onClick={() => {
                          setShowHealthTab(true);
                          setShowApprovers(false);
                          setShowNavDropdown(false);
                        }}
                        className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        My Services
                      </button>
                      <button
                        onClick={() => {
                          setShowFleetDashboard(true);
                          setShowApprovers(false);
                          setShowNavDropdown(false);
                        }}
                        className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Fleet Dashboard
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Centered title */}
              <div className="flex-1 text-center px-2">
                <h1 className="text-sm sm:text-xl font-semibold">Service Approval Group</h1>
              </div>

              {/* User Menu on right */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 sm:space-x-3 hover:bg-gray-50 rounded-lg p-1 sm:p-2 transition-colors"
                  >
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
                      <div className="text-xs text-gray-500">{currentUser.role}</div>
                    </div>
                    <svg className="hidden sm:block w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                      <div className="p-4 border-b">
                        <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                        <p className="text-xs text-gray-500">{currentUser.email}</p>
                      </div>
                      <div className="py-1">
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile Settings</button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Service History</button>
                        <button
                          onClick={() => {
                            setShowApprovers(false);
                            setShowUserMenu(false);
                          }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Service Portal
                        </button>
                        <button
                          onClick={() => {
                            setShowHealthTab(true);
                            setShowApprovers(false);
                            setShowUserMenu(false);
                          }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          My Services (Customer)
                        </button>
                        <button
                          onClick={() => {
                            setShowFleetDashboard(true);
                            setShowApprovers(false);
                            setShowUserMenu(false);
                          }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Fleet Dashboard (Ops)
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Documentation</button>
                        <hr className="my-1" />
                        <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Sign Out</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-6 py-6 max-w-6xl mx-auto">
          {selectedServiceForApproval && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="text-sm text-blue-700 mb-1">Awaiting approval for:</div>
              <div className="font-semibold">{selectedServiceForApproval.name}</div>
              <div className="text-sm text-gray-600 mt-1">
                Submitted: {new Date(selectedServiceForApproval.submittedAt).toLocaleString()}
              </div>
            </div>
          )}

          <Card title="LDAP Approval Group">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">LDAP Distinguished Name:</div>
                <code className="text-xs bg-white px-2 py-1 rounded border font-mono">
                  {approverGroup.ldapGroup}
                </code>
              </div>

              <div>
                <div className="text-lg font-semibold mb-3">{approverGroup.groupName}</div>
                <div className="space-y-3">
                  {approverGroup.members.map((member, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-600">{member.role}</div>
                      </div>
                      <a
                        href={`mailto:${member.email}?subject=Service Approval Request: ${selectedServiceForApproval?.name || 'New Service'}`}
                        className="text-sm text-blue-600 hover:text-blue-700 underline"
                      >
                        {member.email}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-sm text-gray-500 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <strong>Note:</strong> Any member of this group can approve service catalog additions.
                Approval typically takes 1-2 business days. For urgent requests, please reach out directly
                to any approver listed above.
              </div>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header with Rackspace logo, centered title, and user menu */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="px-3 sm:px-6 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            {/* Navigation dropdown on left */}
            <div className="flex items-center gap-4">
              {/* Navigation Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNavDropdown(!showNavDropdown)}
                  className="flex items-center gap-3 px-5 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg transition hover:bg-gray-50 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="text-sm font-semibold">Menu</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showNavDropdown && (
                  <div className="absolute left-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowHealthTab(true);
                          setShowNavDropdown(false);
                        }}
                        className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        My Services
                      </button>
                      <button
                        onClick={() => {
                          setShowFleetDashboard(true);
                          setShowNavDropdown(false);
                        }}
                        className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Fleet Dashboard
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Centered title */}
            <div className="flex-1 text-center px-2">
              <h1 className="text-sm sm:text-xl font-semibold">Service Catalogue Definition - Mock</h1>
              <p className="hidden sm:block text-sm text-gray-600">Define and deploy managed services</p>
            </div>

            {/* User Menu on right */}
            <div className="flex-shrink-0">
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 sm:space-x-3 hover:bg-gray-50 rounded-lg p-1 sm:p-2 transition-colors"
                >
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
                    <div className="text-xs text-gray-500">{currentUser.role}</div>
                  </div>
                  <svg className="hidden sm:block w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="p-4 border-b">
                      <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                      <p className="text-xs text-gray-500">{currentUser.email}</p>
                    </div>
                    <div className="py-1">
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile Settings</button>
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Service History</button>
                      <button
                        onClick={() => {
                          setShowHealthTab(true);
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        My Services (Customer)
                      </button>
                      <button
                        onClick={() => {
                          setShowFleetDashboard(true);
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Fleet Dashboard (Ops)
                      </button>
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Documentation</button>
                      <hr className="my-1" />
                      <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Sign Out</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-3 sm:px-6 py-4 sm:py-6">
        {/* Service Definition Section */}
        <div className="max-w-6xl mx-auto space-y-6">
          <Card title="Service Definition Racker UI">
            <div className="space-y-6">
              {/* Product Catalogue Details */}
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-200">Product Catalogue Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextField
                    label="Service Name"
                    value={svcName}
                    onChange={setSvcName}
                    placeholder="Observability (Datadog)"
                    tooltip="This name is what will show up in the UI and on Customer facing documentation including billing"
                    activeTooltip={activeTooltip}
                    setActiveTooltip={setActiveTooltip}
                    tooltipId="service-name"
                    required={true}
                  />
                  <SelectField
                    label="Category"
                    value={svcCategory}
                    onChange={setSvcCategory}
                    options={["Observability", "Security", "Backup", "Networking", "Infrastructure", "One-off"]}
                    tooltip="This will drive categorization in the product catalogue and could be used to set where things show up in the UI and who approves them"
                    activeTooltip={activeTooltip}
                    setActiveTooltip={setActiveTooltip}
                    tooltipId="category"
                    required={true}
                  />
                  <TextField
                    label="Tag to Apply"
                    value={tag}
                    onChange={setTag}
                    placeholder="svc:observability"
                    tooltip="Tag that when added to a device auto executes the creation of necessary billing entries and ticket enrollment workflows defined here."
                    activeTooltip={activeTooltip}
                    setActiveTooltip={setActiveTooltip}
                    tooltipId="tag-to-apply"
                    className="col-span-1 sm:col-span-2"
                    required={true}
                  />
                  <TextArea
                    label="Description"
                    value={svcDescription}
                    onChange={setSvcDescription}
                    placeholder="Read-only visibility + incident routing"
                    className="col-span-1 sm:col-span-2"
                    tooltip="This is saved with the item and should be used to add a human friendly understanding of what the add-on does as configured"
                    activeTooltip={activeTooltip}
                    setActiveTooltip={setActiveTooltip}
                    tooltipId="description"
                  />
                </div>
              </div>

              {/* Billing Configuration */}
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-200">Billing Configuration</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SelectField
                    label="Unit of Measure"
                    value={unit}
                    onChange={setUnit}
                    options={["per device", "per VM", "per GB", "per user"]}
                    tooltip="These are per X per hour the tag is on the device and billed once a month in the customer's normal cycle."
                    activeTooltip={activeTooltip}
                    setActiveTooltip={setActiveTooltip}
                    tooltipId="unit-measure"
                  />
                  <TextField label="Unit Cost ($)" value={unitCost} onChange={setUnitCost} type="number" step="0.01" />
                  <TextField
                    label="Billing Code/ID"
                    value={billingCode}
                    onChange={setBillingCode}
                    placeholder="OBS-001"
                    className="col-span-1 sm:col-span-2"
                    tooltip="Must be already created by ITS prior to starting this."
                    activeTooltip={activeTooltip}
                    setActiveTooltip={setActiveTooltip}
                    tooltipId="billing-code"
                  />
                </div>
              </div>

              {/* Service Limits & Eligibility */}
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-200">Service Limits & Eligibility</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextField
                    label="Max Enrollments"
                    value={maxEnrollments}
                    onChange={setMaxEnrollments}
                    type="number"
                    placeholder="Unlimited"
                    tooltip="Maximum number of total enrollments allowed for this service. Leave empty for unlimited."
                    activeTooltip={activeTooltip}
                    setActiveTooltip={setActiveTooltip}
                    tooltipId="max-enrollments"
                  />
                  <TextField
                    label="Min Devices per Customer"
                    value={minDevices}
                    onChange={setMinDevices}
                    type="number"
                    placeholder="No minimum"
                    tooltip="Minimum number of devices a customer must have to be eligible for this service."
                    activeTooltip={activeTooltip}
                    setActiveTooltip={setActiveTooltip}
                    tooltipId="min-devices"
                  />
                  <div className="col-span-2">
                    <MultiSelectField
                      label="Applicable Device Types"
                      value={applicableDeviceTypes}
                      onChange={setApplicableDeviceTypes}
                      options={["All", "VMs", "Hosts", "Networking", "Storage", "Containers"]}
                      tooltip="Device types eligible for this service. Select 'All' to allow any device type. This is pulled dynamically and used to filter enrollments."
                      activeTooltip={activeTooltip}
                      setActiveTooltip={setActiveTooltip}
                      tooltipId="device-types"
                    />
                  </div>
                  {!applicableDeviceTypes.includes("All") && applicableDeviceTypes.length > 0 && (
                    <div className="col-span-2">
                      <MultiSelectField
                        label="Applicable Operating Systems"
                        value={applicableOS}
                        onChange={setApplicableOS}
                        options={[...new Set(applicableDeviceTypes.flatMap(type => osOptionsByDeviceType[type] || []))]}
                        tooltip="Operating systems eligible for this service. Only devices with these OS types can be enrolled."
                        activeTooltip={activeTooltip}
                        setActiveTooltip={setActiveTooltip}
                        tooltipId="applicable-os"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Ticket Workflow */}
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-200">Ticket Workflow</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SelectField
                    label="Ticket Queue"
                    value={ticketQueue}
                    onChange={setTicketQueue}
                    options={["Implementation", "Networking", "Security", "Observability Ops"]}
                    tooltip="Pre-populated from available queues."
                    activeTooltip={activeTooltip}
                    setActiveTooltip={setActiveTooltip}
                    tooltipId="ticket-queue"
                    className="col-span-1 sm:col-span-2"
                  />
                  <TextArea
                    label="Ticket Details Template"
                    value={ticketDetails}
                    onChange={setTicketDetails}
                    placeholder="Please provision the requested service for @customerName. Device: @deviceName (ID: @deviceId). Customer ID: @customerId"
                    className="col-span-1 sm:col-span-2"
                    tooltip="Will show up on every enrollment of this service on a customer device."
                    activeTooltip={activeTooltip}
                    setActiveTooltip={setActiveTooltip}
                    tooltipId="ticket-details"
                  />
                </div>
              </div>

              {/* Health Checks */}
              <div className="border-t-2 border-blue-200 pt-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 pb-2 border-b border-gray-200 inline-block">Health Checks</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Enable Health Checks</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={healthCheckEnabled}
                        onChange={(e) => setHealthCheckEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {healthCheckEnabled && (
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    {/* Target Operating Systems */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Target Operating Systems</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={targetOS.includes("linux")}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setTargetOS([...targetOS, "linux"]);
                              } else {
                                setTargetOS(targetOS.filter(os => os !== "linux"));
                              }
                            }}
                          />
                          <span className="text-sm">Linux</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={targetOS.includes("windows")}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setTargetOS([...targetOS, "windows"]);
                              } else {
                                setTargetOS(targetOS.filter(os => os !== "windows"));
                              }
                            }}
                          />
                          <span className="text-sm">Windows</span>
                        </label>
                      </div>
                    </div>

                    {/* Scripts */}
                    {targetOS.includes("linux") && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">Linux Bash Script (v{linuxScriptVersion})</label>
                        </div>
                        <textarea
                          value={linuxScript}
                          onChange={(e) => setLinuxScript(e.target.value)}
                          className="w-full h-32 font-mono text-xs p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="#!/bin/bash"
                        />
                        <div className="text-xs text-gray-600 mt-1">Exit code 0 = success. Encrypted at rest, SHA-256 hashed.</div>
                      </div>
                    )}

                    {targetOS.includes("windows") && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">Windows PowerShell Script (v{windowsScriptVersion})</label>
                        </div>
                        <textarea
                          value={windowsScript}
                          onChange={(e) => setWindowsScript(e.target.value)}
                          className="w-full h-32 font-mono text-xs p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="$ErrorActionPreference = 'Stop'"
                        />
                        <div className="text-xs text-gray-600 mt-1">Exit code 0 = success. Encrypted at rest, SHA-256 hashed.</div>
                      </div>
                    )}

                    {/* Schedule */}
                    <div className="border-t border-blue-300 pt-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Schedule Configuration</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <SelectField
                          label="Frequency"
                          value={scheduleFrequency}
                          onChange={setScheduleFrequency}
                          options={["daily", "weekly", "monthly", "cron"]}
                        />
                        {scheduleFrequency === "cron" && (
                          <TextField
                            label="Custom Cron Expression"
                            value={customCron}
                            onChange={setCustomCron}
                            placeholder="0 2 1 * *"
                            className="col-span-1 sm:col-span-2"
                          />
                        )}
                        <TextField
                          label="Time (UTC)"
                          value={scheduleTime}
                          onChange={setScheduleTime}
                          type="time"
                        />
                        {scheduleFrequency === "monthly" && (
                          <TextField
                            label="Day of Month"
                            value={dayOfMonth}
                            onChange={setDayOfMonth}
                            type="number"
                            placeholder="1-31"
                          />
                        )}
                        {scheduleFrequency === "weekly" && (
                          <SelectField
                            label="Day of Week"
                            value={dayOfWeek}
                            onChange={setDayOfWeek}
                            options={[
                              { label: "Sunday", value: "0" },
                              { label: "Monday", value: "1" },
                              { label: "Tuesday", value: "2" },
                              { label: "Wednesday", value: "3" },
                              { label: "Thursday", value: "4" },
                              { label: "Friday", value: "5" },
                              { label: "Saturday", value: "6" }
                            ]}
                          />
                        )}
                        <SelectField
                          label="Timezone"
                          value={timezone}
                          onChange={setTimezone}
                          options={["UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "Europe/London", "Asia/Tokyo"]}
                        />
                        <TextField
                          label="Timeout (seconds)"
                          value={timeoutSeconds}
                          onChange={setTimeoutSeconds}
                          type="number"
                          placeholder="300"
                        />
                        <TextField
                          label="Success Exit Codes"
                          value={successExitCodes}
                          onChange={setSuccessExitCodes}
                          placeholder="0"
                          tooltip="Comma-separated list of exit codes that indicate success"
                          activeTooltip={activeTooltip}
                          setActiveTooltip={setActiveTooltip}
                          tooltipId="success-codes"
                        />
                      </div>
                    </div>

                    {/* Failure Policy */}
                    <div className="border-t border-blue-300 pt-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Failure Policy</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <TextField
                          label="Consecutive Failures Required"
                          value={consecutiveFailures}
                          onChange={setConsecutiveFailures}
                          type="number"
                          placeholder="1"
                        />
                        <TextField
                          label="Grace Period (hours)"
                          value={gracePeriodHours}
                          onChange={setGracePeriodHours}
                          type="number"
                          placeholder="0"
                          tooltip="Hours to wait before suspending billing after failure threshold"
                          activeTooltip={activeTooltip}
                          setActiveTooltip={setActiveTooltip}
                          tooltipId="grace-period"
                        />
                        <div className="col-span-1 sm:col-span-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={suspendBilling}
                              onChange={(e) => setSuspendBilling(e.target.checked)}
                              className="rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">Suspend Billing on Failure</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Notifications */}
                    <div className="border-t border-blue-300 pt-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Notification Configuration</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Notification Channels</label>
                          <div className="flex gap-4 flex-wrap">
                            {["email", "teams", "pagerduty", "ticket"].map(channel => (
                              <label key={channel} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={notifyChannels.includes(channel)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setNotifyChannels([...notifyChannels, channel]);
                                    } else {
                                      setNotifyChannels(notifyChannels.filter(c => c !== channel));
                                    }
                                  }}
                                />
                                <span className="text-sm capitalize">{channel === "teams" ? "Teams" : channel === "pagerduty" ? "PagerDuty" : channel === "ticket" ? "Ticket" : "Email"}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {notifyChannels.includes("email") && (
                          <TextField
                            label="Email Recipients (comma-separated)"
                            value={emailRecipients}
                            onChange={setEmailRecipients}
                            placeholder="ops-team@company.com, sre@company.com"
                            tooltip="Email addresses to notify on health check failures"
                            activeTooltip={activeTooltip}
                            setActiveTooltip={setActiveTooltip}
                            tooltipId="email-recipients"
                          />
                        )}

                        {notifyChannels.includes("teams") && (
                          <TextField
                            label="Microsoft Teams Channel Webhook URL"
                            value={teamsChannel}
                            onChange={setTeamsChannel}
                            placeholder="https://outlook.office.com/webhook/..."
                            tooltip="Teams webhook URL for notifications"
                            activeTooltip={activeTooltip}
                            setActiveTooltip={setActiveTooltip}
                            tooltipId="teams-channel"
                          />
                        )}

                        {notifyChannels.includes("pagerduty") && (
                          <TextField
                            label="PagerDuty Integration Key"
                            value={pagerdutyService}
                            onChange={setPagerdutyService}
                            placeholder="R03XXXXXXXXXXXXXXXXXX"
                            tooltip="PagerDuty service integration key for alerts"
                            activeTooltip={activeTooltip}
                            setActiveTooltip={setActiveTooltip}
                            tooltipId="pagerduty-service"
                          />
                        )}

                        {notifyChannels.includes("ticket") && (
                          <div>
                            <SelectField
                              label="Ticket System"
                              value={ticketSystem}
                              onChange={setTicketSystem}
                              options={["ServiceNOW", "CORE", "Encore"]}
                              tooltip="Select which ticketing system to create tickets in when health checks fail"
                              activeTooltip={activeTooltip}
                              setActiveTooltip={setActiveTooltip}
                              tooltipId="ticket-system"
                            />
                          </div>
                        )}

                        <TextField
                          label="Additional Recipients (comma-separated emails)"
                          value={additionalRecipients}
                          onChange={setAdditionalRecipients}
                          placeholder="ops@company.com, oncall@company.com"
                          className="col-span-1 sm:col-span-2"
                          tooltip="Account team and CSM are auto-notified. Add extra recipients here."
                          activeTooltip={activeTooltip}
                          setActiveTooltip={setActiveTooltip}
                          tooltipId="additional-recipients"
                        />
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-800">
                      <strong>Security:</strong> Scripts are encrypted at rest, SHA-256 hashed, and require SteerCo approval before activation.
                      Health checks run in sandboxed, non-privileged mode. Output limited to 1-2 KB in notifications; full logs stored securely.
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={handleSendForApproval} className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed" disabled={!formIsValid()}>
                Send for Approval
              </button>
            </div>
          </Card>

          <Card title="Catalogue (Submitted Services)">
            {services.length === 0 ? (
              <EmptyState message="No services yet. Define and submit one above." />
            ) : (
              <div className="space-y-2">
                {services.map((s, idx) => (
                  <div key={s.id} className={`border rounded-lg p-3 sm:p-4 hover:shadow-sm transition-all duration-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <div className="font-medium text-gray-900 text-sm sm:text-base">{s.name}</div>
                        <div className="text-xs sm:text-sm text-gray-600 mt-0.5">{s.category} • {s.workflow.tag} • {s.billing.code}</div>
                      </div>
                      {s.status === "Pending Approval" ? (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium border border-amber-200">
                          {s.status}
                        </span>
                      ) : (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium border border-emerald-200">
                          {s.status}
                        </span>
                      )}
                    </div>
                    {s.description && <p className="text-sm mt-2 text-gray-700">{s.description}</p>}
                    {s.status === "Pending Approval" && (
                      <button
                        onClick={() => {
                          setSelectedServiceForApproval(s);
                          setShowApprovers(true);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 underline mt-2 transition-colors duration-200"
                      >
                        View approvers →
                      </button>
                    )}
                    {s.workflow.ticketDetails && (
                      <div className="text-xs mt-2 p-2 bg-gray-50 rounded">
                        <span className="font-medium">Ticket Template:</span> {s.workflow.ticketDetails.substring(0, 100)}{s.workflow.ticketDetails.length > 100 ? "..." : ""}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Catalogue Section */}
        <div className="max-w-6xl mx-auto space-y-6">
          <Card title="Ticket Template Preview">
            <div className="text-xs text-gray-500 mb-3 p-2 bg-blue-50 rounded">
              This preview shows how your ticket template will look when ANY customer requests this service.
              The variables will be replaced with actual customer data at request time.
            </div>
            {services.length === 0 ? (
              <EmptyState message="No services defined yet. Define a service to see ticket preview." />
            ) : (
              <div className="space-y-2">
                {services.slice(0, 3).map((s, idx) => {
                  const exampleTicket = generateExampleTicket(s);
                  return exampleTicket ? (
                    <div key={s.id} className={`border rounded-lg p-4 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:shadow-sm transition-all duration-200`}>
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-900">{exampleTicket.title}</div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium border border-blue-200">{exampleTicket.queue}</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Template Preview • Service: {s.name}</div>
                      {exampleTicket.details && (
                        <div className="text-sm mt-2 p-2 bg-blue-50 rounded">
                          <div className="font-medium mb-1">Details (with example placeholders):</div>
                          <div className="whitespace-pre-wrap">{exampleTicket.details}</div>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-2 italic">
                        * Actual customer/device details will be inserted when service is requested
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Additional Sections */}
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border">
            <button
              onClick={() => setShowVariablesGuide(!showVariablesGuide)}
              className="w-full p-3 sm:p-4 flex items-center justify-between text-left hover:bg-gray-50 rounded-2xl transition-all duration-200 cursor-pointer"
            >
              <h2 className="text-base font-semibold">Dynamic Variables Guide</h2>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${showVariablesGuide ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showVariablesGuide && (
              <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-3 sm:space-y-4 border-t">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200 mt-4">
                  <div className="font-medium text-sm mb-2">How it works:</div>
                  <p className="text-sm text-gray-700">
                    When any customer requests this service, the system will automatically replace the
                    variables in your ticket template with their specific information.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium">Available Variables:</div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                      <code className="text-xs font-mono text-blue-600">@customerId</code>
                      <div className="text-xs text-gray-600">The requesting customer's unique identifier</div>
                    </div>
                    <div className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                      <code className="text-xs font-mono text-blue-600">@customerName</code>
                      <div className="text-xs text-gray-600">The requesting customer's company name</div>
                    </div>
                    <div className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                      <code className="text-xs font-mono text-blue-600">@deviceId</code>
                      <div className="text-xs text-gray-600">The specific device ID being enrolled</div>
                    </div>
                    <div className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                      <code className="text-xs font-mono text-blue-600">@deviceName</code>
                      <div className="text-xs text-gray-600">The friendly name of the device</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="font-medium text-sm mb-2">Example Usage:</div>
                  <div className="text-xs font-mono bg-white p-2 rounded border">
                    "Enable monitoring for @deviceName belonging to @customerName. Device UUID: @deviceId. Configure alerts to customer portal @customerId."
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    <strong>Becomes:</strong> "Enable monitoring for web-server-01 belonging to Acme Corp. Device UUID: dev-4829. Configure alerts to customer portal cust-1592."
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Approved Add-Ons Section */}
          <div className="bg-white rounded-2xl shadow-sm border">
            <button
              onClick={() => setShowApprovedAddOns(!showApprovedAddOns)}
              className="w-full p-3 sm:p-4 flex items-center justify-between text-left hover:bg-gray-50 rounded-2xl transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-2 relative">
                <h2 className="text-base font-semibold">Approved Add-Ons</h2>
                <div className="relative">
                  <InfoIcon onClick={(e) => {
                    e.stopPropagation();
                    setShowApprovedAddOnsTooltip(!showApprovedAddOnsTooltip);
                  }} />
                  {showApprovedAddOnsTooltip && (
                    <Tooltip
                      content="When an item expires, the approver LDAP group and the requestor are notified. If it is not renewed in 30 days, notifications should continue to be sent until action is taken to either renew it or remove it."
                      onClose={() => setShowApprovedAddOnsTooltip(false)}
                    />
                  )}
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${showApprovedAddOns ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showApprovedAddOns && (
              <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t">
                <div className="mt-4 space-y-3">
                  {approvedAddOns.map((addon) => (
                    <div key={addon.id} className="border rounded-lg p-4 hover:bg-gray-50 hover:shadow-sm transition-all duration-200 relative">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-sm">{addon.name}</div>
                            <span className="text-xs text-gray-500">({addon.enrollments.length} enrollments)</span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            <span className="inline-block mr-3">Category: {addon.category}</span>
                            <span className="inline-block mr-3">Tag: <code className="bg-gray-200 px-1 rounded">{addon.tag}</code></span>
                            <span className="inline-block">Requested by: {addon.requestedBy}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            addon.status === 'Expiring Soon'
                              ? 'bg-amber-100 text-amber-700 border border-amber-200'
                              : 'bg-green-100 text-green-700 border border-green-200'
                          }`}>
                            {addon.status}
                          </span>
                          <div className="relative">
                            <button
                              onClick={() => setActiveDropdown(activeDropdown === addon.id ? null : addon.id)}
                              className="p-1.5 hover:bg-gray-200 rounded-lg transition-all duration-200 hover:scale-110"
                              title="Export options"
                            >
                              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </button>
                            {activeDropdown === addon.id && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                                <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border z-20">
                                  <div className="px-4 py-2 border-b bg-gray-50 rounded-t-lg">
                                    <div className="text-xs font-semibold text-gray-700">Export Service Data</div>
                                    <div className="text-xs text-gray-500 mt-0.5">Choose export format and content</div>
                                  </div>

                                  {/* CSV Exports */}
                                  <div className="border-b">
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-50">Export as CSV</div>
                                    <button
                                      onClick={() => exportCustomerListCSV(addon)}
                                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                                    >
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                      </svg>
                                      Customer List
                                    </button>
                                    <button
                                      onClick={() => exportServiceContractCSV(addon)}
                                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                                    >
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                      Service Contract
                                    </button>
                                  </div>

                                  {/* JSON Exports */}
                                  <div>
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-50">Export as JSON</div>
                                    <button
                                      onClick={() => exportCustomerList(addon)}
                                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                                    >
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                      </svg>
                                      Customer List
                                    </button>
                                    <button
                                      onClick={() => exportServiceContract(addon)}
                                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 rounded-b-lg"
                                    >
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                      Service Contract
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2 flex items-center justify-between">
                        <span>Approved: {addon.approvedDate}</span>
                        <div className="flex items-center relative">
                          <span>Expires: {addon.expiryDate}</span>
                          <InfoIcon
                            onClick={() => setActiveTooltip(activeTooltip === `expiry-${addon.id}` ? null : `expiry-${addon.id}`)}
                          />
                          {activeTooltip === `expiry-${addon.id}` && (
                            <Tooltip
                              content="All services approved and added in this fashion requires renewal or it will be removed from the catalogue and from customers."
                              onClose={() => setActiveTooltip(null)}
                            />
                          )}
                        </div>
                      </div>

                      {/* Health Check Actions (Phase 2) */}
                      {addon.healthCheck?.enabled && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs font-semibold text-blue-900">Health Check Actions</div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-600">Pass Rate:</span>
                              <span className="text-xs font-bold text-green-600">{addon.healthCheck.passRate}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => runHealthCheckTest(addon.id)}
                              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
                            >
                              🧪 Test Health Check
                            </button>
                            <button
                              onClick={() => runAdHocHealthCheck(`enr-${addon.id}`)}
                              className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 border border-green-300"
                            >
                              ▶️ Run Ad-Hoc Check
                            </button>
                            <button
                              onClick={() => viewHealthCheckStatus(`enr-${addon.id}`)}
                              className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 border border-purple-300"
                            >
                              📊 View Status
                            </button>
                          </div>
                          {addon.healthCheck.suspendedCount > 0 && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                              ⚠️ {addon.healthCheck.suspendedCount} device(s) suspended due to failed health checks. Billing paused.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-6 text-xs text-gray-500">
        <div className="text-center space-y-1">
          <p>
            This mock demonstrates service definition with customizable ticket templates and <strong className="text-blue-600">Phase 2 Health Check System</strong>.
          </p>
          <p className="text-gray-400">
            Features: OS-specific health checks (Bash/PowerShell), flexible scheduling (daily/weekly/monthly/cron), auto-suspend billing on failure,
            customer health portal, fleet dashboard with MTTR metrics, multi-channel notifications, and full audit trail.
          </p>
        </div>
      </footer>

      {/* Approval Confirmation Modal */}
      {showApprovalModal && lastSubmittedService && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowApprovalModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl max-w-md w-full p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Service Submitted Successfully</h3>
                </div>
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-900">{lastSubmittedService.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Category: {lastSubmittedService.category} • Tag: {lastSubmittedService.workflow.tag}
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  Your service definition has been sent for approval to the <span className="font-medium">Service Catalog Approvers</span> group.
                </div>

                <div className="flex items-start space-x-2 bg-blue-50 rounded-lg p-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <div className="font-medium mb-1">What happens next?</div>
                    <ul className="space-y-1 text-xs">
                      <li>• Check the <span className="font-medium">"Catalogue (Submitted Services)"</span> section below for status updates</li>
                      <li>• Approvers will review your service definition</li>
                      <li>• Once approved, it will appear in the Approved Add-Ons section</li>
                      <li>• You'll be notified via email when the status changes</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// --- UI primitives ---
function Card({ title, children }) {
  return (
    <div className="bg-white rounded-lg sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-5">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// Info icon component
function InfoIcon({ onClick }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-700 hover:bg-gray-800 text-white text-xs font-bold ml-1 transition-colors"
      type="button"
    >
      i
    </button>
  );
}

// Tooltip popup component
function Tooltip({ content, onClose }) {
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      // Close tooltip on any click outside
      if (!e.target.closest('.tooltip-content')) {
        onClose();
      }
    };

    // Add small delay to prevent immediate closing from the button click that opened it
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [onClose]);

  return (
    <>
      <div className="tooltip-content absolute z-50 mt-1 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg max-w-xs">
        <div className="relative">
          {content}
          <div className="absolute -top-5 left-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-gray-900" />
        </div>
      </div>
    </>
  );
}

function TextField({ label, value, onChange, placeholder, type = "text", step, className = "", tooltip, activeTooltip, setActiveTooltip, tooltipId, required = false }) {
  const isTooltipActive = activeTooltip === tooltipId;

  return (
    <label className={`text-sm ${className} relative`}>
      <div className="mb-1.5 text-gray-700 flex items-center">
        {label}
        {required && <span className="text-red-500 ml-0.5 font-medium">*</span>}
        {tooltip && (
          <InfoIcon onClick={() => setActiveTooltip(isTooltipActive ? null : tooltipId)} />
        )}
        {isTooltipActive && tooltip && (
          <Tooltip content={tooltip} onClose={() => setActiveTooltip(null)} />
        )}
      </div>
      <input
        className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        step={step}
      />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder, className = "", tooltip, activeTooltip, setActiveTooltip, tooltipId, maxLength = 500 }) {
  const isTooltipActive = activeTooltip === tooltipId;

  return (
    <label className={`text-sm ${className} relative`}>
      <div className="mb-1.5 text-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          {label}
          {tooltip && (
            <InfoIcon onClick={() => setActiveTooltip(isTooltipActive ? null : tooltipId)} />
          )}
          {isTooltipActive && tooltip && (
            <Tooltip content={tooltip} onClose={() => setActiveTooltip(null)} />
          )}
        </div>
        <span className="text-xs text-gray-400">{value.length}/{maxLength}</span>
      </div>
      <textarea
        className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 min-h-[80px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options, placeholder, tooltip, activeTooltip, setActiveTooltip, tooltipId, required = false }) {
  const opts = options?.map((o) => (typeof o === "string" ? { label: o, value: o } : o)) || [];
  const isTooltipActive = activeTooltip === tooltipId;

  return (
    <label className="text-sm relative">
      <div className="mb-1.5 text-gray-700 flex items-center">
        {label}
        {required && <span className="text-red-500 ml-0.5 font-medium">*</span>}
        {tooltip && (
          <InfoIcon onClick={() => setActiveTooltip(isTooltipActive ? null : tooltipId)} />
        )}
        {isTooltipActive && tooltip && (
          <Tooltip content={tooltip} onClose={() => setActiveTooltip(null)} />
        )}
      </div>
      <select
        className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 cursor-pointer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {opts.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function MultiSelectField({ label, value, onChange, options, tooltip, activeTooltip, setActiveTooltip, tooltipId }) {
  const isTooltipActive = activeTooltip === tooltipId;

  const handleToggle = (option) => {
    if (option === "All") {
      // If selecting "All", clear all other selections
      onChange(["All"]);
    } else {
      // If selecting something else, remove "All" if present
      const newValue = value.includes("All")
        ? [option]
        : value.includes(option)
          ? value.filter(v => v !== option)
          : [...value, option];

      // If no selections left, default to "All"
      onChange(newValue.length === 0 ? ["All"] : newValue);
    }
  };

  return (
    <div className="text-sm relative">
      <div className="mb-1.5 text-gray-700 flex items-center">
        {label}
        {tooltip && (
          <InfoIcon onClick={() => setActiveTooltip(isTooltipActive ? null : tooltipId)} />
        )}
        {isTooltipActive && tooltip && (
          <Tooltip content={tooltip} onClose={() => setActiveTooltip(null)} />
        )}
      </div>
      <div className="border border-gray-300 rounded-lg p-2 space-y-1 bg-white max-h-48 overflow-y-auto hover:border-gray-400 transition-all duration-200">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={() => handleToggle(option)}
              className="rounded"
            />
            <span className="text-sm">{option}</span>
          </label>
        ))}
      </div>
      {value.length > 0 && !value.includes("All") && (
        <div className="mt-1 text-xs text-gray-500">
          Selected: {value.join(", ")}
        </div>
      )}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-sm text-gray-500 border border-dashed rounded-xl p-4 bg-gray-50 text-center">{message}</div>
  );
}

function Th({ children }) {
  return <th className="text-left font-semibold px-2 py-2">{children}</th>;
}

function Td({ children }) {
  return <td className="px-2 py-2">{children}</td>;
}