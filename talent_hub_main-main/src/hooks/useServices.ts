import { useState, useEffect } from 'react';
import { supabase } from '@/lib1/supabase';
import { services as fallbackServices } from '@/data/services';
import * as icons from 'lucide-react';

export interface Service {
  id?: string;
  name: string;
  description: string;
  delivery?: string;
  delivery_time?: string;
  icon_name?: string;
  base_price?: number;
  icon?: any; // React component
}

export function useServices() {
  const [services, setServices] = useState<Service[]>(fallbackServices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('name');
          
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          const mappedServices = data.map(dbService => {
             // Resolve icon component from string name
             const IconComponent = (icons as any)[dbService.icon_name || 'Box'] || icons.Box;
             return {
                ...dbService,
                delivery: dbService.delivery_time || 'Standard',
                icon: IconComponent
             };
          });
          setServices(mappedServices);
        }
      } catch (e) {
        console.error("Using fallback services due to error:", e);
      } finally {
        setLoading(false);
      }
    }
    
    fetchServices();
  }, []);

  return { services, loading };
}
