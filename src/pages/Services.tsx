import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import ServiceCard from '../components/ServiceCard';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase';
import { geocodePostalCode } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import ServicesMap, { Service as MapService } from '@/components/ServicesMap';

interface Service {
  id: string;
  name: string;
  image: string;
  providerImageUrl?: string;
  serviceName: string;
  description: string;
  rating: number;
  postalCode: string;
  price: string;
  category: string;
  lat?: number;
  lng?: number;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesCollection = collection(db, "services");
        const q = query(servicesCollection, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const servicesData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data() as Service;
            const coords = await geocodePostalCode(data.postalCode);
            return {
              ...data,
              id: doc.id,
              lat: coords?.lat || 56.2639,
              lng: coords?.lng || 9.5018,
            };
          })
        );

        setServices(servicesData);
        setFilteredServices(servicesData);
      } catch (error) {
        console.error("Error fetching services: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleSearch = (filters: { category: string; postalCode: string; keyword: string }) => {
    let filtered = services;

    if (filters.category && filters.category !== 'All Categories') {
      filtered = filtered.filter(service =>
        String(service.category).toLowerCase().trim() === filters.category.toLowerCase().trim()
      );
    }

    if (filters.postalCode) {
      filtered = filtered.filter(service =>
        service.postalCode.includes(filters.postalCode)
      );
    }

    if (filters.keyword) {
      filtered = filtered.filter(service =>
        service.serviceName.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        service.description.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        service.name.toLowerCase().includes(filters.keyword.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  };

  const mapServices: MapService[] = filteredServices.map(service => ({
    id: service.id,
    name: service.name,
    serviceName: service.serviceName,
    description: service.description,
    postalCode: service.postalCode,
    lat: service.lat,
    lng: service.lng,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="bg-gradient-to-r from-fuchsia-600 to-fuchsia-300 text-white sm:py-24">
        <div className="max-w-7xl mx-auto p-20 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6">Find Local Services</h1>
          <div className="mt-8">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Available Services</h2>
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as 'list' | 'map')}
            className="border px-3 py-2 rounded-md text-sm"
          >
            <option value="list">List View</option>
            <option value="map">Map View</option>
          </select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-lg" />)}
          </div>
        ) : filteredServices.length > 0 ? (
          viewMode === 'list' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </div>
          ) : (
            <ServicesMap services={mapServices} />
          )
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services have been listed yet.</h3>
            <p className="text-gray-500">Why not be the first? Go to your dashboard to add a service.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
