import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Link2, Lock, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 pointer-events-none" />
        
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="h-16 w-16 text-primary" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                LinkGuard
              </h1>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold max-w-3xl mx-auto">
              Protect and Share Your Links with Style
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create beautiful, protected link collections and share them with unique URLs. 
              Perfect for creators, businesses, and anyone who wants organized link sharing.
            </p>
            
            <div className="flex gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="shadow-elegant text-lg px-8"
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/auth")}
                className="text-lg px-8"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose LinkGuard?</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-card shadow-card space-y-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Link2 className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold">Multiple Links</h4>
              <p className="text-muted-foreground">
                Add up to 20 links per post with custom button names. Perfect for organizing all your important links in one place.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card shadow-card space-y-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold">Secure & Private</h4>
              <p className="text-muted-foreground">
                Your links are protected with authentication. Only you can manage them, but sharing is easy with unique URLs.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card shadow-card space-y-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold">Lightning Fast</h4>
              <p className="text-muted-foreground">
                Create and share link collections in seconds. Beautiful, responsive design that works everywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h3 className="text-3xl md:text-4xl font-bold">
            Ready to Protect Your Links?
          </h3>
          <p className="text-xl text-muted-foreground">
            Join thousands of users who trust LinkGuard for their link sharing needs.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="shadow-elegant text-lg px-8"
          >
            Start Free Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 LinkGuard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
