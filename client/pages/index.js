import { UserContext } from "../context"; // Ensure the correct path
import UserRoute from "../components/routes/UserRoute";
import DashboardContent from "../components/DashboardContent"; // Import the shared component

const Home = () => {
  return (
    <UserRoute>
      <DashboardContent />
    </UserRoute>
  );
};

export default Home;
