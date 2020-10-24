pragma solidity >=0.4.24 <0.6.0;
/**
  * @title Simple Storage
  * @dev Read and write values to the chain
  */
contract simplestorage {
    string public _x;
    /**
      * @dev Constructor sets the default value
      * @param x The initial value
      */
    constructor(string memory x) public {
        _x = x;
    }
    /**
      * @dev Set the value
      * @param x The new value
      */
    // function set(string memory x) public {
    //     _x = x;
    // }
    function set(string memory x) public returns (string memory ans) {
      _x = x;
      ans = x;
    }
    /**
      * @dev Get the value
      */
    function get() public view returns (string memory x) {
        return _x;
    }
}
