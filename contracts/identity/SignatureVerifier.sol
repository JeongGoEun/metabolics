pragma solidity ^0.4.24;

import "../openzeppelin-solidity/contracts/ECRecovery.sol";

/// @title SignatureVerifier
/// @author genie
/// @notice Implement signature verifying logic
/// @dev almost all of the data need to be verified would use this logic
contract SignatureVerifier {
    using ECRecovery for bytes32;
    bytes constant internal ETH_PREFIX = "\x19Ethereum Signed Message:\n32";

    /// @dev Recover address used to sign a claim
    /// @param toSign Hash to be signed, potentially generated with `claimToSign`
    /// @param signature Signature data i.e. signed hash
    /// @return address recovered from `signature` which signed the `toSign` hash
    function getSignatureAddress(bytes32 toSign, bytes signature)
        public
        pure
        returns (address addr)
    {
        return keccak256(abi.encodePacked(ETH_PREFIX, toSign)).recover(signature);
    }

}