//React
import React , {useContext,useEffect,useState} from 'react';
import {Link} from 'react-router-dom';

//Context
import { GlobalContext } from '../../context/GlobalState';

//Moralis
import Moralis from 'moralis';

//Smart Contract
import Items from '../../abis/Items.json';


export default function AllItems({loading , itemsList , ethPrice , itemsAddress , currentNetwork}) {
  
  const {walletAddress} = useContext(GlobalContext);
  const[totalCount,setTotalCount] = useState(0);

  useEffect(()=>{
    getRewards(currentNetwork);
  },[currentNetwork]);

  async function getRewards(currentNetwork){
    let networkId , networkType;
    if(currentNetwork === 'MATIC'){
      networkType = "mumbai";
      networkId = 80001;
    }
    else{
      //any other network
    }

    const options = {chain : networkType , address : Items.networks[networkId].address};
    const tokenMetaData = await Moralis.Web3API.token.getNFTOwners(options);
    console.log(tokenMetaData);

    setTotalCount(tokenMetaData.result.length);
  }

  const getUSDValue = item =>{
    const totalUSDValue = (ethPrice* +window.web3.utils.fromWei(item.prize.toString(), 'Ether')) / 100000000;
    return <span className="badge badge-secondary donation-needed">Price ${Number.parseFloat(totalUSDValue).toFixed(2)}</span>
  }


  return (
    <div className="container">
        {walletAddress ? 
        <p>
          <Link to="/"></Link>
        </p> : <button className="btn dark-bg-color btn-lg" data-toggle="modal" data-target="#walletModal" disabled={loading}>Open Wallet</button>
        }

<div className="row">
        {itemsList.map(item => {
          return(
            <div className="col-12 col-md-6 col-lg-4 mb-3" key={item.itemId}>
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title">{item.name}</h5>
                    <Link className="btn primary-bg-color" to={`/item/${item.itemId}`}>View</Link>
                  </div>
                  
                  <img
                    className="card-img-top"
                    src={item.imageURL ? `https://ipfs.infura.io/ipfs/${item.imageURL}` : 'other image'}
                    alt="Item" />
                  {getUSDValue(item)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      </div>
    
  )
}
