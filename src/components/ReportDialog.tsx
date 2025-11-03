import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

interface ReportDialogProps {
  postId: string;
  linkId?: string;
}

const ReportDialog = ({ postId, linkId }: ReportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error("Please provide a comment");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("reports").insert({
        post_id: postId,
        link_id: linkId,
        comment: comment.trim(),
        reporter_email: email.trim() || null,
      });

      if (error) throw error;

      toast.success("Report submitted successfully");
      setComment("");
      setEmail("");
      setOpen(false);
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Report Broken Link
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Broken Link</DialogTitle>
          <DialogDescription>
            Let us know if you found a broken or incorrect link
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comment">Comment *</Label>
            <Textarea
              id="comment"
              placeholder="Describe the issue with the link..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
