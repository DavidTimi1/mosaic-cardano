"use client";

import React, { useEffect, useState } from 'react';
import { useWallet } from '@meshsdk/react';
import { Wallet, AlertCircle } from 'lucide-react';
import { useModals } from '@/contexts/modals-context';
import { MODALS } from '@/lib/modals';

interface WalletStatusProps {
  className?: string;
}


export function WalletStatus({ className = '' }: WalletStatusProps) {
  const { connected, connecting, wallet, connect } = useWallet();
  const [networkWarning, setNetworkWarning] = useState(false);
  const { openModal } = useModals();
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    // Auto-connect if a wallet was previously connected
    const persistedWallet = localStorage.getItem('mosaic_connected_wallet');
    if (persistedWallet && !connected && !connecting) {
      connect(persistedWallet);
    }
  }, [connected, connecting, connect]);

  useEffect(() => {
    let isMounted = true;
    const checkStatus = async () => {
      if (connected && wallet) {
        try {
          const netId = await wallet.getNetworkId();
          const isLive = process.env.NEXT_PUBLIC_IS_LIVE === 'true';
          const expectedNetId = isLive ? 1 : 0;
          
          if (isMounted) {
            setNetworkWarning(netId !== expectedNetId);
            const addrs = await wallet.getUsedAddresses();
            if (addrs && addrs.length > 0) {
              setAddress(addrs[0]);
            }
          }
        } catch (e) {
          console.error("Failed to fetch wallet info:", e);
        }
      } else {
        if (isMounted) {
          setNetworkWarning(false);
          setAddress(null);
        }
      }
    };
    checkStatus();
    return () => { isMounted = false; };
  }, [connected, wallet]);

  const truncateAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 9)}...${addr.slice(-4)}`;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {connected && networkWarning && (
        <div className="relative group flex items-center">
          <AlertCircle size={18} className="text-red-500 cursor-help" />
          <div className="absolute top-full right-0 mt-2 w-48 bg-red-50 border border-red-200 text-red-700 text-xs p-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            Network mismatch. Please switch to {process.env.NEXT_PUBLIC_IS_LIVE === 'true' ? 'Mainnet' : 'Preprod'}.
          </div>
        </div>
      )}
      
      <button 
        onClick={() => openModal(MODALS.WALLET_CONNECT)}
        className={`flex items-center cursor-pointer gap-2 px-3 py-1.5 rounded-full border transition-colors text-xs font-bold font-mono tracking-widest ${
          connected 
            ? 'bg-theme-surface-high border-theme-outline/20 text-theme-forest hover:border-theme-forest/30' 
            : 'bg-theme-accent/5 border-theme-accent/20 text-theme-accent hover:bg-theme-accent/10'
        }`}
      >
        <Wallet size={14} className={connected ? "text-theme-forest/60" : "text-theme-accent"} />
        {connected ? (address ? truncateAddress(address) : 'CONNECTING...') : 'CONNECT WALLET'}
      </button>
    </div>
  );
}


export function WalletConnectedText() {
  const { connected } = useWallet();
  return (
    connected ? 'Connected securely' : 'Not connected'
  );
}