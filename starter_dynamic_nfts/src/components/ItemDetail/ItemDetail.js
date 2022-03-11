import React, { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import $ from "jquery";

import { GlobalContext } from "../../context/GlobalState";
import Checkout from "../Checkout/Checkout";

import "./ItemDetail.css";

export default function ItemDetail({
  account,
  itemsList,
  checkoutList,
  paymentwithReward,
  getPrice,
  ethPrice,
  currentNetwork,
}) {
  const { id } = useParams();
  const { walletAddress } = useContext(GlobalContext);

  const getUSDValue = () => {
    let totalUSDValue = 0;
    if (itemsList[id - 1]?.prize) {
      totalUSDValue =
        (ethPrice *
          +window.web3.utils.fromWei(itemsList[id - 1]?.prize, "Ether")) /
        100000000;
    }
    return (
      <h5 className="price-title">
        Serves 1 <span>@ {Number.parseFloat(totalUSDValue).toFixed(2)}$</span>
      </h5>
    );
  };

  return (
    <div className="">
     
      <div className="detail-page-container">
        <div className="frame">
          <div className="detail-page-img">
            <img
              className=""
              src={
                itemsList[id - 1]?.imageURL
                  ? `https://ipfs.infura.io/ipfs/${itemsList[id - 1]?.imageURL}`
                  : "Other Work"
              }
              alt="Item"
            />
          </div>
          <div className="detail-page-description">
            <div className="grid-item item1">
              <h1>{itemsList[id - 1]?.name}</h1>
            </div>
            <div className="grid-item item2">
              <p>{itemsList[id - 1]?.description}</p>
            </div>
            <div className="grid-item item3">
              <h3>{getUSDValue()}</h3>
            </div>
            {walletAddress ? (
              <button
                className="grid-item item4 checkout-btn"
                data-toggle="modal"
                data-target="#checkout"
              >
                Add
              </button>
            ) : (
              <p className="">Connect to your wallet to Pay</p>
            )}
          </div>
        </div>
      </div>
      <Checkout
        paymentwithReward={paymentwithReward}
        id={id}
        imageURL={itemsList[id - 1]?.imageURL}
        itemName={itemsList[id - 1]?.name}
        getPrice={getPrice}
        currentNetwork={currentNetwork}
        walletAddress={walletAddress}
      />
    </div>
  );
}
