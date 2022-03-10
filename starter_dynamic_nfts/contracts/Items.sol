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

contract Items is ERC721URIStorage {
    using Counters for Counters.Counter;
    uint256 public itemCount = 0;
    Counters.Counter public _rewardId;

    mapping(uint256 => Item) public items;
    mapping(uint256 => Reward) public rewards;

    AggregatorV3Interface internal priceFeed;

    Token private token;

    constructor(Token _token) ERC721("Crizza", "CRZ") {
        token = _token;
        priceFeed = AggregatorV3Interface(
            0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada
        );
    }

    //Creating a Pizza
    struct Item {
        uint256 itemId;
        string name;
        string description;
        string imageURL;
        uint256 prize;
        address payable owner;
    }

    //Reward for the user
    struct Reward {
        uint256 rewardId;
        string name;
        uint256 red;
        uint256 green;
        uint256 blue;
        uint256 prize;
    }

    //Pizza created
    event ItemCreated(
        uint256 itemId,
        string name,
        string description,
        string imageURL,
        uint256 prize,
        address payable owner
    );

    //Payment of User to Pizzenia
    event Payment(
        uint256 itemId,
        uint256 amount,
        uint256 prize,
        address from,
        address payable owner
    );

    //Changing RGB Color
    event RGBColor(uint256 itemId, uint256 red, uint256 green, uint256 blue);

    //function for creating a item
    function createItem(
        string memory _name,
        string memory _description,
        string memory _imageURL,
        uint256 _prize
    ) public {
        require(_prize > 0);
        require(bytes(_name).length > 0);
        require(bytes(_description).length > 0);

        itemCount++;

        items[itemCount] = Item(
            itemCount,
            _name,
            _description,
            _imageURL,
            _prize,
            payable(msg.sender)
        );
        emit ItemCreated(
            itemCount,
            _name,
            _description,
            _imageURL,
            _prize,
            payable(msg.sender)
        );
    }

    //function for payment by user and assigning him the reward
    function paymentwithReward(uint256 _itemId, string memory _tokenURI)
        public
        payable
    {
        Item memory _item = items[_itemId];

        require(_item.prize >= msg.value);
        _item.owner.transfer(msg.value);

        items[_itemId] = _item;

        //Reward for the user
        _rewardId.increment();
        uint256 newRewardId = _rewardId.current();
        _safeMint(msg.sender, newRewardId);
        _setTokenURI(newRewardId, _tokenURI);

        //Random RGB values
        uint256 red = getRandomValue(255);
        uint256 green = getRandomValue(255);
        uint256 blue = getRandomValue(255);

        rewards[newRewardId] = Reward(
            newRewardId,
            _item.name,
            red,
            green,
            blue,
            msg.value
        );

        //Giving Pizzenia Tokens to the User
        token.transfer(msg.sender, 5000000000000000000);

        emit Payment(_itemId, msg.value, _item.prize, msg.sender, _item.owner);
    }

    //function for generating random number
    function getRandomValue(uint256 mod) internal view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.difficulty,
                        msg.sender
                    )
                )
            ) % mod;
    }

    //function for changing colors for the reward earned
    function changeRewardColor(uint256 _tokenId) external {
        require(token.balanceOf(msg.sender) > 0);

        Reward memory _reward = rewards[_tokenId];
        uint256 red = getRandomValue(251);
        uint256 green = getRandomValue(254);
        uint256 blue = getRandomValue(253);
        _reward.red = red;
        _reward.green = green;
        _reward.blue = blue;
        rewards[_tokenId] = _reward;

        token.payOneToken(msg.sender, address(this));
        emit RGBColor(_tokenId, red, green, blue);
    }

    //getting latest price feeds via chainlink
    function getLatestPrice() public view returns (int256) {
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return price;
    }

    //Fetching Rewards of User
    function fetchRewards() public view returns (uint256) {
        uint256 totalCount = _rewardId.current();
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
