import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { GlobalContext } from '../../context/GlobalState';

export default function Navbar(loading, currentNetwork, reset) {
  const history = useHistory();
  const { walletAddress, setWalletAddress } = useContext(GlobalContext);

  const handleLogout = async () => {
    //other wallet condition
    // if(){
    // }
    setWalletAddress("");
    reset();
    history.push('/');
  }
  return (
    <div>Navbar</div>
  )
}
