// src/hooks/useCompany.ts
import { useEffect, useState } from 'react';
import axios from 'utils/axios';
import useAuth from 'hooks/useAuth';

interface Company {
  id: number;
  name: string;
  address: string;
  sector: string;
}

interface UserWithCompany {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  company: Company;
  createdAt?: string;
  updatedAt?: string;
}

export default function useCompany() {
  const [company, setCompany] = useState<Company | null>(null);
  const [user, setUser] = useState<UserWithCompany | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchUserAndCompany = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/me');
        const userData = response.data;
        setUser(userData);

        // Si l'utilisateur a une company, elle est directement dans l'objet user
        if (userData.company) {
          setCompany(userData.company);
        }

        // Si l'utilisateur est administrateur, récupérer la liste des entreprises
        if (userData.roles && userData.roles.includes('ROLE_ADMIN')) {
          try {
            const companiesResponse = await axios.get('/companies');
            
            // Gérer le format spécifique de l'API avec la propriété 'member'
            let companiesData = [];
            if (companiesResponse.data && companiesResponse.data.member && Array.isArray(companiesResponse.data.member)) {
              companiesData = companiesResponse.data.member;
            } else if (companiesResponse.data && Array.isArray(companiesResponse.data)) {
              companiesData = companiesResponse.data;
            } else if (companiesResponse.data && Array.isArray(companiesResponse.data.companies)) {
              companiesData = companiesResponse.data.companies;
            } else if (companiesResponse.data && Array.isArray(companiesResponse.data.data)) {
              companiesData = companiesResponse.data.data;
            }
            
            setCompanies(companiesData);
          } catch (error) {
            console.error('Failed to fetch companies list', error);
            
            // Essayer un endpoint alternatif
            try {
              const altResponse = await axios.get('/api/companies');
              
              let companiesData = [];
              if (altResponse.data && altResponse.data.member && Array.isArray(altResponse.data.member)) {
                companiesData = altResponse.data.member;
              } else if (altResponse.data && Array.isArray(altResponse.data)) {
                companiesData = altResponse.data;
              } else if (altResponse.data && Array.isArray(altResponse.data.companies)) {
                companiesData = altResponse.data.companies;
              } else if (altResponse.data && Array.isArray(altResponse.data.data)) {
                companiesData = altResponse.data.data;
              }
              
              setCompanies(companiesData);
            } catch (altError) {
              console.error('Alternative endpoint also failed:', altError);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch user or company', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndCompany();
  }, [isLoggedIn]);

  return { company, user, companies, setCompanies, loading };
}
