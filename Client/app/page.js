'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [advice, setAdvice] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/predict', { name });
            setMessage(response.data.message);
            setAdvice(response.data.advice)

        } catch (error) {
            console.error(error);
            setMessage('Error occurred while generating response.');
        }
    };

    return (
      <main className="h-screen bg-[#f8f4e4] flex flex-col px-20 pt-20">
      <div className="mb-8">
        <h1 className="text-7xl font-semibold text-gray-800 font-pfdisplay">
          Mental Health Assistant
        </h1>
        <h3 className="m-1 text-lg font-light text-gray-900 font-geist">
          Welcome fellow therapist, get started by describing the problem that the patient is facing
        </h3>
      </div>

      <div className="w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter a name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-[40px] focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#43a573] text-white font-semibold rounded-[40px] shadow-md hover:bg-[#36845c] transition-all duration-200"
          >
            Predict
          </button>
        </form>
      </div>

      {message && <div className="flex-1 mt-8 bg-[#fffaf2] rounded-lg shadow-lg p-8 overflow-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Category - <span className='text-[#36845c]'>{message.charAt(0).toUpperCase() + message.slice(1)}</span></h2>
        <p className='p-1'>{advice}</p>
        <div className="text-gray-600">
        </div>
      </div>}
    </main>
    );
}
