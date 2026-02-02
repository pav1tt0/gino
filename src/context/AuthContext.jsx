import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase, supabaseConfigOk, checkInviteCode } from '../supabaseClient';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const initAuth = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();
                if (error) {
                    console.error('Auth session error:', error);
                }
                if (isMounted) {
                    setSession(data?.session || null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        initAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            if (isMounted) {
                setSession(nextSession);
            }
        });

        return () => {
            isMounted = false;
            authListener?.subscription?.unsubscribe();
        };
    }, []);

    const signIn = async ({ email, password }) => {
        setError('');
        if (!supabaseConfigOk) {
            setError('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
            return false;
        }

        setBusy(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: String(email || '').trim(),
                password: String(password || '')
            });

            if (error) {
                setError(error.message);
                return false;
            }
            return true;
        } catch (error) {
            setError('Login failed. Please try again.');
            console.error('Sign in error:', error);
            return false;
        } finally {
            setBusy(false);
        }
    };

    const signUp = async ({ email, password, inviteCode }) => {
        setError('');
        if (!supabaseConfigOk) {
            setError('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
            return false;
        }

        setBusy(true);
        try {
            const inviteOk = await checkInviteCode(inviteCode);
            if (!inviteOk) {
                setError('Invalid invite code.');
                return false;
            }

            const { error } = await supabase.auth.signUp({
                email: String(email || '').trim(),
                password: String(password || '')
            });

            if (error) {
                setError(error.message);
                return false;
            }

            toast.success('Account created. You are now signed in.');
            return true;
        } catch (error) {
            setError('Sign up failed. Please try again.');
            console.error('Sign up error:', error);
            return false;
        } finally {
            setBusy(false);
        }
    };

    const signOut = async () => {
        setError('');
        setBusy(true);
        try {
            const { error } = await supabase.auth.signOut({ scope: 'local' });
            if (error) {
                console.error('Sign out error:', error);
            }
        } finally {
            setSession(null);
            setBusy(false);
        }
    };

    const value = {
        session,
        loading,
        error,
        busy,
        signIn,
        signUp,
        signOut,
        setError // Allow components to clear error
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
