import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Pill, Stethoscope, ChevronRight, Users } from "lucide-react";
import { RareDiseaseSearch } from "@/components/RareDiseaseSearch";
import { DrugSearch } from "@/components/DrugSearch";
import { DiagnosticTool } from "@/components/DiagnosticTool";
import { Communities } from "@/components/Communities";

type ActiveModule = 'home' | 'disease' | 'drug' | 'diagnostic' | 'communities';

const Index = () => {
  const [activeModule, setActiveModule] = useState<ActiveModule>('home');

  const renderContent = () => {
    switch (activeModule) {
      case 'disease':
        return <RareDiseaseSearch onBack={() => setActiveModule('home')} />;
      case 'drug':
        return <DrugSearch onBack={() => setActiveModule('home')} />;
      case 'diagnostic':
        return <DiagnosticTool onBack={() => setActiveModule('home')} />;
      case 'communities':
        return <Communities onBack={() => setActiveModule('home')} />;
      default:
        return (

          <div className="min-h-screen bg-gradient-to-br from-background to-muted overflow-hidden">
            
            {/* Header */}
            <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center">
  <div className="group relative">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl -z-10 transition-all duration-300 group-hover:opacity-0" />
    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl -z-10 opacity-0 transition-all duration-300 group-hover:opacity-100" />
    <img 
      src="/logo.png" 
      alt="Logo" 
      className="w-24 h-24 mb-4 object-contain rounded-2xl p-2 transition-all duration-300 group-hover:scale-105" 
    />
  </div>

</div>
              <div className="text-center mb-12 animate-fade-in-down">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-4 animate-gradient-x bg-[length:200%_auto]">
                UniteRare™
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto [animation-delay:200ms]">
                  Find treatments, get diagnosed, and join communities for 10,000+ rare diseases.
                </p>
              </div>

              {/* Module Cards */}
              <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                <Card 
                  className="group cursor-pointer transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-2 border-border/50 animate-fade-in-up"
                  onClick={() => setActiveModule('disease')}
                >
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <Search className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                    </div>
                    <CardTitle className="text-xl">Rare Disease Search</CardTitle>
                    <CardDescription>
                      Search and explore comprehensive information about rare diseases
                    </CardDescription>
                  </CardHeader>
                  {/* <CardContent className="text-center">
                    <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      Explore Diseases <ChevronRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </CardContent> */}
                </Card>

                <Card 
                  className="group cursor-pointer transition-all duration-300 hover:shadow-secondary/20 hover:shadow-lg hover:-translate-y-2 border-border/50 animate-fade-in-up [animation-delay:200ms]"
                  onClick={() => setActiveModule('drug')}
                >
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-secondary/10 rounded-full flex items-center justify-center group-hover:bg-secondary/20 transition-colors duration-300">
                      <Pill className="w-8 h-8 text-secondary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                    </div>
                    <CardTitle className="text-xl">FDA Drug Search</CardTitle>
                    <CardDescription>
                      Access FDA-approved drug information and regulatory data
                    </CardDescription>
                  </CardHeader>
                  {/* <CardContent className="text-center">
                    <Button variant="outline" className="group-hover:bg-secondary group-hover:text-secondary-foreground transition-all duration-300">
                      Search Drugs <ChevronRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </CardContent> */}
                </Card>

                <Card 
                  className="group cursor-pointer transition-all duration-300 hover:shadow-pink-500/20 hover:shadow-lg hover:-translate-y-2 border-border/50 animate-fade-in-up [animation-delay:400ms]"
                  onClick={() => setActiveModule('diagnostic')}
                >
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center group-hover:bg-pink-200 dark:group-hover:bg-pink-900/50 transition-colors duration-300">
                      <Stethoscope className="w-8 h-8 text-pink-600 dark:text-pink-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                    </div>
                    <CardTitle className="text-xl">Diagnostic Tool</CardTitle>
                    <CardDescription>
                      Answer questions to help identify potential rare diseases
                    </CardDescription>
                  </CardHeader>
                  {/* <CardContent className="text-center">
                    <Button variant="outline" className="group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                      Start Diagnosis <ChevronRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </CardContent> */}
                </Card>

                <Card 
                  className="group cursor-pointer transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-2 border-border/50 animate-fade-in-up"
                  onClick={() => setActiveModule('communities')}
                >
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <Users className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                    </div>
                    <CardTitle className="text-xl">Communities</CardTitle>
                    <CardDescription>
                      Connect with others and join supportive rare disease communities
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              {/* Footer Info */}
              <div className="mt-16 border-t border-border/50 pt-8 animate-fade-in-up [animation-delay:600ms]">
                <div className="max-w-4xl mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">About RareInsight</h4>
                      <p className="text-sm text-muted-foreground">
                        Empowering patients and healthcare providers with rare disease information and diagnostic assistance.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Quick Links</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li><a href="#" className="hover:text-primary transition-colors">Rare Diseases</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Treatment Options</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Clinical Trials</a></li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Important Notice</h4>
                      <p className="text-xs text-muted-foreground">
                        This platform provides educational information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                      </p>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-border/20 text-center text-xs text-muted-foreground">
                    <p>© {new Date().getFullYear()} RareInsight. All rights reserved.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderContent();
};

export default Index;
