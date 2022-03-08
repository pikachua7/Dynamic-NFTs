import React, { useEffect, useState } from 'react';


export default function Checkout({ getBill, paymentwithReward, id, imageURL, itemName, getPrice, currentNetwork, walletAddress }) {

  const [amount, setAmount] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [nft, setNFT] = useState({});
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    getBalance();
  }, [])

  async function getBalance() {
    try {
      const _balance = await window.web3.eth.getBalance(walletAddress);
      setBalance(_balance);
    }
    catch (err) {
      console.error(err);
    }
  }


  async function checkout() {
    try {
      setLoading(true);
      let res;
      res = await paymentwithReward(id, amount, imageURL, itemName);

      await getBill(id);
      setNFT(res);
      setShowReward(true);
    }
    catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  const handleAmount = async e => {
    setAmount(e.target.value);
    const usdValue = await getPrice();
    let totalUSDValue = (usdValue * e.target.value) / 100000000;
    setPrice(Number.parseFloat(totalUSDValue).toFixed(2));
  }

  return (
    <div>Checkout </div>
  )
}
