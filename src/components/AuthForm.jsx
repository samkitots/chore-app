import React, { useState } from 'react';
import { signInWithEmail, signUpWithEmail } from '../firebase';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // State for the user's name
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailValid(validateEmail(newEmail));
  };

  const handleAuthenticate = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        await signInWithEmail(email, password);
        console.log('User logged in!');
      } else {
        await signUpWithEmail(email, password, name); // Pass name to signUpWithEmail
        console.log('User signed up!');
      }
    } catch (error) {
      setError(error.message);
      console.error('Authentication Error:', error);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setResetEmailSent(false);

    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#f8fcfa] group/design-root overflow-x-hidden justify-center items-center" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col justify-center items-center">
        <div className="layout-content-container flex flex-col w-[400px] max-w-[512px] py-8 px-6 bg-white rounded-xl shadow-md">
          <h2 className="text-[#0e1b17] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-6">ChoreRotator</h2>

          {showForgotPassword ? (
            <>
              <h2 className="text-[#0e1b17] tracking-light text-[24px] font-bold leading-tight px-4 text-center pb-4">
                Forgot Password {resetEmailSent && ' - Email Sent!'}
              </h2>
              <form onSubmit={handleForgotPassword}>
                <div className="flex flex-col gap-4 px-4 py-3">
                  <label className="flex flex-col">
                    <input
                      placeholder="Email"
                      className="form-input flex w-full rounded-xl text-[#0e1b17] focus:outline-0 focus:ring-0 border-none bg-[#e7f3ef] h-12 placeholder:text-[#4e977f] p-4 text-base font-normal leading-normal"
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                </div>
                {error && <p className="text-red-500 text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">{error}</p>}
                {!resetEmailSent && (
                  <div className="flex px-4 py-3">
                    <button type="submit" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 flex-1 bg-[#47eab4] text-white text-sm font-bold leading-normal tracking-[0.015em]">
                      <span className="truncate">Send Reset Email</span>
                    </button>
                  </div>
                )}
              </form>
              <p className="text-[#4e977f] text-sm font-normal leading-normal pb-3 pt-4 px-4 text-center underline">
                <button type="button" onClick={() => { setShowForgotPassword(false); setError(null); setResetEmailSent(false); }}>Back to Login</button>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-[#0e1b17] tracking-light text-[24px] font-bold leading-tight px-4 text-center pb-4">
                {isLogin ? 'Log In' : 'Sign Up'}
              </h2>
              <form onSubmit={handleAuthenticate}>
                <div className="flex flex-col gap-4 px-4 py-3">
                  {!isLogin && (
                    <label className="flex flex-col">
                      <input
                        placeholder="Name"
                        className="form-input flex w-full rounded-xl text-[#0e1b17] focus:outline-0 focus:ring-0 border-none bg-[#e7f3ef] h-12 placeholder:text-[#4e977f] p-4 text-base font-normal leading-normal"
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </label>
                  )}
                  <label className="flex flex-col">
                    <input
                      placeholder="Email"
                      className="form-input flex w-full rounded-xl text-[#0e1b17] focus:outline-0 focus:ring-0 border-none bg-[#e7f3ef] h-12 placeholder:text-[#4e977f] p-4 text-base font-normal leading-normal"
                      type="email"
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                    />
                  </label>
                  {isEmailValid && (
                    <label className="flex flex-col">
                      <input
                        placeholder="Password"
                        className="form-input flex w-full rounded-xl text-[#0e1b17] focus:outline-0 focus:ring-0 border-none bg-[#e7f3ef] h-12 placeholder:text-[#4e977f] p-4 text-base font-normal leading-normal"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </label>
                  )}
                </div>
                {error && <p className="text-red-500 text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">{error}</p>}
                <div className="flex px-4 py-3">
                  <button type="submit" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 flex-1 bg-[#47eab4] text-white text-sm font-bold leading-normal tracking-[0.015em]">
                    <span className="truncate">{isLogin ? 'Log In' : 'Sign Up'}</span>
                  </button>
                </div>
              </form>
              <p className="text-[#4e977f] text-sm font-normal leading-normal pb-3 pt-4 px-4 text-center underline">
                <button type="button" onClick={() => { setIsLogin(!isLogin); setError(null); }}>
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log In'}
                </button>
              </p>
              {isLogin && (
                <p className="text-[#4e977f] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline">
                  <button type="button" onClick={() => { setShowForgotPassword(true); setError(null); }}>Forgot Password?</button>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
