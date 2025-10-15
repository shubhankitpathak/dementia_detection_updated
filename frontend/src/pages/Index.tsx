import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Activity, Mic, BarChart3, Globe, Shield, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";
import TrustBadges from "@/components/TrustBadges";

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-b z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              <span className="text-xl font-semibold">Cognitive Screening</span>
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm">
                      <User className="w-4 h-4 mr-2" />
                      {t('nav.dashboard')}
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      {t('nav.login')}
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">
                      {t('nav.register')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24">
        <div 
          className="absolute inset-0 opacity-60" 
          style={{ background: 'var(--gradient-hero)' }}
          aria-hidden="true"
        />
        <div className="relative container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
            <h1 className="text-foreground">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
            
            {/* Trust Badges */}
            <TrustBadges className="pt-4" />
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link to={isAuthenticated ? "/assessment" : "/register"}>
                <Button 
                  size="lg" 
                  className="text-lg px-8 h-14 rounded-full shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                  aria-label={t('hero.start')}
                >
                  {t('hero.start')}
                </Button>
              </Link>
              <Link to="/about">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 h-14 rounded-full w-full sm:w-auto"
                  aria-label={t('hero.learn')}
                >
                  {t('hero.learn')}
                </Button>
              </Link>
            </div>
            
            {/* Medical Disclaimer */}
            <div className="max-w-2xl mx-auto pt-8">
              <MedicalDisclaimer compact />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card" aria-labelledby="features-heading">
        <div className="container mx-auto px-6">
          <h2 id="features-heading" className="text-center mb-16 text-foreground">
            {t('features.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Brain className="w-12 h-12" aria-hidden="true" />}
              title={t('features.memory')}
              description={t('features.memory.desc')}
            />
            <FeatureCard
              icon={<Mic className="w-12 h-12" aria-hidden="true" />}
              title={t('features.speech')}
              description={t('features.speech.desc')}
            />
            <FeatureCard
              icon={<BarChart3 className="w-12 h-12" aria-hidden="true" />}
              title={t('features.results')}
              description={t('features.results.desc')}
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20" aria-labelledby="benefits-heading">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 id="benefits-heading" className="text-foreground">Accessible for Everyone</h2>
              <div className="space-y-4" role="list">
                <BenefitItem 
                  icon={<Globe className="w-6 h-6" />}
                  text="Multilingual support in English, Hindi, Spanish, and more"
                />
                <BenefitItem 
                  icon={<Activity className="w-6 h-6" />}
                  text="Large, clear text and high-contrast design for better readability"
                />
                <BenefitItem 
                  icon={<Shield className="w-6 h-6" />}
                  text="Secure, private, and compliant with healthcare standards"
                />
              </div>
            </div>
            <Card className="p-8 shadow-lg animate-fade-in-up" style={{ background: 'var(--gradient-card)' }}>
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-foreground">
                  Early Detection Matters
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Regular cognitive screening can help identify changes early, enabling 
                  timely intervention and better outcomes. Our platform makes screening 
                  accessible, comfortable, and comprehensive.
                </p>
                <Link to="/assessment">
                  <Button 
                    className="w-full h-12 text-lg rounded-full"
                    aria-label="Begin your cognitive assessment"
                  >
                    Begin Your Assessment
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              <span className="text-xl font-semibold">Cognitive Screening</span>
            </div>
            <div className="flex gap-8 text-muted-foreground">
              <Link to="/about" className="hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => (
  <Card 
    className="p-8 text-center space-y-4 hover:shadow-lg transition-all transform hover:-translate-y-1"
    role="article"
    aria-labelledby={`feature-${title.replace(/\s/g, '-').toLowerCase()}`}
  >
    <div className="flex justify-center text-primary" aria-hidden="true">
      {icon}
    </div>
    <h3 
      id={`feature-${title.replace(/\s/g, '-').toLowerCase()}`}
      className="text-2xl font-semibold text-foreground"
    >
      {title}
    </h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </Card>
);

const BenefitItem = ({ 
  icon, 
  text 
}: { 
  icon: React.ReactNode; 
  text: string;
}) => (
  <div className="flex items-start gap-4" role="listitem">
    <div 
      className="flex-shrink-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground"
      aria-hidden="true"
    >
      {icon}
    </div>
    <p className="text-lg text-foreground pt-1 leading-relaxed">{text}</p>
  </div>
);

export default Index;
