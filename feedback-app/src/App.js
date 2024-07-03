import './App.css';
import './index.css';
import Navbar from './components/bar/superadmin/Navbar';
import MySidebar from './components/bar/superadmin/MySidebar';
import CustomerAdminSidebar from './components/bar/customeradmin/CustomerAdminSidebar';
import CustomerUserSidebar from './components/bar/customeruser/CustomerUserSidebar';
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Dashboard from './pages/superadmin/Dashboard';
import CustomerAdminDashboard from './pages/customeradmin/Dashboard';
import CustomerUserDashboard from './pages/customeruser/Dashboard';
import CustomerUserQuestionnaires from './pages/customeruser/questionnaire/sample';
import QuestionnaireBanks from './pages/superadmin/questionnaireBanks';
import Create from './pages/superadmin/questionnaireBanks/create';
import Category from './pages/superadmin/questionBanks/category';
import QuestionsCategoryWise from './pages/customeradmin/questions/category';
import Show from './pages/customeradmin/questionnaire';
import FeedbackForm from './pages/customeruser/feedback/feedbackform';
import SingleQuestionnaire from './pages/customeradmin/questionnaire/singleQuestionnaire';
import CustomerAdmins from './pages/superadmin/customeradmins';
import CustomerUsersIndex from './pages/superadmin/customerusers';
import CustomerUsers from './pages/customeradmin/customerusers';
import CreateCustomerUser from './pages/customeradmin/customerusers/create';
import SingleQuestionnaireBank from './pages/superadmin/questionnaireBanks/singleQuestionnaireBank';

import SignIn from './pages/login/SignIn';
import Unauthorized from './pages/login/Unauthorized';
import ProtectedRoute from './pages/login/ProtectedRoute';
import { AuthProvider, useAuth } from './pages/login/AuthContext';
import useCurrentRoute from './pages/login/useCurrentRoute';
import { jwtDecode } from 'jwt-decode';
import Register from './pages/login/Register';
import SingleEndUserDetail from './pages/customeradmin/reports/SingleEndUserDetail';

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const navigate = useNavigate();
  const currentRoute = useCurrentRoute();
  const { authState,logout } = useAuth();

  const handleLogin = (token) => {
    const decodedToken = jwtDecode(token);
    navigate({
      SuperAdmin: '/superadmin/dashboard',
      CustomerAdmin: '/customeradmin/dashboard',
      CustomerUser: '/customeruser/dashboard',
    }[decodedToken.role] || '/unauthorized');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderSidebar = () => {
    switch (authState.role) {
      case "SuperAdmin":
        return <MySidebar isSidebar={isSidebar} />;
      case "CustomerAdmin":
        return <CustomerAdminSidebar isSidebar={isSidebar} />;
      case "CustomerUser":
        return <CustomerUserSidebar isSidebar={isSidebar} />;
      default:
        return null;
    }
  };

  const showSidebarAndNavbar = currentRoute !== '/unauthorized';

  return (
    // <AuthProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            {authState.isAuthenticated && showSidebarAndNavbar && renderSidebar()}
            <main className="content">
              {authState.isAuthenticated && showSidebarAndNavbar && <Navbar handleLogout={handleLogout}/>}
              <Routes>
                <Route path="/login" element={<SignIn handleLogin={handleLogin} />} />
                <Route path="/register" element={<Register/>} />
                <Route path="/unauthorized" element={<Unauthorized handleLogout={handleLogout} />} />
                
                {/* SuperAdmin Routes */}
                <Route path="/superadmin/dashboard" element={<ProtectedRoute role="SuperAdmin" />}>
                  <Route path="" element={<Dashboard />} />
                </Route>
                <Route path="/superadmin/questionnairebanks" element={<ProtectedRoute role="SuperAdmin" />}>
                  <Route path="" element={<QuestionnaireBanks />} />
                </Route>
                <Route path="/superadmin/questionnairebanks/create" element={<ProtectedRoute role="SuperAdmin" />}>
                  <Route path="" element={<Create />} />
                </Route>
                <Route path="/superadmin/questionnairebank/:id" element={<ProtectedRoute role="SuperAdmin" />}>
                  <Route path="" element={<SingleQuestionnaireBank />} />
                </Route>
                <Route path="/superadmin/questionbanks" element={<ProtectedRoute role="SuperAdmin" />}>
                  <Route path="" element={<Category />} />
                </Route>
                <Route path="/superadmin/customeradmins" element={<ProtectedRoute role="SuperAdmin" />}>
                  <Route path="" element={<CustomerAdmins />} />
                </Route>
                <Route path="/superadmin/customerusers" element={<ProtectedRoute role="SuperAdmin" />}>
                  <Route path="" element={<CustomerUsersIndex />} />
                </Route>




                {/* CustomerAdmin Routes */}
                <Route path="/customeradmin/dashboard" element={<ProtectedRoute role="CustomerAdmin" />}>
                  <Route path="" element={<CustomerAdminDashboard />} />
                </Route >
                <Route path="/customeradmin/questionnaires" element={<ProtectedRoute role="CustomerAdmin" />}>
                  <Route path="" element={<Show />} />
                </Route >
                <Route path="/customeradmin/questions" element={<ProtectedRoute role="CustomerAdmin" />}>
                  <Route path="" element={<QuestionsCategoryWise />} />
                </Route >
                <Route path="/customeradmin/questionnaire/:id" element={<ProtectedRoute role="CustomerAdmin" />}>
                  <Route path="" element={<SingleQuestionnaire />} />
                </Route >
                <Route path="/customeradmin/customerusers" element={<ProtectedRoute role="CustomerAdmin" />}>
                  <Route path="" element={<CustomerUsers />} />
                </Route >
                <Route path="/customeradmin/customeruser/create" element={<ProtectedRoute role="CustomerAdmin" />}>
                  <Route path="" element={<CreateCustomerUser />} />
                </Route >

                {/* <Route path="/endusers" element={<ProtectedRoute role="CustomerAdmin" />} >
                  <Route path="" element={<EndUserReport />} />
                </Route> */}
                <Route path="/details/:feedbackMasterId" element={<ProtectedRoute role="CustomerAdmin" />} >
                  <Route path="" element={<SingleEndUserDetail />} />
                </Route>
                {/* <Route path="/questionsreport" element={<ProtectedRoute role="CustomerAdmin" />} >
                  <Route path="" element={<QuestionReport />} />
                </Route> */}



                
                {/* CustomerUser Routes */}
                <Route path="/customeruser/dashboard" element={<ProtectedRoute role="CustomerUser" />}>
                  <Route path="" element={<CustomerUserDashboard />} />
                </Route >
                <Route path="/customeruser/questionnaires" element={<ProtectedRoute role="CustomerUser" />}>
                  <Route path="" element={<CustomerUserQuestionnaires />} />
                </Route >
                
                <Route path="/questionnaire/:id" element={<ProtectedRoute role="CustomerUser" />}>
                  <Route path="" element={<FeedbackForm />} />
                </Route >
                
               </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    // </AuthProvider>
  );
}

export default App;
