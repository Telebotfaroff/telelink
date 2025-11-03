import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ExternalLink, Link2 } from "lucide-react";
import { toast } from "sonner";
import ReportDialog from "@/components/ReportDialog";

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

  const getButtonClass = (index: number) => {
    const colors = [
      "bg-gradient-to-r from-teal-400 to-cyan-500",
      "bg-gradient-to-r from-red-500 to-orange-500",
      "bg-gradient-to-r from-blue-500 to-purple-600",
      "bg-gradient-to-r from-green-400 to-green-600",
      "bg-gradient-to-r from-pink-500 to-rose-500",
    ];
    return colors[index % colors.length];
  };

  const isShortened = (url: string) => {
    return url.includes('gplinks.com') || url.includes('gplnk.com');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin h-8 w-8 border-4 border-cyan-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Card className="bg-transparent shadow-none">
          <CardContent className="pt-6">
            <p className="text-center text-gray-400">Post not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-cyan-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              tellelink
            </h1>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mb-8 px-4">
          This website is owned and maintained by{" "}
          <a
            href="https://telemovie.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline"
          >
            https://telemovie.netlify.app/
          </a>{" "}
          only for link sharing.
        </p>

        <Card className="bg-transparent border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-white font-bold tracking-wider">{post.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {links.map((link, index) => (
              <div key={link.id} className="relative">
                {isShortened(link.url) && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 z-10 bg-cyan-500/20 text-cyan-400 border-cyan-500/30 backdrop-blur-sm"
                  >
                    <Link2 className="h-3 w-3 mr-1" />
                    Shortened
                  </Badge>
                )}
                <Button
                  onClick={() => handleLinkClick(link.url)}
                  className={`w-full justify-center group shadow-lg hover:shadow-xl transition-all gap-3 text-white font-bold py-6 px-4 rounded-lg ${getButtonClass(index)}`}
                  size="lg"
                >
                  <span className="font-medium text-lg tracking-wide">{link.button_name}</span>
                  <ExternalLink className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="mt-8 space-y-4">
          <div className="text-center">
            <Button
              onClick={() => handleLinkClick("https://telemovie.netlify.app/")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              Visit Our Website
            </Button>
          </div>
          
          <div className="max-w-md mx-auto">
            <ReportDialog postId={post.id} />
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Powered by tellelink
        </p>
      </div>
    </div>
  );
};

export default PublicPost;
