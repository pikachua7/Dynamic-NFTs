import React, { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalState';


export default function WalletModal({ connectToBlockchain, changeNetwork, setLoading }) {

  const { setWalletAddress } = useContext(GlobalContext);

  const handleConnect = async walletType => {
    try {
      setLoading();
      await connectToBlockchain(walletType);
      const accounts = await window.web3.eth.getAccounts();
      setWalletAddress(accounts[0]);
      setLoading();
    } 
    catch (err) {
      console.error(err);
      setLoading();
    }
  }
  return (
    <div>WalletModal </div>
  )
}
