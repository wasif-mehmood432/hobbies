// src/components/dashboard/Pricing.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import { getFunctions } from 'firebase/functions';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Pricing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const functions = getFunctions();

  const handlePlanSelection = async (plan: { name: string, priceId: string }) => {
    if (!user) {
      toast({ title: "Log venligst ind for at vælge en plan.", variant: "destructive" });
      return;
    }

    toast({ title: "Omdirigerer til betaling..." });

    try {
      const response = await fetch('/.netlify/functions/create-stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.priceId,
          uid: user.id,
          planName: plan.name
        }),
      });

      if (!response.ok) throw new Error('Stripe-session kunne ikke oprettes');

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      if (stripe) await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Stripe fejl:", error);
      toast({ title: "Fejl", description: "Kunne ikke omdirigere til betaling.", variant: "destructive" });
    }
  };

  const plan = {
    name: 'Hobbiies Pro',
    price: '199 kr',
    period: 'måned',
    description: 'Perfekt til dig, der vil blive set',
    features: [
      'Gratis første måned',
      'Opsæt profil med billeder og priser',
      'Synlighed overfor tusindvis af danskere',
      'Ingen binding – du vælger selv'
    ],
    priceId: 'price_1RmZQiGCmL9LrymPXBmZrgXm' // Make sure this is the correct ID in your Stripe
  };

  const isCurrentPlan = plan.name === user?.planName;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Vælg din plan</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Start med en gratis måned og kom i gang med din hobbyforretning.</p>
      </div>
      <div className="max-w-md mx-auto">
        <Card className={`relative ${isCurrentPlan ? 'ring-2 ring-green-500' : 'border-2 border-pink-500'}`}>
          {!isCurrentPlan && (<Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-pink-500">Mest valgt</Badge>)}
          {isCurrentPlan && (<Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500">Aktiv Plan</Badge>)}
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-gray-600">/{plan.period}</span>
            </div>
            <p className="text-gray-600 mt-2">{plan.description}</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              className={`w-full ${isCurrentPlan ? 'bg-green-600 hover:bg-green-700' : 'bg-pink-600 hover:bg-pink-700'}`}
              onClick={() => !isCurrentPlan && handlePlanSelection(plan)}
              disabled={isCurrentPlan}
            >
              {isCurrentPlan ? (
                <><Star className="h-4 w-4 mr-2" /> Aktiv Plan</>
              ) : (
                <><CreditCard className="h-4 w-4 mr-2" /> Vælg Plan</>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pricing;
