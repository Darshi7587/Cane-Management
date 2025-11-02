// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title FarmerRegistry
 * @dev Smart contract for registering and verifying farmers on the blockchain
 * @notice This contract maintains tamper-proof records of farmer registrations
 * 
 * Features:
 * - Register farmers with unique IDs
 * - Store cryptographic hash of farmer details
 * - Track registration timestamps
 * - Maintain wallet addresses for farmers
 * - Verify farmer authenticity
 * - Support for batch operations
 */

contract FarmerRegistry {
    
    // ============ Data Structures ============
    
    /**
     * @dev Farmer registration record
     */
    struct FarmerRecord {
        string farmerId;                    // Unique digital farmer ID (FARM-YYYY-XXXX)
        bytes32 detailsHash;                // SHA-256 hash of farmer details
        uint256 registrationTimestamp;      // Unix timestamp of registration
        address walletAddress;              // Farmer's blockchain wallet address
        bool verified;                      // Verification status
        uint256 lastUpdatedTimestamp;       // Last update timestamp
    }
    
    // ============ State Variables ============
    
    address public owner;                           // Contract owner (admin)
    mapping(string => FarmerRecord) public farmers; // Farmer records by ID
    string[] public farmerIds;                      // Array of all farmer IDs (for enumeration)
    mapping(address => string) public walletToFarmerId; // Map wallet to farmer ID
    mapping(string => bool) public farmerIdExists;  // Quick lookup for farmer ID existence
    
    uint256 public farmerCount;                     // Total number of registered farmers
    uint256 public verifiedFarmerCount;             // Total verified farmers
    
    // ============ Events ============
    
    /**
     * @dev Emitted when a farmer is registered
     */
    event FarmerRegistered(
        string indexed farmerId,
        bytes32 detailsHash,
        address indexed walletAddress,
        uint256 timestamp
    );
    
    /**
     * @dev Emitted when farmer verification status changes
     */
    event VerificationStatusUpdated(
        string indexed farmerId,
        bool verified,
        uint256 timestamp
    );
    
    /**
     * @dev Emitted when farmer details hash is updated
     */
    event FarmerDetailsUpdated(
        string indexed farmerId,
        bytes32 oldHash,
        bytes32 newHash,
        uint256 timestamp
    );
    
    /**
     * @dev Emitted when farmer is removed from registry
     */
    event FarmerRemoved(
        string indexed farmerId,
        uint256 timestamp
    );
    
    // ============ Modifiers ============
    
    /**
     * @dev Ensures only contract owner can call the function
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    /**
     * @dev Ensures the farmer ID exists
     */
    modifier farmerExists(string memory _farmerId) {
        require(farmerIdExists[_farmerId], "Farmer ID does not exist");
        _;
    }
    
    /**
     * @dev Ensures the farmer ID does not already exist
     */
    modifier farmerNotExists(string memory _farmerId) {
        require(!farmerIdExists[_farmerId], "Farmer ID already exists");
        _;
    }
    
    // ============ Constructor ============
    
    /**
     * @dev Initialize contract with owner
     */
    constructor() {
        owner = msg.sender;
        farmerCount = 0;
        verifiedFarmerCount = 0;
    }
    
    // ============ Registration Functions ============
    
    /**
     * @dev Register a new farmer on the blockchain
     * @param _farmerId Unique digital farmer ID
     * @param _detailsHash Keccak256 hash of farmer details
     * @param _registrationTimestamp Unix timestamp of registration
     * @param _walletAddress Farmer's blockchain wallet address
     * 
     * Requirements:
     * - Farmer ID must be unique
     * - Details hash must not be empty
     * - Wallet address must be valid (not zero address)
     */
    function registerFarmer(
        string memory _farmerId,
        bytes32 _detailsHash,
        uint256 _registrationTimestamp,
        address _walletAddress
    ) public onlyOwner farmerNotExists(_farmerId) {
        require(bytes(_farmerId).length > 0, "Farmer ID cannot be empty");
        require(_detailsHash != bytes32(0), "Details hash cannot be zero");
        require(_walletAddress != address(0), "Wallet address cannot be zero address");
        require(_registrationTimestamp <= block.timestamp, "Timestamp cannot be in future");
        
        // Create farmer record
        FarmerRecord storage record = farmers[_farmerId];
        record.farmerId = _farmerId;
        record.detailsHash = _detailsHash;
        record.registrationTimestamp = _registrationTimestamp;
        record.walletAddress = _walletAddress;
        record.verified = false;
        record.lastUpdatedTimestamp = block.timestamp;
        
        // Add to enumeration arrays
        farmerIds.push(_farmerId);
        farmerIdExists[_farmerId] = true;
        walletToFarmerId[_walletAddress] = _farmerId;
        
        // Update counters
        farmerCount++;
        
        // Emit event
        emit FarmerRegistered(_farmerId, _detailsHash, _walletAddress, block.timestamp);
    }
    
    /**
     * @dev Register multiple farmers in batch
     * @param _farmerIds Array of farmer IDs
     * @param _detailsHashes Array of details hashes
     * @param _registrationTimestamps Array of registration timestamps
     * @param _walletAddresses Array of wallet addresses
     */
    function registerFarmersBatch(
        string[] memory _farmerIds,
        bytes32[] memory _detailsHashes,
        uint256[] memory _registrationTimestamps,
        address[] memory _walletAddresses
    ) public onlyOwner {
        require(
            _farmerIds.length == _detailsHashes.length &&
            _farmerIds.length == _registrationTimestamps.length &&
            _farmerIds.length == _walletAddresses.length,
            "Array lengths must match"
        );
        
        for (uint256 i = 0; i < _farmerIds.length; i++) {
            registerFarmer(
                _farmerIds[i],
                _detailsHashes[i],
                _registrationTimestamps[i],
                _walletAddresses[i]
            );
        }
    }
    
    // ============ Verification Functions ============
    
    /**
     * @dev Update farmer verification status
     * @param _farmerId Unique farmer ID
     * @param _verified New verification status
     */
    function updateVerificationStatus(string memory _farmerId, bool _verified)
        public
        onlyOwner
        farmerExists(_farmerId)
    {
        FarmerRecord storage record = farmers[_farmerId];
        
        // Update verification status
        if (record.verified != _verified) {
            record.verified = _verified;
            record.lastUpdatedTimestamp = block.timestamp;
            
            // Update verified count
            if (_verified) {
                verifiedFarmerCount++;
            } else {
                verifiedFarmerCount--;
            }
            
            emit VerificationStatusUpdated(_farmerId, _verified, block.timestamp);
        }
    }
    
    /**
     * @dev Verify farmer details against stored hash
     * @param _farmerId Unique farmer ID
     * @param _detailsHash Hash to verify against
     * @return Boolean indicating if hash matches
     */
    function verifyFarmerDetails(string memory _farmerId, bytes32 _detailsHash)
        public
        view
        farmerExists(_farmerId)
        returns (bool)
    {
        return farmers[_farmerId].detailsHash == _detailsHash;
    }
    
    // ============ Getter Functions ============
    
    /**
     * @dev Get farmer record by ID
     * @param _farmerId Unique farmer ID
     * @return FarmerRecord containing all farmer data
     */
    function getFarmerRecord(string memory _farmerId)
        public
        view
        farmerExists(_farmerId)
        returns (FarmerRecord memory)
    {
        return farmers[_farmerId];
    }
    
    /**
     * @dev Get farmer ID from wallet address
     * @param _walletAddress Farmer's wallet address
     * @return Farmer ID string
     */
    function getFarmerIdByWallet(address _walletAddress)
        public
        view
        returns (string memory)
    {
        return walletToFarmerId[_walletAddress];
    }
    
    /**
     * @dev Get total count of registered farmers
     * @return Count of farmers
     */
    function getFarmerCount() public view returns (uint256) {
        return farmerCount;
    }
    
    /**
     * @dev Get verified farmer count
     * @return Count of verified farmers
     */
    function getVerifiedFarmerCount() public view returns (uint256) {
        return verifiedFarmerCount;
    }
    
    /**
     * @dev Get farmer ID by index (for enumeration)
     * @param _index Index in farmerIds array
     * @return Farmer ID
     */
    function farmerIdsByIndex(uint256 _index) public view returns (string memory) {
        require(_index < farmerIds.length, "Index out of bounds");
        return farmerIds[_index];
    }
    
    /**
     * @dev Check if farmer exists
     * @param _farmerId Farmer ID to check
     * @return Boolean indicating existence
     */
    function isFarmerRegistered(string memory _farmerId) public view returns (bool) {
        return farmerIdExists[_farmerId];
    }
    
    /**
     * @dev Check if farmer is verified
     * @param _farmerId Farmer ID to check
     * @return Boolean indicating verification status
     */
    function isFarmerVerified(string memory _farmerId) public view returns (bool) {
        if (!farmerIdExists[_farmerId]) return false;
        return farmers[_farmerId].verified;
    }
    
    // ============ Update Functions ============
    
    /**
     * @dev Update farmer details hash (in case of corrections)
     * @param _farmerId Farmer ID
     * @param _newHash New details hash
     */
    function updateFarmerDetailsHash(string memory _farmerId, bytes32 _newHash)
        public
        onlyOwner
        farmerExists(_farmerId)
    {
        require(_newHash != bytes32(0), "New hash cannot be zero");
        
        FarmerRecord storage record = farmers[_farmerId];
        bytes32 oldHash = record.detailsHash;
        
        record.detailsHash = _newHash;
        record.lastUpdatedTimestamp = block.timestamp;
        
        emit FarmerDetailsUpdated(_farmerId, oldHash, _newHash, block.timestamp);
    }
    
    /**
     * @dev Update farmer wallet address
     * @param _farmerId Farmer ID
     * @param _newWalletAddress New wallet address
     */
    function updateFarmerWallet(string memory _farmerId, address _newWalletAddress)
        public
        onlyOwner
        farmerExists(_farmerId)
    {
        require(_newWalletAddress != address(0), "New wallet address cannot be zero address");
        
        FarmerRecord storage record = farmers[_farmerId];
        address oldWallet = record.walletAddress;
        
        record.walletAddress = _newWalletAddress;
        record.lastUpdatedTimestamp = block.timestamp;
        
        // Update wallet mapping
        delete walletToFarmerId[oldWallet];
        walletToFarmerId[_newWalletAddress] = _farmerId;
    }
    
    // ============ Admin Functions ============
    
    /**
     * @dev Remove farmer from registry (emergency/correction)
     * @param _farmerId Farmer ID to remove
     */
    function removeFarmer(string memory _farmerId)
        public
        onlyOwner
        farmerExists(_farmerId)
    {
        FarmerRecord storage record = farmers[_farmerId];
        
        // Remove wallet mapping
        delete walletToFarmerId[record.walletAddress];
        
        // Remove from farmerIds array
        for (uint256 i = 0; i < farmerIds.length; i++) {
            if (keccak256(abi.encodePacked(farmerIds[i])) == keccak256(abi.encodePacked(_farmerId))) {
                farmerIds[i] = farmerIds[farmerIds.length - 1];
                farmerIds.pop();
                break;
            }
        }
        
        // Update counters
        if (record.verified) {
            verifiedFarmerCount--;
        }
        farmerCount--;
        
        // Remove farmer record
        delete farmers[_farmerId];
        delete farmerIdExists[_farmerId];
        
        emit FarmerRemoved(_farmerId, block.timestamp);
    }
    
    /**
     * @dev Transfer ownership to new owner
     * @param _newOwner Address of new owner
     */
    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "New owner cannot be zero address");
        owner = _newOwner;
    }
    
    // ============ View Functions ============
    
    /**
     * @dev Get all farmer IDs (paginated)
     * @param _limit Number of records to return
     * @param _offset Starting position
     * @return Array of farmer IDs
     */
    function getFarmerIdsPaginated(uint256 _limit, uint256 _offset)
        public
        view
        returns (string[] memory)
    {
        require(_offset < farmerIds.length, "Offset out of bounds");
        
        uint256 resultSize = _limit;
        if (_offset + _limit > farmerIds.length) {
            resultSize = farmerIds.length - _offset;
        }
        
        string[] memory result = new string[](resultSize);
        for (uint256 i = 0; i < resultSize; i++) {
            result[i] = farmerIds[_offset + i];
        }
        
        return result;
    }
}
