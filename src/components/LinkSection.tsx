import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Shield, Search } from "lucide-react";
import { toast } from "sonner";
import PostCard from "@/components/PostCard";

interface Post {
  id: string;
  title: string;
  slug: string;
  created_at: string;
}

const LinkSection = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handlePostDeleted = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
            type="search"
            placeholder="Search links..."
            className="pl-10 w-full bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>

        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-40 bg-card rounded-lg animate-pulse" />
                ))}
            </div>
        ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
                <Shield className="h-20 w-20 mx-auto mb-6 text-primary/20" />
                <h3 className="text-2xl font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground">Create your first post to see it here.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} onDelete={handlePostDeleted} />
                ))}
            </div>
        )}
    </div>
  );
};

export default LinkSection;
