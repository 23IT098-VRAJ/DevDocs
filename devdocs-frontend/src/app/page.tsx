/**
 * Home/Landing Page
 * Hero section with features, CTA, and recent solutions preview
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { useSolutions } from '@/hooks/useSolutions';
import { SolutionCard } from '@/components/solution/SolutionCard';
import { APP_NAME } from '@/lib/constants';
import { Footer } from '@/components/layout';

export default function Home() {
  const { data: solutions, isLoading } = useSolutions();
  const recentSolutions = solutions?.slice(0, 3) || [];
  
  // Scroll animation refs
  const featureRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const [visibleFeatures, setVisibleFeatures] = useState([false, false, false]);

  useEffect(() => {
    const observers = featureRefs.map((ref, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleFeatures(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }
        },
        { threshold: 0.1, rootMargin: '0px' }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return observer;
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Simple Header with Logo Only */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="container mx-auto">
          <Link href="/" className="inline-flex items-center space-x-2 hover:opacity-90 transition-opacity group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 text-white text-xl font-bold shadow-lg shadow-cyan-400/50 group-hover:shadow-cyan-400/70 transition-shadow">
              D
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-500 bg-clip-text text-transparent">{APP_NAME}</span>
          </Link>
        </div>
      </header>

      {/* Hero Section - What is DevDocs */}
      <section className="relative bg-black py-20 md:py-32 overflow-hidden pt-32">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-grid opacity-30"></div>
        
        {/* Floating Code Snippets */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-code" style={{top: '10%', left: '5%', animationDelay: '0s'}}>const search = () =&gt; {'{}'}</div>
          <div className="floating-code" style={{top: '20%', right: '8%', animationDelay: '2s'}}>function findSolution()</div>
          <div className="floating-code" style={{top: '60%', left: '10%', animationDelay: '4s'}}>async/await</div>
          <div className="floating-code" style={{bottom: '15%', right: '15%', animationDelay: '6s'}}>import React from 'react'</div>
          <div className="floating-code" style={{top: '40%', right: '20%', animationDelay: '8s'}}>SELECT * FROM</div>
          <div className="floating-code" style={{bottom: '30%', left: '15%', animationDelay: '10s'}}>&lt;Component /&gt;</div>
        </div>
        
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="particle" style={{top: '20%', left: '15%'}}></div>
          <div className="particle" style={{top: '40%', right: '25%'}}></div>
          <div className="particle" style={{bottom: '30%', left: '30%'}}></div>
          <div className="particle" style={{top: '70%', right: '40%'}}></div>
          <div className="particle" style={{top: '50%', left: '50%'}}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 text-white text-4xl font-bold shadow-2xl shadow-cyan-400/70 animate-pulse ring-4 ring-cyan-400/30">
              D
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-400 bg-clip-text text-transparent mb-6 animate-gradient drop-shadow-lg">
            {APP_NAME}
          </h1>
          <p className="text-2xl md:text-3xl text-white mb-4 font-bold tracking-tight">
            Your Personal <span className="text-cyan-400">Code Search Engine</span>
          </p>
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Stop scrolling through old projects. Store code solutions once, find them instantly with AI-powered semantic search.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signin">
              <Button variant="primary" size="lg" className="hover:scale-110 hover:shadow-2xl hover:shadow-cyan-400/70 transition-all text-lg px-8">
                Save Your First Solution
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="hover:scale-110 transition-all text-lg px-8">
                Try AI Search
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-black border-t-2 border-cyan-400/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-cyan-400 to-cyan-500 bg-clip-text text-transparent mb-16">
            How DevDocs Works
          </h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute -inset-4 bg-cyan-400/20 rounded-full blur-xl group-hover:bg-cyan-400/30 transition-all"></div>
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 text-white text-4xl font-bold shadow-2xl shadow-cyan-400/50">
                    1
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">Save</h3>
              <p className="text-slate-300 leading-relaxed">
                Found a solution that works? Paste your code, add a title and tags. Takes 30 seconds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute -inset-4 bg-green-400/20 rounded-full blur-xl group-hover:bg-green-400/30 transition-all"></div>
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-cyan-400 text-white text-4xl font-bold shadow-2xl shadow-green-400/50">
                    2
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-green-400 mb-4">Search</h3>
              <p className="text-slate-300 leading-relaxed">
                Need it back? Type what you remember in plain English. AI understands meaning, not just keywords.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute -inset-4 bg-purple-400/20 rounded-full blur-xl group-hover:bg-purple-400/30 transition-all"></div>
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-4xl font-bold shadow-2xl shadow-purple-400/50">
                    3
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-purple-400 mb-4">Use</h3>
              <p className="text-slate-300 leading-relaxed">
                Copy the code, see the explanation, check the tags. Your past solutions at your fingertips.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 bg-black border-t-2 border-cyan-400/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <Link href="/auth/signin">
              <div 
                ref={featureRefs[0]}
                className={`bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-2 border-cyan-400/20 rounded-2xl p-8 text-center group cursor-pointer hover:scale-105 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-400/30 transition-all duration-300 ${visibleFeatures[0] ? 'animate-fade-in-up' : 'scroll-animate'}`}
                style={{animationDelay: '0.1s'}}
              >
                <div className="flex justify-center mb-6">
                  <div className="p-6 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl shadow-lg shadow-cyan-400/50 group-hover:shadow-2xl group-hover:shadow-cyan-400/70 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-cyan-400 mb-3">Lightning Fast</h3>
                <p className="text-slate-400">
                  No complex forms. Just paste code and go.
                </p>
              </div>
            </Link>

            {/* Feature 2 */}
            <Link href="/auth/signin">
              <div 
                ref={featureRefs[1]}
                className={`bg-gradient-to-br from-green-500/10 to-cyan-400/5 border-2 border-green-400/20 rounded-2xl p-8 text-center group cursor-pointer hover:scale-105 hover:border-green-400/50 hover:shadow-2xl hover:shadow-green-400/30 transition-all duration-300 ${visibleFeatures[1] ? 'animate-fade-in-up' : 'scroll-animate'}`}
                style={{animationDelay: '0.2s'}}
              >
                <div className="flex justify-center mb-6">
                  <div className="p-6 bg-gradient-to-br from-green-500 to-cyan-400 rounded-2xl shadow-lg shadow-green-500/50 group-hover:shadow-2xl group-hover:shadow-green-500/70 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-green-400 mb-3">Smart AI</h3>
                <p className="text-slate-400">
                  Search by meaning, not exact words.
                </p>
              </div>
            </Link>

            {/* Feature 3 */}
            <Link href="/auth/signin">
              <div 
                ref={featureRefs[2]}
                className={`bg-gradient-to-br from-purple-500/10 to-pink-500/5 border-2 border-purple-400/20 rounded-2xl p-8 text-center group cursor-pointer hover:scale-105 hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-400/30 transition-all duration-300 ${visibleFeatures[2] ? 'animate-fade-in-up' : 'scroll-animate'}`}
                style={{animationDelay: '0.3s'}}
              >
                <div className="flex justify-center mb-6">
                  <div className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/50 group-hover:shadow-2xl group-hover:shadow-purple-500/70 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-purple-400 mb-3">Organized</h3>
                <p className="text-slate-400">
                  Tag system keeps everything sorted.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Solutions Section */}
      {!isLoading && recentSolutions.length > 0 && (
        <section className="py-20 bg-black border-t-2 border-cyan-400/20">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-500 bg-clip-text text-transparent">Recent Solutions</h2>
              <Link href="/solution">
                <Button variant="ghost" size="sm">
                  View All →
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {recentSolutions.map((solution) => (
                <SolutionCard key={solution.id} solution={solution} showActions={false} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      <section className="relative py-24 bg-black border-t-2 border-cyan-400/30 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10"></div>
        
        {/* Floating particles for final section */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="particle" style={{top: '30%', left: '10%'}}></div>
          <div className="particle" style={{top: '60%', right: '15%'}}></div>
          <div className="particle" style={{bottom: '20%', left: '20%'}}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Stop Losing Code Solutions
              </h2>
              <p className="text-xl text-slate-400 mb-8">
                Start your personal code library today. Free forever.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="flex items-center gap-3 bg-cyan-400/5 border border-cyan-400/20 rounded-lg p-4">
                <svg className="w-6 h-6 text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-300">No credit card</span>
              </div>
              <div className="flex items-center gap-3 bg-green-400/5 border border-green-400/20 rounded-lg p-4">
                <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-300">Setup in 30 seconds</span>
              </div>
              <div className="flex items-center gap-3 bg-purple-400/5 border border-purple-400/20 rounded-lg p-4">
                <svg className="w-6 h-6 text-purple-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-300">Unlimited solutions</span>
              </div>
            </div>

            <div className="text-center">
              <Link href="/auth/signin">
                <Button variant="primary" size="lg" className="shadow-2xl shadow-cyan-400/50 hover:scale-110 transition-all text-lg px-12 py-6">
                  Start Building Your Library
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
