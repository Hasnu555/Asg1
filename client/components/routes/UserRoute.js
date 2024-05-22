// components/routes/ProtectedRoute.js
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../../context';

const UserRoute = ({ children }) => {
  const [state] = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!state || !state.token) {
      
      router.push('/login');
    }
  }, [state, router]);

  if (!state || !state.token) {
    return null; // or a loading spinner
  }
  

  return children;
};

export default UserRoute;
