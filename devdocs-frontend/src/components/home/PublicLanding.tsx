'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function PublicLanding() {
  const router = useRouter();

  return (
    <div className="bg-black text-white overflow-x-hidden selection:bg-[#07b9d5] selection:text-black">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#07b9d5] to-[#059db6] flex items-center justify-center shadow-lg shadow-[#07b9d5]/50">
              <span className="text-white text-xl font-bold">D</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Dev<span className="text-[#07b9d5]">Docs</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button 
              className="text-sm font-medium text-slate-300 hover:text-[#07b9d5] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#07b9d5] focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1" 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Features
            </button>
            <button 
              className="text-sm font-medium text-slate-300 hover:text-[#07b9d5] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#07b9d5] focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1" 
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              How it Works
            </button>
            <button 
              className="text-sm font-medium text-slate-300 hover:text-[#07b9d5] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#07b9d5] focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1" 
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              About
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/auth/signin')}
              className="hidden sm:block text-sm font-bold text-white hover:text-[#07b9d5] transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => router.push('/auth/signup')}
              className="rounded-lg bg-[#07b9d5] px-4 py-2 text-sm font-bold text-black transition-all hover:bg-[#059db6] hover:shadow-[0_0_15px_rgba(7,185,213,0.4)]"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 pt-20 pb-16 text-center sm:px-6 lg:px-8">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0" style={{
          background: 'radial-gradient(circle at center, rgba(7, 185, 213, 0.15) 0%, rgba(0, 0, 0, 0) 70%)'
        }}></div>
        <div 
          className="absolute inset-0 z-0 opacity-[0.07]" 
          style={{
            backgroundImage: 'linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'linear-gradient(to bottom, transparent, 10%, black, 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, 5%, black, 90%, transparent)'
          }}
        ></div>

        <div className="relative z-10 mx-auto max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#07b9d5]/20 bg-[#07b9d5]/5 px-3 py-1 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-[#07b9d5] animate-pulse"></span>
            <span className="text-xs font-medium text-[#07b9d5] uppercase tracking-wide">v2.0 Now Available</span>
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl">
            Your Personal <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#07b9d5] to-blue-400">AI-Powered</span> Code Library
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-400 md:text-xl leading-relaxed">
            Store, organize, and retrieve your snippets instantly with semantic search. Stop reinventing the wheel and start shipping faster.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 pt-4">
            <button 
              onClick={() => router.push('/auth/signup')}
              className="group relative flex h-12 w-full min-w-[160px] items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#07b9d5] px-6 text-base font-bold text-black transition-all hover:bg-[#059db6] hover:shadow-[0_0_20px_rgba(7,185,213,0.5)] sm:w-auto"
            >
              <span>Get Started Free</span>
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button className="flex h-12 w-full min-w-[160px] items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 text-base font-bold text-white transition-all hover:bg-white/10 sm:w-auto">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Code Snippet Visual */}
          <div className="mt-12 w-full max-w-3xl rounded-xl border border-white/10 bg-[#0a0a0a] p-2 shadow-2xl shadow-[#07b9d5]/10">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <div className="ml-4 h-2 w-32 rounded-full bg-white/10"></div>
            </div>
            <div className="p-6 text-left font-mono text-sm text-slate-300 overflow-x-auto">
              <div className="flex">
                <span className="text-[#07b9d5] mr-4 select-none">1</span>
                <p><span className="text-purple-400">const</span> <span className="text-yellow-300">findSolution</span> <span className="text-purple-400">=</span> <span className="text-blue-400">async</span> (<span className="text-orange-300">query</span>) <span className="text-purple-400">=&gt;</span> {'{'}</p>
              </div>
              <div className="flex">
                <span className="text-[#07b9d5] mr-4 select-none">2</span>
                <p className="pl-4"><span className="text-slate-500">// AI Semantic Search in action</span></p>
              </div>
              <div className="flex">
                <span className="text-[#07b9d5] mr-4 select-none">3</span>
                <p className="pl-4"><span className="text-purple-400">const</span> <span className="text-orange-300">snippet</span> <span className="text-purple-400">=</span> <span className="text-purple-400">await</span> <span className="text-yellow-300">DevDocs</span>.<span className="text-blue-400">search</span>(<span className="text-orange-300">query</span>);</p>
              </div>
              <div className="flex">
                <span className="text-[#07b9d5] mr-4 select-none">4</span>
                <p className="pl-4"><span className="text-purple-400">return</span> <span className="text-orange-300">snippet</span>.<span className="text-blue-400">code</span>;</p>
              </div>
              <div className="flex">
                <span className="text-[#07b9d5] mr-4 select-none">5</span>
                <p>{'}'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 bg-black" id="features">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Why DevDocs?</h2>
            <p className="mt-4 text-lg text-slate-400">Everything you need to manage your code snippets efficiently.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="group relative rounded-xl border border-[#07b9d5]/20 bg-[#0a0a0a] p-8 transition-all hover:-translate-y-1 hover:border-[#07b9d5]/50 hover:shadow-[0_0_30px_rgba(7,185,213,0.1)]">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#07b9d5]/10 text-[#07b9d5]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">AI Semantic Search</h3>
              <p className="text-slate-400">Find code by what it does, not just variable names. Our AI understands context and intent.</p>
            </div>

            {/* Feature 2 */}
            <div className="group relative rounded-xl border border-[#07b9d5]/20 bg-[#0a0a0a] p-8 transition-all hover:-translate-y-1 hover:border-[#07b9d5]/50 hover:shadow-[0_0_30px_rgba(7,185,213,0.1)]">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#07b9d5]/10 text-[#07b9d5]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Multi-Language Support</h3>
              <p className="text-slate-400">Beautiful syntax highlighting for 50+ languages including Python, JavaScript, Rust, and Go.</p>
            </div>

            {/* Feature 3 */}
            <div className="group relative rounded-xl border border-[#07b9d5]/20 bg-[#0a0a0a] p-8 transition-all hover:-translate-y-1 hover:border-[#07b9d5]/50 hover:shadow-[0_0_30px_rgba(7,185,213,0.1)]">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#07b9d5]/10 text-[#07b9d5]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Code Organization</h3>
              <p className="text-slate-400">Smart tagging, nested folder structures, and favorites to keep your library pristine.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 bg-[#050505]" id="how-it-works">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-center md:text-left border-l-4 border-[#07b9d5] pl-4">
              How It Works
            </h2>
          </div>
          <div className="grid gap-12 md:grid-cols-3 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-[#07b9d5]/20 via-[#07b9d5]/50 to-[#07b9d5]/20 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#050505] bg-[#0a0a0a] shadow-[0_0_0_1px_rgba(7,185,213,0.3)]">
                <svg className="w-10 h-10 text-[#07b9d5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">1. Save</h3>
              <p className="text-slate-400">Paste your snippet directly from your IDE or import from GitHub. Add quick tags for easy filtering later.</p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#050505] bg-[#0a0a0a] shadow-[0_0_0_1px_rgba(7,185,213,0.3)]">
                <svg className="w-10 h-10 text-[#07b9d5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">2. Search</h3>
              <p className="text-slate-400">Ask a question in plain English like "How do I sort an array of objects?". Our AI finds the best match.</p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#050505] bg-[#0a0a0a] shadow-[0_0_0_1px_rgba(7,185,213,0.3)]">
                <svg className="w-10 h-10 text-[#07b9d5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">3. Solve</h3>
              <p className="text-slate-400">Copy the perfect solution to your clipboard with one click. Solve the problem and move on.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-black border-t border-white/5" id="about">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
            Ready to upgrade your workflow?
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of developers who are coding faster with their own personal AI library.
          </p>
          <button 
            onClick={() => router.push('/auth/signup')}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-[#07b9d5] px-8 text-lg font-bold text-black transition-all hover:bg-[#059db6] hover:shadow-[0_0_20px_rgba(7,185,213,0.4)]"
          >
            Start Building Your Library
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#07b9d5] to-[#059db6] flex items-center justify-center shadow-lg shadow-[#07b9d5]/50">
                <span className="text-white text-lg font-bold">D</span>
              </div>
              <span className="text-lg font-bold text-white">DevDocs</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <a className="text-sm text-slate-500 hover:text-white transition-colors cursor-pointer">Privacy Policy</a>
              <a className="text-sm text-slate-500 hover:text-white transition-colors cursor-pointer">Terms of Service</a>
              <a className="text-sm text-slate-500 hover:text-white transition-colors cursor-pointer">Twitter</a>
              <a className="text-sm text-slate-500 hover:text-white transition-colors cursor-pointer">GitHub</a>
            </div>
            <div className="text-sm text-slate-600">
              © 2026 DevDocs Inc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
