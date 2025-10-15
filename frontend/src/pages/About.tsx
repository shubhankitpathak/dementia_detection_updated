import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, ArrowLeft, Shield, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-6 py-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero */}
          <div className="text-center space-y-6">
            <div className="inline-block p-6 rounded-full bg-accent">
              <Brain className="w-16 h-16 text-accent-foreground" />
            </div>
            <h1 className="text-5xl font-semibold text-foreground">About Our Platform</h1>
            <p className="text-2xl text-muted-foreground leading-relaxed">
              Making cognitive health screening accessible, comfortable, and comprehensive
            </p>
          </div>

          {/* Mission */}
          <Card className="p-10 space-y-6 shadow-xl">
            <h2 className="text-3xl font-semibold text-foreground">Our Mission</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We believe that early detection of cognitive changes can significantly improve outcomes 
              and quality of life. Our platform leverages AI technology to provide accessible, 
              scientifically-designed screening tools that can help identify potential concerns early.
            </p>
            <p className="text-xl text-muted-foreground leading-relaxed">
              By combining interactive cognitive tests with speech analysis, we offer a comprehensive 
              assessment that's both thorough and user-friendly.
            </p>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-8 space-y-4 text-center hover:shadow-xl transition-shadow">
              <div className="inline-block p-4 rounded-full bg-accent">
                <Shield className="w-10 h-10 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Secure & Private</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Your data is encrypted and handled with the highest security standards
              </p>
            </Card>

            <Card className="p-8 space-y-4 text-center hover:shadow-xl transition-shadow">
              <div className="inline-block p-4 rounded-full bg-accent">
                <Users className="w-10 h-10 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Accessible Design</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Large text, high contrast, and multilingual support for everyone
              </p>
            </Card>

            <Card className="p-8 space-y-4 text-center hover:shadow-xl transition-shadow">
              <div className="inline-block p-4 rounded-full bg-accent">
                <TrendingUp className="w-10 h-10 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Evidence-Based</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Tests designed based on established cognitive assessment methods
              </p>
            </Card>
          </div>

          {/* How It Works */}
          <Card className="p-10 space-y-6 shadow-xl">
            <h2 className="text-3xl font-semibold text-foreground">How It Works</h2>
            <div className="space-y-6">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-foreground mb-2">Take the Assessment</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Complete four interactive tests covering memory, attention, reaction time, and speech analysis
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-foreground mb-2">AI Analysis</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Our AI processes your responses and speech patterns to evaluate cognitive performance
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-foreground mb-2">Get Your Results</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Receive a comprehensive report with risk assessment and personalized recommendations
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Disclaimer */}
          <Card className="p-8 bg-accent/50 border-2 border-accent">
            <h3 className="text-2xl font-semibold text-foreground mb-4">Important Notice</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This platform provides screening tools and is not a substitute for professional 
              medical diagnosis or treatment. The assessments are designed to help identify 
              potential areas of concern that warrant professional evaluation. Always consult 
              with qualified healthcare professionals for accurate diagnosis and treatment plans.
            </p>
          </Card>

          {/* CTA */}
          <div className="text-center pt-6">
            <Link to="/assessment">
              <Button size="lg" className="px-12 h-14 text-lg rounded-full">
                Start Your Assessment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
