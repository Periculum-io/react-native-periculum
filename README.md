# react-native-periculum

Periculum library is a powerful & easy to use credit score library for Android.
The library gives you credit score information for your customer. No stress :)

## Badges
[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

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

&nbsp;

## Info
You need to have a [periculum](https://www.periculum.io/) account for this plugin to work. And also install the following packages for the plugin to work perfectly.

* react-native-device-info
* react-native-get-location
* react-native-get-sms-android
* react-native-permissions

&nbsp;

## Android Permissions
Please make sure you add the following android permissions in your AndroidManifest.xml file
```bash
<uses-permission android:name="android.permission.READ_SMS" />
<uses-permission android:name="android.permission.WRITE_SMS" />
<uses-permission android:name="android.permission.SEND_SMS" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
```
&nbsp;
## Usage periculum analytics

How to use the Periculum analytics method
```javascript
import React from 'react';
import {analytics} from 'react-native-periculum';

await analytics(authorization, reference, '08066518328', '0000000111')
	.then(result => {
		console.log({result});
	})
	.catch(error => {
		console.log({error});
	});
```

## Periculum analytics parameters 
| Name | Description  |
| ------ | ------ |
| authorization  | Required. API access token generated from periculum api|
| reference   | Required. unique statement reference	|
| customer mobile   | Required. customer phone number	|
| customer bvn   | Required. customer bvn	|

&nbsp;
&nbsp;

## Usage periculum affordability

How to use the Periculum analytics method
```javascript
import React from 'react';
import {analytics} from 'react-native-periculum';

affordability(authorization, 89, 0.2, 2).then(result => {
      console.log({result});
    })
    .catch(error => {
      console.log({error});
    })
```

## Periculum affordability parameters 
| Name | Description  |
| ------ | ------ |
| authorization  | Required. API access token generated from periculum api|
| reference   | Required. Unique statement reference	|
| DTI    | Required 	|
| Loan Tenure   | Required. Loan tenure 	|
&nbsp;
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)