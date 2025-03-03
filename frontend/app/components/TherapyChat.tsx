"use client"

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Message = {
  id: string;
  session_id: string;
  sender_type: 'doctor' | 'ai' | 'patient';
  content: string;
  created_at: string;
  ai_category: string | null;
};

type Patient = {
  id: string;
  name: string;
  email: string;
};

export default function TherapyChat() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { patientId, sessionId } = useParams() as { patientId: string; sessionId: string };
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [patient, setPatient] = useState<Patient | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchPatient() {
      if (status !== "authenticated") return;
      
      try {
        const response = await fetch(`/api/patients/${patientId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch patient details');
        }
        
        const data = await response.json();
        setPatient(data);
      } catch (err: any) {
        console.error('Error fetching patient:', err);
      }
    }
    
    fetchPatient();
  }, [patientId, status]);

  useEffect(() => {
    async function fetchMessages() {
      if (status !== "authenticated") return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/therapy/messages?sessionId=${sessionId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch therapy messages');
        }
        
        const data = await response.json();
        setMessages(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        console.error('Error fetching therapy messages:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchMessages();
  }, [sessionId, status]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isSending) return;
    
    try {
      setIsSending(true);
      
      const doctorMsgResponse = await fetch('/api/therapy/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          content: newMessage,
          senderType: 'doctor',
        }),
      });
      
      if (!doctorMsgResponse.ok) {
        throw new Error('Failed to send message');
      }
      
      const doctorMessage = await doctorMsgResponse.json();
      setMessages(prev => [...prev, doctorMessage]);
      setNewMessage("");
      
      const aiResponse = await fetch('/api/therapy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId,
          message: newMessage,
        }),
      });
      
      if (!aiResponse.ok) {
        throw new Error('Failed to get AI response');
      }
      
      const aiData = await aiResponse.json();
      
      const aiMsgResponse = await fetch('/api/therapy/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          content: aiData.advice,
          senderType: 'ai',
          aiCategory: aiData.message,
        }),
      });
      
      if (!aiMsgResponse.ok) {
        throw new Error('Failed to save AI response');
      }
      
      const aiMessage = await aiMsgResponse.json();
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('Error in therapy chat:', err);
    } finally {
      setIsSending(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="w-6 h-6 border-t-2 border-blue-500 border-solid rounded-full animate-spin mr-3"></div>
        <p>Loading therapy session...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg flex flex-col h-[calc(100vh-200px)]">
      <div className="px-4 py-3 border-b border-gray-200 sm:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link
            href={`/patients`}
            className="mr-4 text-blue-600 hover:text-blue-800"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Therapy Session with {patient?.name}
            </h3>
            {messages.length > 0 && (
              <p className="text-sm text-gray-500">
                Started {new Date(messages[0].created_at).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button 
                className="mt-1 text-sm text-red-700 underline"
                onClick={() => setError("")}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-10">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No messages yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start the conversation by sending a message below.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender_type === 'doctor' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`rounded-lg px-4 py-2 max-w-[80%] shadow ${
                  msg.sender_type === 'doctor' 
                    ? 'bg-blue-100 text-white' 
                    : msg.sender_type === 'ai'
                      ? 'bg-purple-100 border border-purple-200'
                      : 'bg-gray-100'
                }`}
              >
                {msg.sender_type === 'ai' && msg.ai_category && (
                  <div className="text-xs text-purple-700 font-semibold mb-1">
                    Category: {msg.ai_category}
                  </div>
                )}
                <div className="text-sm text-purple-700">
                  {msg.content}
                </div>
                <div className="text-xs mt-1 text-right text-gray-800">
                  {formatTime(msg.created_at)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input form */}
      <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
        <form onSubmit={sendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={isSending || !newMessage.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                Send
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}