// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @notice Test-only token that burns 10% of each transfer.
contract FeeOnTransferMock is ERC20 {
    constructor() ERC20("Fee-on-transfer test asset", "FEE") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function _update(address from, address to, uint256 amount) internal override {
        if (from == address(0) || to == address(0)) {
            super._update(from, to, amount);
        } else {
            uint256 fee = amount / 10;
            super._update(from, to, amount - fee);
            if (fee != 0) super._update(from, address(0), fee);
        }
    }
}
