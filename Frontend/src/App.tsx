import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FooterLogin from "./components/FooterLogin";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";



import ApplicationPending from "./pages/ApplicationPending";
import WorkflowApplication from "./pages/ApplicationWorkflow";

import EServices from "./pages/EServices";
import HousingPage from "./pages/PageHousing";
import BoilerPage from "./pages/PageBoiler";

import ApplicationEdit from "./pages/ApplicationEdit";
import ApplicationView from "./pages/ApplicationView";

import ApplicationStatus from "./pages/ApplicationStatus";
import WorkflowApplicationHistory from "./pages/ApplicationHistory";

function App() {
const location = useLocation();

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/registration";


  return (
    <div>
      <Header />

      <Navbar />

      <main className="main-content">
        <Routes>

          {/* Public Routes */}
          <Route 
            path="/login" 
            element={<Login />} 
          />

          <Route 
            path="/registration" 
            element={<Registration />} 
          />


          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/"
              element={<Dashboard />}
            /> 
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />           

            <Route
path="/services"
element={<EServices/>}
/>
<Route
path="/services/housing"
element={<HousingPage/>}
/>
<Route
    path="/applications/:workflowId/edit/:applicationId"
    element={<ApplicationEdit />}
/>
<Route
    path="/workflow/application/:id"
    element={<ApplicationView />}
/>
<Route
path="/services/boiler"
element={<BoilerPage/>}
/>
         <Route
          path="/task"
          element={<ApplicationPending/>}
        /> 

        <Route
    path="/workflow/application/:applicationId"
    element={<WorkflowApplication/>}
        />
      </Route>

      <Route
    path="/application-status"
    element={<ApplicationStatus />}
/>  
     <Route
    path="/workflow-application-history"
    element={
        <WorkflowApplicationHistory />
    }
/>     

        </Routes>
         {/* Footer selection */}
        {!isLoggedIn && isAuthPage ? (
          <Footer />
        ) : (
          <FooterLogin />
        )}
      </main>

      

    </div>
  );
}

export default App;