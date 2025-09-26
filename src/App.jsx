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
      enrollments: [
        { customerId: "cust-1", customerName: "Acme Health", deviceId: "dev-101", deviceName: "acme-app-01" },
        { customerId: "cust-1", customerName: "Acme Health", deviceId: "dev-102", deviceName: "acme-db-01" },
        { customerId: "cust-2", customerName: "Bluefin Markets", deviceId: "dev-201", deviceName: "bluefin-edge-01" }
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
      status: "Pending Approval",
      submittedAt: new Date().toISOString(),
      approverGroup: approverGroup.ldapGroup,
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

  if (showApprovers) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="px-3 sm:px-6 py-2 sm:py-3">
            <div className="flex items-center justify-between">
              {/* Logo on left */}
              <div className="flex-shrink-0">
                <img src={rackspaceLogo} alt="Rackspace Technology" className="h-6 sm:h-10" />
              </div>

              {/* Centered title */}
              <div className="flex-1 text-center px-2">
                <h1 className="text-sm sm:text-xl font-semibold">Service Approval Group</h1>
              </div>

              {/* Back button on right */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => setShowApprovers(false)}
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                >
                  <span className="hidden sm:inline">← Back to Catalog</span>
                  <span className="sm:hidden">← Back</span>
                </button>
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
            {/* Logo on left */}
            <div className="flex-shrink-0">
              <img src={rackspaceLogo} alt="Rackspace Technology" className="h-6 sm:h-10" />
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
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-6 text-xs text-gray-500">
        This mock demonstrates service definition with customizable ticket templates using dynamic variables that will be populated when customers request services.
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