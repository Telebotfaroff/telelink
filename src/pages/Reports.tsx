import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";

interface Report {
  id: string;
  post_id: string;
  link_id: string | null;
  comment: string;
  reporter_email: string | null;
  status: string;
  created_at: string;
  posts: {
    title: string;
    slug: string;
  };
  links: {
    url: string;
    button_name: string;
  } | null;
}

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select(`
          *,
          posts (title, slug),
          links (url, button_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (reportId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("reports")
        .update({ status: newStatus })
        .eq("id", reportId);

      if (error) throw error;

      toast.success("Status updated");
      fetchReports();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return <div className="p-6">Loading reports...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reported Broken Links</h1>
        <p className="text-muted-foreground">Manage user-reported broken links</p>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">No reports yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {report.posts.title}
                    </CardTitle>
                    <CardDescription>
                      {report.links ? (
                        <>
                          Link: {report.links.button_name} ({report.links.url})
                        </>
                      ) : (
                        "General post report"
                      )}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      report.status === "resolved"
                        ? "default"
                        : report.status === "pending"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {report.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Comment:</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {report.comment}
                  </p>
                </div>

                {report.reporter_email && (
                  <div>
                    <p className="font-medium mb-1">Reporter Email:</p>
                    <p className="text-sm text-muted-foreground">
                      {report.reporter_email}
                    </p>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Reported on {format(new Date(report.created_at), "PPpp")}
                </div>

                <div className="flex gap-2 pt-2">
                  {report.status !== "resolved" && (
                    <Button
                      size="sm"
                      onClick={() => updateStatus(report.id, "resolved")}
                    >
                      Mark as Resolved
                    </Button>
                  )}
                  {report.status !== "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(report.id, "pending")}
                    >
                      Mark as Pending
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`/${report.posts.slug}`, "_blank")}
                  >
                    View Post
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
