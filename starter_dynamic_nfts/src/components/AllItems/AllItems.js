//React
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

//Context
import { GlobalContext } from '../../context/GlobalState';

//Moralis
import Moralis from 'moralis';

//Smart Contract
import Items from '../../abis/Items.json';

//css
import './Items.css'

//images
// import landingImage from './images/login-image2.jpg'

export default function AllItems({ loading, itemsList, ethPrice, itemsAddress, currentNetwork }) {

  const { walletAddress } = useContext(GlobalContext);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    getRewards(currentNetwork);
  }, [currentNetwork]);

  async function getRewards(currentNetwork) {
    let networkId, networkType;
    if (currentNetwork === 'MATIC') {
      networkType = "mumbai";
      networkId = 80001;
    }
    else {
      //any other network
    }

    const options = { chain: networkType, address: Items.networks[networkId].address };
    const tokenMetaData = await Moralis.Web3API.token.getNFTOwners(options);
    console.log(tokenMetaData);

    setTotalCount(tokenMetaData.result.length);
  }

  const getUSDValue = item => {
    const totalUSDValue = (ethPrice * +window.web3.utils.fromWei(item.prize.toString(), 'Ether')) / 100000000;
    return <span className="price"> ${Number.parseFloat(totalUSDValue).toFixed(2)}</span>
  }


  return (
    <div className="">
        {walletAddress ?
          <p>
            <Link to="/"></Link>
          </p> : 
          <div className='landing-page'>
            <h1>Get Your Favourite Pizza <br/><span>Now</span></h1>
          <button className="order-now-btn" data-toggle="modal" data-target="#walletModal" disabled={loading}>Order Now</button>
          </div>
        }
      <div className="">
        <div className="all-items-grid">
          {itemsList.map(item => {
            return (
              <div className="view-menu" key={item.itemId}>
                {/* N */}
                <div className="cards">
                  <div className="grid-item">
                    <div className='card'>
                      <div className='image-section'>
                        <div>
                          <Link to={`/item/${item.itemId}`}>
                            <img
                              src={item.imageURL ? `https://ipfs.infura.io/ipfs/${item.imageURL}` : 'other image'}
                              alt="Item" />
                          </Link></div>
                      </div>
                      <div className='details-section'>
                        <div><h3>{item.name}</h3></div>
                        <div className='price-details'>
                          <p>{getUSDValue(item)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>

    </div>

  )
}
