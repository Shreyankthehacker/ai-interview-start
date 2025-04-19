
import React from 'react';
import StartButton from '../components/StartButton';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          Welcome to AI Interview
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Practice your interview skills with our AI-powered interviewer. 
          Get ready for real-time questions and responses.
        </p>
        <StartButton />
      </div>
    </div>
  );
};

export default Index;
