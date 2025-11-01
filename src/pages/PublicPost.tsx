import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Link {
  id: string;
  button_name: string;
  url: string;
  position: number;
}

interface Post {
  id: string;
  title: string;
}

const PublicPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .select("id, title")
        .eq("slug", slug)
        .single();

      if (postError) throw postError;
      setPost(postData);

      const { data: linksData, error: linksError } = await supabase
        .from("links")
        .select("*")
        .eq("post_id", postData.id)
        .order("position");

      if (linksError) throw linksError;
      setLinks(linksData || []);
    } catch (error: any) {
      toast.error("Post not found");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Post not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              LinkGuard
            </h1>
          </div>
        </div>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{post.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {links.map((link) => (
              <Button
                key={link.id}
                onClick={() => handleLinkClick(link.url)}
                className="w-full justify-between group shadow-card hover:shadow-elegant transition-all"
                variant="outline"
                size="lg"
              >
                <span className="font-medium">{link.button_name}</span>
                <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </Button>
            ))}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Powered by LinkGuard
        </p>
      </div>
    </div>
  );
};

export default PublicPost;