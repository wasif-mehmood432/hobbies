// src/components/dashboard/Pricing.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Load Stripe with your VITE_STRIPE_PUBLISHABLE_KEY from .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

type PlanName = 'Basic' | 'Premium';

const Pricing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const functions = getFunctions();

  // In src/components/dashboard/Pricing.tsx

  const handlePlanSelection = async (plan: { name: PlanName, priceId: string }) => {
    if (!user) {
      toast({ title: "Please log in to select a plan.", variant: "destructive" });
      return;
    }

    toast({ title: "Redirecting to checkout..." });

    try {
      // Call your new Vercel serverless function
      const response = await fetch('/.netlify/functions/create-stripe-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          uid: user.id, // Pass the user ID
          planName: plan.name // Add this line
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error("Error creating Stripe checkout session:", error);
      toast({ title: "Error", description: "Could not redirect to checkout.", variant: "destructive" });
    }
  };

  const plans = [
    // Make sure these Price IDs exist in your Stripe account
    { name: 'Basic' as PlanName, price: '$19', period: 'month', description: 'Perfect for getting started', features: ['List up to 3 services', 'Basic messaging', 'Standard support', 'Basic analytics'], priceId: 'price_1RmZKZGCmL9LrymPyp7DbEyi' },
    { name: 'Premium' as PlanName, price: '$39', period: 'month', description: 'Most popular', popular: true, features: ['Unlimited services', 'Priority messaging', 'Advanced analytics', 'Premium support', 'Featured listings'], priceId: 'price_1RmZQiGCmL9LrymPXBmZrgXm' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Select the perfect plan for your business needs.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((plan, index) => {
          const isCurrentPlan = plan.name === user?.planName;
          return (
            <Card key={index} className={`relative ${isCurrentPlan ? 'ring-2 ring-green-500' : ''} ${plan.popular ? 'border-2 border-pink-500' : ''}`}>
              {plan.popular && !isCurrentPlan && (<Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-pink-500">Most Popular</Badge>)}
              {isCurrentPlan && (<Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500">Current Plan</Badge>)}
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4"><span className="text-4xl font-bold">{plan.price}</span><span className="text-gray-600">/{plan.period}</span></div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${isCurrentPlan ? 'bg-green-600 hover:bg-green-700' : plan.popular ? 'bg-pink-600 hover:bg-pink-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                  onClick={() => !isCurrentPlan && handlePlanSelection(plan)}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? (<><Star className="h-4 w-4 mr-2" /> Current Plan</>)
                    : (<><CreditCard className="h-4 w-4 mr-2" /> {user?.planName !== 'none' ? 'Change Plan' : 'Select Plan'}</>)}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Pricing;