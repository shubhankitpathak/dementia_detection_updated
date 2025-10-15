import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MedicalDisclaimerProps {
  className?: string;
  compact?: boolean;
}

const MedicalDisclaimer = ({ className = "", compact = false }: MedicalDisclaimerProps) => {
  const { t, language } = useLanguage();

  const disclaimerText = {
    en: {
      title: "Important Medical Disclaimer",
      full: "This screening tool is for informational purposes only and is NOT a substitute for professional medical diagnosis. If you have concerns about cognitive health, please consult with a qualified healthcare provider. Early detection and professional evaluation are essential for proper care.",
      compact: "This is a screening tool only - not a medical diagnosis. Consult a healthcare professional for evaluation."
    },
    es: {
      title: "Aviso Médico Importante",
      full: "Esta herramienta de detección es solo para fines informativos y NO sustituye un diagnóstico médico profesional. Si tiene inquietudes sobre la salud cognitiva, consulte con un proveedor de atención médica calificado. La detección temprana y la evaluación profesional son esenciales para una atención adecuada.",
      compact: "Esta es solo una herramienta de detección, no un diagnóstico médico. Consulte a un profesional de la salud para una evaluación."
    },
    hi: {
      title: "महत्वपूर्ण चिकित्सा अस्वीकरण",
      full: "यह जांच उपकरण केवल सूचनात्मक उद्देश्यों के लिए है और पेशेवर चिकित्सा निदान का विकल्प नहीं है। यदि आपको संज्ञानात्मक स्वास्थ्य के बारे में चिंता है, तो कृपया एक योग्य स्वास्थ्य सेवा प्रदाता से परामर्श करें। उचित देखभाल के लिए प्रारंभिक पहचान और पेशेवर मूल्यांकन आवश्यक है।",
      compact: "यह केवल एक जांच उपकरण है - चिकित्सा निदान नहीं। मूल्यांकन के लिए स्वास्थ्य पेशेवर से परामर्श करें।"
    }
  };

  const text = disclaimerText[language as keyof typeof disclaimerText] || disclaimerText.en;

  return (
    <div 
      className={`medical-disclaimer ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          {!compact && (
            <h4 className="font-semibold text-foreground mb-2 text-lg">
              {text.title}
            </h4>
          )}
          <p className={`text-muted-foreground leading-relaxed ${compact ? 'text-sm' : 'text-base'}`}>
            {compact ? text.compact : text.full}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicalDisclaimer;
