// src/hooks/useCompany.ts
import { useEffect, useState } from 'react';
import axios from 'utils/axios'; // assuming axios is configured with baseURL and JWT token

interface Company {
  id: number;
  name: string;
  address: string;
}

export default function useCompany(companyId = 1) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get(`/companies/${companyId}`);
        setCompany(response.data);
      } catch (error) {
        console.error('Failed to fetch company', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId]);

  return { company, loading };
}
