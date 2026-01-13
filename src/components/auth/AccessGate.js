import React, { useState, useEffect } from 'react';
import { Lock, Mail, KeyRound, LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import logo from '../../Logo-sustain.png';

const AccessGate = ({ onSignIn, onSignUp, authBusy, authError, supabaseConfigOk }) => {
  const [mode, setMode] = useState('gate');
  const [localError, setLocalError] = useState('');

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirm, setSignUpConfirm] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  useEffect(() => {
    setLocalError('');
  }, [mode]);

  const handleSubmitSignIn = async (event) => {
    event.preventDefault();
    setLocalError('');

    if (!signInEmail.trim() || !signInPassword) {
      setLocalError('Please enter email and password.');
      return;
    }

    await onSignIn({
      email: signInEmail,
      password: signInPassword
    });
  };

  const handleSubmitSignUp = async (event) => {
    event.preventDefault();
    setLocalError('');

    if (!signUpEmail.trim() || !signUpPassword || !signUpConfirm || !inviteCode.trim()) {
      setLocalError('Please fill in all fields.');
      return;
    }

    if (signUpPassword !== signUpConfirm) {
      setLocalError('Passwords do not match.');
      return;
    }

    await onSignUp({
      email: signUpEmail,
      password: signUpPassword,
      inviteCode
    });
  };

  const showAside = mode === 'gate';

  return (
    <div className={`w-full ${showAside ? 'max-w-3xl' : 'max-w-md'} bg-white shadow-2xl rounded-2xl border border-gray-200 overflow-hidden`}>
      <div className={showAside ? 'grid md:grid-cols-[1.1fr_1fr]' : ''}>
        {showAside && (
          <div className="relative overflow-hidden bg-white text-green-800 px-6 py-10 md:px-10 border-b md:border-b-0 md:border-r border-green-100">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-100/60 rounded-full"></div>
            <div className="absolute -bottom-14 -left-10 w-40 h-40 bg-emerald-100/60 rounded-full"></div>
            <div className="relative space-y-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <img src={logo} alt="sustAId Logo" className="w-20 h-20 object-contain" />
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                    Welcome to sust<span className="italic">AI</span>d
                  </h1>
                  <p className="text-sm text-green-700 mt-1">AI-Powered Sustainable Material Selection</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
                Access is limited to fashion sustainability professionals. Sign in to continue or request access with an
                invite code.
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-green-800">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200">
                  <ShieldCheck className="w-4 h-4 text-green-700" />
                  Professional platform
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200">
                  <ShieldCheck className="w-4 h-4 text-green-700" />
                  Invite-only access
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200">
                  <ShieldCheck className="w-4 h-4 text-green-700" />
                  Immediate activation
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="px-6 py-6 md:px-7 md:py-7 space-y-4">
        {!supabaseConfigOk && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg px-3 py-2">
            Supabase is not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.
          </div>
        )}

        {localError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
            {localError}
          </div>
        )}

        {authError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
            {authError}
          </div>
        )}

        {mode === 'gate' && (
          <div className="space-y-5">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-900">Welcome back</h2>
              <p className="text-sm text-gray-600">
                Sign in to continue. If you received an invite, request access to create your account.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold disabled:bg-gray-300 disabled:text-gray-600"
                disabled={authBusy || !supabaseConfigOk}
                onClick={() => setMode('signin')}
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-white border border-green-600 text-green-700 rounded-lg hover:bg-green-50 transition-colors text-sm font-semibold disabled:bg-gray-100 disabled:text-gray-400"
                disabled={authBusy || !supabaseConfigOk}
                onClick={() => setMode('signup')}
              >
                <UserPlus className="w-4 h-4" />
                <span>Request Access</span>
              </button>
            </div>
          </div>
        )}

        {mode === 'signin' && (
          <form className="space-y-4" onSubmit={handleSubmitSignIn}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-gray-50"
                  placeholder="you@example.com"
                  disabled={authBusy || !supabaseConfigOk}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-gray-50"
                  placeholder="Enter your password"
                  disabled={authBusy || !supabaseConfigOk}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold disabled:bg-gray-300 disabled:text-gray-600"
              disabled={authBusy || !supabaseConfigOk}
            >
              <LogIn className="w-4 h-4" />
              <span>{authBusy ? 'Signing in...' : 'Sign In'}</span>
            </button>

            <div className="text-sm text-gray-600 text-center">
              Need an invite?{' '}
              <button
                type="button"
                className="text-green-600 hover:text-green-700 font-medium"
                onClick={() => setMode('signup')}
              >
                Request access
              </button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setMode('gate')}
              >
                Back
              </button>
            </div>
          </form>
        )}

        {mode === 'signup' && (
          <form className="space-y-4" onSubmit={handleSubmitSignUp}>
            <div className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-sm text-blue-800">
              Access is immediate once a valid invite code is provided.
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-gray-50"
                  placeholder="you@example.com"
                  disabled={authBusy || !supabaseConfigOk}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-gray-50"
                  placeholder="Create a password"
                  disabled={authBusy || !supabaseConfigOk}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={signUpConfirm}
                  onChange={(e) => setSignUpConfirm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-gray-50"
                  placeholder="Repeat your password"
                  disabled={authBusy || !supabaseConfigOk}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Invite Code</label>
              <div className="relative">
                <UserPlus className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-gray-50"
                  placeholder="Enter invite code"
                  disabled={authBusy || !supabaseConfigOk}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold disabled:bg-gray-300 disabled:text-gray-600"
              disabled={authBusy || !supabaseConfigOk}
            >
              <UserPlus className="w-4 h-4" />
              <span>{authBusy ? 'Creating account...' : 'Request Access'}</span>
            </button>

            <div className="text-sm text-gray-600 text-center">
              Already have an account?{' '}
              <button
                type="button"
                className="text-green-600 hover:text-green-700 font-medium"
                onClick={() => setMode('signin')}
              >
                Sign in
              </button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setMode('gate')}
              >
                Back
              </button>
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  );
};

export default AccessGate;
