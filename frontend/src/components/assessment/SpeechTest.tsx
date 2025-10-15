import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Square, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SpeechTestProps {
  onComplete: (data: any) => void;
}

const PROMPTS = [
  "Describe your typical morning routine.",
  "Tell me about your favorite memory from childhood.",
  "What activities do you enjoy doing in your free time?",
];

const SpeechTest = ({ onComplete }: SpeechTestProps) => {
  const [phase, setPhase] = useState<"instructions" | "recording" | "processing" | "result">("instructions");
  const [isRecording, setIsRecording] = useState(false);
  const [currentPrompt] = useState(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        processRecording();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setPhase("recording");
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone",
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to continue",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const processRecording = () => {
    setPhase("processing");
    
    // Simulate processing time
    setTimeout(() => {
      // In a real implementation, this would send audio to backend for AI analysis
      // For now, we'll generate mock analysis based on recording duration
      const duration = recordingTime;
      const wordsPerMinute = 120 + Math.random() * 30;
      const fluencyScore = 70 + Math.random() * 25;
      const coherenceScore = 75 + Math.random() * 20;
      
      setPhase("result");
      
      onComplete({
        duration,
        wordsPerMinute: Math.round(wordsPerMinute),
        fluencyScore: Math.round(fluencyScore),
        coherenceScore: Math.round(coherenceScore),
        audioSize: chunksRef.current.reduce((acc, chunk) => acc + chunk.size, 0),
        timestamp: new Date().toISOString(),
      });
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (phase === "instructions") {
    return (
      <Card className="p-12 space-y-8 shadow-xl">
        <div className="text-center space-y-4">
          <div className="inline-block p-6 rounded-full bg-accent">
            <Mic className="w-16 h-16 text-accent-foreground" />
          </div>
          <h2 className="text-3xl font-semibold text-foreground">Speech Analysis</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            You'll be asked to speak about a topic for 30-60 seconds. 
            Our AI will analyze your speech patterns, fluency, and coherence.
          </p>
        </div>
        <div className="bg-primary/10 border-2 border-primary rounded-2xl p-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-foreground mb-4">Your Prompt:</h3>
          <p className="text-2xl text-foreground leading-relaxed">
            "{currentPrompt}"
          </p>
        </div>
        <div className="bg-accent/50 rounded-2xl p-8 space-y-4 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-foreground">Tips for best results:</h3>
          <ul className="space-y-3 text-lg text-muted-foreground list-disc list-inside">
            <li>Speak naturally and at your normal pace</li>
            <li>Try to speak for at least 30 seconds</li>
            <li>Find a quiet environment for recording</li>
            <li>Speak clearly into your device's microphone</li>
          </ul>
        </div>
        <div className="text-center pt-4">
          <Button 
            onClick={startRecording} 
            size="lg" 
            className="px-12 h-14 text-lg rounded-full"
          >
            <Mic className="w-5 h-5 mr-2" />
            Start Recording
          </Button>
        </div>
      </Card>
    );
  }

  if (phase === "recording") {
    return (
      <Card className="p-12 space-y-8 shadow-xl">
        <div className="text-center space-y-8">
          <div className="inline-block p-8 rounded-full bg-red-500 animate-pulse">
            <Mic className="w-20 h-20 text-white" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-foreground">Recording...</h2>
            <div className="text-6xl font-bold text-primary">
              {formatTime(recordingTime)}
            </div>
          </div>
          <div className="bg-primary/10 border-2 border-primary rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-xl text-foreground leading-relaxed">
              "{currentPrompt}"
            </p>
          </div>
          <div className="pt-4">
            <Button 
              onClick={stopRecording}
              size="lg" 
              variant="destructive"
              className="px-12 h-14 text-lg rounded-full"
            >
              <Square className="w-5 h-5 mr-2" />
              Stop Recording
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (phase === "processing") {
    return (
      <Card className="p-12 space-y-8 shadow-xl text-center">
        <div className="inline-block p-6 rounded-full bg-accent animate-pulse">
          <Mic className="w-16 h-16 text-accent-foreground" />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-foreground">Processing your response...</h2>
          <p className="text-xl text-muted-foreground">
            Our AI is analyzing your speech patterns
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-12 space-y-8 shadow-xl text-center">
      <div className="inline-block p-6 rounded-full bg-accent">
        <CheckCircle2 className="w-16 h-16 text-primary" />
      </div>
      <div className="space-y-4">
        <h2 className="text-3xl font-semibold text-foreground">Speech Analysis Complete</h2>
        <p className="text-lg text-muted-foreground">
          Recording duration: {formatTime(recordingTime)}
        </p>
      </div>
      <div className="bg-accent/50 rounded-2xl p-8 max-w-2xl mx-auto">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Your speech has been successfully recorded and will be analyzed along with your other 
          assessment results to provide a comprehensive cognitive evaluation.
        </p>
      </div>
      <div className="pt-4">
        <p className="text-sm text-muted-foreground mb-4">
          Note: Full AI speech analysis will be implemented in the complete version
        </p>
      </div>
      <Button 
        onClick={() => onComplete({ recordingTime, timestamp: new Date().toISOString() })} 
        size="lg" 
        className="px-12 h-14 text-lg rounded-full"
      >
        Complete Assessment
      </Button>
    </Card>
  );
};

export default SpeechTest;
