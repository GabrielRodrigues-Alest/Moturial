import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import MotorcyclesSection from '@/components/MotorcyclesSection';
import PlansSection from '@/components/PlansSection';
import AccessoriesSection from '@/components/AccessoriesSection';
import StoresSection from '@/components/StoresSection';
import UserRegistrationSection from '@/components/UserRegistrationSection';
import PaymentSection from '@/components/PaymentSection';
import Stores from './Stores';
import Bikes from './Bikes';
import Plans from './Plans';
import Summary from './Summary';
import Checkout from './Checkout';
import Success from './Success';
import StaffDashboard from './StaffDashboard';
import Account from './Account';
import Accessories from './Accessories';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigate = (page: string) => {
    if (page === "auth" || page === "login") {
      navigate("/auth");
    } else if (page === "dashboard") {
      navigate("/dashboard");
    } else if (page === "account") {
      navigate("/account");
    } else {
      setCurrentPage(page);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "motorcycles":
        return <MotorcyclesSection onNavigate={handleNavigate} />;
      case "plans": 
        return <PlansSection onNavigate={handleNavigate} />;
      case "accessories":
        return <AccessoriesSection onNavigate={handleNavigate} />;
      case "stores":
        return <Stores onNavigate={handleNavigate} />;
      case "bikes":
        return <Bikes onNavigate={handleNavigate} />;
      case "rental-plans":
        return <Plans onNavigate={handleNavigate} />;
      case "summary":
        return <Summary onNavigate={handleNavigate} />;
      case "checkout":
        return <Checkout onNavigate={handleNavigate} />;
      case "success":
        return <Success onNavigate={handleNavigate} />;
      case "staff-dashboard":
        return <StaffDashboard />;
      case "accessories-shop":
        return <Accessories onNavigate={handleNavigate} />;
      case "payment":
        return <PaymentSection onNavigate={handleNavigate} />;
      case "register":
      case "registration":
        return <UserRegistrationSection onNavigate={handleNavigate} />;
      default:
        return (
          <>
            <HeroSection onNavigate={handleNavigate} />
            <MotorcyclesSection onNavigate={handleNavigate} />
            <PlansSection onNavigate={handleNavigate} />
            <StoresSection onNavigate={handleNavigate} />
          </>
        );
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderCurrentPage()}
    </Layout>
  );
};

export default Index;
