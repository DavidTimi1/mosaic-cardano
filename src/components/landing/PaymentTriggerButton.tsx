
import { useExecutePlanPayment } from '@/lib/blockchain';

import { useWallet } from '@meshsdk/react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export const PaymentTriggerButton = ({ planType, usdPrice, loadingPlan, setIsLoading, buttonText, isEmphasized }: { planType: string, usdPrice: number, loadingPlan?: string, setIsLoading?: (plan: string) => void, buttonText: string, isEmphasized?: boolean }) => {
    const { connected, wallet } = useWallet();
    const { processingPlan, executePlanPayment } = useExecutePlanPayment();
    const isProcessing = processingPlan === planType;
    const isDisabled = !!loadingPlan && loadingPlan !== planType;

    const handleClick = async () => {
        if (isDisabled || isProcessing) {
            return;
        }

        if (planType === 'Custom') {
            window.location.href = `mailto:${process.env.NEXT_PUBLIC_SUPPORT_MAIL}`;
            return;
        }

        executePlanPayment(planType, usdPrice, connected, wallet);
    };

    useEffect(() => {
        if (!setIsLoading || !loadingPlan) {
            return;
        }

        if (isProcessing) {
            setIsLoading(planType);
        } else if (loadingPlan === planType) {
            setIsLoading("");
        }
    }, [isProcessing, loadingPlan, planType, setIsLoading])

    return (
        <Button
            onClick={handleClick}
            disabled={isProcessing || isDisabled}
            variant={isEmphasized ? "default" : "outline"}
            className="w-full uppercase tracking-widest font-bold text-xs py-6 shadow-xl hover:shadow-theme-accent/20"
        >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : buttonText}
        </Button>
    )
}