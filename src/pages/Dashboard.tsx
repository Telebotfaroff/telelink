import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Shield, Plus, LogOut, LayoutDashboard, Link as LinkIcon, ArrowRight, Settings as SettingsIcon } from "lucide-react";
import CreatePostDialog from "@/components/CreatePostDialog";
import { Sidebar, SidebarProvider, SidebarTrigger, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import LinkSection from "@/components/LinkSection";
import Settings from "@/pages/Settings";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <div className="flex flex-col h-full bg-muted/40">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                tellelink
                </h1>
            </div>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setActiveView("dashboard")} isActive={activeView === "dashboard"}>
                <LayoutDashboard className="h-5 w-5 mr-3" />
                <span className="text-lg">Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setActiveView("links")} isActive={activeView === "links"}>
                <LinkIcon className="h-5 w-5 mr-3" />
                <span className="text-lg">Links</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setActiveView("settings")} isActive={activeView === "settings"}>
                <SettingsIcon className="h-5 w-5 mr-3" />
                <span className="text-lg">Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
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