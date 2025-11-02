import { useState, useEffect } from "react";
import { TrendingUp, Star, Award, Target } from "lucide-react";
import employeesData from "../data/employees.json";

const PerformanceManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setEmployees(employeesData);
  }, []);

  const getPerformanceColor = (performance) => {
    switch (performance.toLowerCase()) {
      case "excellent":
        return "text-green-600 bg-green-100";
      case "good":
        return "text-blue-600 bg-blue-100";
      case "average":
        return "text-yellow-600 bg-yellow-100";
      case "outstanding":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPerformanceIcon = (performance) => {
    switch (performance.toLowerCase()) {
      case "excellent":
        return <Award className="w-4 h-4" />;
      case "good":
        return <Target className="w-4 h-4" />;
      case "average":
        return <Star className="w-4 h-4" />;
      case "outstanding":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (selectedEmployee && feedback.trim()) {
      alert(`Feedback submitted for ${selectedEmployee.name}: ${feedback}`);
      setFeedback("");
      setSelectedEmployee(null);
    }
  };

  const getAveragePerformance = () => {
    const ratings = { excellent: 5, good: 4, average: 3, outstanding: 5 };
    const total = employees.reduce(
      (sum, emp) => sum + (ratings[emp.performance.toLowerCase()] || 3),
      0
    );
    return (total / employees.length).toFixed(1);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Performance Management</h1>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold">{getAveragePerformance()}/5</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Award className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Top Performers</p>
              <p className="text-2xl font-bold">
                {
                  employees.filter((emp) =>
                    ["excellent", "outstanding"].includes(
                      emp.performance.toLowerCase()
                    )
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold">{employees.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Performance List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Employee Performance</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {employees.map((employee) => (
            <div key={employee.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                    <span className="text-lg font-semibold text-gray-700">
                      {employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{employee.name}</h3>
                    <p className="text-gray-600">
                      {employee.role} • {employee.department}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getPerformanceColor(
                      employee.performance
                    )}`}
                  >
                    {getPerformanceIcon(employee.performance)}
                    <span className="ml-1">{employee.performance}</span>
                  </div>

                  <button
                    onClick={() => setSelectedEmployee(employee)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Add Feedback
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                Add Feedback for {selectedEmployee.name}
              </h3>

              <form onSubmit={handleFeedbackSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Performance Feedback
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Enter your feedback..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedEmployee(null);
                      setFeedback("");
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceManagement;
