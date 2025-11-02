import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import employeesData from "../data/employees.json";

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    newJoiners: 0,
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Combine JSON data with localStorage data
    const additionalEmployees = JSON.parse(
      localStorage.getItem("additionalEmployees") || "[]"
    );
    const allEmployees = [...employeesData, ...additionalEmployees];

    // Calculate stats from combined data
    const totalEmployees = allEmployees.length;
    const presentToday = Math.floor(totalEmployees * 0.85); // Mock: 85% present
    const onLeave = Math.floor(totalEmployees * 0.1); // Mock: 10% on leave
    const newJoiners = allEmployees.filter(
      (emp) => new Date(emp.joinDate) > new Date("2024-01-01")
    ).length; // Mock: joined after 2024

    setStats({ totalEmployees, presentToday, onLeave, newJoiners });

    // Prepare chart data: employees by department
    const departmentCounts = allEmployees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {});
    const chartData = Object.entries(departmentCounts).map(
      ([department, count]) => ({
        department,
        count,
      })
    );
    setChartData(chartData);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8">
        <div
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate("/employees")}
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Total Employees
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalEmployees}
          </p>
        </div>
        <div
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate("/employees?filter=present")}
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Present Today
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {stats.presentToday}
          </p>
        </div>
        <div
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate("/employees?filter=onleave")}
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">On Leave</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.onLeave}</p>
        </div>
        <div
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate("/employees?filter=newjoiners")}
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            New Joiners
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {stats.newJoiners}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Employees by Department
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
