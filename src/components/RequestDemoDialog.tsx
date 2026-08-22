import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";

interface RequestDemoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormState {
  fullName: string;
  workEmail: string;
  company: string;
  phone: string;
  companySize: string;
  productInterest: string;
  preferredDay: string;
  preferredTime: string;
  message: string;
}

const initialForm: FormState = {
  fullName: "",
  workEmail: "",
  company: "",
  phone: "",
  companySize: "",
  productInterest: "",
  preferredDay: "",
  preferredTime: "",
  message: "",
};

export const RequestDemoDialog = ({ open, onOpenChange }: RequestDemoDialogProps) => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isValid =
    form.fullName.trim() &&
    form.workEmail.trim() &&
    form.company.trim() &&
    form.productInterest;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${baseUrl}/v1/public/demo-request/public`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit demo request');
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error('Demo request submission failed:', err);
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      // Reset state after dialog closes
      setTimeout(() => {
        setForm(initialForm);
        setSubmitted(false);
        setErrorMessage(null);
      }, 300);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {submitted ? (
          /* ── Success State ── */
          <div className="flex flex-col items-center justify-center text-center py-16 px-10">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <h2 className="font-['DM_Sans'] font-bold text-[26px] text-foreground mb-3">
              Request Received!
            </h2>
            <p className="font-['DM_Sans'] font-normal text-[15px] leading-[1.6] text-muted-foreground max-w-[360px]">
              Thanks! Our team will reach out within one business day to confirm your demo slot.
            </p>
            <button
              onClick={() => handleClose(false)}
              className="mt-8 bg-transparent border border-border text-muted-foreground font-['DM_Sans'] font-normal text-[14px] px-[20px] py-[10px] rounded-[6px] hover:bg-foreground/5 hover:text-foreground transition-all"
            >
              Close
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="px-8 pt-8 pb-6 border-b border-border">
              <DialogHeader>
                <DialogTitle className="font-['DM_Sans'] font-bold text-[22px] text-foreground text-left">
                  Request a Demo
                </DialogTitle>
                <DialogDescription className="font-['DM_Sans'] font-normal text-[14px] text-muted-foreground text-left mt-1">
                  Tell us about your use case and we'll schedule a personalised walkthrough with our team.
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Body */}
            <div className="px-8 py-6 space-y-5">
              {errorMessage && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-md font-['DM_Sans']">
                  {errorMessage}
                </div>
              )}
              {/* Row 1: Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="font-['DM_Sans'] font-medium text-[13px] text-foreground">
                    Full Name <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Rahul Sharma"
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    className="font-['DM_Sans'] text-[14px] h-10"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="workEmail" className="font-['DM_Sans'] font-medium text-[13px] text-foreground">
                    Work Email <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="workEmail"
                    type="email"
                    placeholder="rahul@yourcompany.com"
                    value={form.workEmail}
                    onChange={(e) => handleChange("workEmail", e.target.value)}
                    className="font-['DM_Sans'] text-[14px] h-10"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Company + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="company" className="font-['DM_Sans'] font-medium text-[13px] text-foreground">
                    Company Name <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="company"
                    placeholder="Acme Finance Ltd."
                    value={form.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                    className="font-['DM_Sans'] text-[14px] h-10"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="font-['DM_Sans'] font-medium text-[13px] text-foreground">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="font-['DM_Sans'] text-[14px] h-10"
                  />
                </div>
              </div>

              {/* Row 3: Company Size + Product Interest */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-['DM_Sans'] font-medium text-[13px] text-foreground">
                    Company Size
                  </Label>
                  <Select value={form.companySize} onValueChange={(v) => handleChange("companySize", v)}>
                    <SelectTrigger className="font-['DM_Sans'] text-[14px] h-10">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10" className="font-['DM_Sans'] text-[13px]">1–10 employees</SelectItem>
                      <SelectItem value="11-50" className="font-['DM_Sans'] text-[13px]">11–50 employees</SelectItem>
                      <SelectItem value="51-200" className="font-['DM_Sans'] text-[13px]">51–200 employees</SelectItem>
                      <SelectItem value="201-500" className="font-['DM_Sans'] text-[13px]">201–500 employees</SelectItem>
                      <SelectItem value="500+" className="font-['DM_Sans'] text-[13px]">500+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-['DM_Sans'] font-medium text-[13px] text-foreground">
                    Product Interest <span className="text-primary">*</span>
                  </Label>
                  <Select value={form.productInterest} onValueChange={(v) => handleChange("productInterest", v)}>
                    <SelectTrigger className="font-['DM_Sans'] text-[14px] h-10">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kyc" className="font-['DM_Sans'] text-[13px]">KYC Engine</SelectItem>
                      <SelectItem value="credit-scoring" className="font-['DM_Sans'] text-[13px]">Credit Scoring</SelectItem>
                      <SelectItem value="rules-engine" className="font-['DM_Sans'] text-[13px]">Rules Engine</SelectItem>
                      <SelectItem value="full-suite" className="font-['DM_Sans'] text-[13px]">Full Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 4: Preferred Day + Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-['DM_Sans'] font-medium text-[13px] text-foreground">
                    Preferred Day
                  </Label>
                  <Select value={form.preferredDay} onValueChange={(v) => handleChange("preferredDay", v)}>
                    <SelectTrigger className="font-['DM_Sans'] text-[14px] h-10">
                      <SelectValue placeholder="Select preferred day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="this-week" className="font-['DM_Sans'] text-[13px]">This week</SelectItem>
                      <SelectItem value="next-week" className="font-['DM_Sans'] text-[13px]">Next week</SelectItem>
                      <SelectItem value="flexible" className="font-['DM_Sans'] text-[13px]">I'm flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-['DM_Sans'] font-medium text-[13px] text-foreground">
                    Preferred Time (IST)
                  </Label>
                  <Select value={form.preferredTime} onValueChange={(v) => handleChange("preferredTime", v)}>
                    <SelectTrigger className="font-['DM_Sans'] text-[14px] h-10">
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning" className="font-['DM_Sans'] text-[13px]">Morning — 9:00 AM to 11:00 AM</SelectItem>
                      <SelectItem value="afternoon" className="font-['DM_Sans'] text-[13px]">Afternoon — 12:00 PM to 2:00 PM</SelectItem>
                      <SelectItem value="evening" className="font-['DM_Sans'] text-[13px]">Evening — 3:00 PM to 5:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 5: Message */}
              <div className="space-y-1.5">
                <Label htmlFor="message" className="font-['DM_Sans'] font-medium text-[13px] text-foreground">
                  Message / Use Case
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your lending volume, use case, or any specific questions..."
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className="font-['DM_Sans'] text-[14px] min-h-[96px] resize-none"
                />
              </div>

              {/* Compliance note */}
              <p className="font-['DM_Sans'] font-normal text-[11px] text-muted-foreground">
                Your information is handled in accordance with our Privacy Policy. We will never share your data with third parties.
              </p>
            </div>

            {/* Footer */}
            <div className="px-8 pb-8 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-border pt-5">
              <button
                type="button"
                onClick={() => handleClose(false)}
                className="font-['DM_Sans'] font-normal text-[14px] text-muted-foreground border border-border px-[20px] py-[10px] rounded-[6px] hover:bg-foreground/5 hover:text-foreground transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || submitting}
                className="bg-[#F97316] text-foreground font-['DM_Sans'] font-semibold text-[14px] px-[24px] py-[10px] rounded-[6px] hover:brightness-[1.08] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
              >
                {submitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
