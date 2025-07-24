import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Loader2, Pill, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DrugSearchProps {
  onBack: () => void;
}

interface DrugResult {
  drug_name: string;
  description: string;
  manufacturers: string[];
  success: boolean;
}

interface DrugSuggestion {
  drug_name: string;
}

export const DrugSearch = ({ onBack }: DrugSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<DrugResult | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [backendUrl, setBackendUrl] = useState("http://localhost:5000");
  const [showConfig, setShowConfig] = useState(false);
  const { toast } = useToast();

  // Debounced search for suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.length > 2) {
        fetchSuggestions(searchTerm);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, backendUrl]);

  const fetchSuggestions = async (query: string) => {
    try {
      const response = await fetch(`${backendUrl}/api/drug-info?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
      }
    } catch (error) {
      // Silently fail for suggestions
      console.log("Suggestions not available");
    }
  };

  const handleSearch = async (drugName: string = searchTerm) => {
    if (!drugName.trim()) return;

    setIsLoading(true);
    setShowSuggestions(false);
    
    try {
      const response = await fetch(`${backendUrl}/api/drug-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          drug_name: drugName.trim()
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResults(data);
        toast({
          title: "Search completed",
          description: `Found information for "${data.drug_name}"`,
        });
      } else {
        toast({
          title: "No results found",
          description: data.message || "No information found for this drug",
          variant: "destructive",
        });
        setResults(null);
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Unable to connect to the drug database. Please check your backend URL.",
        variant: "destructive",
      });
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfig(!showConfig)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Config
            </Button>
          </div>
          <div className="text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-4">
              FDA Drug Search
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find treatments, get diagnosed for 10,000+ rare diseases.
            </p>
          </div>
        </div>

        {/* Configuration Panel */}
        {showConfig && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-sm">Backend Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Backend URL (e.g., http://localhost:5000)"
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={() => setShowConfig(false)} variant="outline">
                  Done
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search FDA Approved Drugs</CardTitle>
            <CardDescription>
              Enter the drug name to get FDA approval information and regulatory data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Enter drug name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                  {/* Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-10 bg-card border border-border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                      {suggestions.slice(0, 10).map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-muted transition-colors cursor-pointer border-b border-border/50 last:border-b-0"
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
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Search Results</h2>
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-primary">{results.drug_name}</CardTitle>
                    <CardDescription className="mt-1">
                      FDA Approved Drug Information
                    </CardDescription>
                  </div>
                  <Badge className="bg-secondary text-secondary-foreground">
                    Approved
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Manufacturers</h4>
                  <div className="flex flex-wrap gap-2">
                    {results.manufacturers.map((manufacturer, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {manufacturer}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Drug Information</h4>
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: results.description.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      }} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !results && searchTerm && (
          <Card className="text-center py-12">
            <CardContent>
              <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try searching with a different drug name or check your spelling
              </p>
            </CardContent>
          </Card>
        )}

        {/* Connection Status */}
        {!isLoading && !showConfig && (
          <div className="text-center mt-8">
            <p className="text-xs text-muted-foreground">
              Connected to: {backendUrl} • Click Config to change backend URL
            </p>
          </div>
        )}
      </div>
    </div>
  );
};