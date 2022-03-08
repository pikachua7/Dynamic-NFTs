// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./AggregatorV3Interface.sol";
import "./Token.sol";

/**
   * Network: Kovan Testnet
   * Aggregator: ETH/USD
   * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
   */
  /**
   * Network: Rinkeby Testnet
   * Aggregator: ETH/USD
   * Address: 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
   */
  /**
   * Network: Mumbai Testnet
   * Aggregator: MATIC/USD
   * Address: 0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada
   */

contract Items is ERC721URIStorage{
    using Counters for Counters.Counter;
    uint public itemCount = 0;
    Counters.Counter public _rewardId;

    mapping(uint => Item) public items;
    mapping(uint => Reward) public rewards;

    AggregatorV3Interface internal priceFeed;

    Token private token;

    constructor(Token _token) ERC721("Pizzenia" , "PZN"){
        token = _token;
        priceFeed = AggregatorV3Interface(0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada);
    }

    //Creating a Pizza
    struct Item{
        uint itemId;
        string name;
        string description;
        string imageURL;
        uint prize;
        address payable owner;
    }

    //Reward for the user
    struct Reward{
        uint rewardId;
        string name;
        uint red;
        uint green;
        uint blue;
        uint prize;
    }

    //Pizza created
    event ItemCreated(
        uint itemId,
        string name,
        string description,
        string imageURL,
        uint prize,
        address payable owner
    );


    //Payment of User to Pizzenia
    event Payment(
        uint itemId,
        uint amount,
        uint prize,
        address from,
        address payable owner
    );

    //Changing RGB Color
    event RGBColor(
        uint itemId,
        uint red,
        uint green,
        uint blue
    );

    //function for creating a item
    function createItem(string memory _name , string memory _description , string memory _imageURL , uint _prize ) public {
        require(_prize > 0);
        require(bytes(_name).length>0);
        require(bytes(_description).length>0);
        
        itemCount++;

        items[itemCount] = Item(itemCount,_name,_description,_imageURL,_prize,payable(msg.sender));
        emit ItemCreated(itemCount,_name,_description,_imageURL,_prize,payable(msg.sender));
    }

    //function for payment by user and assigning him the reward
    function paymentwithReward(uint _itemId,string memory _tokenURI) public payable{
        Item memory _item = items[_itemId];

        require(_item.prize >= msg.value);
        _item.owner.transfer(msg.value);

        items[_itemId] = _item;

        //Reward for the user
        _rewardId.increment();
        uint newRewardId = _rewardId.current();
        _safeMint(msg.sender,newRewardId);
        _setTokenURI(newRewardId,_tokenURI);

        //Random RGB values
        uint red = getRandomValue(255);
        uint green = getRandomValue(255);
        uint blue = getRandomValue(255);

        rewards[newRewardId] = Reward(newRewardId,_item.name,red,green,blue,msg.value);

        //Giving Pizzenia Tokens to the User
        token.transfer(msg.sender,5000000000000000000);

        emit Payment(_itemId,msg.value,_item.prize,msg.sender,_item.owner);
          
    }

    //function for generating random number
    function getRandomValue(uint mod) internal view returns(uint) {
        return uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % mod;
    }

    //function for changing colors for the reward earned
    function changeRewardColor(uint _tokenId) external {
        require(token.balanceOf(msg.sender)>0);
        
        Reward memory _reward = rewards[_tokenId];
        uint red = getRandomValue(255);
        uint green = getRandomValue(255);
        uint blue = getRandomValue(255);
        _reward.red = red;
        _reward.green = green;
        _reward.blue = blue;
        rewards[_tokenId] = _reward;

        token.payOneToken(msg.sender,address(this));
        emit RGBColor(_tokenId,red,green,blue);

    }


    //getting latest price feeds via chainlink
    function getLatestPrice() public view returns (int) {
    (
        uint80 roundID, 
        int price,
        uint startedAt,
        uint timeStamp,
        uint80 answeredInRound
    ) = priceFeed.latestRoundData();
        return price;
    }

    //Fetching Rewards of User
    function fetchRewards() public view returns(uint){
        uint totalCount = _rewardId.current();
        // int itemCount = 0;
        // uint currentIndex = 0;
        // for(uint i=0;i<totalCount;i++){
        //     if(items[i+1].owner == msg.sender){
        //         itemCount++;
        //     }
        // }

        return totalCount;
    }


}