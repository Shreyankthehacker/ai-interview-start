
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const StartButton = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/interview');
  };

  return (
    <Button 
      onClick={handleStart}
      className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-lg transition-all duration-300 transform hover:scale-105"
    >
      Start Interview
      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
    </Button>
  );
};

export default StartButton;
