import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import employeesData from "../data/employees.json";
import AddEmployeeForm from "../components/AddEmployeeForm";

const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const [showAddForm, setShowAddForm] = useState(false);

  const loadEmployees = () => {
    // Combine JSON data with localStorage data
    const additionalEmployees = JSON.parse(
      localStorage.getItem("additionalEmployees") || "[]"
    );
    const allEmployees = [...employeesData, ...additionalEmployees];

    let filtered = allEmployees;

    const filter = searchParams.get("filter");
    if (filter === "present") {
      // Mock: assume 85% are present today
      filtered = allEmployees.slice(0, Math.floor(allEmployees.length * 0.85));
    } else if (filter === "onleave") {
      // Mock: assume 10% are on leave
      filtered = allEmployees.slice(-Math.floor(allEmployees.length * 0.1));
    } else if (filter === "newjoiners") {
      // New joiners after 2024
      filtered = allEmployees.filter(
        (emp) => new Date(emp.joinDate) > new Date("2024-01-01")
      );
    }

    setEmployees(filtered);
  };

  useEffect(() => {
    loadEmployees();
  }, [searchParams]);

  const handleAddEmployee = () => {
    loadEmployees(); // Reload employees to include the new one
  };

  const handleRemoveEmployee = (employeeId) => {
    // Check if employee is from localStorage (additional employees)
    const additionalEmployees = JSON.parse(
      localStorage.getItem("additionalEmployees") || "[]"
    );
    const updatedEmployees = additionalEmployees.filter(
      (emp) => emp.id !== employeeId
    );

    localStorage.setItem(
      "additionalEmployees",
      JSON.stringify(updatedEmployees)
    );
    loadEmployees(); // Reload to reflect changes
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Employee Directory</h1>

      {/* Search Bar and Add Button */}
      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by name, role, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setShowAddForm(true)}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Employee
        </button>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow relative"
          >
            <Link to={`/profile/${employee.id}`} className="block">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-lg mr-4">
                  {getInitials(employee.name)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {employee.name}
                  </h3>
                  <p className="text-sm text-gray-600">{employee.role}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Department:</strong> {employee.department}
                </p>
                <p>
                  <strong>Email:</strong> {employee.email}
                </p>
                <p>
                  <strong>Phone:</strong> {employee.phone}
                </p>
              </div>
            </Link>
            {/* Remove button - only show for localStorage employees */}
            {employee.id > 6 && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (
                    window.confirm(
                      `Are you sure you want to remove ${employee.name}?`
                    )
                  ) {
                    handleRemoveEmployee(employee.id);
                  }
                }}
                className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                title="Remove employee"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No employees found matching your search.
        </p>
      )}

      {showAddForm && (
        <AddEmployeeForm
          onClose={() => setShowAddForm(false)}
          onAddEmployee={handleAddEmployee}
        />
      )}
    </div>
  );
};

export default EmployeeDirectory;
