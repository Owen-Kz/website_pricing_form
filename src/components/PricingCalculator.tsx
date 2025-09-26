import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Globe, Zap, MessageCircle, Phone, ShoppingCart, Users, Database, Palette, Shield, Search, Cloud, Cpu, Smartphone, Mail, Calendar, Star, CreditCard, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClientInfoForm } from "./ClientInfoForm";
import { PriceDisplay } from "./PriceDisplay";

export interface WebsiteType {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  monthlyMaintenance: number;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
  popular?: boolean;
  deliveryTime: string;
}

export interface AddOnService {
  id: string;
  name: string;
  description: string;
  price: number;
  monthlyFee?: number;
  icon: React.ComponentType<{ className?: string }>;
  category: 'feature' | 'integration' | 'maintenance' | 'marketing';
}

// Industry-standard pricing in Naira (₦)
const websiteTypes: WebsiteType[] = [
  {
    id: "static",
    name: "Static Website",
    description: "Perfect for portfolios, landing pages, and business showcases",
    basePrice: 150000,
    monthlyMaintenance: 5000,
    features: ["5-7 Pages", "Responsive design", "SEO optimized", "Fast loading", "Mobile friendly", "1 month support"],
    icon: Globe,
    deliveryTime: "1-2 weeks"
  },
  {
    id: "dynamic",
    name: "Dynamic Website + CMS",
    description: "Full CMS with admin dashboard for content management",
    basePrice: 350000,
    monthlyMaintenance: 15000,
    features: ["Content management", "Admin dashboard", "User authentication", "Database integration", "5-10 pages", "3 months support"],
    icon: Database,
    popular: true,
    deliveryTime: "3-4 weeks"
  },
  {
    id: "ecommerce",
    name: "E-commerce Platform",
    description: "Complete online store with payment processing",
    basePrice: 600000,
    monthlyMaintenance: 25000,
    features: ["Product management", "Payment gateway", "Order tracking", "Inventory system", "Admin dashboard", "6 months support"],
    icon: ShoppingCart,
    deliveryTime: "4-6 weeks"
  },
  {
    id: "mobile-app",
    name: "Mobile Application",
    description: "Complete mobile application (iOS & Android)",
    basePrice: 1200000,
    monthlyMaintenance: 40000,
    features: ["User authentication", "Push notifications", "Cross-platform", "App store deployment", "Backend API", "6 months support"],
    icon: Smartphone,
    deliveryTime: "6-8 weeks"
  },
  {
    id: "web-app",
    name: "Web Application",
    description: "Complex web application with advanced functionality",
    basePrice: 800000,
    monthlyMaintenance: 35000,
    features: ["Advanced features", "User management", "Real-time updates", "API integration", "Scalable architecture", "1 year support"],
    icon: Cpu,
    deliveryTime: "8-12 weeks"
  }
];

const addOnServices: AddOnService[] = [
  // Feature Add-ons
  {
    id: "chat",
    name: "Live Chat System",
    description: "Real-time customer support chat with admin panel",
    price: 75000,
    monthlyFee: 3000,
    icon: MessageCircle,
    category: 'feature'
  },
  {
    id: "whatsapp",
    name: "WhatsApp Integration",
    description: "Direct WhatsApp messaging with automated responses",
    price: 45000,
    icon: Phone,
    category: 'integration'
  },
  {
    id: "custom-design",
    name: "Premium Design Package",
    description: "Unique branding, custom UI/UX design",
    price: 120000,
    icon: Palette,
    category: 'feature'
  },
  {
    id: "user-system",
    name: "Advanced User System",
    description: "User profiles, roles, permissions, and dashboards",
    price: 90000,
    icon: Users,
    category: 'feature'
  },
  {
    id: "performance",
    name: "Performance Optimization",
    description: "Advanced speed optimization and CDN setup",
    price: 60000,
    monthlyFee: 5000,
    icon: Zap,
    category: 'maintenance'
  },

  // Marketing & SEO
  {
    id: "seo-basic",
    name: "Basic SEO Setup",
    description: "On-page SEO optimization and Google Analytics",
    price: 45000,
    icon: Search,
    category: 'marketing'
  },
  {
    id: "seo-advanced",
    name: "Advanced SEO Package",
    description: "Complete SEO strategy + 3 months optimization",
    price: 120000,
    monthlyFee: 15000,
    icon: Search,
    category: 'marketing'
  },
  {
    id: "email-marketing",
    name: "Email Marketing System",
    description: "Newsletter system with automation",
    price: 80000,
    monthlyFee: 7000,
    icon: Mail,
    category: 'marketing'
  },

  // Security & Maintenance
  {
    id: "ssl-security",
    name: "SSL Security Pro",
    description: "Advanced security features and SSL certificate",
    price: 35000,
    monthlyFee: 2000,
    icon: Shield,
    category: 'maintenance'
  },
  {
    id: "backup-system",
    name: "Automated Backup System",
    description: "Daily backups and quick restoration",
    price: 55000,
    monthlyFee: 4000,
    icon: Cloud,
    category: 'maintenance'
  },
  {
    id: "booking-system",
    name: "Booking/Appointment System",
    description: "Complete booking system with calendar",
    price: 95000,
    monthlyFee: 8000,
    icon: Calendar,
    category: 'feature'
  },
  {
    id: "multi-language",
    name: "Multi-language Support",
    description: "2 additional languages integration",
    price: 65000,
    icon: Globe,
    category: 'feature'
  },
  {
    id: "payment-methods",
    name: "Additional Payment Methods",
    description: "Add PayPal, Flutterwave, Bank Transfer",
    price: 50000,
    icon: CreditCard,
    category: 'integration'
  }
];

const maintenancePlans = [
  {
    id: "basic",
    name: "Basic Maintenance",
    price: 10000,
    features: ["Security updates", "Basic support", "Monthly backups"]
  },
  {
    id: "standard",
    name: "Standard Maintenance",
    price: 20000,
    features: ["Priority support", "Weekly backups", "Performance monitoring", "SEO updates"]
  },
  {
    id: "premium",
    name: "Premium Maintenance",
    price: 35000,
    features: ["24/7 support", "Daily backups", "Advanced security", "Regular updates", "Uptime monitoring"]
  }
];

export const PricingCalculator = () => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedMaintenance, setSelectedMaintenance] = useState<string>("standard");
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const selectedWebsite = websiteTypes.find(type => type.id === selectedType);
  const basePrice = selectedWebsite?.basePrice || 0;
  
  const addOnsPrice = selectedAddOns.reduce((total, addOnId) => {
    const addOn = addOnServices.find(service => service.id === addOnId);
    return total + (addOn?.price || 0);
  }, 0);

  const selectedMaintenancePlan = maintenancePlans.find(plan => plan.id === selectedMaintenance);
  const maintenancePrice = selectedMaintenancePlan?.price || 0;

  // Calculate monthly costs
  const monthlyAddOnsFee = selectedAddOns.reduce((total, addOnId) => {
    const addOn = addOnServices.find(service => service.id === addOnId);
    return total + (addOn?.monthlyFee || 0);
  }, 0);

  const totalOneTimePrice = basePrice + addOnsPrice;
  const totalMonthlyPrice = maintenancePrice + monthlyAddOnsFee + (selectedWebsite?.monthlyMaintenance || 0);

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const formatPrice = (price: number) => {
    return `NGN ${price.toLocaleString()}`;
  };

  const getAddOnsByCategory = (category: AddOnService['category']) => {
    return addOnServices.filter(service => service.category === category);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-hero text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4 bg-white/20 text-white">
            Professional Web Development
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get Your Custom Website Quote
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Configure your perfect website with our interactive pricing calculator. 
            Transparent pricing, no hidden costs. Perfect for Nigerian businesses.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Website Type Selection */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Choose Your Website Type
                </h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? "Hide Details" : "Show Details"}
                </Button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {websiteTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Card
                      key={type.id}
                      className={cn(
                        "cursor-pointer transition-all duration-300 hover:shadow-hover",
                        selectedType === type.id
                          ? "ring-2 ring-primary shadow-hover"
                          : "hover:border-primary/50"
                      )}
                      onClick={() => setSelectedType(type.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Icon className="h-6 w-6 text-primary" />
                          <div className="flex gap-2">
                            {type.popular && (
                              <Badge variant="default" className="bg-gradient-primary">
                                <Star className="h-3 w-3 mr-1" />
                                Popular
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {type.deliveryTime}
                            </Badge>
                          </div>
                        </div>
                        <CardTitle className="text-lg">{type.name}</CardTitle>
                        <CardDescription>{type.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-2xl font-bold text-primary">
                            {formatPrice(type.basePrice)}
                          </div>
                          {showDetails && (
                            <ul className="space-y-2">
                              {type.features.map((feature, index) => (
                                <li key={index} className="flex items-center text-sm text-muted-foreground">
                                  <CheckCircle className="h-3 w-3 text-success mr-2 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          )}
                          <div className="text-sm text-muted-foreground">
                            + {formatPrice(type.monthlyMaintenance)}/month maintenance
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Add-on Services */}
            {selectedType && (
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Enhance Your Website
                </h2>
                
                {/* Features */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                    Feature Add-ons
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {getAddOnsByCategory('feature').map((service) => {
                      const Icon = service.icon;
                      const isSelected = selectedAddOns.includes(service.id);
                      
                      return (
                        <Card
                          key={service.id}
                          className={cn(
                            "cursor-pointer transition-all duration-300 hover:shadow-hover",
                            isSelected
                              ? "ring-2 ring-primary shadow-hover"
                              : "hover:border-primary/50"
                          )}
                          onClick={() => toggleAddOn(service.id)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <Icon className="h-5 w-5 text-primary" />
                              {isSelected ? (
                                <CheckCircle className="h-5 w-5 text-success" />
                              ) : (
                                <div className="w-5 h-5 border-2 border-gray-300 rounded" />
                              )}
                            </div>
                            <CardTitle className="text-base">{service.name}</CardTitle>
                            <CardDescription className="text-sm">
                              {service.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-lg font-semibold text-primary">
                              +{formatPrice(service.price)}
                            </div>
                            {service.monthlyFee && (
                              <div className="text-sm text-muted-foreground">
                                + {formatPrice(service.monthlyFee)}/month
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Marketing & SEO */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Search className="h-5 w-5 text-blue-500 mr-2" />
                    Marketing & SEO
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {getAddOnsByCategory('marketing').map((service) => {
                      const Icon = service.icon;
                      const isSelected = selectedAddOns.includes(service.id);
                      
                      return (
                        <Card
                          key={service.id}
                          className={cn(
                            "cursor-pointer transition-all duration-300 hover:shadow-hover",
                            isSelected
                              ? "ring-2 ring-primary shadow-hover"
                              : "hover:border-primary/50"
                          )}
                          onClick={() => toggleAddOn(service.id)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <Icon className="h-5 w-5 text-primary" />
                              {isSelected ? (
                                <CheckCircle className="h-5 w-5 text-success" />
                              ) : (
                                <div className="w-5 h-5 border-2 border-gray-300 rounded" />
                              )}
                            </div>
                            <CardTitle className="text-base">{service.name}</CardTitle>
                            <CardDescription className="text-sm">
                              {service.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-lg font-semibold text-primary">
                              +{formatPrice(service.price)}
                            </div>
                            {service.monthlyFee && (
                              <div className="text-sm text-muted-foreground">
                                + {formatPrice(service.monthlyFee)}/month
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Maintenance & Security */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Shield className="h-5 w-5 text-green-500 mr-2" />
                    Maintenance & Security
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {getAddOnsByCategory('maintenance').map((service) => {
                      const Icon = service.icon;
                      const isSelected = selectedAddOns.includes(service.id);
                      
                      return (
                        <Card
                          key={service.id}
                          className={cn(
                            "cursor-pointer transition-all duration-300 hover:shadow-hover",
                            isSelected
                              ? "ring-2 ring-primary shadow-hover"
                              : "hover:border-primary/50"
                          )}
                          onClick={() => toggleAddOn(service.id)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <Icon className="h-5 w-5 text-primary" />
                              {isSelected ? (
                                <CheckCircle className="h-5 w-5 text-success" />
                              ) : (
                                <div className="w-5 h-5 border-2 border-gray-300 rounded" />
                              )}
                            </div>
                            <CardTitle className="text-base">{service.name}</CardTitle>
                            <CardDescription className="text-sm">
                              {service.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-lg font-semibold text-primary">
                              +{formatPrice(service.price)}
                            </div>
                            {service.monthlyFee && (
                              <div className="text-sm text-muted-foreground">
                                + {formatPrice(service.monthlyFee)}/month
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* Maintenance Plans */}
            {selectedType && (
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Maintenance & Support Plans
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {maintenancePlans.map((plan) => (
                    <Card
                      key={plan.id}
                      className={cn(
                        "cursor-pointer transition-all duration-300 hover:shadow-hover",
                        selectedMaintenance === plan.id
                          ? "ring-2 ring-primary shadow-hover"
                          : "hover:border-primary/50"
                      )}
                      onClick={() => setSelectedMaintenance(plan.id)}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(plan.price)}<span className="text-sm font-normal text-muted-foreground">/month</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-sm">
                              <CheckCircle className="h-3 w-3 text-success mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Client Information Form */}
            {selectedType && (
              <ClientInfoForm 
                selectedWebsite={selectedWebsite}
                selectedAddOns={selectedAddOns}
                selectedMaintenance={selectedMaintenance}
                totalOneTimePrice={totalOneTimePrice}
                totalMonthlyPrice={totalMonthlyPrice}
                addOnServices={addOnServices}
                maintenancePlans={maintenancePlans}
              />
            )}
          </div>

          {/* Price Display Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <PriceDisplay
                selectedType={selectedType}
                selectedAddOns={selectedAddOns}
                selectedMaintenance={selectedMaintenance}
                websiteTypes={websiteTypes}
                addOnServices={addOnServices}
                maintenancePlans={maintenancePlans}
                totalOneTimePrice={totalOneTimePrice}
                totalMonthlyPrice={totalMonthlyPrice}
                formatPrice={formatPrice}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};