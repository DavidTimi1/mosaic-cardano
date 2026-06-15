"use client";

import React, { ReactNode } from 'react';
import { useGetAuthState } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { LockIcon } from 'lucide-react';
import { useModals } from '@/contexts/modals-context';
import { MODALS } from '@/lib/modals';

interface PlanGuardProps {
  children: ReactNode;
  supportedPlans: string[];
  fallbackMessage?: string;
}

export const PlanGuard = ({ children, supportedPlans, fallbackMessage }: PlanGuardProps) => {
  const { data: authState, isLoading } = useGetAuthState();
  const { openModal } = useModals();

  if (isLoading) {
    return <div className="animate-pulse bg-theme-surface-high h-32 rounded-xl w-full"></div>;
  }

  const userPlan = authState?.user?.planType || 'FREE';
  const isSupported = supportedPlans.includes(userPlan);

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-theme-surface-high/50 border border-theme-outline/20 rounded-2xl border-dashed">
        <div className="w-16 h-16 bg-theme-accent/10 text-theme-accent rounded-full flex items-center justify-center mb-4">
          <LockIcon size={24} />
        </div>
        <h3 className="text-xl font-bold text-theme-forest mb-2">Upgrade Required</h3>
        <p className="text-theme-on-surface/70 max-w-md mx-auto mb-6">
          {fallbackMessage || "You'll need to upgrade your plan to access this feature."}
        </p>
        <Button onClick={() => openModal(MODALS.PRICING)}>
          View Plans & Upgrade
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};
