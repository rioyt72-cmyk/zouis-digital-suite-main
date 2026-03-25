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

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  display_order: number;
  is_active: boolean;
}

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "Globe",
    display_order: 0,
    is_active: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({ title: "Error fetching services", variant: "destructive" });
    } else {
      setServices(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      const { error } = await supabase
        .from("services")
        .update(formData)
        .eq("id", editingId);

      if (error) {
        toast({ title: "Error updating service", variant: "destructive" });
      } else {
        toast({ title: "Service updated!" });
        setEditingId(null);
      }
    } else {
      const { error } = await supabase
        .from("services")
        .insert([formData]);

      if (error) {
        toast({ title: "Error creating service", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Service created!" });
      }
    }

    resetForm();
    fetchServices();
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", icon: "Globe", display_order: 0, is_active: true });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (service: Service) => {
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      display_order: service.display_order,
      is_active: service.is_active,
    });
    setEditingId(service.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting service", variant: "destructive" });
    } else {
      toast({ title: "Service deleted!" });
      fetchServices();
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase.from("services").update({ is_active: isActive }).eq("id", id);
    if (!error) fetchServices();
  };

  return (
    <AdminLayout title="Services">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">Manage your services</p>
          <Button variant="hero" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Service
          </Button>
        </div>

        {showForm && (
          <div className="p-6 rounded-[24px] bg-black/30 backdrop-blur-2xl border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading font-semibold text-foreground">
                {editingId ? "Edit Service" : "New Service"}
              </h3>
              <button onClick={resetForm}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Title</Label>
                  <Input
                    placeholder="Web Development"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-white/5 border-white/10 mt-1"
                    required
                  />
                </div>
                <div>
                  <Label>Icon (Lucide name)</Label>
                  <Input
                    placeholder="Globe, Code, Smartphone..."
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="bg-white/5 border-white/10 mt-1"
                    required
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Service description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-white/5 border-white/10 mt-1"
                  required
                />
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                    className="bg-white/5 border-white/10 mt-1 w-24"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label>Active</Label>
                </div>
              </div>
              <Button type="submit" variant="hero" className="w-fit">
                {editingId ? "Update" : "Create"} Service
              </Button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No services found.</div>
        ) : (
          <div className="grid gap-4">
            {services.map((service) => (
              <div key={service.id} className="p-4 rounded-xl bg-black/20 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Switch checked={service.is_active} onCheckedChange={(checked) => toggleActive(service.id, checked)} />
                  <div>
                    <p className="font-semibold text-foreground">{service.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{service.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(service)}><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(service.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
