// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface INativeLoanchPool {
    function deposit() external payable;
    function withdraw(uint256 amount) external;
}

contract NativeReentrantReceiver {
    INativeLoanchPool public immutable pool;
    bool public attackEnabled;
    bool public reentryBlocked;
    bytes4 public reentrySelector;

    constructor(address pool_) {
        pool = INativeLoanchPool(pool_);
    }

    function deposit() external payable {
        pool.deposit{value: msg.value}();
    }

    function withdrawWithAttack(uint256 amount) external {
        attackEnabled = true;
        pool.withdraw(amount);
        attackEnabled = false;
    }

    receive() external payable {
        if (!attackEnabled) return;
        try pool.withdraw(1) {
            revert("reentry unexpectedly succeeded");
        } catch (bytes memory reason) {
            reentryBlocked = true;
            if (reason.length >= 4) {
                bytes4 selector;
                assembly ("memory-safe") {
                    selector := mload(add(reason, 32))
                }
                reentrySelector = selector;
            }
        }
    }
}
