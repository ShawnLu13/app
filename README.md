Big shout out to Ray Huang, Prof. Zhang and Prof. Liu, if you see this ;)

Created in Spring 2024 by Sheng Lu, Xilong Wu, Yujia Liang, Jiawen Liu, Tianrui Li and Jin Zheng

# README
```
This README provides a comprehensive guide to setting up and using Hyperledger Fabric for development purposes. It includes instructions for environment setup, network initialization, chaincode deployment, and running a sample application.
```

## Navigate to the Home Directory
```bash
# Change directory to /home/user
cd /home/user
```

## Manage Software Packages with `dpkg`
```bash
# Configure any packages that were unpacked but not yet configured
dpkg --configure -a
```

## Install Python and Set Default Version
```bash
# Install Python and Python distribution utilities
apt-get install python -y
apt-get install python3-distutils

# Set the default Python version to Python 3
update-alternatives --install /usr/bin/python python /usr/bin/python3 2

# Check the current Python version
python -V

# Note: You can change the Python version with the following command (Python 3.6.9 is recommended for this course)
# update-alternatives --config python
```

## Install `pip` and Manage Python Packages
```bash
# Download the get-pip.py file using wget
wget https://bootstrap.pypa.io/pip/3.5/get-pip.py 

# Execute the get-pip.py script to install pip
python get-pip.py

# Verify pip installation
pip --version 

# Uninstall the requests package
pip uninstall requests -y

# Install a specific version of the requests package
pip install requests==2.20.1

# Uninstall the six package
pip uninstall six -y

# Reinstall the six package with an updated version
pip install six==1.16.0
```

## Docker Installation
```bash
# Docker official documentation: https://docs.docker.com/install/linux/docker-ce/ubuntu/

# Install required packages for Docker
apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common

# Add the official GPG key for Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Verify the GPG key fingerprint for security
apt-key fingerprint 0EBFCD88

# Add the Docker repository to the system's APT sources
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Update the local package database
apt-get update

# Install Docker CE, CLI, and containerd
apt-get install docker-ce docker-ce-cli containerd.io

# Install docker-compose using pip
pip install docker-compose

# Install Node.js
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
apt-get install -y nodejs

# Install build-essential for compiling packages
apt install build-essential
```

## User Mode for user
To operate as the user `user`, use the following commands:
```bash
# switch to user
su - user

### User Environment Setup for user

```bash
# Create a new folder for npm-global
mkdir ~/.npm-global

# Set the npm global path
npm config set prefix '~/.npm-global'

# Modify the profile file to include the new npm path
vi .profile

# Add the following line at the end of the .profile file
export PATH=~/.npm-global/bin:$PATH

# Apply the changes to the environment
source ~/.profile
```

### Hyperledger Fabric Development Setup
```bash
# Create a directory for Hyperledger Fabric development
mkdir ~/fabric-dev-servers && cd ~/fabric-dev-servers

# Download Hyperledger Fabric v1.2 network helper scripts
curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.tar.gz

# Unpack the downloaded file
tar -xvf fabric-dev-servers.tar.gz

# Set the Hyperledger Fabric version and run the download script
export FABRIC_VERSION=hlfv12
./downloadFabric.sh

# Install a specific version of cryptography to avoid conflicts
pip show cryptography 
pip3 install cryptography==3.2

# Start the Hyperledger Fabric network
./startFabric.sh

# Stop the Hyperledger Fabric network
./stopFabric.sh

# List Docker containers
docker ps

# Return to the previous directory level
cd ..
```

### Hyperledger Fabric Samples and Chaincode
```bash
# Set the Hyperledger Fabric samples path
vi .profile  
export PATH=~/fabric-samples/bin:$PATH

# Apply the changes to the environment
source ~/.profile

# Navigate to the Hyperledger Fabric samples
cd fabric-samples

# List the contents of the samples directory
ls -lah 

# Navigate to the chaincode directory and prepare the usedcars chaincode (this traceability project is based on TA Ray's usedcars project as a template, big S/O to Ray if you see this)
cd chaincode
mkdir -p usedcars/go
cd usedcars/go
curl -o userdcars.go https://raw.githubusercontent.com/ShawnLu13/app/main/userdcars.go

# Verify the file upload
ls

# Check the usedcars.go file
vi userdcars.go
:q!

# Navigate to the first-network directory
cd ../../../first-network

# Modify the docker-compose-cli.yaml and base/peer-base.yaml for Go's pure-Go DNS resolver
vi docker-compose-cli.yaml
vi base/peer-base.yaml
# Add the environment variable GODEBUG=netdns=go

# Bring down the network if previously up
./byfn.sh down

# Clean up Docker containers
docker ps -qa | xargs docker stop
docker ps -qa | xargs docker rm

# Generate network initialization configuration
./byfn.sh generate

# Launch the Hyperledger Fabric network
./byfn.sh up

# Check running Docker containers
docker ps
docker ps -a --filter "name=cli"

# Enter the CLI container to install and manipulate chaincode
docker exec -it cli bash

# Set environment variables for the peer and install the usedcars chaincode
# Repeat the following set of commands for each organization's peer
peer chaincode install -n usedcars -p github.com/chaincode/usedcars/go/ -v 1.0

# Instantiate the usedcars chaincode on the channel
peer chaincode instantiate -o orderer.example.com:7050 --tls --cafile <path to cafile> -C mychannel -n usedcars -v 1.0 -c '{"Args":["ProductID"]}' -P "OR ('Org1MSP.peer','Org2MSP.peer')"

# List the instantiated chaincodes on the channel
peer chaincode list --instantiated -C mychannel

# Exit the CLI container
exit

# Navigate to the first-network directory and clone the app repository
cd /home/user/fabric-samples/first-network/
git clone https://github.com/ShawnLu13/app.git 
cd app
npm install

# Start the app on port 3009
PORT=3009 npm start

# Access the web application by opening localhost:3009 in a web browser
```


## Notes
- Ensure you have the necessary permissions to execute these commands, using `sudo` if required.
- Replace `$(lsb_release -cs)` with your Ubuntu version codename if necessary.
- Always verify the authenticity of downloaded scripts and keys to maintain system security.
- The `peer chaincode` commands are documented at [Hyperledger Fabric documentation](https://hyperledger-fabric.readthedocs.io/en/release-1.4/commands/peerchaincode.html).
```
