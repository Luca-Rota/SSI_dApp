// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract DataCellarRegistry {
    mapping(address => bool) private registeredUsers;

    event UserRegistered(address indexed user);
    event UserUnregistered(address indexed user);

    modifier onlySelf(address _userAddress) {
        require(
            msg.sender == _userAddress,
            "Can only perform action on yourself"
        );
        _;
    }

    modifier onlyUnregistered(address _userAddress) {
        require(!registeredUsers[_userAddress], "User already registered");
        _;
    }

    modifier onlyRegistered(address _userAddress) {
        require(registeredUsers[_userAddress], "User not registered");
        _;
    }

    function registerUser(
        address _userAddress
    ) external onlySelf(_userAddress) onlyUnregistered(_userAddress) {
        registeredUsers[_userAddress] = true;
        emit UserRegistered(_userAddress);
    }

    function unregisterUser(
        address _userAddress
    ) external onlySelf(_userAddress) onlyRegistered(_userAddress) {
        registeredUsers[_userAddress] = false;
        emit UserUnregistered(_userAddress);
    }

    function isUserRegistered(
        address _userAddress
    ) external view returns (bool) {
        return registeredUsers[_userAddress];
    }
}