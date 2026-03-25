import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Search, CheckCircle, XCircle, Award, Calendar, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface CertificateData {
  certificate_id: string;
  holder_name: string;
  course_name: string;
  issue_date: string;
}

const CertificateVerification = () => {
  const [certificateId, setCertificateId] = useState("");
  const [verificationResult, setVerificationResult] = useState<"valid" | "invalid" | null>(null);
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (!certificateId.trim()) return;
    
    setIsVerifying(true);
    setVerificationResult(null);
    setCertificateData(null);

    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("certificate_id, holder_name, course_name, issue_date")
        .eq("certificate_id", certificateId.trim().toUpperCase())
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setVerificationResult("valid");
        setCertificateData(data);
      } else {
        setVerificationResult("invalid");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationResult("invalid");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 rounded-2xl bg-primary/30 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-primary/30">
              <Award className="w-10 h-10 text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Certificate <span className="text-primary">Verification</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Verify the authenticity of certificates issued by Zouis Corp. Enter the certificate ID to check its validity.
            </p>
          </div>

          {/* Verification Form */}
          <div className="max-w-xl mx-auto">
            <div className="relative p-8 rounded-[24px] overflow-hidden
              bg-black/30 dark:bg-black/40
              backdrop-blur-2xl backdrop-saturate-150
              border border-white/10
              shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              <div className="relative space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Certificate ID
                  </label>
                  <Input
                    placeholder="Enter certificate ID (e.g., ZC-2024-001)"
                    value={certificateId}
                    onChange={(e) => {
                      setCertificateId(e.target.value);
                      setVerificationResult(null);
                      setCertificateData(null);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                    className="bg-white/5 border-white/10 focus:border-primary/50"
                  />
                </div>
                
                <Button 
                  variant="hero" 
                  className="w-full"
                  onClick={handleVerify}
                  disabled={isVerifying || !certificateId.trim()}
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Verify Certificate
                    </>
                  )}
                </Button>

                {/* Valid Result */}
                {verificationResult === "valid" && certificateData && (
                  <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/30">
                    <div className="flex items-start gap-4">
                      <CheckCircle className="w-8 h-8 text-green-500 shrink-0 mt-1" />
                      <div className="space-y-3">
                        <div>
                          <p className="font-semibold text-green-500 text-lg">Valid Certificate</p>
                          <p className="text-foreground mt-1">
                            This certificate is authentic and issued by <span className="font-semibold">Zouis Corp</span> to{" "}
                            <span className="text-primary font-bold">{certificateData.holder_name}</span>
                          </p>
                        </div>
                        
                        <div className="grid gap-2 pt-2 border-t border-green-500/20">
                          <div className="flex items-center gap-2 text-sm">
                            <Award className="w-4 h-4 text-green-500" />
                            <span className="text-muted-foreground">Certificate ID:</span>
                            <span className="text-foreground font-medium">{certificateData.certificate_id}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <BookOpen className="w-4 h-4 text-green-500" />
                            <span className="text-muted-foreground">Course:</span>
                            <span className="text-foreground font-medium">{certificateData.course_name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-green-500" />
                            <span className="text-muted-foreground">Issue Date:</span>
                            <span className="text-foreground font-medium">
                              {new Date(certificateData.issue_date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Invalid Result */}
                {verificationResult === "invalid" && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-6 h-6 text-red-500" />
                      <div>
                        <p className="font-semibold text-red-500">Invalid Certificate</p>
                        <p className="text-sm text-muted-foreground">
                          This certificate ID was not found in our records. Please check the ID and try again.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Certificate IDs start with "ZC-" followed by year and unique number.
              <br />
              Example: ZC-2024-001
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CertificateVerification;
