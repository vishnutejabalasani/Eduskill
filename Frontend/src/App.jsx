import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/common/Layout';
import ChatBot from './components/common/ChatBot';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import ProfileForm from './components/dashboard/ProfileForm';
import CreateCourseForm from './components/dashboard/CreateCourseForm';
import MyHiresPage from './pages/dashboard/MyHiresPage';
import JobRequestsPage from './pages/dashboard/JobRequestsPage';
import MyCourses from './pages/dashboard/MyCourses';
import ManageCourse from './pages/dashboard/ManageCourse';
import ManageExam from './pages/dashboard/ManageExam';
import MessagesPage from './pages/dashboard/MessagesPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import EditCourse from './pages/dashboard/EditCourse';
import ExamPage from './pages/ExamPage';
import Settings from './pages/dashboard/Settings';
import AdminLayout from './components/admin/AdminLayout';
import UserManagement from './pages/admin/UserManagement';
import FindTalentPage from './pages/FindTalentPage';
import PublicProfilePage from './pages/PublicProfilePage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/common/PageTransition';

// Simple Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null; // or a spinner
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

// Admin Route Wrapper
const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />;
    return children;
};

// Wrapper for Routes to access useLocation
const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode='wait'>
            <Routes location={location} key={location.pathname}>
                {/* Public Routes */}
                <Route path="/" element={<PageTransition><Layout /></PageTransition>}>
                    <Route index element={<HomePage />} />
                    <Route path="courses" element={<CoursesPage />} />
                    <Route path="courses/:id" element={<CourseDetailsPage />} />
                    <Route path="courses/:id/exam" element={<ExamPage />} />
                    <Route path="/find-talent" element={<FindTalentPage />} />
                    <Route path="/creators/:id" element={<PublicProfilePage />} />
                </Route>
                <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
                <Route path="/signup" element={<PageTransition><SignupPage /></PageTransition>} />

                {/* Protected Dashboard Routes */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <PageTransition>
                            <DashboardLayout />
                        </PageTransition>
                    </ProtectedRoute>
                }>
                    <Route index element={<DashboardOverview />} />
                    <Route path="profile" element={<ProfileForm />} />
                    <Route path="create-course" element={<CreateCourseForm />} />
                    <Route path="edit-course/:id" element={<EditCourse />} />
                    <Route path="manage-course/:id" element={<ManageCourse />} />
                    <Route path="manage-exam/:id" element={<ManageExam />} />
                    <Route path="messages" element={<MessagesPage />} />
                    <Route path="courses" element={<MyCourses />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="my-hires" element={<MyHiresPage />} />
                    <Route path="job-requests" element={<JobRequestsPage />} />
                    <Route path="billing" element={<div className="text-gray-400">Billing Coming Soon</div>} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={
                    <AdminRoute>
                        <PageTransition>
                            <AdminLayout />
                        </PageTransition>
                    </AdminRoute>
                }>
                    <Route path="users" element={<UserManagement />} />
                    <Route path="dashboard" element={<Navigate to="/admin/users" replace />} />
                    <Route index element={<Navigate to="/admin/users" replace />} />
                </Route>
            </Routes>
        </AnimatePresence>
    );
};

// Wrapper to hide ChatBot on Exam pages
const ConditionalChatBot = () => {
    const location = useLocation();
    // Hide on routes containing '/exam'
    if (location.pathname.includes('/exam')) return null;
    return <ChatBot />;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-[#0a0a0a] text-white relative selection:bg-[#00E676]/30">
                    {/* Global Ambient Background */}
                    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                        <div className="absolute top-[-10%] left-[20%] w-[40vw] h-[40vw] bg-[#00E676]/5 rounded-full blur-[120px] animate-pulse-slow" />
                        <div className="absolute bottom-[-10%] right-[20%] w-[30vw] h-[30vw] bg-purple-500/5 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
                        <div className="absolute top-[40%] left-[10%] w-[20vw] h-[20vw] bg-blue-500/5 rounded-full blur-[80px] animate-pulse-slow delay-2000" />
                    </div>

                    {/* Content Wrapper */}
                    <div className="relative z-10">
                        <AnimatedRoutes />
                        <ConditionalChatBot />
                    </div>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}


export default App;
// Force Rebuild
