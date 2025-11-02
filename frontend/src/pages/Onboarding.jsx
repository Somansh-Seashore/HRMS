import { useState } from "react";
import { UserPlus, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sendWelcomeMessage } from "../utils/sendWelcomeMessage";

const Onboarding = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "",
    email: "",
    phone: "",
    joinDate: new Date().toISOString().split("T")[0], // Today's date
    status: "Active",
    performance: "Good",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate new ID
    const existingEmployees = JSON.parse(
      localStorage.getItem("additionalEmployees") || "[]"
    );
    const maxId = Math.max(...existingEmployees.map((emp) => emp.id || 0), 6); // Start from 7 since JSON has up to 6
    const newEmployee = {
      ...formData,
      id: maxId + 1,
    };

    // Save to localStorage
    const updatedEmployees = [...existingEmployees, newEmployee];
    localStorage.setItem(
      "additionalEmployees",
      JSON.stringify(updatedEmployees)
    );

    // Send WhatsApp welcome message
    sendWelcomeMessage(formData.phone, formData.name);

    // Show success message and navigate to dashboard
    alert(
      `New employee ${formData.name} added successfully! They will appear in the dashboard as a new joiner.`
    );

    // Reset form
    setFormData({
      name: "",
      role: "",
      department: "",
      email: "",
      phone: "",
      joinDate: new Date().toISOString().split("T")[0],
      status: "Active",
      performance: "Good",
    });

    // Navigate to dashboard to show updated stats
    navigate("/");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Employee</h1>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center mb-6">
          <UserPlus className="mr-3 text-blue-500" size={32} />
          <div>
            <h2 className="text-xl font-semibold">Employee Information</h2>
            <p className="text-gray-600">Add a new employee to the system</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Personal Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Job Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Job Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Product">Product</option>
                  <option value="Engineering">Engineering</option>
                  <option value="HR">HR</option>
                  <option value="Design">Design</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Join Date
                </label>
                <input
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center font-medium"
            >
              <Save className="mr-2" size={20} />
              Add Employee
            </button>
          </div>
        </form>
      </div>

      {/* Recent Additions */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Additions</h3>
        <div className="text-sm text-gray-600">
          <p>New employees added through this form will appear in:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Dashboard - as "New Joiners"</li>
            <li>Employee Directory - in the employee list</li>
            <li>Employee Profile - accessible via directory</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
