import assertRevert from './helpers/assertRevert'
import EVMRevert from './helpers/EVMRevert'

const BigNumber = web3.BigNumber

require('chai').use(require('chai-as-promised')).use(require('chai-bignumber')(BigNumber)).should()

const Registry = artifacts.require('Registry.sol')
const AttestationAgencyRegistry = artifacts.require('AttestationAgencyRegistry.sol')

contract('Attestation Agency Registry', function ([deployer, identity1, aa1, aa2, user2, issuer1, issuer2, issuer3, proxy1]) {
    let registry, aaRegistry

    beforeEach(async () => {

    });
    describe('When Registry initiated,', function () {
        beforeEach(async () => {
            registry = await Registry.new()
            aaRegistry = await AttestationAgencyRegistry.new()

            await registry.setContractDomain("AttestationAgencyRegistry", aaRegistry.address)
            await aaRegistry.setRegistry(registry.address)

        });
        describe('Permissioned User', function () {
            beforeEach(async () => {
                await registry.setPermission("AttestationAgencyRegistry", proxy1, "true")
            });

            it('can register the specific user to Attestation Agency', async () => {
                // register aa
                await aaRegistry.registerAttestationAgency(aa1, 'metadiumAA', 'metadiumAADes', { from: proxy1 })
            });

            it('can update the specific user to Attestation Agency', async () => {
                // register aa
                await aaRegistry.registerAttestationAgency(aa1, 'metadiumAA', 'metadiumAADes', { from: proxy1 })
                // update aa
                await aaRegistry.updateAttestationAgency(aa1, 'metadiumBB', 'metadiumBBDes', { from: proxy1 })
                let [addr, title, expl, createdAt] = await aaRegistry.getAttestationAgencySingle(1)

                assert.equal(title, '0x6d6574616469756d424200000000000000000000000000000000000000000000')
                assert.equal(expl, '0x6d6574616469756d424244657300000000000000000000000000000000000000')

            });

        });

        describe('Non-Permissioned User', function () {
            beforeEach(async () => {

            });

            it('CANNOT register the specific user to Attestation Agency', async () => {
                //register aa -> fail
                await assertRevert(aaRegistry.registerAttestationAgency(aa1, 'metadiumAA', 'metadiumAADes', { from: proxy1 }))
            });

            it('CANNOT update the specific user to Attestation Agency', async () => {
                //register aa -> success
                await registry.setPermission("AttestationAgencyRegistry", proxy1, "true")
                await aaRegistry.registerAttestationAgency(aa1, 'metadiumAA', 'metadiumAADes', { from: proxy1 })

                //update aa -> fail
                await assertRevert(aaRegistry.updateAttestationAgency(aa1, 'metadiumBB', 'metadiumBBDes', { from: user2 }))

            });

        });

        describe('Any User', function () {
            beforeEach(async () => {
                await registry.setPermission("AttestationAgencyRegistry", proxy1, "true")
                await aaRegistry.registerAttestationAgency(aa1, 'metadiumBB', 'metadiumBBDes', { from: proxy1 })
            });
            it('can check AA is registered', async () => {
                let num = await aaRegistry.isRegistered(aa1)
                assert.equal(num, 1)
            });
            it('can can get AA info', async () => {
                let [addr, title, expl, createdAt] = await aaRegistry.getAttestationAgencySingle(1)

                assert.equal(title, '0x6d6574616469756d424200000000000000000000000000000000000000000000')
                assert.equal(expl, '0x6d6574616469756d424244657300000000000000000000000000000000000000')
            });
        })
    })

});
