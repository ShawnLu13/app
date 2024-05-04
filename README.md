Created in Spring 2024 by Sheng Lu, Xilong Wu, Yujia Liang, Jiawen Liu, Tianrui Li and Jin Zheng :)

We would like to extend our sincerest gratitude to the TA Ray Huang and instructors Prof. Zhang and Prof. Liu, whose guidance and support have been instrumental throughout the course and this project. Their willingness to provide feedback and direction has helped us overcome many challenges and has undoubtedly enhanced the quality of our work.

```markdown
# README

## Navigate to the Home Directory
```bash
# Change directory to /home/sheng
cd /home/sheng
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

## Notes
- Ensure you have the necessary permissions to execute these commands, using `sudo` if required.
- Replace `$(lsb_release -cs)` with your Ubuntu version codename if necessary.
- Always verify the authenticity of downloaded scripts and keys to maintain system security.
```
