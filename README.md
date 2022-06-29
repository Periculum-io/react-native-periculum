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

- react-native-device-info
- react-native-get-location
- react-native-get-sms-android
- react-native-permissions

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
import {analyticsRequestV1} from 'react-native-periculum';

await analyticsRequestV1(publicKey, statementName, customerMobile, customerBvn)
  .then(result => {
    console.log({result});
  })
  .catch(error => {
    console.log({error});
  });
```

## Periculum analytics parameters

| Name           | Description                                             | Type   | Required |
| -------------- | ------------------------------------------------------- | ------ | -------- |
| publickey     | Required. Public Key attached to account | String | Yes      |
|
| statementName  | unique statement reference                              | String | No       |
| customerMobile | Required. customer phone number                         | String | No       |
| customerBvn    | customer bvn                                            | String | No       |

&nbsp;
&nbsp;

## Usage periculum attach customer identification information to a statement

How to use the Periculum attach customer identification information to a statement method

```javascript
import React from 'react';
import {patchV2} from 'react-native-periculum';

patchV2(
  publicKey,
  statementKey,
  identificationData,
)
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.log(error);
  });
```

## Periculum attach customer identification information to a statement parameters

| Name               | Description                                           | Type   | Required |
| ------------------ | ----------------------------------------------------- | ------ | -------- |
| publicKey      | Public Key attached to the client account         | String | Yes      |
| statementKey       | Unique statement reference                            | int    | Yes      |
| identificationData | Array of object with keys of IdentifierName and Value | array  | Yes      |

&nbsp;

## Authentication

To utilize any of Insights endpoints, a public key value is required.

To authenticate against the authorization server, you must ensure that you have received your app’s client public key from Periculum. Without this, your app will be unable to call endpoints on the Insights API. If you have not obtained your client public key, then you should contact Periculum standard support channel (email support@periculum.io).

https://www.periculum.io/documentation/insights/#authenticationrequest

&nbsp;

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
