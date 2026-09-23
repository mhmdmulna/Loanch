// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @notice Non-production contract used only to verify the Solidity toolchain.
contract CompilationProbe {
    function ready() external pure returns (bool) {
        return true;
    }
}
