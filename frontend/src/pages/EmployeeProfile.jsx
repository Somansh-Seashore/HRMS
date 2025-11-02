import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import employeesData from "../data/employees.json";

const EmployeeProfile = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    // Combine JSON data with localStorage data
    const additionalEmployees = JSON.parse(
      localStorage.getItem("additionalEmployees") || "[]"
    );
    const allEmployees = [...employeesData, ...additionalEmployees];

    const foundEmployee = allEmployees.find((emp) => emp.id === parseInt(id));
    setEmployee(foundEmployee);
  }, [id]);

  if (!employee) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Employee Profile</h1>
        <p>Employee not found.</p>
        <Link to="/employees" className="text-blue-500 hover:underline">
          Back to Directory
        </Link>
      </div>
    );
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/employees"
          className="inline-flex items-center text-blue-500 hover:text-blue-700"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Directory
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center mb-8">
          <div className="w-20 h-20 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-2xl mr-6">
            {getInitials(employee.name)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {employee.name}
            </h1>
            <p className="text-xl text-gray-600">{employee.role}</p>
            <p className="text-lg text-gray-500">{employee.department}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-3">
              <p>
                <strong>Email:</strong> {employee.email}
              </p>
              <p>
                <strong>Phone:</strong> {employee.phone}
              </p>
            </div>
          </div>

          {/* Job Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Job Information</h2>
            <div className="space-y-3">
              <p>
                <strong>Department:</strong> {employee.department}
              </p>
              <p>
                <strong>Role:</strong> {employee.role}
              </p>
              <p>
                <strong>Join Date:</strong>{" "}
                {new Date(employee.joinDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    employee.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {employee.status}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Performance Summary</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-lg">
              <strong>Current Rating:</strong> {employee.performance}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Performance reviews and detailed metrics would be displayed here
              in a full implementation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
