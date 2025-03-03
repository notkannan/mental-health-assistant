'use client'

import React, { useEffect } from 'react';
import NavMenu from './components/NavMenu';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import Image from 'next/image';

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if(status === 'authenticated'){
      router.push('/dashboard')
    }
  }, [router, status])


  const features = [
    {
      title: "AI-Powered Assistance",
      description: "Automatically generate comprehensive session notes with key insights highlighted for quick reference.",
      icon: "📝"
    },
    {
      title: "Patient Categorization",
      description: "Our ML model analyzes conversation patterns to help identify potential conditions and treatment approaches.",
      icon: "🧠"
    },
    {
      title: "Research Insights",
      description: "Stay updated with the latest therapeutic approaches relevant to your patients' needs.",
      icon: "🔍"
    }
  ];


  return (
    <>
      <NavMenu />
      
      <main className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-50">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Welcome to</span>
              <span className="block text-blue-600">Med Portal, Doc.</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              A space to track your therapy sessions with our patients, with a touch of AI.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link href="/auth/signin" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                  Sign In
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link href="#howitworks" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                  How does it work?
                </Link>
              </div>
            </div>
          </div>

          {/* How it Works Section */}
          <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
            <h2 id="howitworks" className="text-3xl font-extrabold text-gray-900 text-center">How does it work?</h2>
            <p className="mt-4 text-lg text-gray-500">
              The app is built for therapists to keep track of their patients&apos; conversation history. With the help of a fine-tuned AI model, therapists get wonderful actionable insights from the AI bot on how to assist the patient, and the therapist can proceed with those.
            </p>
            <p className="mt-4 text-lg text-gray-500">
              Problems are classified by our trained ML model. This helps is analysis of data, for the future!
            </p>
            <p className="mt-4 text-lg text-gray-500">
              Additionally, the platform offers a comprehensive dashboard where therapists can view and manage their appointments, track patient progress, and access AI-generated reports. The integration with various tools and services ensures a seamless experience for both therapists and patients.
            </p>
            <p className="mt-4 text-lg text-gray-500">
              Our goal is to empower therapists with the latest technology to enhance their practice and provide better care for their patients.
            </p>
            
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">The Process</h3>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mb-4">
                    <span className="text-lg font-bold">1</span>
                  </div>
                  <h4 className="text-xl font-medium text-gray-900">Record Sessions</h4>
                  <p className="mt-2 text-base text-gray-500">
                    Securely record and store therapy sessions with patient consent.
                  </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mb-4">
                    <span className="text-lg font-bold">2</span>
                  </div>
                  <h4 className="text-xl font-medium text-gray-900">AI Analysis</h4>
                  <p className="mt-2 text-base text-gray-500">
                    Our fine-tuned AI models analyze conversations to identify patterns, emotions, and potential treatment approaches.
                  </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mb-4">
                    <span className="text-lg font-bold">3</span>
                  </div>
                  <h4 className="text-xl font-medium text-gray-900">Actionable Insights</h4>
                  <p className="mt-2 text-base text-gray-500">
                    Receive personalized recommendations and insights to enhance your therapeutic approach for each patient.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center">Powerful Features for Modern Therapists</h2>
            <p className="mt-4 text-xl text-gray-500 text-center max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with clinical expertise to support your practice.
            </p>
            
            <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="text-center mb-4">
                      <span className="text-4xl">{feature.icon}</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 text-center">{feature.title}</h3>
                    <p className="mt-2 text-base text-gray-500 text-center">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* CTA Section */}
         
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-xl font-bold mb-4">Med Portal</h3>
              <p className="text-gray-300 mb-4">
                Empowering therapists with AI-driven insights for better patient outcomes.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Features</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Case Studies</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Reviews</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-base text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">API Status</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Community</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; {new Date().getFullYear()} Med Portal, Inc. All rights reserved.
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <a href="#" className="text-sm text-gray-400 hover:text-gray-300">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-400 hover:text-gray-300">Terms of Service</a>
              <a href="#" className="text-sm text-gray-400 hover:text-gray-300">Cookie Policy</a>
              <a href="#" className="text-sm text-gray-400 hover:text-gray-300">HIPAA Compliance</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}