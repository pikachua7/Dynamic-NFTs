import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { GlobalContext } from '../../context/GlobalState';
import './Navbar.css'
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
    <>
      {walletAddress?<nav className="">
      <div className="navbar">
        <ul>
          <li className="navbar-items logo">Logo</li>
        {walletAddress &&
          <li className="navbar-items item1" data-toggle="collapse" data-target=".navbar-collapse.show">
            <Link className="" to="/">Dashboard</Link>
          </li>
}
        {walletAddress &&
            <li className="navbar-items item2" data-toggle="collapse" data-target=".navbar-collapse.show">
              <Link className="" to="/userRewards">My Rewards</Link>
            </li>
          }

          <li className="navbar-items item3" data-toggle="collapse" data-target=".navbar-collapse.show">

            {walletAddress ? <a
              target="_blank"
              className=""
              rel="noopener noreferrer"
              href={"https://explorer-mumbai.maticvigil.com/address/" + walletAddress}>
              {walletAddress.substring(0, 5)}...{walletAddress.substring(37, 42)}
            </a> : <></>
            
            
            
            // <button className="" data-toggle="modal" data-target="#walletModal" disabled={loading}>Open Wallet</button>
            }
          </li>
          {walletAddress &&
            <li className="navbar-items item4" data-toggle="collapse" data-target=".navbar-collapse.show">
              <button className="navbar-disconnect-btn" onClick={() => handleLogout()}>Logout</button>
            </li>
          }
        </ul>
      </div>
    </nav>:<></>}
    </>
  )
}
