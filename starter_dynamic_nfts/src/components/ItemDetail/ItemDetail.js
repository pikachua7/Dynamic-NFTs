import React , {useEffect , useContext} from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import $ from 'jquery';

import {GlobalContext} from '../../context/GlobalState';
import Checkout from '../Checkout/Checkout';

export default function ItemDetail({account,itemsList,checkoutList,paymentwithReward,getBill,getPrice,ethPrice,currentNetwork}) {
  
  const {id} = useParams();
  const {walletAddress} = useContext(GlobalContext);

  useEffect(() =>{
    async function fetchData(){
      await getBill(id);
    }
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    })

    fetchData();
  },[id])

  const getUSDValue = () =>{
    let totalUSDValue = 0;
    if(itemsList[id-1]?.prize){
      totalUSDValue = (ethPrice * +window.web3.utils.fromWei(itemsList[id - 1]?.prize, 'Ether')) / 100000000;
    }
    return (
      <h5 className="card-title">
        Need ${Number.parseFloat(totalUSDValue).toFixed(2)}
      </h5>
    )
  }
  
  return (
    <div>
      ItemDetail
      <Checkout getBill={getBill} paymentwithReward={paymentwithReward} id={id} imageURL ={itemsList[id-1]?.imageURL} itemName={itemsList[id-1]?.name} getPrice={getPrice} currentNetwork={currentNetwork} walletAddress={walletAddress} />
    </div>
  )
}
