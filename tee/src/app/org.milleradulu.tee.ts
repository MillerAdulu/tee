import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.milleradulu.tee{
   export class TeaFarmer extends Participant {
      email: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      accountBalance: number;
   }
   export class TeaFactory extends Participant {
      email: string;
      name: string;
      city: string;
      county: string;
      constituency: string;
      street: string;
      accountBalance: number;
   }
   export class ShoppingCenter extends Participant {
      email: string;
      name: string;
      city: string;
      county: string;
      constituency: string;
      street: string;
      accountBalance: number;
   }
   export class TeaLeavesShipment extends Asset {
      shipmentId: string;
      contract: Contract;
      unitCount: number;
   }
   export class Contract extends Asset {
      contractId: string;
      farmer: TeaFarmer;
      factory: TeaFactory;
      shoppingCenter: ShoppingCenter;
      arrivalTime: Date;
      unitPrice: number;
   }
   export class TeaLeavesShipmentReceived extends Transaction {
      shipment: TeaLeavesShipment;
   }
   export class SetupDemo extends Transaction {
   }
// }
