import React from 'react';

const FeatureCircle = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Pink circle with call-to-action */}
          <div className="lg:w-1/2">
            <div className="w-80 h-80 bg-[#ff00c8] p-10 rounded-full flex items-center justify-center text-white mx-auto">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">
                  Gør din hobby til<br />
                  en indtægtskilde
                </h3>
                <p className="text-lg mb-6">
                  Få synlighed, nye kunder og<br />
                  byg dit eget brand – helt uden CVR.
                </p>
                <button className="bg-white text-[#ff00c8] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                  Kom i gang
                </button>
              </div>
            </div>
          </div>

          {/* Text features section */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              En platform for lokale talenter og passioner
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Bliv fundet</h4>
                <p className="text-gray-600">
                  Vi gør det nemt for kunder at finde dig via søgning, kort og filtre – helt uden markedsførings-erfaring.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Tjen penge på det du elsker</h4>
                <p className="text-gray-600">
                  Uanset om du laver negle, tilbyder handyman-hjælp eller noget helt tredje – Hobbiies giver dig muligheden.
                </p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900">Kontakt os</h4>
                <p className="text-gray-600">Har du spørgsmål? Skriv til os på <br /> <strong>info@hobbiies.dk</strong></p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeatureCircle;
