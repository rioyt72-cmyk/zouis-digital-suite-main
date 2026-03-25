import { useState, useEffect } from "react";
import { AdminLayout } from "@/pages/Admin";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Mail, MailOpen } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages(data || []);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    fetchMessages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    toast({ title: "Deleted!" });
    setSelectedMessage(null);
    fetchMessages();
  };

  const openMessage = (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.is_read) markAsRead(msg.id);
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <AdminLayout title="Messages">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}` : "All messages read"}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Message List */}
          <div className="space-y-2">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No messages yet.</div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedMessage?.id === msg.id
                      ? "bg-primary/10 border-primary/30"
                      : "bg-black/20 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {msg.is_read ? (
                        <MailOpen className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Mail className="w-4 h-4 text-primary" />
                      )}
                      <div>
                        <p className={`font-medium ${msg.is_read ? "text-foreground" : "text-primary"}`}>
                          {msg.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{msg.email}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {msg.subject && (
                    <p className="text-sm text-foreground mt-2 font-medium">{msg.subject}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{msg.message}</p>
                </div>
              ))
            )}
          </div>

          {/* Message Detail */}
          {selectedMessage && (
            <div className="p-6 rounded-[24px] bg-black/30 backdrop-blur-2xl border border-white/10 h-fit sticky top-24">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{selectedMessage.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                  {selectedMessage.phone && (
                    <p className="text-sm text-muted-foreground">{selectedMessage.phone}</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(selectedMessage.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>

              {selectedMessage.subject && (
                <p className="font-medium text-foreground mb-2">{selectedMessage.subject}</p>
              )}

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Received: {new Date(selectedMessage.created_at).toLocaleString()}
              </p>

              <Button
                variant="hero"
                className="mt-4 w-full"
                onClick={() => window.open(`mailto:${selectedMessage.email}`)}
              >
                Reply via Email
              </Button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
