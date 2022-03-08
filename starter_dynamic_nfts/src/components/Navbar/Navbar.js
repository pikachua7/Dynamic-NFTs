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
    <nav className="navbar navbar-expand-md navbar-light bg-light">
      <div className="container">
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
              <Link className="nav-link text-primary-color" to="/">Dashboard</Link>
            </li>
            {walletAddress &&
              <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                <Link className="nav-link text-primary-color" to="/userRewards">My Rewards</Link>
              </li>
            }
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item d-flex align-items-center" data-toggle="collapse" data-target=".navbar-collapse.show">
              
              {walletAddress ? <a
                target="_blank"
                className="nav-link text-primary-color"
                rel="noopener noreferrer"
                href={"https://explorer-mumbai.maticvigil.com/address/" + walletAddress}>
                {walletAddress.substring(0,5)}...{walletAddress.substring(37,42)}
              </a> : <button className="btn secondary-bg-color" data-toggle="modal" data-target="#walletModal" disabled={loading}>Open Wallet</button>
              }
            </li>
            {walletAddress && 
              <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                <button className="btn" onClick={() => handleLogout()}>Disconnect Wallet</button>
              </li>
            }
          </ul>
        </div>
        
      </div>
      
    </nav>
  )
}
