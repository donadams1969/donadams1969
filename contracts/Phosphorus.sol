// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title Interfaces for the Phosphorus Protocol™️®️©️
 */
interface IPHOS_R {
    function mint(address to, uint256 amount) external;
}

interface IPHOS_W {
    function mint(address to, uint256 amount) external;
    function burn(uint256 amount) external;
    function burnFrom(address account, uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
    function applyDecay(address account) external returns (uint256); // Function to trigger decay calculation externally if needed
}

/**
 * @title eVALORAIPLUS.protocol.PHOS_R™️®️©️ Token ($PHOS-R)
 * @notice The stable, safe governance and staking token (Red Phosphorus).
 * Only Ownable (initially the deployer/Commander) can mint.
 */
contract PHOS_R is ERC20, Ownable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(address initialOwner) ERC20("PHOS-R Governance Token", "PHOS-R") Ownable(initialOwner) {
        _setupRole(DEFAULT_ADMIN_ROLE, initialOwner);
        _setupRole(MINTER_ROLE, initialOwner);
    }

    function mint(address to, uint256 amount) public {
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        _mint(to, amount);
    }

    function grantMinterRole(address minter) public onlyOwner {
        _setupRole(MINTER_ROLE, minter);
    }

    function _setupRole(bytes32 role, address account) internal {
        _grantRole(role, account);
    }
}

/**
 * @title eVALORAIPLUS.protocol.PHOS_W™️®️©️ Token ($PHOS-W)
 * @notice The highly reactive, volatile, and inflationary rewards token (White Phosphorus).
 * Includes a decay mechanism for tokens held outside approved contracts.
 */
contract PHOS_W is ERC20, ERC20Burnable, Ownable, AccessControl {

    // --- Decay Parameters ---
    uint256 public decayRateBasisPoints = 5000; // 50% decay (5000 basis points = 50.00%)
    uint256 public decayIntervalSeconds = 24 hours; // Decay applied per day
    mapping(address => uint256) public lastInteractionTimestamp; // Tracks last time balance was updated/checked with decay

    // --- Approved Contracts (Immune to Decay) ---
    // These are the bonding protocols where PHOS-W is safely "compounded".
    mapping(address => bool) public isApprovedBondingContract;

    event DecayApplied(address indexed account, uint256 decayedAmount, uint256 newBalance);
    event ApprovedContractSet(address indexed contractAddress, bool isApproved);

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(address initialOwner) ERC20("PHOS-W Reward Token", "PHOS-W") Ownable(initialOwner) {
        _setupRole(DEFAULT_ADMIN_ROLE, initialOwner);
        _setupRole(MINTER_ROLE, initialOwner);
    }

    /**
     * @notice Calculates the current balance after applying decay. Does NOT modify state.
     * @param account The address to check.
     * @return The balance after potential decay.
     */
    function _calculateBalanceWithDecay(address account) internal view returns (uint256) {
        if (isApprovedBondingContract[account] || account == address(0)) {
            // Approved contracts and the zero address are immune to decay
            return super.balanceOf(account);
        }

        uint256 lastTimestamp = lastInteractionTimestamp[account];
        if (lastTimestamp == 0) {
            // If never interacted, assume minted recently, no decay yet for calculation.
            // Decay will be applied properly upon first transfer/interaction.
            return super.balanceOf(account);
        }

        uint256 timeElapsed = block.timestamp - lastTimestamp;
        if (timeElapsed < decayIntervalSeconds) {
            return super.balanceOf(account); // Not enough time passed for decay cycle
        }

        uint256 decayPeriods = timeElapsed / decayIntervalSeconds;
        uint256 currentBalance = super.balanceOf(account);

        // Apply decay using exponentiation by squaring
        // Formula: balance = balance * (1 - decayRate)^periods
        // Using basis points: balance = balance * ((10000 - decayRateBasisPoints)/10000)^periods
        uint256 decayMultiplier = 10000 - decayRateBasisPoints; // Represents (1 - decayRate) * 10000
        uint256 decayFactor = power(decayMultiplier, decayPeriods);
        uint256 divisor = power(10000, decayPeriods);
        currentBalance = (currentBalance * decayFactor) / divisor;

        return currentBalance;
    }

    /**
     * @notice Updates the balance by applying decay and burning the difference. Modifies state.
     * @param account The address whose balance needs updating.
     * @return The new balance after decay has been applied and burned.
     */
    function _updateBalanceWithDecay(address account) internal returns (uint256) {
        uint256 currentStoredBalance = super.balanceOf(account);
        uint256 balanceAfterDecay = _calculateBalanceWithDecay(account);

        if (balanceAfterDecay < currentStoredBalance) {
            uint256 decayedAmount = currentStoredBalance - balanceAfterDecay;
            _burn(account, decayedAmount); // Burn the decayed amount
            emit DecayApplied(account, decayedAmount, balanceAfterDecay);
        }

        // Update the timestamp only if decay was potentially applicable
        if (!isApprovedBondingContract[account] && account != address(0)) {
           lastInteractionTimestamp[account] = block.timestamp;
        }

        return balanceAfterDecay;
    }

    /**
     * @notice Override balanceOf to always show the decayed balance.
     */
    function balanceOf(address account) public view override returns (uint256) {
        // Note: This is a view function, cannot modify state here.
        // It shows the *potential* balance after decay. Actual decay happens on transfer/interaction.
        return _calculateBalanceWithDecay(account);
    }

    /**
     * @notice Allows an external caller (or the user themselves) to trigger the decay calculation and burn.
     * Useful if a wallet doesn't automatically show the decayed balance.
     */
    function applyDecay(address account) external returns (uint256) {
        // Requires the caller to be the account owner or an authorized contract (like bonding contracts)
        require(msg.sender == account || isApprovedBondingContract[msg.sender] || msg.sender == owner(), "Unauthorized decay trigger");
        return _updateBalanceWithDecay(account);
    }


    /**
     * @notice Override _update to apply decay before any balance change.
     */
    function _update(address from, address to, uint256 amount) internal override {
        if (from != address(0)) {
           _updateBalanceWithDecay(from); // Apply decay to sender before transfer
        }
       if (to != address(0) && from != address(0)) { // Don't decay receiver on mint
            // Update receiver timestamp, decay will calculate from now
            if (!isApprovedBondingContract[to]){
               lastInteractionTimestamp[to] = block.timestamp;
            }
       } else if (to != address(0) && from == address(0)) {
            // Set initial timestamp on mint
            if(!isApprovedBondingContract[to]){
               lastInteractionTimestamp[to] = block.timestamp;
            }
       }

        super._update(from, to, amount);
    }

    // --- Admin Functions ---
    function mint(address to, uint256 amount) public {
         require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
         // Set initial timestamp on mint
         if(!isApprovedBondingContract[to] && to != address(0)){
            lastInteractionTimestamp[to] = block.timestamp;
         }
        _mint(to, amount);
    }

    function setDecayParameters(uint256 _decayRateBasisPoints, uint256 _decayIntervalSeconds) external onlyOwner {
        require(_decayRateBasisPoints <= 10000, "Decay rate cannot exceed 100%");
        require(_decayIntervalSeconds > 0, "Interval must be positive");
        decayRateBasisPoints = _decayRateBasisPoints;
        decayIntervalSeconds = _decayIntervalSeconds;
    }

    function setApprovedBondingContract(address _contract, bool _isApproved) external onlyOwner {
        isApprovedBondingContract[_contract] = _isApproved;
        emit ApprovedContractSet(_contract, _isApproved);
    }

    function grantMinterRole(address minter) public onlyOwner {
        _setupRole(MINTER_ROLE, minter);
    }

    function _setupRole(bytes32 role, address account) internal {
        _grantRole(role, account);
    }

    /**
     * @dev internal function to perform exponentiation by squaring
     */
    function power(uint256 base, uint256 exp) internal pure returns (uint256) {
        uint256 res = 1;
        base = base;
        while (exp > 0) {
            if (exp % 2 == 1) res = res * base;
            base = base * base;
            exp /= 2;
        }
        return res;
    }
}


/**
 * @title eVALORAIPLUS.protocol.Matchstrike™️®️©️ Contract
 * @notice Stakes $PHOS-R ("Matchbox") to generate $PHOS-W ("Spark").
 */
contract Matchstrike is Ownable {

    IPHOS_R public phosR;
    IPHOS_W public phosW;

    uint256 public totalStaked;
    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public lastRewardTimestamp;

    struct BoostInfo {
        uint256 boostMultiplier; // e.g., 2 for 2x boost
        uint256 expiryTimestamp;
    }
    mapping(address => BoostInfo) public activeBoosts;

    uint256 public rewardRatePerSecondPerToken = uint256(1e18) / (1 days); // Example: 1 PHOS-W per PHOS-R per day

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 rewardAmount);

    constructor(address _phosRAddress, address _phosWAddress, address initialOwner) Ownable(initialOwner) {
        phosR = IPHOS_R(_phosRAddress);
        phosW = IPHOS_W(_phosWAddress);
    }

    function calculateRewards(address user) public view returns (uint256) {
        uint256 staked = stakedBalance[user];
        if (staked == 0) {
            return 0;
        }
        uint256 lastTime = lastRewardTimestamp[user];
        if(lastTime == 0) { // If first stake or claimed recently and restaked
             lastTime = block.timestamp; // Start calculation from now
        }
        uint256 timeElapsed = block.timestamp - lastTime;
        uint256 rewards = (staked * timeElapsed * rewardRatePerSecondPerToken) / 1e18;

        BoostInfo storage boost = activeBoosts[user];
        if (boost.expiryTimestamp > block.timestamp) {
            rewards = rewards * boost.boostMultiplier;
        }

        return rewards;
    }

    function registerBoost(address user, uint256 boostMultiplier, uint256 durationSeconds) external {
        // In a real scenario, this should be restricted to the AcidBoost contract
        activeBoosts[user] = BoostInfo({
            boostMultiplier: boostMultiplier,
            expiryTimestamp: block.timestamp + durationSeconds
        });
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Cannot stake 0");
        _claimRewards(msg.sender); // Claim pending rewards before staking more

        // Transfer PHOS-R from user to this contract
        // Requires user to have approved this contract first
        bool success = ERC20(address(phosR)).transferFrom(msg.sender, address(this), amount);
        require(success, "PHOS-R transfer failed");

        stakedBalance[msg.sender] = stakedBalance[msg.sender] + amount;
        totalStaked = totalStaked + amount;
        lastRewardTimestamp[msg.sender] = block.timestamp; // Reset reward timer
        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) external {
        require(amount > 0, "Cannot unstake 0");
        require(stakedBalance[msg.sender] >= amount, "Insufficient staked balance");

        _claimRewards(msg.sender); // Claim pending rewards before unstaking

        stakedBalance[msg.sender] = stakedBalance[msg.sender] - amount;
        totalStaked = totalStaked - amount;
        // lastRewardTimestamp is updated implicitly by _claimRewards

        // Transfer PHOS-R back to the user
        bool success = ERC20(address(phosR)).transfer(msg.sender, amount);
        require(success, "PHOS-R transfer failed");

        emit Unstaked(msg.sender, amount);
    }

    function claimRewards() external {
        _claimRewards(msg.sender);
    }

    function _claimRewards(address user) internal {
        uint256 rewards = calculateRewards(user);
        if (rewards > 0) {
            lastRewardTimestamp[user] = block.timestamp; // Update timestamp before minting
            PHOS_W(address(phosW)).mint(user, rewards);
            emit RewardClaimed(user, rewards);
        } else if (stakedBalance[user] > 0 && lastRewardTimestamp[user] == 0) {
             // Handle case where user staked but hasn't claimed yet (set timestamp)
             lastRewardTimestamp[user] = block.timestamp;
        }
    }

    // --- Admin Functions ---
    function setRewardRate(uint256 _newRatePerSecondPerToken) external onlyOwner {
        rewardRatePerSecondPerToken = _newRatePerSecondPerToken;
    }

     // In case of emergency or upgrade
    function emergencyWithdrawStuckTokens(address tokenAddress, address recipient) external onlyOwner {
        require(tokenAddress != address(phosR), "Cannot withdraw staked PHOS-R"); // Protect staked tokens
        uint256 balance = ERC20(tokenAddress).balanceOf(address(this));
        if (balance > 0) {
            bool success = ERC20(tokenAddress).transfer(recipient, balance);
            require(success, "Emergency transfer failed");
        }
    }
}

/**
 * @title eVALORAIPLUS.protocol.Fertilizer™️®️©️ Contract
 * @notice Bonds $PHOS-W to yield more $PHOS-R.
 */
contract Fertilizer is Ownable {

    IPHOS_W public phosW;
    IPHOS_R public phosR;

    uint256 public totalBonded;
    mapping(address => uint256) public bondedBalance;
    mapping(address => uint256) public lastRewardTimestamp;
    uint256 public rewardRatePerSecondPerToken = uint256(1e18) / (1 days); // Example: 1 PHOS-R per PHOS-W per day

    event Bonded(address indexed user, uint256 amount);
    event Unbonded(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 rewardAmount);

    constructor(address _phosWAddress, address _phosRAddress, address initialOwner) Ownable(initialOwner) {
        phosW = IPHOS_W(_phosWAddress);
        phosR = IPHOS_R(_phosRAddress);
        // Ensure PHOS_W contract approves this contract for decay immunity
        // PHOS_W(payable(_phosWAddress)).setApprovedBondingContract(address(this), true); // Requires Owner call
    }

    function calculateRewards(address user) public view returns (uint256) {
        uint256 bonded = bondedBalance[user];
        if (bonded == 0) {
            return 0;
        }
        uint256 lastTime = lastRewardTimestamp[user];
        if(lastTime == 0) { // If first bond or claimed recently and rebonded
             lastTime = block.timestamp; // Start calculation from now
        }
        uint256 timeElapsed = block.timestamp - lastTime;
        return (bonded * timeElapsed * rewardRatePerSecondPerToken) / 1e18;
    }

    function bond(uint256 amount) external {
        require(amount > 0, "Cannot bond 0");
        _claimRewards(msg.sender); // Claim pending rewards before bonding more
        // Apply decay before transfer
        phosW.applyDecay(msg.sender);
        // Transfer PHOS-W from user to this contract
        bool success = ERC20(address(phosW)).transferFrom(msg.sender, address(this), amount);
        require(success, "PHOS-W transfer failed");

        bondedBalance[msg.sender] = bondedBalance[msg.sender] + amount;
        totalBonded = totalBonded + amount;
        lastRewardTimestamp[msg.sender] = block.timestamp; // Reset reward timer
        emit Bonded(msg.sender, amount);
    }

    function unbond(uint256 amount) external {
        require(amount > 0, "Cannot unbond 0");
        require(bondedBalance[msg.sender] >= amount, "Insufficient bonded balance");

        _claimRewards(msg.sender); // Claim pending rewards before unbonding

        bondedBalance[msg.sender] = bondedBalance[msg.sender] - amount;
        totalBonded = totalBonded - amount;

        // Transfer PHOS-W back to the user
        bool success = ERC20(address(phosW)).transfer(msg.sender, amount);
        require(success, "PHOS-W transfer failed");

        emit Unbonded(msg.sender, amount);
    }

    function claimPhosRRewards() external {
        _claimRewards(msg.sender);
    }

    function _claimRewards(address user) internal {
        uint256 rewards = calculateRewards(user);
        if (rewards > 0) {
            lastRewardTimestamp[user] = block.timestamp; // Update timestamp before minting
            PHOS_R(address(phosR)).mint(user, rewards);
            emit RewardClaimed(user, rewards);
        } else if (bondedBalance[user] > 0 && lastRewardTimestamp[user] == 0) {
             // Handle case where user bonded but hasn't claimed yet (set timestamp)
             lastRewardTimestamp[user] = block.timestamp;
        }
    }

     // --- Admin Functions ---
    // Function for owner to deposit PHOS-R rewards
    function depositPhosRRewards(uint256 amount) external onlyOwner {
         bool success = ERC20(address(phosR)).transferFrom(msg.sender, address(this), amount);
         require(success, "PHOS-R reward deposit failed");
    }
}

/**
 * @title eVALORAIPLUS.protocol.ATP™️®️©️ Contract
 * @notice Consumes (burns) $PHOS-W as "gas" for protocol actions.
 */
contract ATP is Ownable {
    IPHOS_W public phosW;

    constructor(address _phosWAddress, address initialOwner) Ownable(initialOwner) {
        phosW = IPHOS_W(_phosWAddress);
    }

    /**
     * @notice Example function requiring PHOS-W burn.
     * @param requiredBurnAmount The amount of PHOS-W to burn.
     */
    function performAction(uint256 requiredBurnAmount) external {
        // Apply decay first
        phosW.applyDecay(msg.sender);
        // Burn PHOS-W directly from the user's balance
        // Requires user to have approved this contract or use burnFrom
         phosW.burnFrom(msg.sender, requiredBurnAmount); // Preferred method

        // --- Perform the actual protocol action here ---
        // E.g., mint an NFT, execute a special trade, etc.
    }
}

/**
 * @title eVALORAIPLUS.protocol.DNA™️®️©️ Contract
 * @notice Locks $PHOS-W long-term to fund new protocol structures.
 */
contract DNA is Ownable {

    IPHOS_W public phosW;
    uint256 public totalLocked;
    // Structure to track locked funds, proposal details, unlock times etc.
    // mapping(bytes32 => ProposalLock) public proposals;

    constructor(address _phosWAddress, address initialOwner) Ownable(initialOwner) {
        phosW = IPHOS_W(_phosWAddress);
        // PHOS_W(payable(_phosWAddress)).setApprovedBondingContract(address(this), true); // Requires Owner call
    }

    function lockForProposal(uint256 amount /*, bytes32 proposalId */) external {
        require(amount > 0, "Cannot lock 0");
         // Apply decay first
        phosW.applyDecay(msg.sender);
        // Transfer PHOS-W to this contract for locking
        bool success = ERC20(address(phosW)).transferFrom(msg.sender, address(this), amount);
        require(success, "PHOS-W transfer failed");

        totalLocked = totalLocked + amount;
        // TODO: Implement proposal tracking and unlock logic
    }
}

/**
 * @title eVALORAIPLUS.protocol.AcidBoost™️®️©️ Contract
 * @notice Burns small amounts of $PHOS-W for temporary staking boosts.
 */
contract AcidBoost is Ownable {
    IPHOS_W public phosW;
    Matchstrike public matchstrike; // Reference to the staking contract

    // Mapping to track active boosts per user and their expiry
    // mapping(address => BoostInfo) public activeBoosts;

    constructor(address _phosWAddress, address _matchstrikeAddress, address initialOwner) Ownable(initialOwner) {
        phosW = IPHOS_W(_phosWAddress);
        matchstrike = Matchstrike(_matchstrikeAddress);
    }

    function applyBoost(uint256 burnAmount, uint256 boostMultiplier, uint256 boostDurationSeconds) external {
        require(burnAmount > 0, "Cannot burn 0");
        require(boostMultiplier > 1, "Boost must be greater than 1x");
         // Apply decay first
        phosW.applyDecay(msg.sender);
        // Burn PHOS-W from user
        phosW.burnFrom(msg.sender, burnAmount);

        matchstrike.registerBoost(msg.sender, boostMultiplier, boostDurationSeconds);
    }
}
