import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface RareDiseaseSearchProps {
  onBack: () => void;
}

interface DiseaseResult {
  disease: string;
  description: string;
  success: boolean;
  message: string;
}

export const RareDiseaseSearch = ({ onBack }: RareDiseaseSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();

  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length > 2) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/disease-description?q=${encodeURIComponent(searchTerm)}`);
          if (response.ok) {
            const data = await response.json();
            setSuggestions(data.suggestions || []);
            setShowSuggestions(true);
          }
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setShowSuggestions(false);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/disease-description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disease_name: searchTerm.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setResult(data);
          toast({
            title: "Search completed",
            description: `Found information for "${data.disease}"`,
          });
        } else {
          throw new Error(data.message || "Disease not found");
        }
      } else {
        throw new Error("Failed to fetch disease information");
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "Unable to fetch disease information. Please try again.",
        variant: "destructive",
      });
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setIsLoading(true);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/disease-description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disease_name: suggestion }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setResult(data);
          toast({
            title: "Search completed",
            description: `Found information for "${data.disease}"`,
          });
        } else {
          throw new Error(data.message || "Disease not found");
        }
      } else {
        throw new Error("Failed to fetch disease information");
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "Unable to fetch disease information. Please try again.",
        variant: "destructive",
      });
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-4">
              Rare Disease Search
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find treatments, get diagnosed for 10,000+ rare diseases.
            </p>
          </div>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Rare Diseases</CardTitle>
            <CardDescription>
              Enter the name of a rare disease to get detailed information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Input
                  placeholder="Enter disease name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowSuggestions(suggestions.length > 0)}
                  className="w-full"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        className="w-full px-4 py-2 text-left hover:bg-muted transition-colors"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Disease Information</h2>
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-primary">{result.disease}</CardTitle>
                    <CardDescription className="mt-1">
                      Rare Disease Information
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({node, ...props}) => <p className="mb-4" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 mb-4" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-2 mb-4" {...props} />,
                      li: ({node, ...props}) => <li className="text-muted-foreground" {...props} />,
                      h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-3" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xl font-semibold mt-5 mb-3" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-lg font-semibold mt-4 mb-3" {...props} />,
                      h4: ({node, ...props}) => <h4 className="text-base font-semibold mt-3 mb-2" {...props} />,
                    }}
                  >
                    {result.description}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !result && searchTerm && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try searching with a different disease name or check your spelling
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};