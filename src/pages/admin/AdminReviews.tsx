import { useState, useEffect } from "react";
import { AdminLayout } from "@/pages/Admin";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, X, Star } from "lucide-react";

interface Review {
  id: string;
  client_name: string;
  client_role: string | null;
  client_company: string | null;
  content: string;
  rating: number;
  avatar_url: string | null;
  is_active: boolean;
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    client_name: "",
    client_role: "",
    client_company: "",
    content: "",
    rating: 5,
    avatar_url: "",
    is_active: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    setReviews(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      client_role: formData.client_role || null,
      client_company: formData.client_company || null,
      avatar_url: formData.avatar_url || null,
    };

    if (editingId) {
      await supabase.from("reviews").update(payload).eq("id", editingId);
      toast({ title: "Updated!" });
    } else {
      await supabase.from("reviews").insert([payload]);
      toast({ title: "Created!" });
    }

    resetForm();
    fetchReviews();
  };

  const resetForm = () => {
    setFormData({ client_name: "", client_role: "", client_company: "", content: "", rating: 5, avatar_url: "", is_active: true });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (review: Review) => {
    setFormData({
      client_name: review.client_name,
      client_role: review.client_role || "",
      client_company: review.client_company || "",
      content: review.content,
      rating: review.rating,
      avatar_url: review.avatar_url || "",
      is_active: review.is_active,
    });
    setEditingId(review.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await supabase.from("reviews").delete().eq("id", id);
    toast({ title: "Deleted!" });
    fetchReviews();
  };

  return (
    <AdminLayout title="Reviews">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">Manage client reviews</p>
          <Button variant="hero" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Review
          </Button>
        </div>

        {showForm && (
          <div className="p-6 rounded-[24px] bg-black/30 backdrop-blur-2xl border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading font-semibold">{editingId ? "Edit" : "New"} Review</h3>
              <button onClick={resetForm}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Client Name</Label>
                  <Input value={formData.client_name} onChange={(e) => setFormData({ ...formData, client_name: e.target.value })} className="bg-white/5 border-white/10 mt-1" required />
                </div>
                <div>
                  <Label>Role</Label>
                  <Input value={formData.client_role} onChange={(e) => setFormData({ ...formData, client_role: e.target.value })} className="bg-white/5 border-white/10 mt-1" />
                </div>
                <div>
                  <Label>Company</Label>
                  <Input value={formData.client_company} onChange={(e) => setFormData({ ...formData, client_company: e.target.value })} className="bg-white/5 border-white/10 mt-1" />
                </div>
              </div>
              <div>
                <Label>Review Content</Label>
                <Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="bg-white/5 border-white/10 mt-1" required />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Rating (1-5)</Label>
                  <Input type="number" min="1" max="5" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })} className="bg-white/5 border-white/10 mt-1" />
                </div>
                <div>
                  <Label>Avatar URL</Label>
                  <Input value={formData.avatar_url} onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })} className="bg-white/5 border-white/10 mt-1" />
                </div>
                <div className="flex items-center gap-2 mt-6">
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
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No reviews found.</div>
        ) : (
          <div className="grid gap-4">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 rounded-xl bg-black/20 border border-white/10 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground">{review.client_name}</p>
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.client_role} at {review.client_company}</p>
                  <p className="text-sm text-foreground/80 mt-1 line-clamp-2">{review.content}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(review)}><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(review.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;
