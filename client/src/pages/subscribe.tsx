import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Crown, Check } from "lucide-react";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscribeForm = ({ selectedPlan }: { selectedPlan: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/settings?subscription=success`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "You are now subscribed!",
      });
    }
    
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full"
        disabled={!stripe || processing}
      >
        {processing ? "Processing..." : `Subscribe to ${selectedPlan}`}
      </Button>
    </form>
  );
};

export default function Subscribe() {
  const [clientSecret, setClientSecret] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [currentUser] = useState({ id: 1 }); // Mock user
  const { toast } = useToast();

  const plans = [
    {
      id: "pro",
      name: "Pro",
      price: "£9.99",
      priceId: "price_pro", // Replace with actual Stripe price ID
      sparks: 50,
      features: [
        "50 Sparks per month",
        "3 Voice profiles",
        "Export to Google Docs & Notion",
        "Offline cache (10 projects)"
      ]
    },
    {
      id: "creator",
      name: "Creator",
      price: "£19.99",
      priceId: "price_creator", // Replace with actual Stripe price ID
      sparks: 200,
      features: [
        "200 Sparks per month",
        "Unlimited Voice profiles",
        "All integrations",
        "Unlimited offline cache",
        "Priority support"
      ]
    },
    {
      id: "agency",
      name: "Agency",
      price: "£49.99",
      priceId: "price_agency", // Replace with actual Stripe price ID
      sparks: "Unlimited",
      features: [
        "Unlimited Sparks",
        "Everything in Creator",
        "Full API access",
        "CSV export",
        "Custom integrations"
      ]
    }
  ];

  useEffect(() => {
    const createSubscription = async () => {
      try {
        const selectedPlanData = plans.find(p => p.id === selectedPlan);
        if (!selectedPlanData) return;

        const response = await apiRequest("POST", "/api/create-subscription", {
          priceId: selectedPlanData.priceId
        }, {
          headers: { "user-id": currentUser.id.toString() }
        });
        
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create subscription. Please try again.",
          variant: "destructive",
        });
      }
    };

    createSubscription();
  }, [selectedPlan, currentUser.id, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-xl font-bold text-gray-900">SparkDraft</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="text-center mb-8">
          <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Upgrade to Pro
          </h2>
          <p className="text-gray-600">
            Unlock more Sparks and powerful features to supercharge your content creation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Choose Your Plan
            </h3>
            
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`cursor-pointer transition-all ${
                  selectedPlan === plan.id 
                    ? "border-primary bg-primary/5" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                      <p className="text-2xl font-bold text-primary">
                        {plan.price}<span className="text-sm text-gray-500">/month</span>
                      </p>
                    </div>
                    <Badge variant={selectedPlan === plan.id ? "default" : "outline"}>
                      {typeof plan.sparks === "number" 
                        ? `${plan.sparks} Sparks`
                        : `${plan.sparks} Sparks`
                      }
                    </Badge>
                  </div>
                  
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              {clientSecret ? (
                <Elements 
                  stripe={stripePromise} 
                  options={{ clientSecret }}
                >
                  <SubscribeForm selectedPlan={plans.find(p => p.id === selectedPlan)?.name || ""} />
                </Elements>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
