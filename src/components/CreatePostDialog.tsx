import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Link2, Link2Off } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Link {
  button_name: string;
  url: string;
}

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated: () => void;
}

const CreatePostDialog = ({ open, onOpenChange, onPostCreated }: CreatePostDialogProps) => {
  const [title, setTitle] = useState("");
  const [links, setLinks] = useState<Link[]>([{ button_name: "", url: "" }]);
  const [loading, setLoading] = useState(false);
  const [linkShortenerEnabled, setLinkShortenerEnabled] = useState(false);

  useEffect(() => {
    if (open) {
      fetchUserSettings();
    }
  }, [open]);

  const fetchUserSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: settings } = await supabase
        .from("user_settings")
        .select("enable_link_shortener")
        .eq("user_id", user.id)
        .single();

      if (settings) {
        setLinkShortenerEnabled(settings.enable_link_shortener);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const shortenLink = async (url: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('shorten-link', {
        body: { url }
      });

      if (error) throw error;

      return data.shortenedUrl || url;
    } catch (error) {
      console.error("Error shortening link:", error);
      return url; // Return original URL if shortening fails
    }
  };

  const handleAddLink = () => {
    if (links.length < 20) {
      setLinks([...links, { button_name: "", url: "" }]);
    }
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, field: keyof Link, value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    const validLinks = links.filter(link => link.button_name.trim() && link.url.trim());
    if (validLinks.length === 0) {
      toast.error("Please add at least one link");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const slug = generateSlug(title);

      const { data: post, error: postError } = await supabase
        .from("posts")
        .insert({ title, slug, user_id: user.id })
        .select()
        .single();

      if (postError) throw postError;

      // Shorten links if enabled
      let processedLinks = validLinks;
      if (linkShortenerEnabled) {
        toast.info("Shortening links...");
        processedLinks = await Promise.all(
          validLinks.map(async (link) => ({
            ...link,
            url: await shortenLink(link.url),
          }))
        );
      }

      const linksToInsert = processedLinks.map((link, index) => ({
        post_id: post.id,
        button_name: link.button_name,
        url: link.url,
        position: index,
      }));

      const { error: linksError } = await supabase
        .from("links")
        .insert(linksToInsert);

      if (linksError) throw linksError;

      // Copy the post link to clipboard
      const postUrl = `${window.location.origin}/post/${slug}`;
      await navigator.clipboard.writeText(postUrl);

      toast.success("Post created and link copied to clipboard!");
      setTitle("");
      setLinks([{ button_name: "", url: "" }]);
      onPostCreated();
    } catch (error: any) {
      toast.error(error.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription className="flex items-center gap-2 flex-wrap">
            Add a title and up to 20 links with custom button names
            <Badge 
              variant={linkShortenerEnabled ? "default" : "secondary"}
              className="ml-auto"
            >
              {linkShortenerEnabled ? (
                <>
                  <Link2 className="h-3 w-3 mr-1" />
                  Link Shortener ON
                </>
              ) : (
                <>
                  <Link2Off className="h-3 w-3 mr-1" />
                  Link Shortener OFF
                </>
              )}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Post Title</Label>
            <Input
              id="title"
              placeholder="My awesome links"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Links ({links.length}/20)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddLink}
                disabled={links.length >= 20}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>

            <div className="space-y-3">
              {links.map((link, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Button name"
                      value={link.button_name}
                      onChange={(e) => handleLinkChange(index, "button_name", e.target.value)}
                    />
                    <Input
                      placeholder="https://example.com"
                      type="url"
                      value={link.url}
                      onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                    />
                  </div>
                  {links.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveLink(index)}
                      className="mt-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save and Copy"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;