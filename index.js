import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import {fetchRequest} from './fetchRequest';
import {
  checkPermissions,
  device,
  getAndroidId,
  getApiLevel,
  getCarrier,
  getDeviceName,
  getFingerprint,
  getFirstInstallTime,
  getIpAddress,
  getLocation,
  getMacAddress,
  getManufacturer,
  getMaxMemory,
  getSmsData,
  isCameraPresent,
  uniqueReference,
  validateIdentificationData,
} from './helpers';
import API from './api';

// analytics
export const analyticsRequestV1 = async (publickey, reference, mobile, bvn, customSenderOnly = false) => {
  const analyticsInfo = new Promise(async (resolve, reject) => {
    try {
      // check authorization...
      if (!publickey) {
        const ata = {
          status: false,
          msg: 'Please enter public key!',
        };
        return reject(ata);
      }

      // checkPermissions
      const permission = await checkPermissions();

      // if permission is false then return error...
      if (permission === false) {
        const data = {
          status: false,
          msg: 'Please check all permissions are granted!',
        };
        return reject(data);
      }

      // get customer location...
      const location = await getLocation();

      if (location.status === false) {
        const data = {
          status: false,
          msg: 'An error occurred when trying to get clients location!',
        };
        return reject(data);
      }

      // get sms data...
      const smsData = await getSmsData(customSenderOnly)
        .then(result => {
          return result;
        })
        .catch(error => {
          return error;
        });

      const sms = smsData.smsList; // store sms list
      const smsCount = smsData.count; //

      // align the data......
      const data = {
        publickey: publickey,
        statementName: reference ?? (await uniqueReference()),
        appName: DeviceInfo.getApplicationName(),
        bundleId: DeviceInfo.getBundleId(),
        version: DeviceInfo.getVersion(),
        device: {
          device: await device(),
          deviceId: DeviceInfo.getDeviceId(),
          deviceName: await getDeviceName(),
          firstInstallTime: await getFirstInstallTime(),
          baseOs: 'Android',
          apiLevel: await getApiLevel(),
          androidId: await getAndroidId(),
          brand: DeviceInfo.getBrand(),
          buildNumber: DeviceInfo.getBuildNumber(),
          fingerprint: await getFingerprint(),
          manufacturer: await getManufacturer(),
          maxMemory: await getMaxMemory(),
          readableVersion: DeviceInfo.getReadableVersion(),
          uniqueId: DeviceInfo.getUniqueId(),
          isTablet: DeviceInfo.isTablet(),
          camera: {
            isCameraPresent: (await isCameraPresent()) ?? false,
          },
          network: {
            carrier: await getCarrier(),
            ip: await getIpAddress(),
            macAddress: await getMacAddress(),
          },
        },
        sms: {
          data: JSON.parse(sms),
          count: smsCount,
        },
        metadata: {
          customer: {
            phoneNumber: mobile ?? null,
            bvn: bvn ?? null,
          },
        },
        location: location.data,
      };

      // make the http request call...
      // run analytics...
      const analyticsData = await runAnalytics(data, '/mobile/analytics'); // run analytics...

      // all is good...
      if (analyticsData.status === true) {
        const analyticsDataResponse = {
          status: analyticsData.status,
          data: analyticsData.data, // analytics data...
        };

        // call resolve
        resolve(analyticsDataResponse);
      }

      // failed....
      if (analyticsData.status === false) {
        const analyticsDataResponseFailed = {
          status: analyticsData.status,
          data: 'Failed to get customer analytics data, contact support if this persist!',
        };

        // call resolve
        reject(analyticsDataResponseFailed);
      }
    } catch (error) {
      const data = {
        status: false,
        error: error,
      };
      return reject(data);
    }
  });

  return analyticsInfo;
};


// // push analytics data...
const runAnalytics = async (data, path) => {
  try {
    const config = {
      method: 'post',
      url: API + `${path}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: data,
    };

    const result = await axios(config)
      .then(function (response) {
        return {
          status: true,
          data: response.data,
        };
      })
      .catch(function (error) {
        return {
          status: false,
          data: error,
        };
      });

    return result;
  } catch (error) {
    return {
      status: false,
      data: error,
    };
  }
};


// V2 call
export const analyticsRequestV2 = async (publickey, reference, mobile, bvn, customSenderOnly = false) => {
  const analyticsInfo = new Promise(async (resolve, reject) => {
    try {
      // check authorization...
      if (!publickey) {
        const ata = {
          status: false,
          msg: 'Please enter public key!',
        };
        return reject(ata);
      }

      // checkPermissions
      const permission = await checkPermissions();

      // if permission is false then return error...
      if (permission === false) {
        const data = {
          status: false,
          msg: 'Please check all permissions are granted!',
        };
        return reject(data);
      }

      // get customer location...
      const location = await getLocation();

      if (location.status === false) {
        const data = {
          status: false,
          msg: 'An error occurred when trying to get clients location!',
        };
        return reject(data);
      }

      // get sms data...
      const smsData = await getSmsData(customSenderOnly)
        .then(result => {
          return result;
        })
        .catch(error => {
          return error;
        });

      const sms = smsData.smsList; // store sms list
      const smsCount = smsData.count; //

      // align the data......
      const data = {
        publickey: publickey,
        statementName: reference ?? (await uniqueReference()),
        appName: DeviceInfo.getApplicationName(),
        bundleId: DeviceInfo.getBundleId(),
        version: DeviceInfo.getVersion(),
        device: {
          device: await device(),
          deviceId: DeviceInfo.getDeviceId(),
          deviceName: await getDeviceName(),
          firstInstallTime: await getFirstInstallTime(),
          baseOs: 'Android',
          apiLevel: await getApiLevel(),
          androidId: await getAndroidId(),
          brand: DeviceInfo.getBrand(),
          buildNumber: DeviceInfo.getBuildNumber(),
          fingerprint: await getFingerprint(),
          manufacturer: await getManufacturer(),
          maxMemory: await getMaxMemory(),
          readableVersion: DeviceInfo.getReadableVersion(),
          uniqueId: DeviceInfo.getUniqueId(),
          isTablet: DeviceInfo.isTablet(),
          camera: {
            isCameraPresent: (await isCameraPresent()) ?? false,
          },
          network: {
            carrier: await getCarrier(),
            ip: await getIpAddress(),
            macAddress: await getMacAddress(),
          },
        },
        sms: {
          data: JSON.parse(sms),
          count: smsCount,
        },
        metadata: {
          customer: {
            phoneNumber: mobile ?? null,
            bvn: bvn ?? null,
          },
        },
        location: location.data,
      };

      // make the http request call...
      // run analytics...
      const analyticsData = await runAnalytics(data, '/mobile/insights/v2'); // run analytics...

      // all is good...
      if (analyticsData.status === true) {
        const analyticsDataResponse = {
          status: analyticsData.status,
          data: analyticsData.data, // analytics data...
        };

        // call resolve
        resolve(analyticsDataResponse);
      }

      // failed....
      if (analyticsData.status === false) {
        const analyticsDataResponseFailed = {
          status: analyticsData.status,
          data: 'Failed to get customer analytics data, contact support if this persist!',
        };

        // call resolve
        reject(analyticsDataResponseFailed);
      }
    } catch (error) {
      const data = {
        status: false,
        error: error,
      };
      return reject(data);
    }
  });

  return analyticsInfo;
};


// V2 Patch Call
export const patchV2 = async (
  publicKey,
  overviewKey,
  identificationData,
) => {
  if (validateIdentificationData(identificationData)) {
    if (!statementKey) {
      throw {status: false, msg: 'Please include a statement key'};
    } else {
      try {
        await fetchRequest({
          path: `mobile/insights/v2/${overviewKey}`,
          method: 'PATCH',
          data: {publicKey, identificationData},
        });

        return {status: true};
      } catch (error) {
        throw {status: false, msg: error?.msg || error};
      }
    }
  }
};



