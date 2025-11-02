import { useAuth } from "../hooks/useAuth";

const UserProfile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const username =
    user.user_metadata?.username || localStorage.getItem("username") || "N/A";
  const email = user.email || "N/A";

  // Fake data for demonstration
  const fakeProfileData = {
    fullName: `${username} Doe`,
    position: "Software Developer",
    department: "Engineering",
    employeeId: "EMP001",
    joinDate: "2023-01-15",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, USA",
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {fakeProfileData.fullName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <p className="mt-1 text-sm text-gray-900">{username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">{email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {fakeProfileData.phone}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {fakeProfileData.address}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Employment Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Employee ID
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {fakeProfileData.employeeId}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Position
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {fakeProfileData.position}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {fakeProfileData.department}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Join Date
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {fakeProfileData.joinDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
