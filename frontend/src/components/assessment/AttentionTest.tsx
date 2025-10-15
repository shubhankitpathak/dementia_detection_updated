import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface AttentionTestProps {
  onComplete: (data: any) => void;
}

const TARGET_LETTER = "A";
const TOTAL_LETTERS = 30;
const LETTER_DISPLAY_TIME = 800;

const AttentionTest = ({ onComplete }: AttentionTestProps) => {
  const [phase, setPhase] = useState<"instructions" | "active" | "result">("instructions");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [targetIndices, setTargetIndices] = useState<number[]>([]);
  const [correctHits, setCorrectHits] = useState(0);
  const [falseAlarms, setFalseAlarms] = useState(0);
  const [reacted, setReacted] = useState(false);

  const generateLetters = () => {
    const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const letterArray: string[] = [];
    const targets: number[] = [];

    for (let i = 0; i < TOTAL_LETTERS; i++) {
      if (Math.random() < 0.3 && i > 0) {
        letterArray.push(TARGET_LETTER);
        targets.push(i);
      } else {
        const randomLetter = allLetters[Math.floor(Math.random() * allLetters.length)];
        letterArray.push(randomLetter === TARGET_LETTER ? "B" : randomLetter);
      }
    }

    setLetters(letterArray);
    setTargetIndices(targets);
  };

  const startTest = () => {
    generateLetters();
    setPhase("active");
    setCurrentIndex(0);
  };

  useEffect(() => {
    if (phase === "active" && currentIndex < TOTAL_LETTERS) {
      setReacted(false);
      const timer = setTimeout(() => {
        if (currentIndex + 1 >= TOTAL_LETTERS) {
          setPhase("result");
        } else {
          setCurrentIndex(currentIndex + 1);
        }
      }, LETTER_DISPLAY_TIME);

      return () => clearTimeout(timer);
    }
  }, [phase, currentIndex]);

  const handleClick = () => {
    if (reacted) return;
    setReacted(true);

    if (letters[currentIndex] === TARGET_LETTER) {
      setCorrectHits(correctHits + 1);
    } else {
      setFalseAlarms(falseAlarms + 1);
    }
  };

  const handleFinish = () => {
    const accuracy = targetIndices.length > 0 
      ? (correctHits / targetIndices.length) * 100 
      : 0;
    
    onComplete({
      totalTargets: targetIndices.length,
      correctHits,
      falseAlarms,
      accuracy,
      timestamp: new Date().toISOString(),
    });
  };

  if (phase === "instructions") {
    return (
      <Card className="p-12 space-y-8 shadow-xl">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-semibold text-foreground">Attention Test</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Letters will appear on screen one at a time. Click the screen every time 
            you see the letter "<span className="font-bold text-primary">{TARGET_LETTER}</span>". 
            Don't click for other letters.
          </p>
        </div>
        <div className="bg-accent/50 rounded-2xl p-8 space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Instructions:</h3>
          <ul className="space-y-3 text-lg text-muted-foreground list-disc list-inside">
            <li>Focus on each letter as it appears</li>
            <li>Click anywhere when you see "{TARGET_LETTER}"</li>
            <li>Don't click for other letters</li>
            <li>The test measures your sustained attention</li>
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

  if (phase === "active") {
    return (
      <Card 
        className="p-12 space-y-8 shadow-xl cursor-pointer select-none min-h-[500px] flex flex-col items-center justify-center"
        onClick={handleClick}
      >
        <div className="text-center space-y-8">
          <p className="text-lg text-muted-foreground">
            Click when you see "{TARGET_LETTER}"
          </p>
          <div className="text-[12rem] font-bold text-primary animate-in zoom-in fade-in duration-200">
            {letters[currentIndex]}
          </div>
          <p className="text-lg text-muted-foreground">
            {currentIndex + 1} / {TOTAL_LETTERS}
          </p>
        </div>
      </Card>
    );
  }

  const accuracy = targetIndices.length > 0 
    ? (correctHits / targetIndices.length) * 100 
    : 0;

  return (
    <Card className="p-12 space-y-8 shadow-xl text-center">
      <div className="inline-block p-6 rounded-full bg-accent">
        <CheckCircle2 className="w-16 h-16 text-primary" />
      </div>
      <div className="space-y-4">
        <h2 className="text-3xl font-semibold text-foreground">Test Complete</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto pt-4">
          <div className="bg-accent/50 rounded-2xl p-6">
            <div className="text-4xl font-bold text-primary">{correctHits}</div>
            <p className="text-lg text-muted-foreground mt-2">Correct Hits</p>
          </div>
          <div className="bg-accent/50 rounded-2xl p-6">
            <div className="text-4xl font-bold text-orange-500">{falseAlarms}</div>
            <p className="text-lg text-muted-foreground mt-2">False Alarms</p>
          </div>
          <div className="bg-accent/50 rounded-2xl p-6">
            <div className="text-4xl font-bold text-primary">{Math.round(accuracy)}%</div>
            <p className="text-lg text-muted-foreground mt-2">Accuracy</p>
          </div>
        </div>
      </div>
      <div className="bg-accent/50 rounded-2xl p-6 max-w-2xl mx-auto">
        <p className="text-lg text-muted-foreground leading-relaxed">
          {accuracy >= 70
            ? "Excellent sustained attention! You maintained good focus throughout the test."
            : "Attention exercises and regular cognitive activities can help improve focus."}
        </p>
      </div>
      <Button 
        onClick={handleFinish} 
        size="lg" 
        className="px-12 h-14 text-lg rounded-full"
      >
        Continue to Next Test
      </Button>
    </Card>
  );
};

export default AttentionTest;
