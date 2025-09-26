import { useState, useRef } from "react";
import { useForm, ValidationError } from '@formspree/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, User, Mail, Globe, FileText, CheckCircle, Image, Loader2, X, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClientInfo {
  name: string;
  email: string;
  domain: string;
  description: string;
}

interface ClientInfoFormProps {
  selectedWebsite: any;
  selectedAddOns: string[];
  selectedMaintenance: string;
  totalOneTimePrice: number;
  totalMonthlyPrice: number;
  addOnServices: any[];
  maintenancePlans: any[];
}

// Cloudinary configuration - replace with your actual credentials
const CLOUDINARY_CLOUD_NAME  = import.meta.env.VITE_CLOUD_NAME; // e.g., "your-cloud-name"
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUD_UPLOAD_PRESET; // Create an unsigned upload preset in Cloudinary

export const ClientInfoForm = ({
  selectedWebsite,
  selectedAddOns,
  selectedMaintenance,
  totalOneTimePrice,
  totalMonthlyPrice,
  addOnServices,
  maintenancePlans
}: ClientInfoFormProps) => {
  const { toast } = useToast();
  const [state, handleSubmit] = useForm("mnngnkop");
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    name: "",
    email: "",
    domain: "",
    description: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [websiteReferences, setWebsiteReferences] = useState<string[]>([]);
  const [referenceInput, setReferenceInput] = useState("");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof ClientInfo, value: string) => {
    setClientInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a logo smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      setLogoFile(file);
      
      toast({
        title: "Logo uploaded",
        description: `${file.name} has been uploaded successfully`,
      });
    }
  };

  const uploadLogoToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
    
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      const data = await response.json();
      return data.secure_url; // Return the secure URL of the uploaded image
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload logo. Please try again.');
    }
  };

  const removeLogo = () => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoPreview(null);
    setLogoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReferenceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addReference();
    }
  };

  const addReference = () => {
    const trimmedInput = referenceInput.trim();
    if (trimmedInput && !websiteReferences.includes(trimmedInput)) {
      setWebsiteReferences(prev => [...prev, trimmedInput]);
      setReferenceInput("");
    }
  };

  const removeReference = (index: number) => {
    setWebsiteReferences(prev => prev.filter((_, i) => i !== index));
  };

  const handleReferenceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReferenceInput(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!clientInfo.name || !clientInfo.email) {
      toast({
        title: "Missing information",
        description: "Please fill in your name and email address",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientInfo.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    let logoUrl = "";

    // Upload logo to Cloudinary if exists
    if (logoFile) {
      setIsUploadingLogo(true);
      try {
        logoUrl = await uploadLogoToCloudinary(logoFile);
        toast({
          title: "Logo uploaded to Cloudinary",
          description: "Logo has been successfully processed",
        });
      } catch (error) {
        toast({
          title: "Logo upload failed",
          description: error instanceof Error ? error.message : "Please try again",
          variant: "destructive",
        });
        setIsUploadingLogo(false);
        return;
      }
      setIsUploadingLogo(false);
    }

    // Create FormData for Formspree submission
    const formData = new FormData();
    
    // Basic client information
    formData.append("name", clientInfo.name);
    formData.append("email", clientInfo.email);
    formData.append("domain", clientInfo.domain);
    formData.append("description", clientInfo.description);
    formData.append("websiteReferences", websiteReferences.join(", "));
    
    // Add logo URL if uploaded successfully
    if (logoUrl) {
      formData.append("logoUrl", logoUrl);
    }
    
    // Quote information
    formData.append("websiteType", selectedWebsite?.name || "Not selected");
    formData.append("websitePrice", `₦${selectedWebsite?.basePrice?.toLocaleString() || 0}`);
    formData.append("deliveryTime", selectedWebsite?.deliveryTime || "Not specified");
    
    // Add-ons information
    const selectedAddOnItems = selectedAddOns.map(id => 
      addOnServices.find(service => service.id === id)
    ).filter(Boolean);
    
    formData.append("addOns", selectedAddOnItems.map(item => item.name).join(", "));
    formData.append("addOnsTotal", `₦${selectedAddOnItems.reduce((sum, item) => sum + (item.price || 0), 0).toLocaleString()}`);
    
    // Maintenance plan
    const maintenancePlan = maintenancePlans.find(plan => plan.id === selectedMaintenance);
    formData.append("maintenancePlan", maintenancePlan?.name || "Not selected");
    formData.append("maintenancePrice", `₦${maintenancePlan?.price?.toLocaleString() || 0}/month`);
    
    // Pricing summary
    formData.append("oneTimeCost", `₦${totalOneTimePrice.toLocaleString()}`);
    formData.append("monthlyCost", `₦${totalMonthlyPrice.toLocaleString()}`);
    formData.append("totalFirstPayment", `₦${totalOneTimePrice.toLocaleString()}`);
    formData.append("ongoingMonthly", `₦${totalMonthlyPrice.toLocaleString()}`);
    
    // Timestamp and subject
    formData.append("submittedAt", new Date().toLocaleString());
    formData.append("_subject", `New Website Quote Request from ${clientInfo.name}`);

    // Call Formspree's handleSubmit
    handleSubmit(formData);
  };

  const generateQuoteSummary = () => {
    const selectedAddOnItems = selectedAddOns.map(id => 
      addOnServices.find(service => service.id === id)
    ).filter(Boolean);
    
    const maintenancePlan = maintenancePlans.find(plan => plan.id === selectedMaintenance);

    return `
Website Type: ${selectedWebsite?.name || "Not selected"}
One-Time Development Cost: ₦${totalOneTimePrice.toLocaleString()}
Monthly Maintenance: ₦${totalMonthlyPrice.toLocaleString()}

Selected Add-ons:
${selectedAddOnItems.length > 0 ? selectedAddOnItems.map(item => `• ${item.name} - ₦${item.price.toLocaleString()}`).join('\n') : '• None'}

Maintenance Plan: ${maintenancePlan?.name || "Not selected"} - ₦${maintenancePlan?.price?.toLocaleString() || 0}/month

Total First Payment: ₦${totalOneTimePrice.toLocaleString()}
Ongoing Monthly: ₦${totalMonthlyPrice.toLocaleString()}
    `.trim();
  };

  // Show success message when form is submitted
  if (state.succeeded) {
    return (
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Thank You!
        </h2>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Quote Request Submitted Successfully!
              </h3>
              <p className="text-muted-foreground mb-4">
                We've received your project details and will get back to you within 24 hours 
                with your detailed proposal.
              </p>
              <div className="bg-slate-50 rounded-lg p-4 text-left">
                <h4 className="font-semibold mb-2">Your Quote Summary:</h4>
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {generateQuoteSummary()}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  const isSubmitting = state.submitting || isUploadingLogo;

  return (
    <section>
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Project Information & Quote Request
      </h2>
      
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2 text-primary" />
            Complete Your Quote Request
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={clientInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="pl-10 border-input-border focus:ring-focus"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={clientInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 border-input-border focus:ring-focus"
                    required
                  />
                </div>
                <ValidationError 
                  prefix="Email" 
                  field="email"
                  errors={state.errors}
                  className="text-xs text-red-500"
                />
              </div>
            </div>

            {/* Domain Preference */}
            <div className="space-y-2">
              <Label htmlFor="domain" className="text-sm font-medium">
                Preferred Domain Name
              </Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="domain"
                  name="domain"
                  type="text"
                  placeholder="yourwebsite.com"
                  value={clientInfo.domain}
                  onChange={(e) => handleInputChange("domain", e.target.value)}
                  className="pl-10 border-input-border focus:ring-focus"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                We'll help you register this domain or suggest alternatives
              </p>
            </div>

            {/* Website References */}
            <div className="space-y-2">
              <Label htmlFor="references" className="text-sm font-medium">
                Website References (Optional)
              </Label>
              <div className="space-y-2">
                <div className="relative">
                  <Link className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="references"
                    type="text"
                    placeholder="Paste website URLs or names (type comma or enter to add)"
                    value={referenceInput}
                    onChange={handleReferenceInputChange}
                    onKeyDown={handleReferenceKeyDown}
                    className="pl-10 border-input-border focus:ring-focus"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Add websites you like for design inspiration. Separate with commas or press Enter.
                </p>
                
                {/* Tags display */}
                {websiteReferences.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {websiteReferences.map((ref, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="flex items-center gap-1 py-1"
                      >
                        {ref}
                        <button
                          type="button"
                          onClick={() => removeReference(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Logo Upload with Preview */}
            <div className="space-y-2">
              <Label htmlFor="logo" className="text-sm font-medium">
                Logo Upload {isUploadingLogo && "(Uploading...)"}
              </Label>
              <div className="border-2 border-dashed border-input-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  id="logo"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  disabled={isUploadingLogo}
                />
                <label
                  htmlFor="logo"
                  className={`cursor-pointer flex flex-col items-center space-y-2 ${isUploadingLogo ? 'opacity-50' : ''}`}
                >
                  {logoPreview ? (
                    <div className="space-y-3">
                      <div className="relative inline-block">
                        <img 
                          src={logoPreview} 
                          alt="Logo preview" 
                          className="w-32 h-32 object-contain rounded-lg border"
                        />
                        {!isUploadingLogo && (
                          <button
                            type="button"
                            onClick={removeLogo}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">
                          {isUploadingLogo ? "Uploading to Cloudinary..." : "Click to change logo"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <div className="text-sm">
                        <span className="font-medium">Upload your logo</span>
                        <p className="text-muted-foreground">PNG, JPG up to 5MB</p>
                        {isUploadingLogo && (
                          <p className="text-blue-500">Uploading to Cloudinary...</p>
                        )}
                      </div>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Project Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Project Description
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Tell us about your project goals, target audience, and any specific requirements..."
                  value={clientInfo.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="pl-10 pt-3 min-h-[120px] border-input-border focus:ring-focus resize-none"
                />
              </div>
              <ValidationError 
                prefix="Description" 
                field="description"
                errors={state.errors}
                className="text-xs text-red-500"
              />
              
              {/* Quote Summary Preview */}
              <div className="bg-slate-50 rounded-lg p-3 mt-2">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Your Quote Summary:</p>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                  {generateQuoteSummary()}
                </pre>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isUploadingLogo ? "Uploading Logo..." : "Submitting Quote..."}
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Submit Quote Request
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By submitting, you agree to our terms and privacy policy. We'll contact you within 24 hours.
            </p>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};