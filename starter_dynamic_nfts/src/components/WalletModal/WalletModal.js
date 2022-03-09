import React, { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import metamaskLogo from './metamask-logo.svg'

import './WalletModal.css'
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
    <div className="container my-5">
      <div className="modal fade" id="walletModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Choose Wallet</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <div className="d-flex justify-content-around">
                <div>
                  <img
                    className="wallet-img"
                    src={metamaskLogo}
                    alt="Metamask"
                    onClick={() => handleConnect("Metamask")}
                    data-dismiss="modal" />
                  <p className="lead text-center">METAMASK</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
