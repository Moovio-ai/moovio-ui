
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Square } from 'lucide-react';

interface VoiceRecorderProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptComplete: (transcript: string) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isOpen,
  onClose,
  onTranscriptComplete
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopRecording();
      setTranscript('');
      setDuration(0);
    }
  }, [isOpen]);

  useEffect(() => {
    // Check for speech recognition support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript + interimTranscript);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      setIsRecording(true);
      mediaRecorder.start();
      
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      
      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRecording(false);
  };

  const handleSendTranscript = () => {
    if (transcript.trim()) {
      onTranscriptComplete(transcript.trim());
      onClose();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-moovio-dark rounded-2xl p-6 w-full max-w-md animate-slide-up">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">Voice Message</h3>
          <p className="text-gray-400 text-sm">Tap to start recording</p>
        </div>

        <div className="flex flex-col items-center mb-6">
          {/* Recording indicator */}
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
            isRecording 
              ? 'bg-moovio-red animate-pulse-recording' 
              : 'bg-moovio-gray hover:bg-moovio-gray-light'
          } transition-colors duration-200`}>
            {isRecording ? (
              <Square size={32} className="text-white" />
            ) : (
              <Mic size={32} className="text-white" />
            )}
          </div>

          {/* Timer */}
          <div className="text-2xl font-mono text-white mb-2">
            {formatTime(duration)}
          </div>

          {/* Recording status */}
          <div className="text-sm text-gray-400">
            {isRecording ? 'Recording...' : 'Ready to record'}
          </div>
        </div>

        {/* Transcript display */}
        {transcript && (
          <div className="bg-moovio-gray rounded-lg p-3 mb-4">
            <p className="text-white text-sm">{transcript}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-moovio-gray hover:bg-moovio-gray-light text-white rounded-lg py-3 px-4 transition-colors duration-200"
          >
            Cancel
          </button>
          
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex-1 netflix-button"
            >
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg py-3 px-4 transition-colors duration-200"
            >
              Stop Recording
            </button>
          )}
          
          {transcript && !isRecording && (
            <button
              onClick={handleSendTranscript}
              className="flex-1 netflix-button"
            >
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Extend Window interface for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
