import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  Routes,
  Route,
} from "react-router-dom";

import "./css/Layout.css";
import ApplicationForm from "./pages/ApplicationFormHousing";
import ApplicationPending from "./pages/ApplicationPending";
import WorkflowApplication from "./pages/ApplicationWorkflow";

import EServices from "./pages/EServices";
    import HousingPage from "./pages/PageHousing";
 import BoilerPage from "./pages/PageBoiler";

 import ApplicationEdit from "./pages/ApplicationEdit";
 import ApplicationView from "./pages/ApplicationView";
function App() {
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

        
          

        </Routes>
      </main>

      <Footer />

    </div>
  );
}

export default App;