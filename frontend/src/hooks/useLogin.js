import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import axios from 'axios';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/user/login', {
        email,
        password
      });

      // Save the user to local storage
      localStorage.setItem('user', JSON.stringify(response.data));

      // Update the Auth Context
      dispatch({ type: 'LOGIN', payload: response.data });

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.error || 'An error occurred during login');
    }
  };

  return { login, isLoading, error };
};