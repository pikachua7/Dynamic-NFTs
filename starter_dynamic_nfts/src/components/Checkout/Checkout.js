import React, { useEffect, useState } from 'react';


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
    <div className="container my-5">
      <div className="modal fade" id="checkout" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Pay {currentNetwork}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              {!showReward ? (
                <div className="form-group my-1">
                  <span className="badge badge-primary">Your Balance</span>
                  <p className="lead">{balance / 10 ** 18} {currentNetwork}</p>
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
                      <span className="input-group-text">{currentNetwork}</span>
                    </div>
                  </div>
                  <p className="lead">${price}</p>
                </div>
              ) : (
                <>
                  <h2 className="h4 text-center mb-3">You Earn NFT and 5 PZN Tokens!</h2>
                  <div className="card" style={{ background: `rgb(${nft.red}, ${nft.green}, ${nft.blue})` }}>
                    <div className="card-body px-4">
                      {console.log(nft.tokenURI)}

                      {/* <img className="img-rounded" src={nft.tokenURI ? `https://ipfs.infura.io/ipfs/${nft.tokenURI}` : 'other image'} alt="NFT" /> */}
                    </div>
                  </div>
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
                        Send
                      </button>
                    </>
                  ) : (
                    // <Spinner />
                    <></>
                  )}
                </>
              ) : (
                <button type="button" className="btn btn-light" data-dismiss="modal">Close</button>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
