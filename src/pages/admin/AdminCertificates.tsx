import { useState, useEffect } from "react";
import { AdminLayout } from "@/pages/Admin";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, X } from "lucide-react";

interface Certificate {
  id: string;
  certificate_id: string;
  holder_name: string;
  course_name: string;
  issue_date: string;
}

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    certificate_id: "",
    holder_name: "",
    course_name: "",
    issue_date: new Date().toISOString().split("T")[0],
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error fetching certificates", variant: "destructive" });
    } else {
      setCertificates(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      const { error } = await supabase
        .from("certificates")
        .update(formData)
        .eq("id", editingId);

      if (error) {
        toast({ title: "Error updating certificate", variant: "destructive" });
      } else {
        toast({ title: "Certificate updated!" });
        setEditingId(null);
      }
    } else {
      const { error } = await supabase
        .from("certificates")
        .insert([formData]);

      if (error) {
        toast({ title: "Error creating certificate", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Certificate created!" });
      }
    }

    setFormData({
      certificate_id: "",
      holder_name: "",
      course_name: "",
      issue_date: new Date().toISOString().split("T")[0],
    });
    setShowForm(false);
    fetchCertificates();
  };

  const handleEdit = (cert: Certificate) => {
    setFormData({
      certificate_id: cert.certificate_id,
      holder_name: cert.holder_name,
      course_name: cert.course_name,
      issue_date: cert.issue_date,
    });
    setEditingId(cert.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;

    const { error } = await supabase
      .from("certificates")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error deleting certificate", variant: "destructive" });
    } else {
      toast({ title: "Certificate deleted!" });
      fetchCertificates();
    }
  };

  return (
    <AdminLayout title="Certificates">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">Manage certificates for verification</p>
          <Button variant="hero" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Certificate
          </Button>
        </div>

        {showForm && (
          <div className="p-6 rounded-[24px] bg-black/30 backdrop-blur-2xl border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading font-semibold text-foreground">
                {editingId ? "Edit Certificate" : "New Certificate"}
              </h3>
              <button onClick={() => { setShowForm(false); setEditingId(null); }}>
                <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Certificate ID</Label>
                <Input
                  placeholder="ZC-2024-001"
                  value={formData.certificate_id}
                  onChange={(e) => setFormData({ ...formData, certificate_id: e.target.value })}
                  className="bg-white/5 border-white/10 mt-1"
                  required
                />
              </div>
              <div>
                <Label>Holder Name</Label>
                <Input
                  placeholder="Gokul"
                  value={formData.holder_name}
                  onChange={(e) => setFormData({ ...formData, holder_name: e.target.value })}
                  className="bg-white/5 border-white/10 mt-1"
                  required
                />
              </div>
              <div>
                <Label>Course Name</Label>
                <Input
                  placeholder="Web Development"
                  value={formData.course_name}
                  onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                  className="bg-white/5 border-white/10 mt-1"
                  required
                />
              </div>
              <div>
                <Label>Issue Date</Label>
                <Input
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                  className="bg-white/5 border-white/10 mt-1"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" variant="hero">
                  {editingId ? "Update" : "Create"} Certificate
                </Button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No certificates found. Add your first certificate!
          </div>
        ) : (
          <div className="grid gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-4 rounded-xl bg-black/20 border border-white/10 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-foreground">{cert.holder_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {cert.certificate_id} • {cert.course_name} • {new Date(cert.issue_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(cert)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(cert.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCertificates;
