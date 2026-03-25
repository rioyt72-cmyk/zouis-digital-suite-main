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

interface Portfolio {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  link: string | null;
  display_order: number;
  is_active: boolean;
}

const AdminPortfolio = () => {
  const [items, setItems] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "",
    link: "",
    display_order: 0,
    is_active: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("portfolio")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error) setItems(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      description: formData.description || null,
      image_url: formData.image_url || null,
      category: formData.category || null,
      link: formData.link || null,
    };

    if (editingId) {
      const { error } = await supabase.from("portfolio").update(payload).eq("id", editingId);
      if (!error) toast({ title: "Updated!" });
      setEditingId(null);
    } else {
      const { error } = await supabase.from("portfolio").insert([payload]);
      if (!error) toast({ title: "Created!" });
    }

    resetForm();
    fetchItems();
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", image_url: "", category: "", link: "", display_order: 0, is_active: true });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (item: Portfolio) => {
    setFormData({
      title: item.title,
      description: item.description || "",
      image_url: item.image_url || "",
      category: item.category || "",
      link: item.link || "",
      display_order: item.display_order,
      is_active: item.is_active,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await supabase.from("portfolio").delete().eq("id", id);
    toast({ title: "Deleted!" });
    fetchItems();
  };

  return (
    <AdminLayout title="Portfolio">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">Manage portfolio items</p>
          <Button variant="hero" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Item
          </Button>
        </div>

        {showForm && (
          <div className="p-6 rounded-[24px] bg-black/30 backdrop-blur-2xl border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading font-semibold">{editingId ? "Edit" : "New"} Portfolio Item</h3>
              <button onClick={resetForm}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Title</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="bg-white/5 border-white/10 mt-1" required />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="bg-white/5 border-white/10 mt-1" />
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className="bg-white/5 border-white/10 mt-1" />
                </div>
                <div>
                  <Label>Link</Label>
                  <Input value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} className="bg-white/5 border-white/10 mt-1" />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-white/5 border-white/10 mt-1" />
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <Label>Order</Label>
                  <Input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} className="bg-white/5 border-white/10 mt-1 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
                  <Label>Active</Label>
                </div>
              </div>
              <Button type="submit" variant="hero" className="w-fit">{editingId ? "Update" : "Create"}</Button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No portfolio items found.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-black/20 border border-white/10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}><Edit2 className="w-4 h-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPortfolio;
