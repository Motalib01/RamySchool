import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Director from "./pages/Director";
import Receptionist from "./pages/Receptionist";
import Login from "./pages/Login";
import DirectorDashboard from "./components/pages/director/dashboard/dashboardSection";
import DirectorTeachersSection from "./components/pages/director/teachers/TeachersSection";
import ReceptionistTeachersSection from "./components/pages/receptionist/teachers/TeachersSection";
import StudentSection from "./components/pages/receptionist/students/StudentsSection";
import SessionsSection from "./components/pages/receptionist/sessions/SessionsSection";
import PresencesSection from "./components/pages/receptionist/presences/PresencesSection";
import GroupsSection from "./components/pages/receptionist/groups/GroupsSection";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/director"
        element={
          <ProtectedRoute>
            <Director />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DirectorDashboard />} />
        <Route path="teachers" element={<DirectorTeachersSection />} />
        <Route path="students" element={<StudentSection />} />
        <Route path="sessions" element={<SessionsSection />} />
        <Route path="presences" element={<PresencesSection />} />
        <Route path="groups" element={<GroupsSection />} />
      </Route>

      <Route
        path="/receptionist"
        element={
          <ProtectedRoute>
            <Receptionist />
          </ProtectedRoute>
        }
      >
        <Route path="teachers" element={<ReceptionistTeachersSection />} />
        <Route path="students" element={<StudentSection />} />
        <Route path="sessions" element={<SessionsSection />} />
        <Route path="presences" element={<PresencesSection />} />
        <Route path="groups" element={<GroupsSection />} />
      </Route>
    </Routes>
  );
}

export default App;
