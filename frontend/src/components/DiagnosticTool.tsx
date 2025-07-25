import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Stethoscope, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DiagnosticToolProps {
  onBack: () => void;
}

interface Question {
  id: string;
  question: string;
  options?: string[];
  type: 'text' | 'single' | 'multiple' | 'textarea';
  placeholder?: string;
}

interface RareDisease {
  causes: string;
  clinical_significance: string;
  clinical_trials: string;
  description: string;
  diagnosis: string[];
  disease_name: string;
  disease_overview: string;
  key_aspects: string;
  related_disorders: string[];
  score: number;
  symptoms: string[];
  treatment: string[];
}

interface ClinicalTrial {
  Description: string;
  Sponsor: string;
}

interface DiagnosticResult {
  patient_details: {
    name: string;
    age: number;
    gender: string;
    symptoms: string;
    duration: string;
    family_history: string;
    medications: string;
    previous_diagnoses: string;
    travel: string;
    allergies: string;
    other_conditions: string;
  };
  top_rare_diseases: RareDisease[];
}

const questionSections = [
  {
    title: "Personal Information",
    description: "Let's start with some basic information about you.",
    questions: [
      {
        id: "name",
        question: "What is your full name?",
        type: 'text',
        placeholder: 'John Doe',
        required: true
      },
      {
        id: "age",
        question: "What is your age?",
        type: 'text',
        placeholder: 'e.g., 35',
        required: true
      },
      {
        id: "gender",
        question: "What is your gender?",
        type: 'single',
        options: ["Male", "Female", "Other", "Prefer not to say"],
        required: true
      }
    ]
  },
  {
    title: "Symptoms & History",
    description: "Tell us about your symptoms and medical history.",
    questions: [
      {
        id: "symptoms",
        question: "What symptoms are you experiencing?",
        type: 'textarea',
        placeholder: 'Describe your symptoms in detail, including when they started and how they affect you',
        required: true
      },
      {
        id: "duration",
        question: "How long have you been experiencing these symptoms?",
        type: 'single',
        options: ["Less than 1 month", "1-6 months", "6-12 months", "1-2 years", "More than 2 years"],
        required: true
      },
      {
        id: "family_history",
        question: "Is there any family history of similar symptoms or rare diseases?",
        type: 'textarea',
        placeholder: 'Please describe any relevant family medical history',
        required: false
      }
    ]
  },
  {
    title: "Medical Background",
    description: "Help us understand your medical background.",
    questions: [
      {
        id: "medications",
        question: "Are you currently taking any medications?",
        type: 'textarea',
        placeholder: 'List all current medications, including dosages',
        required: false
      },
      {
        id: "previous_diagnoses",
        question: "Have you been diagnosed with any medical conditions in the past?",
        type: 'textarea',
        placeholder: 'List any previous medical diagnoses',
        required: false
      },
      {
        id: "other_conditions",
        question: "Are there any other health conditions or concerns we should know about?",
        type: 'textarea',
        placeholder: 'Please provide any additional health information',
        required: false
      }
    ]
  }
];

// Flatten questions array for easier access
const allQuestions = questionSections.flatMap(section => section.questions);

export const DiagnosticTool = ({ onBack }: DiagnosticToolProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState<DiagnosticResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const validateSection = () => {
    // Check all required questions in current section
    const currentSectionRequired = questionSections[currentSection].questions.filter(
      q => q.required && (!answers[q.id] || !answers[q.id].trim())
    );

    if (currentSectionRequired.length > 0) {
      toast({
        title: "Response required",
        description: `Please complete all required questions in the ${questionSections[currentSection].title} section.`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const nextSection = () => {
    // Mark all questions in current section as touched
    const newTouched = { ...touched };
    currentSectionData.questions.forEach(q => {
      if (q.required) newTouched[q.id] = true;
    });
    setTouched(newTouched);
    
    // Validate current section
    if (!isSectionValid()) {
      scrollToFirstError();
      toast({
        title: "Missing Information",
        description: "Please complete all required fields before continuing.",
        variant: "destructive",
      });
      return;
    }
    
    // Move to next section or submit
    if (currentSection < questionSections.length - 1) {
      setCurrentSection(prev => {
        const nextSection = prev + 1;
        // Scroll to top when changing sections
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return nextSection;
      });
    } else {
      analyzeSymptoms();
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => {
        const prevSection = prev - 1;
        // Scroll to top when changing sections
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return prevSection;
      });
    }
  };

  const analyzeSymptoms = async () => {
    setIsAnalyzing(true);
    
    try {
      const formData = {
        name: answers.name || "Anonymous",
        age: parseInt(answers.age) || 0,
        gender: answers.gender || "Unknown",
        symptoms: answers.symptoms || "",
        duration: answers.duration || "",
        family_history: answers.family_history || "None reported",
        medications: answers.medications || "None",
        previous_diagnoses: answers.previous_diagnoses || "None",
        travel: answers.travel || "None",
        allergies: answers.allergies || "None",
        other_conditions: answers.other_conditions || "None"
      };

      const response = await fetch('http://127.0.0.1:8000/api/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log(response)

      console.log(response.top_rare_diseases)

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      
      if (responseData.success && responseData.data) {
        setResults(responseData.data);
        setIsComplete(true);
        toast({
          title: "Analysis complete",
          description: `Found ${responseData.data.top_rare_diseases?.length || 0} potential matches`,
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      toast({
        title: "Analysis failed",
        description: "Unable to analyze symptoms. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const restart = () => {
    setCurrentSection(0);
    setCurrentQuestion(0);
    setAnswers({});
    setIsComplete(false);
    setResults(null);
  };

  const currentSectionData = questionSections[currentSection];
  
  // Track which questions have been touched for validation
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Calculate completion percentage based on all questions
  const calculateCompletionPercentage = () => {
    const totalQuestions = allQuestions.length;
    const answeredQuestions = allQuestions.filter(q => {
      const answer = answers[q.id];
      return answer !== undefined && answer.trim() !== '';
    }).length;
    
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  // Check if all required questions in current section are answered
  const isSectionValid = () => {
    return currentSectionData.questions.every(
      q => !q.required || (answers[q.id] && answers[q.id].trim() !== '')
    );
  };

  // Check if a specific question has an error
  const hasError = (questionId: string, required: boolean) => {
    if (!required) return false;
    return touched[questionId] && (!answers[questionId] || answers[questionId].trim() === '');
  };

  // Mark a question as touched when it loses focus
  const handleBlur = (questionId: string) => {
    setTouched(prev => ({ ...prev, [questionId]: true }));
  };

  // Scroll to first error in section
  const scrollToFirstError = () => {
    const firstError = currentSectionData.questions.find(
      q => q.required && (!answers[q.id] || !answers[q.id].trim())
    );
    
    if (firstError) {
      const element = document.getElementById(`question-${firstError.id}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (isComplete && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Diagnostic Results</h1>
          </div>

          <div className="space-y-6">
            <Card className="border-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-secondary">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  Analysis Complete
                </CardTitle>
                <CardDescription>
                  Based on your responses, here are potential matches. Please consult with a healthcare professional for proper diagnosis.
                </CardDescription>
              </CardHeader>
            </Card>

            {results.top_rare_diseases.map((disease, index) => (
              <Card key={index} className="border-border/50">
                <CardHeader>
                  <div className="flex">
                    <CardTitle className="text-primary">{disease.disease_name}</CardTitle>
                    <Badge variant="outline" className="ml-2 mt-1 bg-orange-50 text-orange-500 border-orange-500">
                      {/* {disease.score || 0}% match */}
                      {results.top_rare_diseases[index].score}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-1">Overview</h4>
                    <p className="text-muted-foreground mb-4">{disease.disease_overview || disease.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">Description</h4>
                    <p className="text-muted-foreground mb-4">{disease.description}</p>
                  </div>
                  
                  {/* <div>
                    <h4 className="font-semibold mb-1">Symptoms</h4>
                    <p className="text-muted-foreground mb-4">{disease.symptoms}</p>
                  </div> */}

                  {disease.symptoms && disease.symptoms.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-1">Symptoms</h4>
                      <div className="flex flex-wrap gap-2">
                        {disease.symptoms.map((symptom: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {symptom.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-semibold mb-1">Diagnosis</h4>
                    <p className="text-muted-foreground mb-4">{disease.diagnosis.map((diagnose, index) => {
                      return <ul>
                        <li key={index}>{diagnose}</li>
                      </ul>
                    })}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-1">Treatment</h4>
                    <p className="text-muted-foreground mb-4">{disease.treatment.map((treatment, index) => {
                      return <ul>
                        <li key={index}>{treatment}</li>
                      </ul>
                    })}</p>
                  </div>
                  
                  {disease.related_disorders && disease.related_disorders.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-1">Related Disorders</h4>
                      <div className="flex flex-wrap gap-2">
                        {disease.related_disorders.map((disorder: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {disorder.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <h4 className="font-semibold mb-1">Clinical Significance</h4>
                    <p className="text-muted-foreground text-sm">{disease.clinical_significance}</p>
                  </div>
                  
                  {disease.causes && (
                    <div className="pt-2">
                      <h4 className="font-semibold mb-1">Causes</h4>
                      <p className="text-muted-foreground text-sm">{disease.causes}</p>
                    </div>
                  )}
                  
                  {disease.clinical_trials && (
                    <div className="pt-2">
                      <h4 className="font-semibold mb-1">Clinical Trials</h4>
                      <p className="text-muted-foreground text-sm">
                        {disease.clinical_trials}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            <div className="flex gap-4">
              <Button onClick={restart} variant="outline">
                Start New Assessment
              </Button>
              <Button onClick={onBack}>
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="py-12">
            <Stethoscope className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-semibold mb-2">Analyzing Your Symptoms</h3>
            <p className="text-muted-foreground">
              Please wait while we process your responses...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-4">
              Diagnostic Assessment
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find treatments, get diagnosed for 10,000+ rare diseases.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Progress */}  
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Section {currentSection + 1} of {questionSections.length}</span>
              <span>
                {calculateCompletionPercentage()}% Complete
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${calculateCompletionPercentage()}%`
                }}
              />
            </div>
            <h3 className="text-lg font-semibold mt-4">{currentSectionData.title}</h3>
            <p className="text-muted-foreground text-sm">{currentSectionData.description}</p>
          </div>

          {/* Questions Section */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>{currentSectionData.title}</CardTitle>
              <CardDescription>{currentSectionData.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentSectionData.questions.map((question) => (
                <div key={question.id} className="space-y-2">
                  <h4 
                    id={`question-${question.id}`}
                    className={`font-medium ${hasError(question.id, question.required) ? 'text-destructive' : ''}`}
                  >
                    {question.question}
                    {question.required && <span className="text-destructive ml-1">*</span>}
                  </h4>
                  
                  {question.placeholder && (
                    <p className="text-sm text-muted-foreground mb-2">{question.placeholder}</p>
                  )}
                  
                  <div className="mt-1">
                    {question.type === 'textarea' ? (
                      <>
                        <textarea
                          className={`w-full p-3 border rounded-md min-h-[100px] ${hasError(question.id, question.required) ? 'border-destructive' : ''}`}
                          value={answers[question.id] || ''}
                          onChange={(e) => handleAnswer(question.id, e.target.value)}
                          onBlur={() => handleBlur(question.id)}
                          placeholder={question.placeholder}
                          aria-invalid={hasError(question.id, question.required)}
                          aria-errormessage={hasError(question.id, question.required) ? `${question.id}-error` : undefined}
                        />
                        {hasError(question.id, question.required) && (
                          <p className="text-sm text-destructive mt-1" id={`${question.id}-error`}>
                            This field is required
                          </p>
                        )}
                      </>
                    ) : question.type === 'single' && question.options ? (
                      <div className="space-y-2">
                        {question.options.map((option) => (
                          <Button
                            key={option}
                            variant={answers[question.id] === option ? "default" : "outline"}
                            className={`justify-start text-left h-auto py-3 px-4 w-full ${hasError(question.id, question.required) ? 'border-destructive' : ''}`}
                            onClick={() => {
                              handleAnswer(question.id, option);
                              handleBlur(question.id);
                            }}
                            type="button"
                          >
                            {option}
                          </Button>
                        ))}
                        {hasError(question.id, question.required) && (
                          <p className="text-sm text-destructive mt-1" id={`${question.id}-error`}>
                            Please select an option
                          </p>
                        )}
                      </div>
                    ) : (
                      <>
                        <input
                          type="text"
                          className={`w-full p-3 border rounded-md ${hasError(question.id, question.required) ? 'border-destructive' : ''}`}
                          value={answers[question.id] || ''}
                          onChange={(e) => handleAnswer(question.id, e.target.value)}
                          onBlur={() => handleBlur(question.id)}
                          placeholder={question.placeholder}
                          aria-invalid={hasError(question.id, question.required)}
                          aria-errormessage={hasError(question.id, question.required) ? `${question.id}-error` : undefined}
                        />
                        {hasError(question.id, question.required) && (
                          <p className="text-sm text-destructive mt-1" id={`${question.id}-error`}>
                            This field is required
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={prevSection}
              disabled={currentSection === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous Section
            </Button>
            <Button 
              onClick={nextSection}
              disabled={!isSectionValid()}
              className="ml-auto"
            >
              {currentSection === questionSections.length - 1 
                ? "Complete Assessment" 
                : `Next: ${questionSections[currentSection + 1]?.title || 'Finish'}`}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};