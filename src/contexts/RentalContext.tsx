import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RentalState {
  selectedStore: any | null;
  selectedBike: any | null;
  selectedPlan: any | null;
  selectedStartDate: Date | null;
  quotedPrice: number | null;
}

interface RentalContextType {
  rentalState: RentalState;
  setSelectedStore: (store: any) => void;
  setSelectedBike: (bike: any) => void;
  setSelectedPlan: (plan: any) => void;
  setSelectedStartDate: (date: Date) => void;
  setQuotedPrice: (price: number) => void;
  clearRentalState: () => void;
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

export const useRental = () => {
  const context = useContext(RentalContext);
  if (!context) {
    throw new Error('useRental must be used within a RentalProvider');
  }
  return context;
};

interface RentalProviderProps {
  children: ReactNode;
}

export const RentalProvider: React.FC<RentalProviderProps> = ({ children }) => {
  const [rentalState, setRentalState] = useState<RentalState>({
    selectedStore: null,
    selectedBike: null,
    selectedPlan: null,
    selectedStartDate: null,
    quotedPrice: null,
  });

  const setSelectedStore = (store: any) => {
    setRentalState(prev => ({
      ...prev,
      selectedStore: store,
      selectedBike: null, // Reset bike when store changes
    }));
  };

  const setSelectedBike = (bike: any) => {
    setRentalState(prev => ({ ...prev, selectedBike: bike }));
  };

  const setSelectedPlan = (plan: any) => {
    setRentalState(prev => ({ ...prev, selectedPlan: plan }));
  };

  const setSelectedStartDate = (date: Date) => {
    setRentalState(prev => ({ ...prev, selectedStartDate: date }));
  };

  const setQuotedPrice = (price: number) => {
    setRentalState(prev => ({ ...prev, quotedPrice: price }));
  };

  const clearRentalState = () => {
    setRentalState({
      selectedStore: null,
      selectedBike: null,
      selectedPlan: null,
      selectedStartDate: null,
      quotedPrice: null,
    });
  };

  return (
    <RentalContext.Provider
      value={{
        rentalState,
        setSelectedStore,
        setSelectedBike,
        setSelectedPlan,
        setSelectedStartDate,
        setQuotedPrice,
        clearRentalState,
      }}
    >
      {children}
    </RentalContext.Provider>
  );
};