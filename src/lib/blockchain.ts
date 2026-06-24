
import { ROUTES } from '@/lib/routes';
import { useGetAuthState } from '@/services/auth';
import { AppIntent, INTENT_KEY } from '@/lib/intents';
import { toast } from 'sonner';
import { fetchAdaPrice, useVerifyPayment } from '@/services/payments';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { IInitiator } from '@meshsdk/core';


const TREASURY_ADDRESS = process.env.NEXT_PUBLIC_TREASURY_ADDRESS;

export const useExecutePlanPayment = () => {
    const { data: authState, refetch } = useGetAuthState();
    const router = useRouter();
    const [processingPlan, setProcessingPlan] = useState<string | null>(null);
    const verifyPayment = useVerifyPayment();


    const executePlanPayment = async (planType: string, usdPrice: number, connected: boolean, wallet: unknown) => {
        if (!authState?.isAuthenticated) {
            localStorage.setItem(INTENT_KEY, AppIntent.PRICING_VIEW);
            router.push(ROUTES.AUTH);
            return;
        }

        if (!TREASURY_ADDRESS) {
            toast.error("A critical error occured, please contact support. CODE: TR_ADRR");
            return
        }

        if (!connected) {
            toast.error('Please connect your Cardano wallet in Account Settings first.');
            return;
        }

        setProcessingPlan(planType);

        try {
            const { Transaction } = await import('@meshsdk/core');
            const adaPrice = await fetchAdaPrice();
            const adaAmount = usdPrice / adaPrice;
            const lovelaceAmount = Math.ceil(adaAmount * 1_000_000).toString();

            toast.loading(`Processing payment of ~${adaAmount.toFixed(2)} ADA...`, { id: 'payment' });

            //@ts-expect-error - Mesh wallet
            const networkId = await wallet.getNetworkId();
            const isLive = process.env.NEXT_PUBLIC_IS_LIVE === 'true';
            const expectedNetworkId = isLive ? 1 : 0;
            const expectedNetworkName = isLive ? 'Mainnet' : 'Preprod Testnet';

            if (networkId !== expectedNetworkId) {
                throw new Error(`Invalid network. Please switch your wallet to ${expectedNetworkName}.`);
            }

            const tx = new Transaction({ initiator: wallet as unknown as IInitiator });
            tx.sendLovelace(TREASURY_ADDRESS, lovelaceAmount);
            tx.setMetadata(674, { msg: ["Mosaic Upgrade", `User: ${authState?.user?.id}`] });

            const unsignedTx = await tx.build();
            //@ts-expect-error - Mesh wallet
            const signedTx = await wallet.signTx(unsignedTx, false);
            //@ts-expect-error - Mesh wallet
            const txHash = await wallet.submitTx(signedTx);

            toast.loading('Confirming transaction...', { id: 'payment' });

            await verifyPayment.mutateAsync({ txHash, planType });

            toast.success('Plan upgraded successfully!', { id: 'payment' });
            await refetch();

        } catch (error) {
            console.error(error);
            toast.error((error as Error).message || 'Payment failed or was cancelled.', { id: 'payment' });
        } finally {
            setProcessingPlan(null);
        }
    };

    return {
        processingPlan,
        executePlanPayment
    }
}