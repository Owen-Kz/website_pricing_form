import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Download, Calendar, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { WebsiteType, AddOnService } from "./PricingCalculator";

interface MaintenancePlan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

interface PriceDisplayProps {
  selectedType: string;
  selectedAddOns: string[];
  selectedMaintenance: string;
  websiteTypes: WebsiteType[];
  addOnServices: AddOnService[];
  maintenancePlans: MaintenancePlan[];
  totalOneTimePrice: number;
  totalMonthlyPrice: number;
  formatPrice: (price: number) => string;
}

export const PriceDisplay = ({
  selectedType,
  selectedAddOns,
  selectedMaintenance,
  websiteTypes,
  addOnServices,
  maintenancePlans,
  totalOneTimePrice,
  totalMonthlyPrice,
  formatPrice,
}: PriceDisplayProps) => {
  const selectedWebsiteType = websiteTypes.find(type => type.id === selectedType);
  const selectedAddOnItems = selectedAddOns.map(id => 
    addOnServices.find(service => service.id === id)
  ).filter(Boolean) as AddOnService[];
  
  const selectedMaintenancePlan = maintenancePlans.find(plan => plan.id === selectedMaintenance);

  if (!selectedType) {
    return (
      <Card className="shadow-lg border-2">
        <CardHeader>
          <CardTitle className="text-center text-muted-foreground">
            Select a website type to see pricing
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const handleGenerateQuote = () => {
    const quoteData = {
      websiteType: selectedWebsiteType?.name,
      addOns: selectedAddOnItems.map(item => item.name),
      maintenancePlan: selectedMaintenancePlan?.name,
      oneTimeCost: totalOneTimePrice,
      monthlyCost: totalMonthlyPrice,
      timestamp: new Date().toISOString(),
    };
    
    console.log("Quote generated:", quoteData);
    
    // Create a simple quote text for download
    const quoteText = `
Website Development Quote
========================

Project: ${selectedWebsiteType?.name}
One-Time Development Cost: ${formatPrice(totalOneTimePrice)}
Monthly Maintenance: ${formatPrice(totalMonthlyPrice)}

Included Features:
${selectedWebsiteType?.features.map(f => `• ${f}`).join('\n')}

Add-on Services:
${selectedAddOnItems.length > 0 ? selectedAddOnItems.map(a => `• ${a.name} - ${formatPrice(a.price)}`).join('\n') : '• None selected'}

Maintenance Plan: ${selectedMaintenancePlan?.name} - ${formatPrice(selectedMaintenancePlan?.price || 0)}/month
Maintenance Features:
${selectedMaintenancePlan?.features.map(f => `• ${f}`).join('\n')}

Total First Payment: ${formatPrice(totalOneTimePrice)}
Ongoing Monthly: ${formatPrice(totalMonthlyPrice)}

Generated on: ${new Date().toLocaleDateString()}
    `.trim();

    // Create and download a text file
    const blob = new Blob([quoteText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `website-quote-${selectedWebsiteType?.name}-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="shadow-lg border-2 border-primary/20 sticky top-8">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Project Quote</CardTitle>
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
            Live Quote
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Real-time pricing based on your selection
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        {/* Base Website Type */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-700" />
              <span className="font-semibold">{selectedWebsiteType?.name}</span>
            </div>
            <span className="font-bold text-primary">
              {formatPrice(selectedWebsiteType?.basePrice || 0)}
            </span>
          </div>
          <div className="text-sm text-muted-foreground ml-6 space-y-1">
            <p>{selectedWebsiteType?.description}</p>
            <p className="text-xs">Delivery: {selectedWebsiteType?.deliveryTime}</p>
            <p className="text-xs">Includes: {selectedWebsiteType?.features.slice(0, 2).join(', ')}...</p>
          </div>
        </div>

        {/* Add-on Services */}
        {selectedAddOnItems.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Add-on Services
              </h4>
              {selectedAddOnItems.map((addOn) => (
                <div key={addOn.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <div>
                      <span className="text-sm font-medium">{addOn.name}</span>
                      {addOn.monthlyFee && (
                        <span className="text-xs text-muted-foreground block">
                          + {formatPrice(addOn.monthlyFee)}/month
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    +{formatPrice(addOn.price)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Maintenance Plan */}
        {selectedMaintenancePlan && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Maintenance Plan
              </h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                  <div>
                    <span className="text-sm font-medium">{selectedMaintenancePlan.name}</span>
                    <span className="text-xs text-muted-foreground block">
                      Monthly subscription
                    </span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-primary">
                  {formatPrice(selectedMaintenancePlan.price)}/month
                </span>
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Price Summary */}
        <div className="space-y-4 bg-slate-50 rounded-lg p-4">
          <div className="flex items-center justify-between text-lg font-bold">
            <span>One-Time Development</span>
            <span className="text-primary">
              {formatPrice(totalOneTimePrice)}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-lg font-bold border-t pt-2">
            <span>Monthly Maintenance</span>
            <span className="text-green-700">
              {formatPrice(totalMonthlyPrice)}/month
            </span>
          </div>

          {/* Payment Terms */}
          <div className="text-xs text-muted-foreground space-y-2 pt-2">
            <div className="bg-white p-2 rounded border">
              <p className="font-semibold text-foreground">Payment Structure:</p>
              <p>• 50% deposit to start project</p>
              <p>• 50% upon completion</p>
              <p>• Monthly billing for maintenance</p>
            </div>
            <p>• 30-day support included with development</p>
            <p>• Source code delivered upon final payment</p>
            <p>• Custom requirements may affect final pricing</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button 
            onClick={handleGenerateQuote}
            className="w-full bg-gradient-primary hover:from-blue-700 hover:to-purple-700 text-white transition-all"
            size="lg"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Quote
          </Button>

          <a href="https://calendly.com/bensonmichaelowen/30min" className="block" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full" size="lg">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Consultation
            </Button>
          </a>

          <a href="mailto:bensonmichaelowen@gmail.com?subject=Website Development Quote Inquiry" className="block">
            <Button variant="ghost" className="w-full" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Email for Custom Quote
            </Button>
          </a>
        </div>

        {/* Contact Info */}
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-2">
            Need customization? We offer flexible payment plans!
          </p>
          <div className="space-y-1 text-xs">
            <p className="font-medium text-foreground">📞 +234 902 731 5223</p>
            <p className="text-primary font-semibold">✉️ bensonmichaelowen@gmail.com</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};