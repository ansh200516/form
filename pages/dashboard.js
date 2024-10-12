// pages/dashboard.js
import ProtectedRoute from '../components/ProtectedRoute';
import CourseForm from '../components/CourseForm';

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <div className="p-8">
        <h1 className="text-3xl mb-6">Launch a New Course</h1>
        <CourseForm />
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;

