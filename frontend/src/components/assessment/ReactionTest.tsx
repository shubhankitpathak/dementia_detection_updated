import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, CheckCircle2 } from "lucide-react";

interface ReactionTestProps {
  onComplete: (data: any) => void;
}

const ROUNDS = 5;

const ReactionTest = ({ onComplete }: ReactionTestProps) => {
  const [phase, setPhase] = useState<"instructions" | "waiting" | "ready" | "result">("instructions");
  const [currentRound, setCurrentRound] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startRound = () => {
    setPhase("waiting");
    const randomDelay = 2000 + Math.random() * 3000;
    
    timeoutRef.current = setTimeout(() => {
      setStartTime(Date.now());
      setPhase("ready");
    }, randomDelay);
  };

  const handleClick = () => {
    if (phase === "ready") {
      const reactionTime = Date.now() - startTime;
      const newTimes = [...reactionTimes, reactionTime];
      setReactionTimes(newTimes);

      if (currentRound + 1 < ROUNDS) {
        setCurrentRound(currentRound + 1);
        startRound();
      } else {
        setPhase("result");
      }
    } else if (phase === "waiting") {
      // Clicked too early
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setTimeout(() => startRound(), 1000);
    }
  };

  const startTest = () => {
    setCurrentRound(0);
    setReactionTimes([]);
    startRound();
  };

  const handleFinish = () => {
    const avgReactionTime = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
    
    onComplete({
      rounds: ROUNDS,
      reactionTimes,
      averageReactionTime: avgReactionTime,
      bestTime: Math.min(...reactionTimes),
      timestamp: new Date().toISOString(),
    });
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (phase === "instructions") {
    return (
      <Card className="p-12 space-y-8 shadow-xl">
        <div className="text-center space-y-4">
          <div className="inline-block p-6 rounded-full bg-accent">
            <Zap className="w-16 h-16 text-accent-foreground" />
          </div>
          <h2 className="text-3xl font-semibold text-foreground">Reaction Time Test</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            When the screen turns green, click as quickly as possible. 
            We'll measure your reaction speed over {ROUNDS} rounds.
          </p>
        </div>
        <div className="bg-accent/50 rounded-2xl p-8 space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Instructions:</h3>
          <ul className="space-y-3 text-lg text-muted-foreground list-disc list-inside">
            <li>Wait for the screen to turn green</li>
            <li>Click anywhere as fast as you can when it turns green</li>
            <li>Don't click too early - wait for the green signal</li>
            <li>Complete {ROUNDS} rounds for best accuracy</li>
          </ul>
        </div>
        <div className="text-center pt-4">
          <Button 
            onClick={startTest} 
            size="lg" 
            className="px-12 h-14 text-lg rounded-full"
          >
            Start Test
          </Button>
        </div>
      </Card>
    );
  }

  if (phase === "waiting") {
    return (
      <Card 
        className="p-12 min-h-[500px] flex flex-col items-center justify-center bg-red-500 hover:bg-red-600 transition-colors cursor-pointer shadow-xl"
        onClick={handleClick}
      >
        <div className="text-center space-y-8">
          <div className="text-4xl font-bold text-white">Wait...</div>
          <p className="text-xl text-white/90">
            Round {currentRound + 1} of {ROUNDS}
          </p>
          <p className="text-lg text-white/80">
            Watch for the green signal!
          </p>
        </div>
      </Card>
    );
  }

  if (phase === "ready") {
    return (
      <Card 
        className="p-12 min-h-[500px] flex flex-col items-center justify-center bg-green-500 hover:bg-green-600 transition-colors cursor-pointer shadow-xl animate-in fade-in zoom-in duration-100"
        onClick={handleClick}
      >
        <div className="text-center space-y-8">
          <div className="text-6xl font-bold text-white">CLICK!</div>
          <p className="text-xl text-white/90">
            Round {currentRound + 1} of {ROUNDS}
          </p>
        </div>
      </Card>
    );
  }

  const avgTime = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
  const bestTime = Math.min(...reactionTimes);

  return (
    <Card className="p-12 space-y-8 shadow-xl text-center">
      <div className="inline-block p-6 rounded-full bg-accent">
        <CheckCircle2 className="w-16 h-16 text-primary" />
      </div>
      <div className="space-y-4">
        <h2 className="text-3xl font-semibold text-foreground">Test Complete</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto pt-4">
          <div className="bg-accent/50 rounded-2xl p-6">
            <div className="text-5xl font-bold text-primary">{Math.round(avgTime)}</div>
            <p className="text-lg text-muted-foreground mt-2">Average Time (ms)</p>
          </div>
          <div className="bg-accent/50 rounded-2xl p-6">
            <div className="text-5xl font-bold text-green-600">{Math.round(bestTime)}</div>
            <p className="text-lg text-muted-foreground mt-2">Best Time (ms)</p>
          </div>
        </div>
      </div>
      <div className="bg-accent/50 rounded-2xl p-6 max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold text-foreground mb-4">All Reaction Times:</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {reactionTimes.map((time, idx) => (
            <div key={idx} className="bg-card px-4 py-2 rounded-full shadow">
              <span className="text-sm text-muted-foreground">R{idx + 1}:</span>{" "}
              <span className="font-semibold text-foreground">{Math.round(time)}ms</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-accent/50 rounded-2xl p-6 max-w-2xl mx-auto">
        <p className="text-lg text-muted-foreground leading-relaxed">
          {avgTime < 300
            ? "Excellent reaction time! Your cognitive processing speed is very good."
            : avgTime < 400
            ? "Good reaction time. Your responses are within normal range."
            : "Regular physical and cognitive exercises can help improve reaction time."}
        </p>
      </div>
      <Button 
        onClick={handleFinish} 
        size="lg" 
        className="px-12 h-14 text-lg rounded-full"
      >
        Continue to Speech Test
      </Button>
    </Card>
  );
};

export default ReactionTest;
