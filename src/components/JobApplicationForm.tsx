import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { CheckCircle, Copy, AlertCircle } from "lucide-react";

const applicationSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().max(20).optional(),
  experience_years: z.number().min(0).max(50).optional(),
  current_company: z.string().max(100).optional(),
  linkedin_url: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  portfolio_url: z.string().url("Invalid portfolio URL").optional().or(z.literal("")),
  cover_letter: z.string().max(5000).optional(),
});

interface JobApplicationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: {
    id: string;
    title: string;
    location: string;
    job_type: string;
  } | null;
  isGeneral?: boolean;
}

interface ExistingApplication {
  application_number: string;
  created_at: string;
  canReapplyDate: Date;
}

export const JobApplicationForm = ({ open, onOpenChange, job, isGeneral = false }: JobApplicationFormProps) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState("");
  const [existingApplication, setExistingApplication] = useState<ExistingApplication | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    experience_years: "",
    current_company: "",
    linkedin_url: "",
    portfolio_url: "",
    cover_letter: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const checkExistingApplication = async (email: string): Promise<ExistingApplication | null> => {
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const { data, error } = await supabase
      .from("job_applications")
      .select("application_number, created_at")
      .eq("email", email.toLowerCase().trim())
      .gte("created_at", sixtyDaysAgo.toISOString())
      .order("created_at", { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) return null;

    const applicationDate = new Date(data[0].created_at);
    const canReapplyDate = new Date(applicationDate);
    canReapplyDate.setDate(canReapplyDate.getDate() + 60);

    return {
      application_number: data[0].application_number,
      created_at: data[0].created_at,
      canReapplyDate,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setExistingApplication(null);
    
    const dataToValidate = {
      ...formData,
      experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined,
      linkedin_url: formData.linkedin_url || undefined,
      portfolio_url: formData.portfolio_url || undefined,
    };

    const result = applicationSchema.safeParse(dataToValidate);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      // Check for existing application within 60 days
      const existing = await checkExistingApplication(formData.email);
      if (existing) {
        setExistingApplication(existing);
        setLoading(false);
        return;
      }

      const applicationData = {
        full_name: formData.full_name,
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone || null,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
        current_company: formData.current_company || null,
        linkedin_url: formData.linkedin_url || null,
        portfolio_url: formData.portfolio_url || null,
        cover_letter: formData.cover_letter || null,
        career_id: isGeneral ? null : job?.id,
        is_general_application: isGeneral,
        application_number: "temp", // Will be replaced by trigger
      };

      const { data, error } = await supabase
        .from("job_applications")
        .insert([applicationData])
        .select("application_number")
        .single();

      if (error) throw error;

      setApplicationNumber(data.application_number);
      setSubmitted(true);

      // Send confirmation email
      try {
        await supabase.functions.invoke("send-application-email", {
          body: {
            type: "confirmation",
            email: formData.email,
            name: formData.full_name,
            applicationNumber: data.application_number,
            jobTitle: isGeneral ? "General Application" : job?.title,
          },
        });
      } catch (emailError) {
        console.log("Email sending failed, but application was submitted");
      }

      toast({ title: "Application submitted successfully!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      experience_years: "",
      current_company: "",
      linkedin_url: "",
      portfolio_url: "",
      cover_letter: "",
    });
    setErrors({});
    setSubmitted(false);
    setApplicationNumber("");
    setExistingApplication(null);
    onOpenChange(false);
  };

  const copyApplicationNumber = (appNum: string) => {
    navigator.clipboard.writeText(appNum);
    toast({ title: "Copied to clipboard!" });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading">
            {existingApplication 
              ? "Already Applied" 
              : submitted 
              ? "Application Submitted!" 
              : isGeneral 
              ? "General Application" 
              : `Apply for ${job?.title}`}
          </DialogTitle>
        </DialogHeader>

        {existingApplication ? (
          <div className="text-center py-8 space-y-6">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto" />
            <div>
              <p className="text-lg font-semibold mb-2">You have already applied!</p>
              <p className="text-muted-foreground mb-4">
                We found an existing application with this email address. Please check your email for your application number.
              </p>
              <p className="text-sm text-amber-600 mt-2">
                You can reapply after {formatDate(existingApplication.canReapplyDate)}.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={handleClose} variant="hero">
                Close
              </Button>
            </div>
          </div>
        ) : submitted ? (
          <div className="text-center py-8 space-y-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <p className="text-lg font-semibold mb-2">Thank you for applying!</p>
              <p className="text-muted-foreground mb-4">
                Your application has been submitted. Save your application number to check status:
              </p>
              <div className="flex items-center justify-center gap-2 p-4 bg-primary/10 rounded-lg">
                <span className="text-xl font-mono font-bold text-primary">{applicationNumber}</span>
                <Button variant="ghost" size="sm" onClick={() => copyApplicationNumber(applicationNumber)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                A confirmation email has been sent to your email address.
              </p>
            </div>
            <Button onClick={handleClose} variant="hero">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isGeneral && job && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm">
                <p><strong>Position:</strong> {job.title}</p>
                <p><strong>Location:</strong> {job.location} • {job.job_type}</p>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="bg-white/5 border-white/10 mt-1"
                  required
                />
                {errors.full_name && <p className="text-sm text-red-500 mt-1">{errors.full_name}</p>}
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/5 border-white/10 mt-1"
                  required
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-white/5 border-white/10 mt-1"
                />
              </div>
              <div>
                <Label>Years of Experience</Label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                  className="bg-white/5 border-white/10 mt-1"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Current Company</Label>
                <Input
                  value={formData.current_company}
                  onChange={(e) => setFormData({ ...formData, current_company: e.target.value })}
                  className="bg-white/5 border-white/10 mt-1"
                />
              </div>
              <div>
                <Label>LinkedIn URL</Label>
                <Input
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  className="bg-white/5 border-white/10 mt-1"
                  placeholder="https://linkedin.com/in/..."
                />
                {errors.linkedin_url && <p className="text-sm text-red-500 mt-1">{errors.linkedin_url}</p>}
              </div>
            </div>

            <div>
              <Label>Portfolio URL</Label>
              <Input
                value={formData.portfolio_url}
                onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                className="bg-white/5 border-white/10 mt-1"
                placeholder="https://..."
              />
              {errors.portfolio_url && <p className="text-sm text-red-500 mt-1">{errors.portfolio_url}</p>}
            </div>

            <div>
              <Label>Cover Letter</Label>
              <Textarea
                value={formData.cover_letter}
                onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
                className="bg-white/5 border-white/10 mt-1 min-h-[120px]"
                placeholder="Tell us why you're interested in this position..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="hero" className="flex-1" disabled={loading}>
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
