import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Briefcase, MapPin, Clock, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { JobApplicationForm } from "@/components/JobApplicationForm";
import { ApplicationStatusCheck } from "@/components/ApplicationStatusCheck";

interface Career {
  id: string;
  title: string;
  location: string;
  job_type: string;
  description: string;
  requirements: string | null;
}

const Careers = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Career | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showGeneralForm, setShowGeneralForm] = useState(false);
  const [showStatusCheck, setShowStatusCheck] = useState(false);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    const { data } = await supabase
      .from("careers")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    setCareers(data || []);
    setLoading(false);
  };

  const handleApply = (job: Career) => {
    setSelectedJob(job);
    setShowApplicationForm(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Join Our <span className="text-primary">Team</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
              Be part of a dynamic team that's shaping the future of digital solutions in Tamil Nadu and beyond.
            </p>
            <Button 
              variant="outline" 
              className="border-white/20 hover:bg-white/10"
              onClick={() => setShowStatusCheck(true)}
            >
              <Search className="w-4 h-4 mr-2" />
              Check Application Status
            </Button>
          </div>

          {/* Job Listings */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : careers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No open positions at the moment.</p>
              <p className="text-muted-foreground">Check back later or submit a general application below!</p>
            </div>
          ) : (
            <div className="grid gap-6 max-w-4xl mx-auto">
              {careers.map((job) => (
                <div
                  key={job.id}
                  className="group relative p-6 md:p-8 rounded-[24px] overflow-hidden transition-all duration-500 hover:-translate-y-1
                    bg-black/30 dark:bg-black/40
                    backdrop-blur-2xl backdrop-saturate-150
                    border border-white/10
                    shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]
                    hover:shadow-[0_20px_50px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.12)]
                    hover:border-white/20
                    card-glossy-shine"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  
                  <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-heading font-semibold text-foreground mb-2">{job.title}</h3>
                      <p className="text-muted-foreground mb-3">{job.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-primary" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-primary" />
                          {job.job_type}
                        </span>
                      </div>
                    </div>
                    <Button variant="hero" className="shrink-0" onClick={() => handleApply(job)}>
                      Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA Section */}
          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-4">
              Don't see a position that fits? Send us your resume anyway!
            </p>
            <Button 
              variant="outline" 
              className="border-white/20 hover:bg-white/10"
              onClick={() => setShowGeneralForm(true)}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Submit General Application
            </Button>
          </div>
        </div>
      </main>
      <Footer />

      {/* Application Form Modal */}
      <JobApplicationForm
        open={showApplicationForm}
        onOpenChange={setShowApplicationForm}
        job={selectedJob}
      />

      {/* General Application Form Modal */}
      <JobApplicationForm
        open={showGeneralForm}
        onOpenChange={setShowGeneralForm}
        job={null}
        isGeneral={true}
      />

      {/* Status Check Modal */}
      <ApplicationStatusCheck
        open={showStatusCheck}
        onOpenChange={setShowStatusCheck}
      />
    </div>
  );
};

export default Careers;
