import React, { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../../context/GlobalState';

// css
import './UserReward.css';
import Spinner from '../Spinner/Spinner';

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
    setTokenAmount(tokenAmount - 1);
    e.preventDefault()
    if (!guessNumber || guessNumber < 0 || guessNumber > 20) {
      setFeedbackMsg('Please enter a valid number from 0 to 20.')
    }

    let num1 = winningNumber
    let num2 = parseInt(guessNumber)

    if (num1 == num2) {
      try {
        setFeedbackMsg('🏆🏆 You Won! 🏆🏆 ')
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
      setFeedbackMsg("You're very close!")
      return
    }
    if (dif > 3 && dif <= 10) {
      setFeedbackMsg("You're close but some where far!")
      return
    }
    if (dif > 10) {
      setFeedbackMsg("You're ver far!")
      return
    }
  }

  return (
    <div className="container" style={{}}>
      <div className="game-frame">
            <p className="token-info">{tokenAmount} PZN <br/><span>Pay 1 PZN to change the color of your NFTs</span></p>

            <h2>
                Enter a number from 0 - 20
              </h2>
              <form className="" noValidate autoComplete="off">
                <input
                  id="outlined-basic"
                  label="Guess a number between 0 - 20"
                  variant="outlined"
                  className="game-input"
                  defaultValue={guessNumber}
                  type="number"
                  onChange={(e) => setGuessNumber(e.target.value)}
                />
                <br/>
                <button
                  className='go-btn'
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={checkGuessNumber}
                >
                  Go
                </button>
              </form>

              <p className="">{feedbackMsg}</p>
              {/* {walletAddress && <img
                className="ml-2"
                width='35'
                height='35'
                src={`data:image/png;base64,${new Identicon(walletAddress, 30).toString()}`}
                alt="Icon" />} */}
      </div>
        {winner ? <div className="nft-grid">
        {tokensList.map(token => {
          return (
            <div className='nft-card'>
                 <div className="nft" key={token.id}>
              <div className="nft-inner-section" style={{ background: `rgb(${token.red}, ${token.green}, ${token.blue})` }}>
                <div className="nft-img">
                  {console.log(token.tokenURI)}
                  <img className="" src={token.tokenURI ? `https://ipfs.infura.io/ipfs/${token.tokenURI}` : '/images/no-image.png'} alt="NFT" />
                 
                </div>
              </div>
              <div className="nft-details">
                    <div className="nft-price">{window.web3.utils.fromWei(token.prize.toString(), 'Ether')} {currentNetwork}</div>
                    <div className="nft-name">{token.name}</div>
              </div>

  
                    
              <center>
                {loading ? <Spinner/> : <button className="change-color-btn" onClick={() => handleClick(token.id)}>Change Color</button>}
              </center>
            </div>

            </div>
          )
        })}
      </div> : <></>}

      
        








      
      {!tokensList.length && <p className="no-nft-msg">You do not have any NFTs</p>}
    </div>
  )
}