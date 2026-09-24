// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

/// @notice On-chain rules and accounting for the Loanch MVP.
contract LoanchPool is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 public constant BPS = 10_000;
    uint256 public constant DEFAULT_WEIGHT_BPS = BPS;
    uint256 public constant MIN_WEIGHT_BPS = 5_000;
    uint256 public constant MAX_WEIGHT_BPS = 20_000;
    uint256 public constant STAKE_BPS = 500;
    uint256 public constant MAX_LOAN_BPS = 5_000;
    uint256 public constant MIN_DURATION = 1 days;
    uint256 public constant MAX_DURATION = 365 days;
    uint256 public constant MIN_REPUTATION = 20;
    uint256 public constant INITIAL_REPUTATION = 50;
    uint256 public constant LOAN_MARGIN_BPS = 1_000;
    uint256 public constant REWARD_PRECISION = 1e27;
    uint256 public constant DEFAULT_GRACE_PERIOD = 7 days;

    IERC20 public immutable asset;
    uint256 public reserveBps;
    uint256 public totalShares;
    uint256 public totalWeightedShares;
    uint256 public saverPrincipalClaims;
    uint256 public liquidityReserveTarget;
    uint256 public riskThreshold = 60;
    uint256 public saverBps = 8_000;
    uint256 public platformBps = 1_500;
    uint256 public reserveReturnBps = 500;
    uint256 public totalLockedStake;
    uint256 public activeLoanPrincipal;
    uint256 public activeLoanCount;
    uint256 public loanCount;
    uint256 public saverReturnLiability;
    uint256 public platformRevenue;
    uint256 public lossReserveAmount;
    uint256 public accReturnPerWeightedShare;
    mapping(address borrower => uint256 loanId) public activeLoanId;
    mapping(address borrower => uint256 amount) public freeStake;
    mapping(address borrower => uint256 amount) public allocatedStake;

    enum Eligibility { Eligible, NotVerified, RiskTooLow, ReputationTooLow, BorrowerBlocked,
        InvalidAmount, InvalidDuration, ActiveLoanExists, InsufficientStake, InsufficientLiquidity }

    enum LoanStatus { None, Active, Completed, Defaulted }

    struct Loan {
        uint256 id;
        address borrower;
        uint256 principal;
        uint256 principalOutstanding;
        uint256 totalRepayment;
        uint256 amountPaid;
        uint256 dueDate;
        uint256 stakeAmount;
        LoanStatus status;
    }

    mapping(uint256 loanId => Loan loan) private loans;

    struct DefaultLoss {
        uint256 unpaidPrincipal;
        uint256 stakeUsed;
        uint256 reserveUsed;
        uint256 saverLoss;
        uint256 stakeReturned;
    }

    mapping(uint256 loanId => DefaultLoss loss) public defaultLosses;

    mapping(address user => bool verified) public identityVerified;

    struct BorrowerProfile {
        uint256 riskScore;
        uint256 reputation;
        bool blockedAfterDefault;
    }

    mapping(address user => BorrowerProfile profile) private borrowerProfiles;

    struct SaverPosition {
        uint256 shares;
        uint256 weightBps;
        uint256 weightedShares;
        uint256 rewardDebt;
        uint256 pendingReturnScaled;
    }

    struct SaverPositionView {
        uint256 shares;
        uint256 weightBps;
        uint256 weightedShares;
        uint256 principalClaim;
        uint256 claimableReturn;
    }

    struct PoolStats {
        uint256 totalShares;
        uint256 totalWeightedShares;
        uint256 saverPrincipalClaims;
        uint256 liquidPoolAssets;
        uint256 liquidityReserveTarget;
        uint256 availableLending;
        uint256 activeLoanPrincipal;
        uint256 activeLoanCount;
        uint256 lockedStake;
        uint256 saverReturnLiability;
        uint256 platformRevenue;
        uint256 lossReserveAmount;
    }

    mapping(address saver => SaverPosition position) private saverPositions;

    error InvalidAsset();
    error InvalidReserveRatio();
    error InvalidScore();
    error InvalidDistribution();
    error InvalidWeight();
    error IdentityNotVerified();
    error ZeroDeposit();
    error ZeroAmount();
    error ZeroShares();
    error ZeroWeightedShares();
    error ZeroPrincipalSharePrice();
    error UnsupportedTokenTransfer();
    error InsufficientPrincipal();
    error InsufficientLiquidity();
    error InsufficientStake();
    error LoanNotEligible(Eligibility reason);
    error InvalidLoanState();
    error NotBorrower();
    error Overpayment();
    error NothingToClaim();
    error GracePeriodActive();
    error InsufficientPlatformRevenue();

    event IdentityVerificationUpdated(address indexed user, bool verified);
    event ReserveBpsUpdated(uint256 oldReserveBps, uint256 newReserveBps);
    event BorrowerRiskScoreUpdated(address indexed user, uint256 score);
    event RiskThresholdUpdated(uint256 oldScore, uint256 newScore);
    event DistributionBpsUpdated(uint256 saver, uint256 platform, uint256 reserve);
    event SaverWeightUpdated(address indexed user, uint256 oldWeightBps, uint256 newWeightBps);
    event Deposited(address indexed saver, uint256 amount);
    event Withdrawn(address indexed saver, uint256 amount);
    event StakeLocked(address indexed borrower, uint256 amount);
    event StakeUnlocked(address indexed borrower, uint256 amount);
    event LoanRequested(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event LoanDisbursed(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event LoanRepaid(uint256 indexed loanId, uint256 amount, uint256 remainingDebt);
    event LoanCompleted(uint256 indexed loanId);
    event ReturnDistributed(uint256 indexed loanId, uint256 saverAmount, uint256 platformAmount, uint256 reserveAmount);
    event SaverReturnRedirected(uint256 indexed loanId, uint256 amount);
    event ReturnClaimed(address indexed saver, uint256 amount);
    event LoanDefaulted(uint256 indexed loanId, uint256 unpaidPrincipal);
    event StakeSlashed(uint256 indexed loanId, uint256 amount);
    event ReserveUsed(uint256 indexed loanId, uint256 amount);
    event SaverLossRecognized(uint256 indexed loanId, uint256 amount);
    event ReputationPenalized(address indexed borrower, uint256 newScore);
    event PlatformRevenueWithdrawn(address indexed recipient, uint256 amount);

    constructor(address asset_, uint256 reserveBps_) Ownable(msg.sender) {
        if (asset_ == address(0) || asset_.code.length == 0) revert InvalidAsset();
        if (reserveBps_ > BPS) revert InvalidReserveRatio();

        asset = IERC20(asset_);
        reserveBps = reserveBps_;
    }

    /// @dev Only a verification result is stored on-chain, not identity data.
    function setIdentityVerification(address user, bool verified) external onlyOwner {
        identityVerified[user] = verified;
        if (verified && borrowerProfiles[user].reputation == 0 && !borrowerProfiles[user].blockedAfterDefault) {
            borrowerProfiles[user].reputation = INITIAL_REPUTATION;
        }
        emit IdentityVerificationUpdated(user, verified);
    }

    function setBorrowerRiskScore(address user, uint256 score) external onlyOwner {
        if (score > 100) revert InvalidScore();
        borrowerProfiles[user].riskScore = score;
        emit BorrowerRiskScoreUpdated(user, score);
    }

    function setRiskThreshold(uint256 score) external onlyOwner {
        if (score > 100) revert InvalidScore();
        uint256 oldScore = riskThreshold;
        riskThreshold = score;
        emit RiskThresholdUpdated(oldScore, score);
    }

    function setDistributionBps(uint256 saver, uint256 platform, uint256 reserve) external onlyOwner {
        if (saver > BPS || platform > BPS || reserve > BPS || saver + platform + reserve != BPS) {
            revert InvalidDistribution();
        }
        saverBps = saver;
        platformBps = platform;
        reserveReturnBps = reserve;
        emit DistributionBpsUpdated(saver, platform, reserve);
    }

    function getBorrowerProfile(address user) external view returns (BorrowerProfile memory) {
        BorrowerProfile memory profile = borrowerProfiles[user];
        if (profile.reputation == 0 && !profile.blockedAfterDefault) {
            profile.reputation = INITIAL_REPUTATION;
        }
        return profile;
    }

    function getLoan(uint256 loanId) external view returns (Loan memory) {
        return loans[loanId];
    }

    function remainingDebt(uint256 loanId) public view returns (uint256) {
        Loan storage loan = loans[loanId];
        return loan.totalRepayment - loan.amountPaid;
    }

    function setReserveBps(uint256 newReserveBps) external onlyOwner {
        if (newReserveBps > BPS) revert InvalidReserveRatio();
        uint256 oldReserveBps = reserveBps;
        reserveBps = newReserveBps;
        liquidityReserveTarget = Math.mulDiv(saverPrincipalClaims, newReserveBps, BPS);
        emit ReserveBpsUpdated(oldReserveBps, newReserveBps);
    }

    function liquidPoolAssets() public view returns (uint256) {
        uint256 balance = asset.balanceOf(address(this));
        return balance > totalLockedStake ? balance - totalLockedStake : 0;
    }

    function availableLending() public view returns (uint256) {
        uint256 liquidAssets = _poolSpendable();
        return liquidAssets > liquidityReserveTarget ? liquidAssets - liquidityReserveTarget : 0;
    }

    function _poolSpendable() internal view returns (uint256) {
        uint256 liquid = liquidPoolAssets();
        uint256 segregated = lossReserveAmount + saverReturnLiability + platformRevenue;
        return liquid > segregated ? liquid - segregated : 0;
    }

    function claimableReturn(address saver) public view returns (uint256) {
        SaverPosition storage position = saverPositions[saver];
        uint256 accruedScaled = position.pendingReturnScaled +
            position.weightedShares * accReturnPerWeightedShare - position.rewardDebt;
        return accruedScaled / REWARD_PRECISION;
    }

    function getSaverPosition(address saver) external view returns (SaverPositionView memory position) {
        SaverPosition memory stored = saverPositions[saver];
        position.shares = stored.shares;
        position.weightBps = stored.weightBps;
        position.weightedShares = stored.weightedShares;
        position.claimableReturn = claimableReturn(saver);
        if (totalShares != 0) {
            position.principalClaim = Math.mulDiv(stored.shares, saverPrincipalClaims, totalShares);
        }
    }

    function getPoolStats() external view returns (PoolStats memory stats) {
        stats.totalShares = totalShares;
        stats.totalWeightedShares = totalWeightedShares;
        stats.saverPrincipalClaims = saverPrincipalClaims;
        stats.liquidPoolAssets = liquidPoolAssets();
        stats.liquidityReserveTarget = liquidityReserveTarget;
        stats.availableLending = availableLending();
        stats.activeLoanPrincipal = activeLoanPrincipal;
        stats.activeLoanCount = activeLoanCount;
        stats.lockedStake = totalLockedStake;
        stats.saverReturnLiability = saverReturnLiability;
        stats.platformRevenue = platformRevenue;
        stats.lossReserveAmount = lossReserveAmount;
    }

    function withdrawablePrincipal(address saver) public view returns (uint256) {
        if (totalShares == 0) return 0;
        uint256 claim = Math.mulDiv(saverPositions[saver].shares, saverPrincipalClaims, totalShares);
        uint256 liquid = _poolSpendable();
        return claim < liquid ? claim : liquid;
    }

    function requiredStake(uint256 amount) public pure returns (uint256) {
        return Math.mulDiv(amount, STAKE_BPS, BPS, Math.Rounding.Ceil);
    }

    function previewLoan(address user, uint256 amount, uint256 duration)
        public view returns (Eligibility reason, uint256 stakeRequired)
    {
        stakeRequired = requiredStake(amount);
        BorrowerProfile storage profile = borrowerProfiles[user];
        if (profile.blockedAfterDefault) return (Eligibility.BorrowerBlocked, stakeRequired);
        if (profile.riskScore < riskThreshold) return (Eligibility.RiskTooLow, stakeRequired);
        uint256 reputation = profile.reputation == 0 ? INITIAL_REPUTATION : profile.reputation;
        if (reputation < MIN_REPUTATION) return (Eligibility.ReputationTooLow, stakeRequired);
        if (amount == 0 || amount > Math.mulDiv(saverPrincipalClaims, MAX_LOAN_BPS, BPS)) {
            return (Eligibility.InvalidAmount, stakeRequired);
        }
        if (duration < MIN_DURATION || duration > MAX_DURATION) {
            return (Eligibility.InvalidDuration, stakeRequired);
        }
        if (activeLoanId[user] != 0) return (Eligibility.ActiveLoanExists, stakeRequired);
        if (freeStake[user] < stakeRequired) return (Eligibility.InsufficientStake, stakeRequired);
        if (amount > availableLending()) return (Eligibility.InsufficientLiquidity, stakeRequired);
        return (Eligibility.Eligible, stakeRequired);
    }

    function setSaverWeight(address user, uint256 newWeightBps) external onlyOwner {
        if (newWeightBps < MIN_WEIGHT_BPS || newWeightBps > MAX_WEIGHT_BPS) revert InvalidWeight();
        SaverPosition storage position = saverPositions[user];
        _settleReturn(position);
        uint256 oldWeightBps = position.weightBps == 0 ? DEFAULT_WEIGHT_BPS : position.weightBps;
        uint256 oldWeightedShares = position.weightedShares;
        uint256 newWeightedShares = Math.mulDiv(position.shares, newWeightBps, BPS);
        if (position.shares != 0 && newWeightedShares == 0) revert ZeroWeightedShares();
        position.weightBps = newWeightBps;
        position.weightedShares = newWeightedShares;
        position.rewardDebt = newWeightedShares * accReturnPerWeightedShare;
        totalWeightedShares = totalWeightedShares - oldWeightedShares + newWeightedShares;
        emit SaverWeightUpdated(user, oldWeightBps, newWeightBps);
    }

    function deposit(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroDeposit();

        uint256 mintedShares;
        if (totalShares == 0) {
            mintedShares = amount;
        } else {
            if (saverPrincipalClaims == 0) revert ZeroPrincipalSharePrice();
            mintedShares = Math.mulDiv(amount, totalShares, saverPrincipalClaims);
            if (mintedShares == 0) revert ZeroShares();
        }

        SaverPosition storage position = saverPositions[msg.sender];
        _settleReturn(position);
        uint256 previousWeightedShares = position.weightedShares;
        if (position.weightBps == 0) position.weightBps = DEFAULT_WEIGHT_BPS;
        position.shares += mintedShares;
        position.weightedShares = Math.mulDiv(position.shares, position.weightBps, BPS);
        position.rewardDebt = position.weightedShares * accReturnPerWeightedShare;
        if (position.weightedShares == 0) revert ZeroWeightedShares();

        totalShares += mintedShares;
        totalWeightedShares += position.weightedShares - previousWeightedShares;
        saverPrincipalClaims += amount;
        liquidityReserveTarget = Math.mulDiv(saverPrincipalClaims, reserveBps, BPS);

        _transferIn(msg.sender, amount);

        emit Deposited(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        if (saverPrincipalClaims == 0 && totalShares != 0) revert ZeroPrincipalSharePrice();
        SaverPosition storage position = saverPositions[msg.sender];
        uint256 claim = totalShares == 0 ? 0 : Math.mulDiv(position.shares, saverPrincipalClaims, totalShares);
        if (amount > claim) revert InsufficientPrincipal();
        if (amount > _poolSpendable()) revert InsufficientLiquidity();

        uint256 burnedShares = Math.mulDiv(amount, totalShares, saverPrincipalClaims, Math.Rounding.Ceil);
        _settleReturn(position);
        uint256 oldWeightedShares = position.weightedShares;
        position.shares -= burnedShares;
        position.weightedShares = Math.mulDiv(position.shares, position.weightBps, BPS);
        position.rewardDebt = position.weightedShares * accReturnPerWeightedShare;
        if (position.shares != 0 && position.weightedShares == 0) revert ZeroWeightedShares();
        totalShares -= burnedShares;
        totalWeightedShares = totalWeightedShares - oldWeightedShares + position.weightedShares;
        saverPrincipalClaims -= amount;
        liquidityReserveTarget = Math.mulDiv(saverPrincipalClaims, reserveBps, BPS);

        _transferOut(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    function stake(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        freeStake[msg.sender] += amount;
        totalLockedStake += amount;
        _transferIn(msg.sender, amount);
        emit StakeLocked(msg.sender, amount);
    }

    function unstake(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        if (amount > freeStake[msg.sender]) revert InsufficientStake();
        freeStake[msg.sender] -= amount;
        totalLockedStake -= amount;
        _transferOut(msg.sender, amount);
        emit StakeUnlocked(msg.sender, amount);
    }

    function requestLoan(uint256 amount, uint256 duration) external nonReentrant returns (uint256 loanId) {
        (Eligibility reason, uint256 stakeRequired) = previewLoan(msg.sender, amount, duration);
        if (reason != Eligibility.Eligible) revert LoanNotEligible(reason);
        if (borrowerProfiles[msg.sender].reputation == 0) {
            borrowerProfiles[msg.sender].reputation = INITIAL_REPUTATION;
        }

        loanId = ++loanCount;
        freeStake[msg.sender] -= stakeRequired;
        allocatedStake[msg.sender] += stakeRequired;
        activeLoanId[msg.sender] = loanId;
        activeLoanPrincipal += amount;
        activeLoanCount++;
        loans[loanId] = Loan({
            id: loanId,
            borrower: msg.sender,
            principal: amount,
            principalOutstanding: amount,
            totalRepayment: amount + Math.mulDiv(amount, LOAN_MARGIN_BPS, BPS),
            amountPaid: 0,
            dueDate: block.timestamp + duration,
            stakeAmount: stakeRequired,
            status: LoanStatus.Active
        });

        emit LoanRequested(loanId, msg.sender, amount);
        _transferOut(msg.sender, amount);
        emit LoanDisbursed(loanId, msg.sender, amount);
    }

    function repayLoan(uint256 loanId, uint256 amount) external nonReentrant {
        Loan storage loan = loans[loanId];
        if (loan.status != LoanStatus.Active) revert InvalidLoanState();
        if (msg.sender != loan.borrower) revert NotBorrower();
        if (amount == 0) revert ZeroAmount();
        uint256 debt = remainingDebt(loanId);
        if (amount > debt) revert Overpayment();

        uint256 principalPaid = amount < loan.principalOutstanding ? amount : loan.principalOutstanding;
        uint256 marginPaid = amount - principalPaid;
        loan.principalOutstanding -= principalPaid;
        loan.amountPaid += amount;
        activeLoanPrincipal -= principalPaid;
        if (marginPaid != 0) _distributeReturn(loanId, marginPaid);

        if (loan.amountPaid == loan.totalRepayment) {
            loan.status = LoanStatus.Completed;
            activeLoanId[loan.borrower] = 0;
            activeLoanCount--;
            allocatedStake[loan.borrower] -= loan.stakeAmount;
            totalLockedStake -= loan.stakeAmount;
        }

        _transferIn(msg.sender, amount);
        emit LoanRepaid(loanId, amount, remainingDebt(loanId));
        if (loan.status == LoanStatus.Completed) {
            _transferOut(msg.sender, loan.stakeAmount);
            emit StakeUnlocked(msg.sender, loan.stakeAmount);
            BorrowerProfile storage profile = borrowerProfiles[msg.sender];
            profile.reputation = profile.reputation > 95 ? 100 : profile.reputation + 5;
            emit LoanCompleted(loanId);
        }
    }

    function _distributeReturn(uint256 loanId, uint256 margin) internal {
        uint256 saverAmount = Math.mulDiv(margin, saverBps, BPS);
        uint256 platformAmount = Math.mulDiv(margin, platformBps, BPS);
        uint256 reserveAmount = margin - saverAmount - platformAmount;
        platformRevenue += platformAmount;
        if (totalWeightedShares == 0) {
            reserveAmount += saverAmount;
            emit SaverReturnRedirected(loanId, saverAmount);
            saverAmount = 0;
        } else {
            accReturnPerWeightedShare += Math.mulDiv(saverAmount, REWARD_PRECISION, totalWeightedShares);
            saverReturnLiability += saverAmount;
        }
        lossReserveAmount += reserveAmount;
        emit ReturnDistributed(loanId, saverAmount, platformAmount, reserveAmount);
    }

    function claimReturn() external nonReentrant {
        SaverPosition storage position = saverPositions[msg.sender];
        _settleReturn(position);
        uint256 amount = position.pendingReturnScaled / REWARD_PRECISION;
        if (amount == 0) revert NothingToClaim();
        if (liquidPoolAssets() < lossReserveAmount + platformRevenue + saverReturnLiability) {
            revert InsufficientLiquidity();
        }
        position.pendingReturnScaled %= REWARD_PRECISION;
        saverReturnLiability -= amount;
        _transferOut(msg.sender, amount);
        emit ReturnClaimed(msg.sender, amount);
    }

    function withdrawPlatformRevenue(address recipient, uint256 amount) external onlyOwner nonReentrant {
        if (recipient == address(0)) revert InvalidAsset();
        if (amount == 0) revert ZeroAmount();
        if (amount > platformRevenue) revert InsufficientPlatformRevenue();
        if (liquidPoolAssets() < lossReserveAmount + saverReturnLiability + platformRevenue) {
            revert InsufficientLiquidity();
        }
        platformRevenue -= amount;
        _transferOut(recipient, amount);
        emit PlatformRevenueWithdrawn(recipient, amount);
    }

    function markDefault(uint256 loanId) external nonReentrant {
        Loan storage loan = loans[loanId];
        if (loan.status != LoanStatus.Active || remainingDebt(loanId) == 0) revert InvalidLoanState();
        if (block.timestamp <= loan.dueDate + DEFAULT_GRACE_PERIOD) revert GracePeriodActive();

        uint256 unpaidPrincipal = loan.principalOutstanding;
        uint256 stakeUsed = loan.stakeAmount < unpaidPrincipal ? loan.stakeAmount : unpaidPrincipal;
        uint256 afterStake = unpaidPrincipal - stakeUsed;
        uint256 reserveUsed = lossReserveAmount < afterStake ? lossReserveAmount : afterStake;
        uint256 saverLoss = afterStake - reserveUsed;
        uint256 stakeReturned = loan.stakeAmount - stakeUsed;

        loan.status = LoanStatus.Defaulted;
        activeLoanId[loan.borrower] = 0;
        activeLoanCount--;
        activeLoanPrincipal -= unpaidPrincipal;
        allocatedStake[loan.borrower] -= loan.stakeAmount;
        totalLockedStake -= loan.stakeAmount;
        lossReserveAmount -= reserveUsed;
        saverPrincipalClaims -= saverLoss;
        liquidityReserveTarget = Math.mulDiv(saverPrincipalClaims, reserveBps, BPS);
        defaultLosses[loanId] = DefaultLoss(unpaidPrincipal, stakeUsed, reserveUsed, saverLoss, stakeReturned);

        BorrowerProfile storage profile = borrowerProfiles[loan.borrower];
        profile.reputation = profile.reputation > 20 ? profile.reputation - 20 : 0;
        profile.blockedAfterDefault = true;

        emit LoanDefaulted(loanId, unpaidPrincipal);
        emit StakeSlashed(loanId, stakeUsed);
        emit ReserveUsed(loanId, reserveUsed);
        emit SaverLossRecognized(loanId, saverLoss);
        emit ReputationPenalized(loan.borrower, profile.reputation);
        if (stakeReturned != 0) {
            _transferOut(loan.borrower, stakeReturned);
            emit StakeUnlocked(loan.borrower, stakeReturned);
        }
    }

    function _settleReturn(SaverPosition storage position) internal {
        position.pendingReturnScaled +=
            position.weightedShares * accReturnPerWeightedShare - position.rewardDebt;
        position.rewardDebt = position.weightedShares * accReturnPerWeightedShare;
    }

    function _transferIn(address from, uint256 amount) internal {
        uint256 balanceBefore = asset.balanceOf(address(this));
        asset.safeTransferFrom(from, address(this), amount);
        uint256 balanceAfter = asset.balanceOf(address(this));
        if (balanceAfter < balanceBefore || balanceAfter - balanceBefore != amount) {
            revert UnsupportedTokenTransfer();
        }
    }

    function _transferOut(address to, uint256 amount) internal {
        uint256 balanceBefore = asset.balanceOf(address(this));
        uint256 recipientBefore = asset.balanceOf(to);
        asset.safeTransfer(to, amount);
        uint256 balanceAfter = asset.balanceOf(address(this));
        uint256 recipientAfter = asset.balanceOf(to);
        if (balanceAfter > balanceBefore || balanceBefore - balanceAfter != amount ||
            recipientAfter < recipientBefore || recipientAfter - recipientBefore != amount) {
            revert UnsupportedTokenTransfer();
        }
    }
}
