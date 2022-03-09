//React
import React, { Component } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Web3 from 'web3';

//Context
import { GlobalProvider } from './context/GlobalState';

//Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AddItem from './components/AddItem/AddItem';
import ItemDetail from './components/ItemDetail/ItemDetail';
import AllItems from './components/AllItems/AllItems';
import UserReward from './components/UserReward/UserReward';
import WalletModal from './components/WalletModal/WalletModal';

//Smart Contracts
import Items from './abis/Items.json';
import Token from './abis/Token.json';
import Random from './abis/Random.json';

//CSS
import './App.css';

//Moralis
import Moralis from 'moralis';

const serverUrl = "https://qubn0n4prexd.usemoralis.com:2053/server";
const appId = "5h7sk3zRFdC5nJGzTtYYUKvJ8lXa7hU6kq4UNgLQ";
Moralis.start({ serverUrl, appId });


class App extends Component {
  state = {
    account: '',
    itemsCount: 0,
    totalCount: 0,
    itemsContract: null,
    itemsAddress: "",
    tokenContract: null,
    itemsList: [],
    checkoutList: [],
    tokensList: [],
    ethPrice: 0,
    currentNetwork: "MATIC",
    loading: false,
    randomContract : null,
    randomAddress : ""
  }

  //Connection to Wallet
  async connectToBlockchain(walletType) {
    if (walletType === 'Metamask') {
      await this.loadWeb3();
    }

    await this.loadBlockchainData(walletType);
    await this.getItems();

    const ethValue = await this.getPrice();
    this.setState({ ethPrice: ethValue });
  }

  async loadBlockchainData(walletType) {
    let web3;
    if (walletType === 'Metamask') {
      web3 = window.web3;
    }
    else {
      //Any other wallet
    }

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    console.log(this.state.account);

    const networkId = await web3.eth.net.getId();

    //Token Contract

    const TokenData = Token.networks[networkId];

    if (TokenData) {
      const abi = Token.abi;
      const address = Token.networks[networkId].address;
      const tokenContract = new web3.eth.Contract(abi, address);
      this.setState({ tokenContract });
    }
    else {
      window.alert('Token Contract not deployed to detected network');
    }

    //Items contract

    const networkData = await Items.networks[networkId];

    if (networkData) {
      const abi = Items.abi;
      const address = Items.networks[networkId].address;
      this.setState({ itemsAddress: address });

      const itemsContract = new web3.eth.Contract(abi, address);
      this.setState({ itemsContract });

      const itemsCount = await itemsContract.methods.itemCount().call();
      this.setState({ itemsCount });

      const totalCount = await itemsContract.methods.fetchRewards().call();
      this.setState({ totalCount: totalCount });

      for (let i = 1; i <= totalCount; i++) {
        const tokenOwner = await itemsContract.methods.ownerOf(i).call();
        if (tokenOwner === accounts[0]) {
          let tokenURI = await itemsContract.methods.tokenURI(i).call();
          let data = await itemsContract.methods.rewards(i).call();
          this.setState({
            tokensList: [...this.state.tokensList, {
              id: i,
              tokenURI,
              name: data.name,
              red: data.red,
              green: data.green,
              blue: data.blue,
              prize: data.prize
            }]
          });
        }
      }
    }
    else {
      window.alert('Items Contract not deployed to detected network');
    }

    //random number contract

    const randomData = await Random.networks[networkId];
    console.log(randomData);
    if(randomData){
      const abi = Random.abi;
      console.log(abi);
      const address = Random.networks[networkId].address;
      this.setState({ randomAddress: address });

      const randomContract = new web3.eth.Contract(abi, address);
      this.setState({ randomContract });
      console.log(randomContract);

      const res = await randomContract.methods.randomResult().call();
      console.log(res);
    }
    else {
      window.alert('Random Contract not deployed to detected network');
    }
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async getItems() {
    for (let i = 0; i < this.state.itemsCount; i++) {
      const item = await this.state.itemsContract.methods.items(i + 1).call();
      this.setState({ itemsList: [...this.state.itemsList, item] });
    }
  }

  async createItem(name, description, imageURL, prize) {
    const data = await this.state.itemsContract.methods.createItem(name, description, imageURL, window.web3.utils.toWei(prize.toString(), 'Ether')).send({ from: this.state.account });
    this.setState({ itemsList: [...this.state.itemsList, data.events.ItemCreated.returnValues] });
  }

  async paymentwithReward(id, prize, imageURL, itemName) {
    const res = await this.state.itemsContract.methods.paymentwithReward(id, imageURL).send({ from: this.state.account, value: window.web3.utils.toWei(prize.toString(), 'Ether') });
    //doubt
    console.log(res);
    const itemId = res.events.Transfer.returnValues.tokenId; //tokenId
    console.log(itemId);
    const tokenURI = await this.state.itemsContract.methods.tokenURI(itemId).call();
    console.log(tokenURI);
    const data = await this.state.itemsContract.methods.rewards(itemId).call();
    console.log(data);
    const newToken = {
      id: itemId,
      name: itemName,
      tokenURI,
      red: data.red,
      green: data.green,
      blue: data.blue,
      prize: window.web3.utils.toWei(prize.toString(), 'Ether')
    }
    console.log(newToken);
    this.setState({
      tokensList: [...this.state.tokensList, newToken]
    });

    return newToken;
  }

  async getBill(itemId) {
    const transaction = await this.state.itemsContract?.getPastEvents('Transactions', { fromBlock: 0, toBlock: 'latest' });
    this.setState({ checkoutList: transaction?.filter(transaction => transaction.returnValues.itemId === itemId) });
  }

  async changeRewardColor(rewardId) {
    const res = await this.state.itemsContract.methods.changeRewardColor(rewardId).send({ from: this.state.account });
    let temp = [...this.state.tokensList];
    for (let token of temp) {
      if (token.id === rewardId) {
        token.red = res.events.RGBColor.returnValues.red;
        token.green = res.events.RGBColor.returnValues.green;
        token.blue = res.events.RGBColor.returnValues.blue;
      }
    }
    this.setState({ tokensList: [...temp] });
  }

  async getPrice() {
    console.log(this.state.itemsContract);
    const ethPrice = await this.state.itemsContract.methods.getLatestPrice().call();
    return ethPrice;
  }

  setLoading() {
    this.setState({ loading: !this.state.loading })
  }

  reset() {
    this.setState({
      itemsList: [],
      checkoutList: [],
      tokensList: []
    })
  }

  changeNetwork(value) {
    this.setState({ currentNetwork: value });
  }

  render() {
    return (
      <GlobalProvider>
        <Router>
          <Navbar loading={this.state.loading} currentNetwork={this.state.currentNetwork} reset={this.reset.bind(this)} />
          <Switch>
            <Route exact path="/">
              <AllItems loading={this.state.loading} itemsList={this.state.itemsList} ethPrice={this.state.ethPrice} itemsAddress={this.state.itemsAddress} currentNetwork={this.state.currentNetwork} />
            </Route>
            <Route exact path="/userRewards">
              <UserReward changeRewardColor={this.changeRewardColor.bind(this)} tokenContract={this.state.tokenContract} randomContract={this.state.randomContract} tokensList={this.state.tokensList} currentNetwork={this.state.currentNetwork} />
            </Route>
            <Route exact path="/addItem">
              <AddItem createItem={this.createItem.bind(this)} getPrice={this.getPrice.bind(this)} currentNetwork={this.state.currentNetwork} />
            </Route>
            <Route exact path="/item/:id">
              <ItemDetail account={this.state.account} itemsList={this.state.itemsList} checkoutList={this.state.checkoutList} paymentwithReward={this.paymentwithReward.bind(this)} getPrice={this.getPrice.bind(this)} ethPrice={this.state.ethPrice} currentNetwork={this.state.currentNetwork} />
            </Route>
          </Switch>
          <WalletModal connectToBlockchain={this.connectToBlockchain.bind(this)} changeNetwork={this.changeNetwork.bind(this)} setLoading={this.setLoading.bind(this)} />
          <Footer />
        </Router>
      </GlobalProvider>
    )
  }
}

export default App;