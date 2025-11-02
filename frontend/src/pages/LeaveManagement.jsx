import { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
} from "lucide-react";
import leaveRequestsData from "../data/leaveRequests.json";

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "Annual Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const loadLeaveRequests = () => {
    // Combine JSON data with localStorage data
    const additionalLeaveRequests = JSON.parse(
      localStorage.getItem("additionalLeaveRequests") || "[]"
    );
    const allLeaveRequests = [...leaveRequestsData, ...additionalLeaveRequests];
    setLeaveRequests(allLeaveRequests);
  };

  useEffect(() => {
    loadLeaveRequests();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Calculate days
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    // Generate new ID
    const existingLeaveRequests = JSON.parse(
      localStorage.getItem("additionalLeaveRequests") || "[]"
    );
    const maxId = Math.max(
      ...existingLeaveRequests.map((req) => req.id || 0),
      5
    ); // Start from 6 since JSON has up to 5

    const newLeaveRequest = {
      id: maxId + 1,
      employeeName: "Current User", // In a real app, this would be the logged-in user
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days: days,
      reason: formData.reason,
      status: "Pending",
      appliedDate: new Date().toISOString().split("T")[0],
    };

    // Save to localStorage
    const updatedLeaveRequests = [...existingLeaveRequests, newLeaveRequest];
    localStorage.setItem(
      "additionalLeaveRequests",
      JSON.stringify(updatedLeaveRequests)
    );

    // Reload leave requests
    loadLeaveRequests();

    alert("Leave request submitted successfully!");
    setShowForm(false);
    setFormData({
      type: "Annual Leave",
      startDate: "",
      endDate: "",
      reason: "",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="text-green-500" size={20} />;
      case "Rejected":
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-yellow-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleStatusChange = (requestId, newStatus) => {
    const additionalLeaveRequests = JSON.parse(
      localStorage.getItem("additionalLeaveRequests") || "[]"
    );
    const updatedRequests = additionalLeaveRequests.map((request) =>
      request.id === requestId ? { ...request, status: newStatus } : request
    );

    localStorage.setItem(
      "additionalLeaveRequests",
      JSON.stringify(updatedRequests)
    );
    loadLeaveRequests(); // Reload to reflect changes
  };

  const handleDeleteRequest = (requestId) => {
    if (window.confirm("Are you sure you want to delete this leave request?")) {
      const additionalLeaveRequests = JSON.parse(
        localStorage.getItem("additionalLeaveRequests") || "[]"
      );
      const updatedRequests = additionalLeaveRequests.filter(
        (request) => request.id !== requestId
      );

      localStorage.setItem(
        "additionalLeaveRequests",
        JSON.stringify(updatedRequests)
      );
      loadLeaveRequests(); // Reload to reflect changes
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Leave Management</h1>

      {/* Apply Leave Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="mr-2" size={20} />
          Apply for Leave
        </button>
      </div>

      {/* Leave Application Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Apply for Leave</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leave Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Annual Leave">Annual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Please provide a reason for your leave request..."
                required
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
              >
                Submit Request
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Leave Requests List */}
      <div className="bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold p-6 pb-4 flex items-center">
          <Calendar className="mr-2" size={24} />
          Leave Requests
        </h2>
        <div className="space-y-4 p-6 pt-0">
          {leaveRequests.map((request) => (
            <div
              key={request.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {getStatusIcon(request.status)}
                  <span
                    className={`ml-2 px-2 py-1 rounded text-sm font-medium ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {request.id > 5 && request.status === "Pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusChange(request.id, "Approved")
                        }
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(request.id, "Rejected")
                        }
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {request.id > 5 && (
                    <button
                      onClick={() => handleDeleteRequest(request.id)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                      title="Delete request"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <span className="text-sm text-gray-500">
                    Applied: {formatDate(request.appliedDate)}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <strong>Employee:</strong> {request.employeeName}
                </div>
                <div>
                  <strong>Type:</strong> {request.type}
                </div>
                <div>
                  <strong>Duration:</strong> {formatDate(request.startDate)} -{" "}
                  {formatDate(request.endDate)}
                </div>
                <div>
                  <strong>Days:</strong> {request.days}
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <strong>Reason:</strong> {request.reason}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
