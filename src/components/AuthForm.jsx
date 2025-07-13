import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const auth = getAuth();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        // You'll want to save the 'name' to your database here.
        // This example focuses on auth, see previous examples for database interaction.
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResetEmailSent(false);

    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  };
  
  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
    setError('');
    setResetEmailSent(false)
  }

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
              <form onSubmit={handlePasswordReset}>
                <div className="flex flex-col gap-4 px-4 py-3">
                  <label className="flex flex-col">
                    <input
                      placeholder="Email"
                      className="form-input flex w-full rounded-xl text-[#0e1b17] focus:outline-0 focus:ring-0 border-none bg-[#e7f3ef] h-12 placeholder:text-[#4e977f] p-4 text-base font-normal leading-normal"
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </label>
                </div>
                {error && <p className="text-red-500 text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">{error}</p>}
                {!resetEmailSent && (
                  <div className="flex px-4 py-3">
                    <button type="submit" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 flex-1 bg-[#47eab4] text-white text-sm font-bold leading-normal tracking-[0.015em]" disabled={loading}>
                      <span className="truncate">{loading ? 'Sending...' : 'Send Reset Email'}</span>
                    </button>
                  </div>
                )}
              </form>
              <p className="text-[#4e977f] text-sm font-normal leading-normal pb-3 pt-4 px-4 text-center underline">
                <button type="button" onClick={toggleForgotPassword} disabled={loading}>Back to Login</button>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-[#0e1b17] tracking-light text-[24px] font-bold leading-tight px-4 text-center pb-4">
                {isLogin ? 'Log In' : 'Sign Up'}
              </h2>
              <form onSubmit={handleAuth}>
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
                        disabled={loading}
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
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </label>
                  <label className="flex flex-col">
                      <input
                        placeholder="Password"
                        className="form-input flex w-full rounded-xl text-[#0e1b17] focus:outline-0 focus:ring-0 border-none bg-[#e7f3ef] h-12 placeholder:text-[#4e977f] p-4 text-base font-normal leading-normal"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                      />
                    </label>
                </div>
                {error && <p className="text-red-500 text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">{error}</p>}
                <div className="flex px-4 py-3">
                  <button type="submit" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 flex-1 bg-[#47eab4] text-white text-sm font-bold leading-normal tracking-[0.015em]" disabled={loading}>
                    <span className="truncate">{loading ? 'Authenticating...' : (isLogin ? 'Log In' : 'Sign Up')}</span>
                  </button>
                </div>
              </form>
              <p className="text-[#4e977f] text-sm font-normal leading-normal pb-3 pt-4 px-4 text-center underline">
                <button type="button" onClick={toggleForm} disabled={loading}>
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log In'}
                </button>
              </p>
              {isLogin && (
                <p className="text-[#4e977f] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline">
                  <button type="button" onClick={toggleForgotPassword} disabled={loading}>Forgot Password?</button>
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