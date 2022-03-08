import React , {useEffect , useContext} from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import $ from 'jquery';

import {GlobalContext} from '../../context/GlobalState';
import Checkout from '../Checkout/Checkout';

export default function ItemDetail({account,itemsList,checkoutList,paymentwithReward,getPrice,ethPrice,currentNetwork}) {
  
  const {id} = useParams();
  const {walletAddress} = useContext(GlobalContext);

 

  const getUSDValue = () =>{
    let totalUSDValue = 0;
    if(itemsList[id-1]?.prize){
      totalUSDValue = (ethPrice * +window.web3.utils.fromWei(itemsList[id - 1]?.prize, 'Ether')) / 100000000;
    }
    return (
      <h5 className="card-title">
        Prize ${Number.parseFloat(totalUSDValue).toFixed(2)}
      </h5>
    )
  }
  
  return (
    <div className="container">
      <h1 className="my-3">Item Detail</h1>
        <div className="row">
          <div className="card">
            <div className="card-body">
              <img
                className="card-img-top mb-3"
                src={itemsList[id - 1]?.imageURL ? `https://ipfs.infura.io/ipfs/${itemsList[id - 1]?.imageURL}` : 'Other Work'}
                alt="Item" />
              
              <div className="d-flex justify-content-between align-items-center">
                {getUSDValue()}
              </div>
              
              <p className="lead m-0">{itemsList[id - 1]?.name}</p>
              <p className="text-secondary">{itemsList[id - 1]?.description}</p>
              
              {walletAddress ? <button className="btn primary-bg-color btn-block" data-toggle="modal" data-target="#checkout">
                Pay
              </button> : <p className="lead text-center text-danger">Connect to your wallet to Pay</p> }
            </div>
          </div>
        </div>
      <Checkout paymentwithReward={paymentwithReward} id={id} imageURL ={itemsList[id-1]?.imageURL} itemName={itemsList[id-1]?.name} getPrice={getPrice} currentNetwork={currentNetwork} walletAddress={walletAddress} />
    </div>
  )
}
