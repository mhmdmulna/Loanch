// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @notice Test-only ERC-20 which attempts a nested deposit during pool transfers.
contract ReentrantToken is ERC20 {
    address public pool;
    bool public reentryBlocked;
    bytes4 public reentrySelector;
    bool private attacking;

    constructor() ERC20("Reentrant test token", "REENTER") {}

    function setPool(address pool_) external {
        pool = pool_;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function _update(address from, address to, uint256 amount) internal override {
        if (!attacking && pool != address(0) && (from == pool || to == pool)) {
            attacking = true;
            (bool succeeded, bytes memory response) = pool.call(abi.encodeWithSignature("deposit(uint256)", 1));
            reentryBlocked = !succeeded;
            if (response.length >= 4) {
                bytes4 selector;
                assembly { selector := mload(add(response, 32)) }
                reentrySelector = selector;
            }
            attacking = false;
        }
        super._update(from, to, amount);
    }
}
