
import React, { useState, useRef, useEffect } from 'react';
import TypewriterText from '../components/TypewriterText';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Play } from 'lucide-react';

const Interview = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [question, setQuestion] = useState("Tell me about yourself and your experience.");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/mp3' });
        setAudioBlob(audioBlob);
        // Here you would send the audioBlob to your backend for processing
        audioChunks.current = [];
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const playAudio = async (audioBlob: Blob) => {
    const url = URL.createObjectURL(audioBlob);
    const audio = new Audio(url);
    await audio.play();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    return () => {
      if (mediaRecorder.current && isRecording) {
        mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isRecording]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Interview in Progress</h2>
          <div className="bg-blue-50 rounded-lg p-6">
            <TypewriterText text={question} onComplete={() => {}} />
          </div>
        </div>
        
        <div className="flex justify-center gap-4">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            className={`${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white px-6 py-4 rounded-lg transition-all duration-300`}
          >
            {isRecording ? (
              <>
                <MicOff className="mr-2 h-5 w-5" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="mr-2 h-5 w-5" />
                Start Recording
              </>
            )}
          </Button>

          {audioBlob && (
            <Button
              onClick={() => playAudio(audioBlob)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg transition-all duration-300"
            >
              <Play className="mr-2 h-5 w-5" />
              Play Recording
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interview;
