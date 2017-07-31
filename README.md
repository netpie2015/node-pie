# Node-PIE
A flow-based programming tool powered by Node-RED.

## Installation

To install node-pie, Node.js is required. Run the following command in your command terminal (you may need to sudo):

```
npm install node-pie -g
```

## Running

To run use the folowing command:

```
node-pie
```

The application will be running in foreground. If you want to run as a daemon, please use pm2.

```
npm install pm2 -g
pm2 start node-pie
```
