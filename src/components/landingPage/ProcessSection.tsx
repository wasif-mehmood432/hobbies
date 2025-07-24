import React from 'react';
import { CheckCircle } from 'lucide-react';

const ProcessSection = () => {
  const steps = [
    "Opret din kampagne",
    "Vælg de rette influencers",
    "Godkend deres indhold",
    "Følg resultaterne live"
  ];

  return (
    <section className="bg-white text-black py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold  mb-4">
            Det har <span className="text-[#dc44bb]">aldrig været nemmere</span>
          </h2>
          <h3 className="text-3xl lg:text-5xl font-bold  mb-8">at komme i gang!</h3>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Vores platform gør det super simpelt at finde og samarbejde med influencers.
            Du behøver ingen erfaring – vi guider dig hele vejen.
          </p>
        </div>

        <div className="bg-[#dc44bb] text-white p-8 rounded-2xl mb-12">
          <h3 className="text-2xl font-bold mb-6">Sådan fungerer det</h3>
          <p className="text-lg mb-6">
            Uanset om du er ny eller erfaren, kan du nemt lave din første kampagne med få klik.
            Vi hjælper dig med at finde influencers, som passer til din stil og dit budget.
          </p>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-white" />
                <span className="text-lg">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg text-gray-700 mb-6 italic">
            "Vi fandt de perfekte influencers gennem Hobbiies – det var nemt, hurtigt og gav fantastiske resultater."
          </p>
          <div className="font-semibold">
            Carolina Drivenes<br />
            Marketing Manager
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
