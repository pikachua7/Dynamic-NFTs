import React, { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../../context/GlobalState';

export default function UserReward({changeRewardColor,tokenContract,tokensList,currentNetwork}) {
  const {walletAddress} = useContext(GlobalContext);
  const[tokenAmount , setTokenAmount] = useState(0);
  const[loading,setLoading] = useState(false);

  useEffect(() => {
    async function getTokenAmount(){
      const tokens = await tokenContract.methods.balanceOf(walletAddress).call();
      setTokenAmount(+window.web3.utils.fromWei(tokens.toString(),'Ether'));
    }
    if(walletAddress){
      getTokenAmount();
    }
  },[walletAddress])

  const handleClick = async tokenId =>{
    try{
      setLoading(true);
      await changeRewardColor(tokenId);
      setTokenAmount(tokenAmount-1);
      setLoading(false);
    }
    catch(err){
      console.log(err);
      setLoading(false);
    }
  }
  
  return (
    <div>UserReward </div>
  )
}
