import DeviceInfo from 'react-native-device-info';

export const device = async () => {
  DeviceInfo.getDevice().then(device => {
    return device;
  });
};

export const validateIdentificationData = identificationData => {
  if (Array.isArray(identificationData)) {
    if (identificationData.length == 0) {
      throw {
        status: false,
        msg: 'identificationData cannot be empty',
      };
    } else {
      for (let i = 0; i < identificationData.length; i++) {
        if (
          !identificationData[i].hasOwnProperty('Value') ||
          !identificationData[i].hasOwnProperty('IdentifierName')
        ) {
          throw {
            status: false,
            msg: "Please make sure that the array contains objects with the keys 'identifierName' and 'value'",
          };
        }
        if (identificationData.length - 1 == i) {
          return true;
        }
      }
    }
  } else {
    throw {status: false, msg: 'identificationData must be an array'};
  }
};
