// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract BuyMeACoffee {
    // event to emit when a memo is created
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
        );

    // Memo Struct
    struct Memo{
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // List of all memos recieved from friends
    Memo[] memos;

    // address of contract deployer
    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    /**
    * @dev to buy a cofffee for contract owner
    * @param _name name of the coffee buyer
    * @param _message a nice message from the coffee buyer
     */
    function buyCoffee(string memory _name, string memory _message) public payable {
        // Revert function if no eth is sent
        require(msg.value > 0, "Unable to buy coffee with 0 eth");

        // Add the memo to storage
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        // Emit a log event when a new memo is created
        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }

    /**
    * @dev send entire contract balance to the owner
     */
    function witdrawTips() public {
        require(owner.send(address(this).balance));
    }

    /**
    * @dev retrieve all the memos stored on the blockchain
     */
    function getMemos() public view returns(Memo[] memory) {
    return memos;
    }
}
