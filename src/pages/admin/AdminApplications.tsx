import { useState, useEffect } from "react";
import { AdminLayout } from "@/pages/Admin";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Search, Eye, Mail, X, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Application {
  id: string;
  application_number: string;
  full_name: string;
  email: string;
  phone: string | null;
  experience_years: number | null;
  current_company: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  cover_letter: string | null;
  status: string;
  is_general_application: boolean;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  careers: { title: string } | null;
}

const statusOptions = [
  { value: "pending", label: "Pending Review", color: "bg-yellow-500/20 text-yellow-500" },
  { value: "reviewing", label: "Under Review", color: "bg-blue-500/20 text-blue-500" },
  { value: "shortlisted", label: "Shortlisted", color: "bg-green-500/20 text-green-500" },
  { value: "interview", label: "Interview Scheduled", color: "bg-purple-500/20 text-purple-500" },
  { value: "hired", label: "Hired", color: "bg-green-600/20 text-green-600" },
  { value: "rejected", label: "Not Selected", color: "bg-red-500/20 text-red-500" },
];

const AdminApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from("job_applications")
      .select(`*, careers:career_id (title)`)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string, email: string, name: string, appNumber: string) => {
    setUpdating(true);
    const { error } = await supabase
      .from("job_applications")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      // Send status update email
      try {
        await supabase.functions.invoke("send-application-email", {
          body: {
            type: "status_update",
            email,
            name,
            applicationNumber: appNumber,
            status: newStatus,
          },
        });
      } catch (emailError) {
        console.log("Email notification failed");
      }

      toast({ title: "Status updated!" });
      fetchApplications();
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    }
    setUpdating(false);
  };

  const saveAdminNotes = async () => {
    if (!selectedApp) return;
    setUpdating(true);

    const { error } = await supabase
      .from("job_applications")
      .update({ admin_notes: adminNotes })
      .eq("id", selectedApp.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Notes saved!" });
      fetchApplications();
      setSelectedApp({ ...selectedApp, admin_notes: adminNotes });
    }
    setUpdating(false);
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.application_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    return statusOptions.find((s) => s.value === status)?.color || "bg-gray-500/20 text-gray-500";
  };

  return (
    <AdminLayout title="Job Applications">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or application number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/10">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No applications found.</div>
        ) : (
          <div className="space-y-3">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-xl bg-black/20 border border-white/10 flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-foreground">{app.full_name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded ${getStatusStyle(app.status)}`}>
                      {statusOptions.find((s) => s.value === app.status)?.label}
                    </span>
                    {app.is_general_application && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">General</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {app.careers?.title || "General Application"} • {app.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {app.application_number} • Applied {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={app.status}
                    onValueChange={(value) =>
                      updateStatus(app.id, value, app.email, app.full_name, app.application_number)
                    }
                    disabled={updating}
                  >
                    <SelectTrigger className="w-40 bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedApp(app);
                      setAdminNotes(app.admin_notes || "");
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading">Application Details</DialogTitle>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold">{selectedApp.full_name}</p>
                  <p className="text-muted-foreground">{selectedApp.application_number}</p>
                </div>
                <span className={`text-sm px-3 py-1 rounded-full ${getStatusStyle(selectedApp.status)}`}>
                  {statusOptions.find((s) => s.value === selectedApp.status)?.label}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-white/5">
                  <Label className="text-muted-foreground text-xs">Email</Label>
                  <p className="flex items-center gap-2">
                    {selectedApp.email}
                    <a href={`mailto:${selectedApp.email}`} className="text-primary">
                      <Mail className="w-4 h-4" />
                    </a>
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <Label className="text-muted-foreground text-xs">Phone</Label>
                  <p>{selectedApp.phone || "Not provided"}</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <Label className="text-muted-foreground text-xs">Position</Label>
                  <p>{selectedApp.careers?.title || "General Application"}</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <Label className="text-muted-foreground text-xs">Experience</Label>
                  <p>{selectedApp.experience_years ? `${selectedApp.experience_years} years` : "Not provided"}</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <Label className="text-muted-foreground text-xs">Current Company</Label>
                  <p>{selectedApp.current_company || "Not provided"}</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <Label className="text-muted-foreground text-xs">Applied On</Label>
                  <p>{new Date(selectedApp.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-4">
                {selectedApp.linkedin_url && (
                  <a
                    href={selectedApp.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    LinkedIn <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {selectedApp.portfolio_url && (
                  <a
                    href={selectedApp.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    Portfolio <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {selectedApp.cover_letter && (
                <div>
                  <Label className="text-muted-foreground text-xs">Cover Letter</Label>
                  <div className="p-4 rounded-lg bg-white/5 mt-2 whitespace-pre-wrap">
                    {selectedApp.cover_letter}
                  </div>
                </div>
              )}

              <div>
                <Label className="text-muted-foreground text-xs">Admin Notes</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="bg-white/5 border-white/10 mt-2"
                  placeholder="Add internal notes about this applicant..."
                />
                <Button
                  variant="hero"
                  size="sm"
                  className="mt-2"
                  onClick={saveAdminNotes}
                  disabled={updating}
                >
                  Save Notes
                </Button>
              </div>

              <div>
                <Label className="text-muted-foreground text-xs">Update Status</Label>
                <Select
                  value={selectedApp.status}
                  onValueChange={(value) =>
                    updateStatus(
                      selectedApp.id,
                      value,
                      selectedApp.email,
                      selectedApp.full_name,
                      selectedApp.application_number
                    )
                  }
                  disabled={updating}
                >
                  <SelectTrigger className="w-full bg-white/5 border-white/10 mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminApplications;
