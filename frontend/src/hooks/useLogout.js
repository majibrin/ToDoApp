import { useAuthContext } from './useAuthContext';

export const useLogout = () => {
    const { dispatch } = useAuthContext();

    const logout = () => {
        // 1. Remove user from storage
        localStorage.removeItem('user');

        // 2. Dispatch logout action
        dispatch({ type: 'LOGOUT' });
    };

    return { logout };
};