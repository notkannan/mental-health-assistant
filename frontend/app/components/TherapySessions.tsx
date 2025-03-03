"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Session = {
  id: string;
  created_at: string;
  patient: {
    id: string;
    name: string;
    email: string;
  };
  summary: string | null;
};

export default function TherapySessions({ patientId }: { patientId?: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch therapy sessions
  useEffect(() => {
    if (status !== "authenticated") return;

    async function fetchSessions() {
      try {
        setIsLoading(true);
        const url = patientId 
          ? `/api/therapy/sessions?patientId=${patientId}`
          : '/api/therapy/sessions';
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch therapy sessions');
        }
        
        const data = await response.json();
        setSessions(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        console.error('Error fetching therapy sessions:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSessions();
  }, [patientId, status]);

  // Create a new session
  const createNewSession = async () => {
    if (!patientId) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/therapy/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create new therapy session');
      }
      
      const newSession = await response.json();
      
      // Navigate to the new session
      router.push(`/patients/${patientId}/therapy/${newSession.id}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('Error creating therapy session:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="w-6 h-6 border-t-2 border-blue-500 border-solid rounded-full animate-spin mr-3"></div>
        <p>Loading therapy sessions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Therapy Sessions
        </h3>
        {patientId && (
          <button
            onClick={createNewSession}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Session
          </button>
        )}
      </div>
      
      {sessions.length === 0 ? (
        <div className="px-4 py-5 sm:p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No therapy sessions</h3>
          <p className="mt-1 text-sm text-gray-500">
            {patientId 
              ? "Start a new therapy session with this patient."
              : "You don't have any therapy sessions yet."}
          </p>
          {patientId && (
            <div className="mt-6">
              <button
                onClick={createNewSession}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Start Therapy Session
              </button>
            </div>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {sessions.map((therapySession) => (
            <li key={therapySession.id}>
              <Link
                href={`/patients/${therapySession.patient.id}/therapy/${therapySession.id}`}
                className="block hover:bg-gray-50"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <p className="ml-3 text-sm font-medium text-blue-600 truncate">
                        Session with {therapySession.patient.name}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {formatDate(therapySession.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {therapySession.patient.email}
                      </p>
                    </div>
                    {therapySession.summary && (
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p className="truncate max-w-xs">
                          {therapySession.summary}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}