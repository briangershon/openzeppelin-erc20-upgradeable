import { expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import hre from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract } from 'ethers';

describe('MyToken', function () {
    let contract: Contract;
    let owner: SignerWithAddress;
    let otherUser: SignerWithAddress;

    beforeEach(async function () {
        const Contract = await hre.ethers.getContractFactory('MyToken');

        const [_owner, _otherUser] = await hre.ethers.getSigners();
        owner = _owner;
        otherUser = _otherUser;

        contract = await upgrades.deployProxy(Contract);
        await contract.deployed();
    });

    describe('owner', function () {
        it('should be able to mint', async () => {
            await contract.mint(
                otherUser.address,
                hre.ethers.utils.parseEther('1.0')
            );
            await expect(await contract.balanceOf(otherUser.address)).to.equal(
                hre.ethers.utils.parseEther('1.0')
            );
        });
    });

    describe('non-owner', function () {
        it('should not be able to mint', async () => {
            await expect(
                contract
                    .connect(otherUser)
                    .mint(otherUser.address, hre.ethers.utils.parseEther('1.0'))
            ).to.be.revertedWith(
                'AccessControl: account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 is missing role 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6'
            );
        });
    });
});
