'use strict'

const Registry = artifacts.require('Registry.sol')
const GovImp = artifacts.require('GovImp.sol')
const Gov = artifacts.require('Gov.sol')
const Staking = artifacts.require('Staking.sol')

const fs = require('fs')

//TODO deploy script clean up
async function deploy(deployer, network, accounts) {
    let registry, govImp, gov, staking, govDelegator
    deployer.then(async () => {
        [registry, govImp, gov, staking] = await deployContracts(deployer, network, accounts)
        await basicRegistrySetup(deployer, network, accounts, registry, govImp, gov, staking)
        await writeToContractsJson(registry, govImp, gov, staking)
    })
}

async function deployContracts(deployer, network, accounts) {
    //proxy create metaID instead user for now. Because users do not have enough fee.
    let registry, govImp, gov, staking

    registry = await deployer.deploy(Registry)
    staking = await deployer.deploy(Staking, registry.address)
    govImp = await deployer.deploy(GovImp)
    gov = await deployer.deploy(Gov)

    return [registry, govImp, gov, staking]
}

async function basicRegistrySetup(deployer, network, accounts, registry, govImp, gov, staking) {
    await registry.setContractDomain("Staking", staking.address)
    await registry.setContractDomain("GovernanceContract", gov.address)
}

async function writeToContractsJson(registry, govImp, gov, staking) {
    console.log(`Writing Contract Address To contracts.json`)

    let contractData = {}
    contractData["REGISTRY_ADDRESS"] = registry.address
    contractData["STAKING_ADDRESS"] = staking.address
    contractData["GOV_IMP_ADDRESS"] = govImp.address
    contractData["GOV_ADDRESS"] = gov.address

    fs.writeFile('contracts.json', JSON.stringify(contractData), 'utf-8', function (e) {
        if (e) {
            console.log(e);
        } else {
            console.log('contracts.json updated!');
        }
    });
}

module.exports = deploy