// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title LegalEaseDocRegistry
 * @notice Trust-layer registry that anchors SHA-256
 *         file-hashes on Base.  One tx = one immutable
 *         on-chain proof; emits an event so front-ends can
 *         read instantly without extra RPC calls.
 */
contract LegalEaseDocRegistry {
    struct Doc {
        bytes32 hash;      // SHA-256 digest of the exact file bytes
        address submitter; // wallet that anchored the proof
        uint40  timestamp; // block-timestamp (fits in 5 bytes = gas-cheap)
        string  meta;      // free-form JSON or IPFS CID (optional)
    }

    mapping(bytes32 => Doc) public docs;   // hash ⇒ record
    event DocumentNotarized(bytes32 indexed hash,
                            address indexed submitter,
                            uint256 timestamp,
                            string  meta);

    /** ----------------------------------------------------------------
     * @dev Stores a document hash on-chain (idempotent).
     * @param _hash SHA-256 digest (32 bytes)
     * @param _meta Optional metadata (e.g., IPFS CID, filename, tags)
     */
    function notarize(bytes32 _hash, string calldata _meta) external {
        require(_hash != bytes32(0), "empty-hash");
        require(docs[_hash].timestamp == 0, "already-stored");

        docs[_hash] = Doc({
            hash: _hash,
            submitter: msg.sender,
            timestamp: uint40(block.timestamp),
            meta: _meta
        });

        emit DocumentNotarized(_hash, msg.sender, block.timestamp, _meta);
    }

    /** ---------------------------------------------------------------
     * @dev Returns true iff hash is already notarized.
     */
    function exists(bytes32 _hash) external view returns (bool) {
        return docs[_hash].timestamp != 0;
    }
} 