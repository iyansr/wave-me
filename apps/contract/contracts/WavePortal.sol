// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    constructor() payable {
        console.log("Hello");
    }

    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s has waved w/ message %s", msg.sender, _message);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        emit NewWave(msg.sender, block.timestamp, _message);

        uint256 prizeAmount = 0.00001 ether;

        // 1.condition, 2.message if not meet
        require(
            prizeAmount <= address(this).balance,
            "Trying to withdraw more money than the contract has."
        );

        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "Failed to withdraw money from contract.");
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getWaveCount() public view returns (uint256) {
        console.log("We have %s total waves", totalWaves);
        return totalWaves;
    }
}
