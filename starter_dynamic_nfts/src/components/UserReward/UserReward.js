import React, { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../../context/GlobalState';

export default function UserReward({ changeRewardColor, tokenContract, tokensList, currentNetwork }) {
  const { walletAddress } = useContext(GlobalContext);
  console.log(walletAddress);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const[winningNumber,setWinningNumber] = useState(0);
  console.log(winningNumber);
  const[guessNumber,setGuessNumber] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState('')
  console.log(tokenContract);
  console.log(tokensList);
  const [winner, setWinner] = useState(false);

  useEffect(() => {
    setWinningNumber(Math.ceil(Math.random()*20));

    async function getTokenAmount() {

      const tokens = await tokenContract.methods.balanceOf(walletAddress).call();
      console.log(tokens);
      setTokenAmount(+window.web3.utils.fromWei(tokens.toString(), 'Ether'));
    }
    if (walletAddress) {
      getTokenAmount();
    }
    
  }, [walletAddress])

  const handleClick = async tokenId => {
    try {
      setLoading(true);
      await changeRewardColor(tokenId);
      setTokenAmount(tokenAmount - 1);
      setLoading(false);
    }
    catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  //game
  const checkGuessNumber = async (e) => {
    e.preventDefault()
    if (!guessNumber || guessNumber < 0 || guessNumber > 20) {
      setFeedbackMsg('Please enter a valid number from 0 to 20.')
    }

    let num1 = winningNumber
    let num2 = parseInt(guessNumber)

    if (num1 == num2) {
      try {
        setFeedbackMsg('🏆🏆 You Win! 🏆🏆 ')
        setWinner(true)
        // clean up notification again after 11 seconds
        setTimeout(() => {
          //  setShowNotification(false)
        }, 11000)
      } catch (e) {
        alert(
          'Something went wrong! ' +
            'Maybe you need to sign out and back in? ' +
            'Check your browser console for more info.',
        )
        throw e
      }
      return
    }
    const dif = Math.abs(num1 - num2)
    if (dif <= 3) {
      setFeedbackMsg("You're very close😌💭👍!")
      return
    }
    if (dif > 3 && dif <= 8) {
      setFeedbackMsg("You're lukewarm😊😊😊")
      return
    }
    if (dif > 10) {
      setFeedbackMsg("You're a bit chilly 😬 😬 😬")
      return
    }
  }

  return (
    <div className="container" style={{ minHeight: '65vh' }}>
      <div className="d-flex align-items-center">
        <h1 className="my-3">My Tokens</h1>
        {/* {walletAddress && <img
          className="ml-2"
          width='35'
          height='35'
          src={`data:image/png;base64,${new Identicon(walletAddress, 30).toString()}`}
          alt="Icon" />} */}
      </div>

      <p className="mb-4">You have {tokenAmount} PZN - Pay 1 PZN to change the color of your NFTs</p>


      









      <div className="row">
        {tokensList.map(token => {
          return (
            
            <div className="col-6 col-md-4 col-lg-3 mb-3" key={token.id}>
              <div className="card" style={{ background: `rgb(${token.red}, ${token.green}, ${token.blue})` }}>
                <div className="card-body px-4">
                  {console.log(token.tokenURI)}
                  <img className="img-rounded relative" src={token.tokenURI ? `https://ipfs.infura.io/ipfs/${token.tokenURI}` : '/images/no-image.png'} alt="NFT" />

                  <span className="badge secondary-bg-color token__label">
                    <p className="m-0">{currentNetwork}</p>
                    <p className="m-0">{window.web3.utils.fromWei(token.prize.toString(), 'Ether')} </p>
                  </span>

                  <center>
                    <span className="badge badge-warning text-center">{token.name}</span>
                  </center>
                </div>
              </div>

              <center>
                {loading ? <></> : <button className="btn primary-bg-color btn-sm" onClick={() => handleClick(token.id)}>Change Color</button>}
              </center>
            </div>
          )
        })}
      </div>
      {!tokensList.length && <p className="text-danger lead text-center mt-5">You do not have any NFTs.  You can earn some NFTs by donating some crypto to restaurants.</p>}
    </div>
  )
}
