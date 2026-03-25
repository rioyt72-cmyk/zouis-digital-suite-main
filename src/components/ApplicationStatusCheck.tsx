import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Clock, CheckCircle, XCircle, AlertCircle, FileText } from "lucide-react";

interface ApplicationStatusCheckProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ApplicationData {
  application_number: string;
  full_name: string;
  email: string;
  status: string;
  created_at: string;
  updated_at: string;
  is_general_application: boolean;
  career?: {
    title: string;
  } | null;
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  pending: { icon: Clock, color: "text-yellow-500", label: "Pending Review" },
  reviewing: { icon: AlertCircle, color: "text-blue-500", label: "Under Review" },
  shortlisted: { icon: CheckCircle, color: "text-green-500", label: "Shortlisted" },
  interview: { icon: FileText, color: "text-purple-500", label: "Interview Scheduled" },
  hired: { icon: CheckCircle, color: "text-green-600", label: "Hired" },
  rejected: { icon: XCircle, color: "text-red-500", label: "Not Selected" },
};

export const ApplicationStatusCheck = ({ open, onOpenChange }: ApplicationStatusCheckProps) => {
  const [applicationNumber, setApplicationNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationNumber.trim()) return;

    setLoading(true);
    setNotFound(false);
    setApplication(null);

    try {
      const { data, error } = await supabase
        .from("job_applications")
        .select(`
          application_number,
          full_name,
          email,
          status,
          created_at,
          updated_at,
          is_general_application,
          careers:career_id (title)
        `)
        .ilike("application_number", applicationNumber.trim())
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setApplication({
          ...data,
          career: data.careers as { title: string } | null,
        });
      } else {
        setNotFound(true);
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setApplicationNumber("");
    setApplication(null);
    setNotFound(false);
    onOpenChange(false);
  };

  const status = application ? statusConfig[application.status] || statusConfig.pending : null;
  const StatusIcon = status?.icon || Clock;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-background/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading">Check Application Status</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <Label>Application Number</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={applicationNumber}
                onChange={(e) => setApplicationNumber(e.target.value.toUpperCase())}
                className="bg-white/5 border-white/10 font-mono"
                placeholder="APP-XXXXXXXX-XXXXXXXX"
              />
              <Button type="submit" variant="hero" disabled={loading}>
                {loading ? "..." : <Search className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </form>

        {notFound && (
          <div className="text-center py-6">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-muted-foreground">No application found with this number.</p>
            <p className="text-sm text-muted-foreground mt-1">Please check and try again.</p>
          </div>
        )}

        {application && (
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full bg-white/5 ${status?.color}`}>
                <StatusIcon className="w-6 h-6" />
              </div>
              <div>
                <p className={`font-semibold ${status?.color}`}>{status?.label}</p>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(application.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white/5 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{application.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Position:</span>
                <span className="font-medium">
                  {application.is_general_application ? "General Application" : application.career?.title || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Applied:</span>
                <span className="font-medium">{new Date(application.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              You will receive an email notification when your application status changes.
            </p>
          </div>
        )}

        <Button onClick={handleClose} variant="outline" className="w-full mt-2">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};
