import { useState } from 'react';
import { useAuthContext } from './useAuthContext'; // We haven't created this specific file yet, see note below*
import axios from 'axios';

// *NOTE: If you haven't created useAuthContext.js yet, ensure you have the context file ready. 
// If you skipped the hook creation step, you can use useContext(AuthContext) directly, 
// but using a custom hook is cleaner.

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/user/signup', {
        email,
        password
      });

      // Save the user (email + token) to local storage
      localStorage.setItem('user', JSON.stringify(response.data));

      // Update the Auth Context state
      dispatch({ type: 'LOGIN', payload: response.data });

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.error || 'An error occurred during signup');
    }
  };

  return { signup, isLoading, error };
};