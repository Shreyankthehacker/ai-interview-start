import React, { useState, useRef, useEffect } from 'react';
import TypewriterText from '../components/TypewriterText';
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from 'lucide-react';
import lamejs from 'lamejs';

const Interview = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [question, setQuestion] = useState("Tell me about yourself and your experience.");
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const audioChunks = useRef<Float32Array[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext.current = new AudioContext();
      const source = audioContext.current.createMediaStreamSource(stream);
      const processor = audioContext.current.createScriptProcessor(4096, 1, 1);
      
      source.connect(processor);
      processor.connect(audioContext.current.destination);
      
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        audioChunks.current.push(new Float32Array(inputData));
      };

      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (audioContext.current && isRecording) {
      const mp3encoder = new lamejs.Mp3Encoder(1, audioContext.current.sampleRate, 128);
      const samples = new Int16Array(concatenateAudioBuffers(audioChunks.current));
      
      const mp3Data = [];
      const mp3buf = mp3encoder.encodeBuffer(samples);
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }
      
      const end = mp3encoder.flush();
      if (end.length > 0) {
        mp3Data.push(end);
      }

      const blob = new Blob(mp3Data, { type: 'audio/mp3' });
      // Here you would send the MP3 blob to your backend
      
      audioChunks.current = [];
      setIsRecording(false);
      audioContext.current.close();
    }
  };

  const concatenateAudioBuffers = (buffers: Float32Array[]): Float32Array => {
    let totalLength = 0;
    buffers.forEach(buffer => totalLength += buffer.length);
    const result = new Float32Array(totalLength);
    let offset = 0;
    buffers.forEach(buffer => {
      result.set(buffer, offset);
      offset += buffer.length;
    });
    return result;
  };

  const playQuestion = async (text: string) => {
    try {
      // Here you would fetch the MP3 audio from your backend
      // For now, we'll use text-to-speech as a fallback
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (audioContext.current && isRecording) {
        audioContext.current.close();
      }
    };
  }, [isRecording]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Interview in Progress</h2>
          <div className="bg-blue-50 rounded-lg p-6">
            <TypewriterText 
              text={question} 
              onComplete={() => playQuestion(question)}
            />
          </div>
        </div>
        
        <div className="flex justify-center">
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
        </div>
      </div>
    </div>
  );
};

export default Interview;
