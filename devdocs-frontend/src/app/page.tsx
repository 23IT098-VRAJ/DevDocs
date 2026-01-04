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
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900 py-20 md:py-32 overflow-hidden">
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
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white text-4xl font-bold shadow-2xl shadow-blue-500/70 animate-pulse ring-4 ring-blue-500/30">
              D
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent mb-6 animate-gradient drop-shadow-lg">
            {APP_NAME}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-4 font-semibold">
            AI-Powered Code Search for Developers
          </p>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Save solutions in 30 seconds, search with natural language. 
            Semantic search powered by vector embeddings finds what you need, even if you don't remember the exact words.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/solution/create">
              <Button variant="primary" size="lg" className="hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/70 transition-all">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Save Your First Solution
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" size="lg" className="hover:scale-105 transition-all">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Try Semantic Search
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-12">
            Why {APP_NAME}?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div 
              ref={featureRefs[0]}
              className={`text-center group ${visibleFeatures[0] ? 'animate-fade-in-up' : 'scroll-animate'}`}
              style={{animationDelay: '0.1s'}}
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full shadow-lg shadow-blue-500/50 group-hover:shadow-xl group-hover:shadow-blue-500/70 group-hover:scale-110 transition-all">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Lightning Fast</h3>
              <p className="text-slate-400">
                Save code snippets in 30 seconds. No complex setup, no lengthy forms. Just paste, tag, and go.
              </p>
            </div>

            {/* Feature 2 */}
            <div 
              ref={featureRefs[1]}
              className={`text-center group ${visibleFeatures[1] ? 'animate-fade-in-up' : 'scroll-animate'}`}
              style={{animationDelay: '0.2s'}}
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full shadow-lg shadow-emerald-500/50 group-hover:shadow-xl group-hover:shadow-emerald-500/70 group-hover:scale-110 transition-all">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Smart Search</h3>
              <p className="text-slate-400">
                Semantic search understands meaning, not just keywords. Find "authentication" even when searching "user login".
              </p>
            </div>

            {/* Feature 3 */}
            <div 
              ref={featureRefs[2]}
              className={`text-center group ${visibleFeatures[2] ? 'animate-fade-in-up' : 'scroll-animate'}`}
              style={{animationDelay: '0.3s'}}
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full shadow-lg shadow-violet-500/50 group-hover:shadow-xl group-hover:shadow-violet-500/70 group-hover:scale-110 transition-all">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Your Knowledge Base</h3>
              <p className="text-slate-400">
                Build your personal developer documentation. All your solutions, patterns, and code snippets in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Solutions Section */}
      {!isLoading && recentSolutions.length > 0 && (
        <section className="py-20 bg-slate-950">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Recent Solutions</h2>
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

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-600 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Build Your Knowledge Base?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join developers who are organizing their code solutions with semantic search
          </p>
          <Link href="/solution/create">
            <Button variant="secondary" size="lg">
              Get Started - It's Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
