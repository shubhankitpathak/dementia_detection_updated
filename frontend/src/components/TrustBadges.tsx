import { Shield, Lock, CheckCircle, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TrustBadgesProps {
  className?: string;
  variant?: "row" | "grid";
}

const TrustBadges = ({ className = "", variant = "row" }: TrustBadgesProps) => {
  const { t, language } = useLanguage();

  const badges = {
    en: [
      { icon: Shield, text: "Private & Secure", description: "Your data is encrypted" },
      { icon: Lock, text: "HIPAA Compliant", description: "Healthcare data standards" },
      { icon: CheckCircle, text: "Scientifically Validated", description: "Evidence-based methods" },
      { icon: Globe, text: "Multilingual Support", description: "Accessible to all" }
    ],
    es: [
      { icon: Shield, text: "Privado y Seguro", description: "Sus datos están encriptados" },
      { icon: Lock, text: "Cumple con HIPAA", description: "Estándares de datos de salud" },
      { icon: CheckCircle, text: "Validado Científicamente", description: "Métodos basados en evidencia" },
      { icon: Globe, text: "Soporte Multilingüe", description: "Accesible para todos" }
    ],
    hi: [
      { icon: Shield, text: "निजी और सुरक्षित", description: "आपका डेटा एन्क्रिप्ट किया गया है" },
      { icon: Lock, text: "HIPAA अनुपालन", description: "स्वास्थ्य डेटा मानक" },
      { icon: CheckCircle, text: "वैज्ञानिक रूप से मान्य", description: "साक्ष्य-आधारित तरीके" },
      { icon: Globe, text: "बहुभाषी समर्थन", description: "सभी के लिए सुलभ" }
    ]
  };

  const currentBadges = badges[language as keyof typeof badges] || badges.en;

  const gridClasses = variant === "grid" 
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" 
    : "flex flex-wrap gap-3 justify-center";

  return (
    <div className={`${gridClasses} ${className}`}>
      {currentBadges.map((badge, index) => (
        <div 
          key={index}
          className={`trust-badge ${variant === "grid" ? "flex-col text-center p-6" : ""}`}
          role="status"
          aria-label={`${badge.text}: ${badge.description}`}
        >
          <badge.icon 
            className={`${variant === "grid" ? "w-8 h-8 mx-auto mb-2" : "w-4 h-4"} text-primary`} 
            aria-hidden="true" 
          />
          <div className={variant === "grid" ? "" : ""}>
            <span className="font-medium text-foreground">{badge.text}</span>
            {variant === "grid" && (
              <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
