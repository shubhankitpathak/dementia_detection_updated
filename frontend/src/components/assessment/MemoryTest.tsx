import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

interface MemoryTestProps {
  onComplete: (data: any) => void;
}

const SEQUENCE_LENGTH = 6;
const DISPLAY_TIME = 3000;
const COLORS = ["bg-red-400", "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-purple-400", "bg-pink-400"];

const MemoryTest = ({ onComplete }: MemoryTestProps) => {
  const [phase, setPhase] = useState<"instructions" | "memorize" | "recall" | "result">("instructions");
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  const generateSequence = () => {
    const newSequence = Array.from({ length: SEQUENCE_LENGTH }, () => 
      Math.floor(Math.random() * COLORS.length)
    );
    setSequence(newSequence);
  };

  const startMemorize = () => {
    generateSequence();
    setPhase("memorize");
    setTimeout(() => {
      setPhase("recall");
    }, DISPLAY_TIME);
  };

  const handleColorClick = (colorIndex: number) => {
    const newUserSequence = [...userSequence, colorIndex];
    setUserSequence(newUserSequence);

    if (newUserSequence.length === SEQUENCE_LENGTH) {
      // Calculate score
      const correct = newUserSequence.filter((val, idx) => val === sequence[idx]).length;
      setScore(correct);
      setPhase("result");
    }
  };

  const handleFinish = () => {
    onComplete({
      totalItems: SEQUENCE_LENGTH,
      correctItems: score,
      accuracy: (score / SEQUENCE_LENGTH) * 100,
      timestamp: new Date().toISOString(),
    });
  };

  if (phase === "instructions") {
    return (
      <Card className="p-12 space-y-8 shadow-xl">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-semibold text-foreground">Memory Recall Test</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            You will see a sequence of colored circles. Try to remember the exact order. 
            After they disappear, recreate the sequence by clicking the circles in the same order.
          </p>
        </div>
        <div className="bg-accent/50 rounded-2xl p-8 space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Instructions:</h3>
          <ul className="space-y-3 text-lg text-muted-foreground list-disc list-inside">
            <li>Watch the sequence of {SEQUENCE_LENGTH} colored circles carefully</li>
            <li>You have {DISPLAY_TIME / 1000} seconds to memorize the pattern</li>
            <li>Then click the circles in the exact order you saw them</li>
            <li>Take your time - accuracy is more important than speed</li>
          </ul>
        </div>
        <div className="text-center pt-4">
          <Button 
            onClick={startMemorize} 
            size="lg" 
            className="px-12 h-14 text-lg rounded-full"
          >
            Start Test
          </Button>
        </div>
      </Card>
    );
  }

  if (phase === "memorize") {
    return (
      <Card className="p-12 space-y-8 shadow-xl">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Memorize this sequence</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            {sequence.map((colorIndex, idx) => (
              <div
                key={idx}
                className={`w-20 h-20 rounded-full ${COLORS[colorIndex]} shadow-lg animate-in fade-in zoom-in`}
                style={{ animationDelay: `${idx * 100}ms` }}
              />
            ))}
          </div>
          <p className="text-lg text-muted-foreground">
            Watch carefully... the sequence will disappear soon
          </p>
        </div>
      </Card>
    );
  }

  if (phase === "recall") {
    return (
      <Card className="p-12 space-y-8 shadow-xl">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Click the circles in order
          </h2>
          <p className="text-lg text-muted-foreground">
            Progress: {userSequence.length} / {SEQUENCE_LENGTH}
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {COLORS.map((color, idx) => (
              <button
                key={idx}
                onClick={() => handleColorClick(idx)}
                className={`w-20 h-20 rounded-full ${color} shadow-lg hover:scale-110 transition-transform active:scale-95`}
              />
            ))}
          </div>
          {userSequence.length > 0 && (
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-2">Your sequence:</p>
              <div className="flex justify-center gap-2">
                {userSequence.map((colorIndex, idx) => (
                  <div
                    key={idx}
                    className={`w-12 h-12 rounded-full ${COLORS[colorIndex]} shadow`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-12 space-y-8 shadow-xl text-center">
      <div className="inline-block p-6 rounded-full bg-accent">
        {score >= SEQUENCE_LENGTH * 0.7 ? (
          <CheckCircle2 className="w-16 h-16 text-green-600" />
        ) : (
          <XCircle className="w-16 h-16 text-orange-500" />
        )}
      </div>
      <div className="space-y-4">
        <h2 className="text-3xl font-semibold text-foreground">Test Complete</h2>
        <div className="text-6xl font-bold text-primary">
          {score} / {SEQUENCE_LENGTH}
        </div>
        <p className="text-xl text-muted-foreground">
          Accuracy: {Math.round((score / SEQUENCE_LENGTH) * 100)}%
        </p>
      </div>
      <div className="bg-accent/50 rounded-2xl p-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          {score >= SEQUENCE_LENGTH * 0.7
            ? "Great job! Your short-term memory recall is performing well."
            : "Memory exercises can help improve cognitive function over time."}
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

export default MemoryTest;
