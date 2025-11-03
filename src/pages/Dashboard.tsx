import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Shield, Plus, LogOut, LayoutDashboard, Link as LinkIcon, ArrowRight, Settings as SettingsIcon, MessageSquare } from "lucide-react";
import CreatePostDialog from "@/components/CreatePostDialog";
import { Sidebar, SidebarProvider, SidebarTrigger, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import LinkSection from "@/components/LinkSection";
import Settings from "@/pages/Settings";
import Reports from "@/pages/Reports";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useIsAdmin } from "@/hooks/useIsAdmin";

const Dashboard = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const navigate = useNavigate();
  const { isAdmin } = useIsAdmin();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <SidebarProvider>
      <Sidebar className="border-r bg-gradient-to-b from-background to-muted/20">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                tellelink
              </h1>
            </div>
          </div>
          
          <div className="flex-1 p-4 space-y-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setActiveView("dashboard")} 
                  isActive={activeView === "dashboard"}
                  className="group relative overflow-hidden transition-all duration-200"
                >
                  <div className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    activeView === "dashboard" 
                      ? "bg-primary text-primary-foreground shadow-lg" 
                      : "hover:bg-muted/50"
                  }`}>
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="font-medium">Dashboard</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setActiveView("links")} 
                  isActive={activeView === "links"}
                  className="group relative overflow-hidden transition-all duration-200"
                >
                  <div className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    activeView === "links" 
                      ? "bg-primary text-primary-foreground shadow-lg" 
                      : "hover:bg-muted/50"
                  }`}>
                    <LinkIcon className="h-5 w-5" />
                    <span className="font-medium">Links</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setActiveView("settings")} 
                  isActive={activeView === "settings"}
                  className="group relative overflow-hidden transition-all duration-200"
                >
                  <div className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    activeView === "settings" 
                      ? "bg-primary text-primary-foreground shadow-lg" 
                      : "hover:bg-muted/50"
                  }`}>
                    <SettingsIcon className="h-5 w-5" />
                    <span className="font-medium">Settings</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveView("reports")} 
                    isActive={activeView === "reports"}
                    className="group relative overflow-hidden transition-all duration-200"
                  >
                    <div className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      activeView === "reports" 
                        ? "bg-primary text-primary-foreground shadow-lg" 
                        : "hover:bg-muted/50"
                    }`}>
                      <MessageSquare className="h-5 w-5" />
                      <span className="font-medium">Reports</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </div>
          
          <div className="p-4 border-t bg-card/30">
            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-xs text-muted-foreground text-center">
                Powered by tellelink
              </p>
            </div>
          </div>
        </div>
      </Sidebar>
      <SidebarInset>
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <SidebarTrigger />
                <div className="flex items-center gap-4">
                    <Button onClick={() => setShowCreateDialog(true)} className="shadow-lg rounded-full">
                        <Plus className="h-5 w-5 mr-2" />
                        New Post
                    </Button>
                    <Button variant="ghost" onClick={handleSignOut} className="rounded-full">
                        <LogOut className="h-5 w-5 mr-2" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </header>

        <main className="container mx-auto px-4 py-8">
            {activeView === 'dashboard' && (
                <div className="grid gap-8">
                    <Card className="shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <LayoutDashboard className="h-6 w-6" />
                                Welcome to your Dashboard
                            </CardTitle>
                            <CardDescription>
                                This is your central hub for managing your content and links.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                You can create new posts, manage your links, and view your public profile.
                                Get started by creating a new post or managing your links.
                            </p>
                            <Button variant="link" className="px-0 mt-4" onClick={() => setActiveView("links")}>
                                Manage Links <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
            {activeView === 'links' && <LinkSection />}
            {activeView === 'settings' && <Settings />}
            {activeView === 'reports' && isAdmin && <Reports />}
        </main>

        <CreatePostDialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
            onPostCreated={() => {}}
        />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Dashboard;