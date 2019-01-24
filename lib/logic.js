/* eslint-disable require-jsdoc */
/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getParticipantRegistry getAssetRegistry getFactory */
'use strict';

async function processPayment(shipmentReceived) {
    const contract = shipmentReceived.shipment.contract;
    const shipment = shipmentReceived.shipment;

    let pay = contract.unitPrice * shipment.unitCount;

    logger('Received at: ' + shipmentReceived.timestamp);
    logger('Contract arrivalDateTime: ' + contract.arrivalTime);

    if (shipment.timestamp > contract.arrivalTime) {
        pay = 0;
        logger('Late shipment!');
    } else if (pay < 0) {
        pay = 0;
    }

    return {
        contract,
        pay,
    };
}

async function updateRecord(registry, data) {
    const updateRegistry = getReg(registry);
    return await updateRegistry.update(data);
}

async function getReg(namespace) {
    return await getParticipantRegistry('org.milleradulu.tee.' + namespace);
}

async function logger(message) {
    return console.log(message);
}

async function payFarmer(shipmentReceived) {
    const {contract, pay} = await processPayment(shipmentReceived);
    logger('Payout: ' + pay);
    contract.farmer.accountBalance += pay;
    contract.factory.accountBalance -= pay;

    logger('Farmer: ' + contract.farmer.$identifier + ' new balance: ' + contract.farmer.accountBalance);
    logger('Factory: ' + contract.factory.$identifier + ' new balance: ' + contract.factory.accountBalance);

    await updateRecord('TeaFarmer', contract.farmer);
    await updateRecord('TeaFactory', contract.factory);
}

async function payFactory(shipmentReceived) {
    const {contract, pay} = await processPayment(shipmentReceived);
    logger('Payout: ' + pay);
    contract.factory.accountBalance += pay;
    contract.shoppingCenter.accountBalance -= pay;

    logger('Factory: ' + contract.factory.$identifier + ' new balance: ' + contract.factory.accountBalance);
    logger('Shopping Center: ' + contract.shoppingCenter.$identifier + ' new balance: ' + contract.shoppingCenter.accountBalance);

    await updateRecord('Factory', contract.factory);
    await updateRecord('Shopping Center', contract.shoppingCenter);
}

async function setupDemo(setupDemo) {
    const factory = getFactory();
    const NS = 'org.milleradulu.tee';

    // Create a farmer
    const farmer = factory.newResource(NS, 'TeaFarmer', 'farm@farmer.com');
    const farmerName = factory.newResource(NS, 'UserName');
    farmerName.firstName = 'Miller';
    farmerName.lastName = 'Adulu';
    farmer.name = farmerName;
    farmer.phoneNumber = '254703175638';

    // Create a factory
    const teaFactory = factory.newResource(NS, 'TeaFactory', 'fac@factory.com');
    const factoryAddress = factory.newResource(NS, 'Address');
    factoryAddress.city = 'Nairobi';
    factoryAddress.county = 'Nairobi';
    factoryAddress.constituency = 'Dagoretti';
    factoryAddress.street = 'Macharia Road';

    teaFactory.name = 'PBK Factory';
    teaFactory.address = factoryAddress;

    // Create a shopping center
    const shoppingCenter = factory.newResource(NS, 'ShoppingCenter', 'shop@shop.com');
    const centerAddress = factory.newResource(NS, 'Address');
    centerAddress.city = 'Nairobi';
    centerAddress.county = 'Nairobi';
    centerAddress.constituency = 'Dagoretti';
    centerAddress.street = 'Macharia Road';

    shoppingCenter.name = 'PBK Shopping Center';
    shoppingCenter.address = centerAddress;

    // Create a contract
    const contract = factory.newResource(NS, 'Contract', 'CON_001');
    contract.farmer = factory.newRelationship(NS, 'TeaFarmer');
    contract.factory = factory.newRelationship(NS, 'TeaFactory');
    contract.shoppingCenter = factory.newRelationship(NS, 'ShoppingCenter');
    const tomorrow = setupDemo.timestamp;
    tomorrow.setDate(tomorrow.getDate() + 1);
    contract.arrivalTime = tomorrow;
    contract.unitPrice = 100;

    const shipment = factory.newResource(NS, 'TeaLeavesShipment', 'SHIP_001');
    shipment.unitCount = 200;
    shipment.contract = factory.newRelationship(NS, 'Contract', 'CON_001');

    addRec('TeaFarmer', farmer);
    addRec('TeaFactory', teaFactory);
    addRec('ShoppingCenter', shoppingCenter);
    addRec('Contract', contract);
    addRec('TeaLeavesShipment', shipment);
}

async function addRec(namespace, data) {
    const reg = getReg(namespace);
    return await reg.addAll([data]);
}