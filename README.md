# react-native-periculum

The package gives you credit score information for your customer. No stress :)

## Installation
Add react-native-periculum to your project by running;

Yarn

```bash
yarn add react-native-periculum
```
 NPM

```bash
npm install react-native-periculum
```

## Info
You need to have a [periculum](https://www.periculum.io/) account for this plugin to work. And also install the following packages for the plugin to work perfectly.

* react-native-device-info
* react-native-get-location
* react-native-get-sms-android
* react-native-permissions


## Usage

```javascript
import React from 'react';
import Periculum from 'react-native-periculum';

<Periculum
  authorization={token}
  options={{
    reference: reference,
    customer: {
     email: 'customer-email@example.com', //customer email
     mobile: '08066518328', // customer mobile
     bvn: '0000000111', // customer bvn
     nin: '0000000111', // customer nin
   },
   loanTenure: 2, // loan tenure...
   dti: 0.2,
  }}
  btnStyles={{backgroundColor: 'red', padding: 10}}
  callback={result => {
    console.log({result});
  }}
/>

```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)