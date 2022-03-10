import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Checkout.css'
import Gift from './gift.png'
import Confetti from 'react-confetti'
import Spinner from '../Spinner/Spinner';

export default function Checkout({ paymentwithReward, id, imageURL, itemName, getPrice, currentNetwork, walletAddress }) {

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
      console.log(res);
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
    <div className="">
      <div className="modal fade" id="checkout" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
        
            <div className="modal-body">
              {!showReward ? (
                <div className="form-group my-1">
                  <div className='popup-header'>
                  <h5 className="modal-title">Checkout</h5>
              <    button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
                  </div>
                  <p className='balance'><span className="badge badge-primary">Balance </span>{balance / 10 ** 18} {currentNetwork}</p>
  
                  <label className="text-muted font-weight-bold" htmlFor="text">Add to Cart</label>
                  <div class="input-group mb-3">
                    <input
                      className="form-control"
                      name="Amount"
                      type="number"
                      value={amount}
                      onChange={(e) => handleAmount(e)}
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">${price}</span>
                    </div>
                  </div>
                  <p className="lead"></p>
                </div>
              ) : (
                <>
                  <div className='reveal-nft'>
                  <div><h2 className="h4 text-center mb-3">You have earned a NFT and 5 PZN coins!</h2></div>
                  {/* <div className="nft-gift" style={{ background: `rgb(${nft.red}, ${nft.green}, ${nft.blue})` }}> */}
                    <div className="card-body px-4">
                      {console.log(nft.tokenURI)}

                      <img className="img-rounded" style={{width:'10em',height:'10em'}} src={Gift} alt="NFT" />
                      
                    </div>
                  </div>
                  {/* </div> */}
                </>
              )}

            </div>

            <div className="modal-footer">
              {!showReward ? (
                <>
                  {!loading ? (
                    <>
                      <button type="button" className="btn btn-light" data-dismiss="modal">Cancel</button>
                      <button
                        className="btn primary-bg-color"
                        onClick={checkout}>
                        Pay
                      </button>
                    </>
                  ) : (
                    <Spinner />
                  )}
                </>
              ) : (
                <div className='close-section'>
                  <p>Check My Rewards section to claim your NFT</p>
                    <button type="button" className="btn btn-light" data-dismiss="modal">Close</button>
                </div>
                
              )}
                <Confetti
            width={500}
            numberOfPieces={100}
            run={showReward}
          />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
