import UserRoute from "../../components/routes/UserRoute";
import DashboardContent from "../../components/DashboardContent"; // Import the shared component

const Dashboard = () => {
  return (
    <UserRoute>
      <DashboardContent />
    </UserRoute>
  );
};

export default Dashboard;
