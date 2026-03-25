import { useState, useEffect } from "react";
import { AdminLayout } from "@/pages/Admin";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, X } from "lucide-react";

interface Career {
  id: string;
  title: string;
  location: string;
  job_type: string;
  description: string;
  requirements: string | null;
  is_active: boolean;
}

const AdminCareers = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    job_type: "Full-time",
    description: "",
    requirements: "",
    is_active: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    const { data } = await supabase.from("careers").select("*").order("created_at", { ascending: false });
    setCareers(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, requirements: formData.requirements || null };

    if (editingId) {
      await supabase.from("careers").update(payload).eq("id", editingId);
      toast({ title: "Updated!" });
    } else {
      await supabase.from("careers").insert([payload]);
      toast({ title: "Created!" });
    }

    resetForm();
    fetchCareers();
  };

  const resetForm = () => {
    setFormData({ title: "", location: "", job_type: "Full-time", description: "", requirements: "", is_active: true });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (career: Career) => {
    setFormData({
      title: career.title,
      location: career.location,
      job_type: career.job_type,
      description: career.description,
      requirements: career.requirements || "",
      is_active: career.is_active,
    });
    setEditingId(career.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job?")) return;
    await supabase.from("careers").delete().eq("id", id);
    toast({ title: "Deleted!" });
    fetchCareers();
  };

  return (
    <AdminLayout title="Careers">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">Manage job listings</p>
          <Button variant="hero" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Job
          </Button>
        </div>

        {showForm && (
          <div className="p-6 rounded-[24px] bg-black/30 backdrop-blur-2xl border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading font-semibold">{editingId ? "Edit" : "New"} Job</h3>
              <button onClick={resetForm}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Job Title</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="bg-white/5 border-white/10 mt-1" required />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="bg-white/5 border-white/10 mt-1" required />
                </div>
                <div>
                  <Label>Job Type</Label>
                  <Input value={formData.job_type} onChange={(e) => setFormData({ ...formData, job_type: e.target.value })} className="bg-white/5 border-white/10 mt-1" required />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-white/5 border-white/10 mt-1" required />
              </div>
              <div>
                <Label>Requirements</Label>
                <Textarea value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} className="bg-white/5 border-white/10 mt-1" />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
                <Label>Active</Label>
              </div>
              <Button type="submit" variant="hero" className="w-fit">{editingId ? "Update" : "Create"}</Button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : careers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No jobs found.</div>
        ) : (
          <div className="grid gap-4">
            {careers.map((career) => (
              <div key={career.id} className="p-4 rounded-xl bg-black/20 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{career.title}</p>
                    {!career.is_active && <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded">Inactive</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{career.location} • {career.job_type}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(career)}><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(career.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCareers;
