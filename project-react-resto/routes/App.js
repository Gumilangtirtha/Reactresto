// ...existing imports...
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './components/auth/Login';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route 
            path="/admin/*" 
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            } 
          />
          {/* ...existing routes... */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
