// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EarlySupport {

    uint256 public constant SUPPORT_AMOUNT = 1e16; // 0.01 ETH
    uint256 public constant MAX_SUPPORTERS = 20;

    struct Content {
        address creator;
        string title;
        string descriptionHash;
        address[] supporters;
        uint256 pool;
        bool isViral;
    }

    mapping(uint256 => Content) public contents;
    mapping(uint256 => mapping(address => bool)) public hasSupported;

    uint256 public contentCount;

    event ContentRegistered(uint256 id, address creator);
    event Supported(uint256 id, address supporter);
    event ViralTriggered(uint256 id);

    function registerContent(string memory _title, string memory _hash) public {
        contentCount++;

        contents[contentCount].creator = msg.sender;
        contents[contentCount].title = _title;
        contents[contentCount].descriptionHash = _hash;

        emit ContentRegistered(contentCount, msg.sender);
    }

    function support(uint256 _id) public payable {
        require(msg.value == SUPPORT_AMOUNT, "Send exact ETH");

        Content storage c = contents[_id];

        require(!c.isViral, "Already viral");
        require(c.supporters.length < MAX_SUPPORTERS, "Max supporters reached");
        require(!hasSupported[_id][msg.sender], "Already supported");

        c.supporters.push(msg.sender);
        hasSupported[_id][msg.sender] = true;
        c.pool += msg.value;

        emit Supported(_id, msg.sender);
    }

    function markViral(uint256 _id) public {
        Content storage c = contents[_id];

        require(msg.sender == c.creator, "Only creator");
        require(!c.isViral, "Already viral");
        require(c.supporters.length > 0, "No supporters");

        c.isViral = true;

        uint256 reward = c.pool / c.supporters.length;

        for (uint256 i = 0; i < c.supporters.length; i++) {
            address payable user = payable(c.supporters[i]);
            user.transfer(reward);
        }

        emit ViralTriggered(_id);
    }

    function getSupporters(uint256 _id) public view returns (address[] memory) {
        return contents[_id].supporters;
    }

    function getPool(uint256 _id) public view returns (uint256) {
        return contents[_id].pool;
    }
}