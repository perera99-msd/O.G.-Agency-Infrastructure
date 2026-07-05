import { AdminProvider } from './context/AdminContext';
import { AuthProvider } from './context/AuthContext';
import { DashdarkWrapper } from './DashdarkWrapper';

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <DashdarkWrapper />
      </AdminProvider>
    </AuthProvider>
  );
}
