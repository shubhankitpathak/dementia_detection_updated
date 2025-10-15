import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import MemoryTest from "@/components/assessment/MemoryTest";
import AttentionTest from "@/components/assessment/AttentionTest";
import ReactionTest from "@/components/assessment/ReactionTest";
import SpeechTest from "@/components/assessment/SpeechTest";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";

type TestStep = "intro" | "memory" | "attention" | "reaction" | "speech" | "complete";

const Assessment = () => {
  const [currentStep, setCurrentStep] = useState<TestStep>("intro");
  const [results, setResults] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || '';

  const steps: TestStep[] = ["intro", "memory", "attention", "reaction", "speech", "complete"];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = (currentStepIndex / (steps.length - 1)) * 100;

  const saveAssessmentToBackend = async (assessmentResults: any) => {
    if (!isAuthenticated || !token) {
      // If not authenticated, just navigate to results with local data
      navigate("/results", { state: { results: assessmentResults, fromLocal: true } });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`${backendUrl}/api/assessments/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          results: {
            memory_accuracy: assessmentResults.memory?.accuracy,
            memory_correct: assessmentResults.memory?.correctItems,
            memory_total: assessmentResults.memory?.totalItems,
            attention_accuracy: assessmentResults.attention?.accuracy,
            attention_hits: assessmentResults.attention?.correctHits,
            attention_false_alarms: assessmentResults.attention?.falseAlarms,
            reaction_avg_time: assessmentResults.reaction?.averageReactionTime,
            reaction_best_time: assessmentResults.reaction?.bestTime,
            speech_duration: assessmentResults.speech?.recordingTime,
            speech_data: assessmentResults.speech?.audioData,
          },
        }),
      });

      if (response.ok) {
        const savedAssessment = await response.json();
        toast.success('Assessment saved successfully!');
        navigate("/results", { state: { assessment: savedAssessment, results: assessmentResults } });
      } else {
        throw new Error('Failed to save assessment');
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast.error('Failed to save assessment. Showing local results.');
      navigate("/results", { state: { results: assessmentResults, fromLocal: true } });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStepComplete = (stepName: string, data: any) => {
    const updatedResults = { ...results, [stepName]: data };
    setResults(updatedResults);
    
    const nextStepMap: Record<TestStep, TestStep> = {
      intro: "memory",
      memory: "attention",
      attention: "reaction",
      reaction: "speech",
      speech: "complete",
      complete: "complete",
    };
    
    const nextStep = nextStepMap[currentStep];
    if (nextStep === "complete") {
      // Save results and navigate to results page
      saveAssessmentToBackend(updatedResults);
    } else {
      setCurrentStep(nextStep);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Loading Overlay */}
      {isSaving && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="p-8 shadow-xl">
            <div className="space-y-4 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
              <p className="text-lg font-medium text-foreground">Saving your assessment...</p>
            </div>
          </Card>
        </div>
      )}
      
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              <span className="text-xl font-semibold">Assessment</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      {currentStep !== "intro" && (
        <div className="bg-card border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="max-w-3xl mx-auto space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Step {currentStepIndex} of {steps.length - 2}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {currentStep === "intro" && (
            <IntroStep onStart={() => handleStepComplete("intro", {})} />
          )}
          {currentStep === "memory" && (
            <MemoryTest onComplete={(data) => handleStepComplete("memory", data)} />
          )}
          {currentStep === "attention" && (
            <AttentionTest onComplete={(data) => handleStepComplete("attention", data)} />
          )}
          {currentStep === "reaction" && (
            <ReactionTest onComplete={(data) => handleStepComplete("reaction", data)} />
          )}
          {currentStep === "speech" && (
            <SpeechTest onComplete={(data) => handleStepComplete("speech", data)} />
          )}
        </div>
      </div>
    </div>
  );
};

const IntroStep = ({ onStart }: { onStart: () => void }) => (
  <Card className="p-12 text-center space-y-8 shadow-xl animate-fade-in-up">
    <div className="inline-block p-6 rounded-full bg-accent animate-pulse-gentle">
      <Brain className="w-16 h-16 text-accent-foreground" aria-hidden="true" />
    </div>
    <div className="space-y-4">
      <h1 className="text-4xl font-semibold text-foreground">
        Cognitive Assessment
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        This assessment consists of four interactive tests designed to evaluate different 
        aspects of cognitive function. The entire process takes approximately 15-20 minutes.
      </p>
    </div>
    
    {/* Medical Disclaimer */}
    <MedicalDisclaimer />
    
    <div className="bg-accent/50 rounded-2xl p-8 text-left space-y-4">
      <h3 className="text-2xl font-semibold text-foreground">What to expect:</h3>
      <ul className="space-y-3 text-lg text-muted-foreground" role="list">
        <li className="flex items-start gap-3" role="listitem">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold" aria-hidden="true">1</span>
          <span>Memory Recall Test - Remember and identify patterns</span>
        </li>
        <li className="flex items-start gap-3" role="listitem">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold" aria-hidden="true">2</span>
          <span>Attention Test - Focus and concentration exercises</span>
        </li>
        <li className="flex items-start gap-3" role="listitem">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold" aria-hidden="true">3</span>
          <span>Reaction Time Test - Quick response assessment</span>
        </li>
        <li className="flex items-start gap-3" role="listitem">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold" aria-hidden="true">4</span>
          <span>Speech Analysis - Voice recording and evaluation</span>
        </li>
      </ul>
    </div>
    <div className="pt-4">
      <Button 
        onClick={onStart} 
        size="lg" 
        className="px-12 h-14 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
        aria-label="Begin cognitive assessment"
      >
        Begin Assessment
      </Button>
    </div>
  </Card>
);

export default Assessment;
