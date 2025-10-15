import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, ArrowLeft, Download } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";

const Results = () => {
  const location = useLocation();
  const results = location.state?.results || {};

  const calculateOverallScore = () => {
    const memoryScore = results.memory?.accuracy || 0;
    const attentionScore = results.attention?.accuracy || 0;
    const reactionScore = results.reaction?.averageReactionTime 
      ? Math.max(0, 100 - (results.reaction.averageReactionTime - 200) / 3)
      : 0;
    
    return Math.round((memoryScore + attentionScore + reactionScore) / 3);
  };

  const overallScore = calculateOverallScore();
  const riskLevel = overallScore >= 75 ? "Low" : overallScore >= 50 ? "Moderate" : "High";
  const riskColor = overallScore >= 75 ? "text-green-600" : overallScore >= 50 ? "text-orange-500" : "text-red-600";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              <span className="text-xl font-semibold">Assessment Results</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Overall Score */}
          <Card className="p-12 text-center space-y-6 shadow-xl" style={{ background: 'var(--gradient-card)' }}>
            <h1 className="text-4xl font-semibold text-foreground">Your Results</h1>
            <div className="inline-block p-8 rounded-full bg-accent">
              <div className="text-7xl font-bold text-primary">{overallScore}</div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl text-muted-foreground">Overall Cognitive Score</p>
              <p className="text-xl">
                Risk Level: <span className={`font-semibold ${riskColor}`}>{riskLevel}</span>
              </p>
            </div>
          </Card>

          {/* Individual Test Results */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Memory Test */}
            {results.memory && (
              <Card className="p-8 space-y-4 shadow-lg">
                <h3 className="text-2xl font-semibold text-foreground">Memory Recall</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-muted-foreground">Accuracy</span>
                    <span className="text-2xl font-bold text-primary">
                      {Math.round(results.memory.accuracy)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-muted-foreground">Correct Items</span>
                    <span className="text-xl font-semibold text-foreground">
                      {results.memory.correctItems} / {results.memory.totalItems}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Attention Test */}
            {results.attention && (
              <Card className="p-8 space-y-4 shadow-lg">
                <h3 className="text-2xl font-semibold text-foreground">Attention & Focus</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-muted-foreground">Accuracy</span>
                    <span className="text-2xl font-bold text-primary">
                      {Math.round(results.attention.accuracy)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-muted-foreground">Correct Hits</span>
                    <span className="text-xl font-semibold text-foreground">
                      {results.attention.correctHits}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-muted-foreground">False Alarms</span>
                    <span className="text-xl font-semibold text-foreground">
                      {results.attention.falseAlarms}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Reaction Test */}
            {results.reaction && (
              <Card className="p-8 space-y-4 shadow-lg">
                <h3 className="text-2xl font-semibold text-foreground">Reaction Time</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-muted-foreground">Average Time</span>
                    <span className="text-2xl font-bold text-primary">
                      {Math.round(results.reaction.averageReactionTime)}ms
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-muted-foreground">Best Time</span>
                    <span className="text-xl font-semibold text-foreground">
                      {Math.round(results.reaction.bestTime)}ms
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Speech Test */}
            {results.speech && (
              <Card className="p-8 space-y-4 shadow-lg">
                <h3 className="text-2xl font-semibold text-foreground">Speech Analysis</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-muted-foreground">Recording Duration</span>
                    <span className="text-xl font-semibold text-foreground">
                      {results.speech.recordingTime}s
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Speech data recorded for AI analysis
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Recommendations */}
          <Card className="p-8 space-y-6 shadow-lg">
            <h2 className="text-3xl font-semibold text-foreground">Recommendations</h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              {overallScore >= 75 ? (
                <>
                  <p>
                    Your cognitive performance is within normal ranges across all tested areas. 
                    Continue maintaining a healthy lifestyle with regular mental and physical activities.
                  </p>
                  <p>
                    Consider scheduling regular assessments to track your cognitive health over time.
                  </p>
                </>
              ) : overallScore >= 50 ? (
                <>
                  <p>
                    Your results show some areas that could benefit from attention. 
                    We recommend consulting with a healthcare professional for a comprehensive evaluation.
                  </p>
                  <p>
                    Engaging in cognitive exercises, maintaining social connections, and regular physical 
                    activity can help support cognitive function.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    We recommend consulting with a healthcare professional as soon as possible 
                    for a thorough cognitive assessment.
                  </p>
                  <p>
                    Early intervention and professional guidance can make a significant difference 
                    in managing cognitive health concerns.
                  </p>
                </>
              )}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link to="/assessment">
              <Button 
                size="lg" 
                className="px-8 h-12 text-lg rounded-full w-full sm:w-auto"
              >
                Take Assessment Again
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 h-12 text-lg rounded-full w-full sm:w-auto"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Report
            </Button>
          </div>

          {/* Disclaimer */}
          <MedicalDisclaimer />
        </div>
      </div>
    </div>
  );
};

export default Results;
