# tee

## Introduction
A Hyperledger Composer blockchain application to enable proper tracking of tea produce from farmers to shopping centers

## Installation

1. Install the [Hyperledger Dev environment](https://hyperledger.github.io/composer/latest/installing/development-tools.html) and start the Fabric

2. Clone this repository from Github

``` git clone https://github.com/MillerAdulu/tee.git ```

3. Install the business network

``` composer network install --card PeerAdmin@hlfv1 --archiveFile tee@0.0.1.bna ```

4. Start the business network

``` composer network start --networkName tee --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card ```

5. Check that the business network has been deployed successfully by pinging it

``` composer network ping --card admin@tee ```

6. Generate the REST API

``` composer-rest-server ```

- `Enter the name of the business network card to use: admin@tee`
- `Specify if you want namespaces in the generated REST API: never use namespaces`
- `Specify if you want to use an API key to secure the REST API: N`
- `Specify if you want to enable authentication for the REST API using Passport: N`
- `Specify if you want to enable the explorer test interface: Y`
- `Specify a key if you want to enable dynamic logging: ENTER KEY`
- ` Specify if you want to enable event publication over WebSockets: Y`
- `Specify if you want to enable TLS security for the REST API: N`

- Browse the REST API at: `http://localhost:3000/explorer`

### Optional

7. Generate a skeleton angular application

``` yo hyperledger-composer:angular ```

- Select `Yes` when asked to connect to running business network.

- Enter standard package.json questions (project name, description, author name, author email, license)

- Enter `admin@tee` network for the business network card.

- Select `Connect to an existing REST API`

- Enter `http://localhost` for the REST server address.

- Enter `3000` for server port.

- Select `Namespaces are not used`