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

  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || false;

  const fetchUserAndCompany = async () => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('/me');
      const userData = response.data;
      console.log('User data:', userData); // Debug log
      setUser(userData);

      if (userData.company) {
        setCompany(userData.company);
      }

      // Si l'utilisateur est administrateur, récupérer la liste des entreprises
      if (userData.roles && userData.roles.includes('ROLE_ADMIN')) {
        try {
          const companiesResponse = await axios.get('/companies');
          console.log('Companies response:', companiesResponse.data); // Debug log

          // Gestion des différents formats possibles de réponse
          let companiesData;
          if (companiesResponse.data && companiesResponse.data['hydra:member']) {
            companiesData = companiesResponse.data['hydra:member'];
          } else if (companiesResponse.data && companiesResponse.data.member) {
            companiesData = companiesResponse.data.member;
          } else if (companiesResponse.data && Array.isArray(companiesResponse.data)) {
            companiesData = companiesResponse.data;
          } else if (companiesResponse.data && companiesResponse.data.companies) {
            companiesData = companiesResponse.data.companies;
          } else {
            companiesData = [];
          }

          console.log('Processed companies data:', companiesData); // Debug log
          setCompanies(companiesData);
        } catch (error) {
          console.error('Failed to fetch companies:', error);
          setCompanies([]);
        }
      } else {
        // Si l'utilisateur n'est pas admin, on met une liste vide
        setCompanies([]);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setUser(null);
      setCompany(null);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndCompany();
  }, [isLoggedIn]);

  return {
    company,
    companies,
    setCompanies,
    user,
    loading,
    isAdmin,
    refreshCompanies: fetchUserAndCompany
  };
}
