'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthHeader } from '@/components/layout/AuthHeader';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Successful login - redirect to home page
      router.push('/');
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <AuthHeader />
      
      {/* Animated background with grid */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>

        
        {/* Floating code snippets */}
        <div className="absolute top-20 left-10 text-cyan-500/20 font-mono text-sm animate-float">const auth = () =&gt; {'{}'}</div>
        <div className="absolute top-40 right-20 text-cyan-500/20 font-mono text-sm animate-float" style={{animationDelay: '1s'}}>async login()</div>
        <div className="absolute bottom-32 left-16 text-cyan-500/20 font-mono text-sm animate-float" style={{animationDelay: '2s'}}>{'<Session />'}</div>
        <div className="absolute bottom-20 right-16 text-cyan-500/20 font-mono text-sm animate-float" style={{animationDelay: '0.5s'}}>JWT.verify()</div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Header with glow effect */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3 relative inline-block">
            Welcome Back
            <div className="absolute -inset-1 bg-gradient-to-r from-[#07b9d5]/25 to-[#059ab3]/15 blur-lg -z-10"></div>
          </h2>
          <p className="text-gray-400 text-sm">Sign in to continue your coding journey</p>
        </div>

        {/* Sign In Form with pure black background */}
        <div className="bg-black backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-cyan-500/30 p-8 relative overflow-hidden">
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#07b9d5]/5 via-transparent to-[#07b9d5]/3 pointer-events-none"></div>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <form onSubmit={handleSubmit} className="space-y-6 relative">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 backdrop-blur-sm animate-in slide-in-from-top">
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {/* Email Field */}
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-black border-2 border-gray-800 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-white placeholder-gray-600 transition-all hover:border-gray-700"
                placeholder="you@example.com"
                disabled={loading}
                suppressHydrationWarning
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3.5 bg-black border-2 border-gray-800 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-white placeholder-gray-600 transition-all hover:border-gray-700"
                placeholder="••••••••"
                disabled={loading}
                suppressHydrationWarning
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-gradient-to-r from-[#07b9d5] to-[#059ab3] hover:from-[#059ab3] hover:to-[#07b9d5] text-black font-bold rounded-xl shadow-lg shadow-[#07b9d5]/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group mt-8"
            >
              <div className="absolute inset-0 bg-[#07b9d5] opacity-0 group-hover:opacity-20 transition-opacity"></div>
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-black text-gray-500">New to DevDocs?</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Link href="/auth/signup" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors group">
              Create an account
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>


      </div>
    </div>
  );
}
