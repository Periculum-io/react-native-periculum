import { request, PERMISSIONS } from "react-native-permissions";
import DeviceInfo from "react-native-device-info";
import GetLocation from "react-native-get-location";
import SmsAndroid from "react-native-get-sms-android";
import axios from "axios";

const ANALYTICS_URL = "https://api.insights-periculum.com/mobile/analytics";
const INSIGHTS_URL = "https://api.insights-periculum.com/affordability";

// analytics
export const analytics = async (authorization, reference, mobile, bvn) => {
  const analyticsInfo = new Promise(async (resolve, reject) => {
    try {
      // check authorization...
      if (!authorization) {
        const ata = {
          status: false,
          msg: "Please enter authorization token!",
        };
        return reject(ata);
      }

      // checkPermissions
      const permission = await checkPermissions();

      // if permission is false then return error...
      if (permission === false) {
        const data = {
          status: false,
          msg: "Please check all permissions are granted!",
        };
        return reject(data);
      }

      // get customer location...
      const location = await getLocation();

      if (location.status === false) {
        const data = {
          status: false,
          msg: "An error occurred when trying to get clients location!",
        };
        return reject(data);
      }

      // get sms data...
      const smsData = await getSmsData()
        .then((result) => {
          return result;
        })
        .catch((error) => {
          return error;
        });

      const sms = smsData.smsList; // store sms list
      const smsCount = smsData.count; //

      // align the data......
      const data = {
        statementName: reference ?? await uniqueReference(),
        appName: DeviceInfo.getApplicationName(),
        bundleId: DeviceInfo.getBundleId(),
        version: DeviceInfo.getVersion(),
        device: {
          device: await device(),
          deviceId: DeviceInfo.getDeviceId(),
          deviceName: await getDeviceName(),
          firstInstallTime: await getFirstInstallTime(),
          baseOs: "Android",
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
      const analyticsData = await analyticsHttpRequest(data, authorization); // run analytics...

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
          data: "Failed to get customer analytics data, contact support if this persist!",
        };

        // call resolve
        reject(analyticsDataResponseFailed);
      }

      // setTimeout(() => {
      //   resolve(data);
      // }, 300);
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

// affordability

export const affordability = async (
  authorization,
  statementKey,
  dti,
  loanTenure,
  averageMonthlyTotalExpenses,
  averageMonthlyLoanRepaymentAmount
) => {
  const analyticsInfo = new Promise(async (resolve, reject) => {
    try {
      // check authorization...
      if (!authorization) {
        const ata = {
          status: false,
          msg: "Please enter authorization token!",
        };
        return reject(ata);
      }

      // check reference...
      if (!statementKey) {
        const data = {
          status: false,
          msg: "Please enter unique statement reference!",
        };
        return reject(data);
      }

      // check mobile...
      if (!dti) {
        const data = {
          status: false,
          msg: "Please enter affordability DTI!",
        };
        return reject(data);
      }

      // check bvn
      if (!loanTenure) {
        const data = {
          status: false,
          msg: "Please enter affordability loan tenure!",
        };
        return reject(data);
      }

      // make the call...
      const affordability = await affordabilityCheck(
        statementKey,
        dti,
        loanTenure,
        authorization,
        averageMonthlyTotalExpenses,
        averageMonthlyLoanRepaymentAmount
      );

      if (affordability.status === true) {
        return resolve({
          status: true,
          data: affordability.data,
        });
      }

      // failed...
      return reject({
        status: false,
        msg: "Failed to get statement affordability details.",
      });
    } catch (err) {
      const data = {
        status: false,
        error: error,
      };
      return reject(data);
    }
  });
  return analyticsInfo;
};

// check permissions
const checkPermissions = async (permissions) => {
  // request permissions for sms
  request(PERMISSIONS.ANDROID.READ_SMS).then((result) => {
    if (result !== "granted") {
      return false;
    }
  });

  // check permission for location...
  request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
    if (result !== "granted") {
      return false;
    }
  });

  // check permission for location...
  request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then((result) => {
    if (result !== "granted") {
      return false;
    }
  });
};

// get customer location...
const getLocation = async () => {
  // location...
  const location = await GetLocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 15000,
  })
    .then((location) => {
      const data = {
        status: true,
        data: location,
      };

      return data;
    })
    .catch((error) => {
      const data = {
        status: false,
        msg: error.message,
      };
      return data;
    });

  return location;
};

// sms data...
const getSmsData = async () => {
  const date = new Date(); // get date...

  // max date...
  const maxDate = date.getTime();

  // min date...
  date.setMonth(date.getMonth() - 6);
  const minDate = date.getTime();

  const filter = {
    box: "inbox",
    minDate: minDate, // timestamp (in milliseconds since UNIX epoch)
    maxDate: maxDate, // timestamp (in milliseconds since UNIX epoch)
  };

  let smsObj = [];

  const newPromise = new Promise(async (resolve, fail) => {
    const response = await SmsAndroid.list(
      JSON.stringify(filter),
      (fail) => {
        const data = {
          status: false,
          msg: "Failed with this error: " + fail,
        };
        return fail(data);
      },
      (count, smsList) => {
        return resolve({
          smsList: smsList,
          count: count,
        });
      }
    );
  });

  return newPromise;
};

/**
 * Get Device info...
 */

// The name of the industrial design.
const device = async () => {
  return DeviceInfo.getDevice().then((device) => {
    return device;
  });
};

// Gets the time at which the app was first installed, in milliseconds.
const getFirstInstallTime = async () => {
  return DeviceInfo.getFirstInstallTime().then((firstInstallTime) => {
    return firstInstallTime;
  });
};

// Gets the device name.
const getDeviceName = async () => {
  return DeviceInfo.getDeviceName().then((deviceName) => {
    return deviceName;
  });
};

const getApiLevel = async () => {
  return DeviceInfo.getApiLevel().then((apiLevel) => {
    return apiLevel;
  });
};

const getAndroidId = async () => {
  return DeviceInfo.getAndroidId().then((androidId) => {
    return androidId;
  });
};

const getFingerprint = async () => {
  return DeviceInfo.getFingerprint().then((fingerprint) => {
    return fingerprint.toString();
  });
};

const getManufacturer = async () => {
  return DeviceInfo.getManufacturer().then((manufacturer) => {
    return manufacturer;
  });
};

const getMaxMemory = async () => {
  return DeviceInfo.getMaxMemory().then((maxMemory) => {
    return maxMemory;
  });
};

const isCameraPresent = async () => {
  return DeviceInfo.isCameraPresent()
    .then((isCameraPresent) => {
      return isCameraPresent;
    })
    .catch((cameraAccessException) => { });
};

// Network
const getCarrier = async () => {
  return DeviceInfo.getCarrier().then((carrier) => {
    return carrier;
  });
};

const getIpAddress = async () => {
  return DeviceInfo.getIpAddress().then((ip) => {
    return ip;
  });
};

const getMacAddress = async () => {
  return DeviceInfo.getMacAddress().then((mac) => {
    return mac;
  });
};

// create unique reference
const uniqueReference = async () => {
  return Math.floor(new Date().getTime() / 1000).toString();
};

// push analytics data...
const analyticsHttpRequest = async (data, authorization) => {
  try {
    const config = {
      method: "post",
      url: ANALYTICS_URL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authorization}`,
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

// const affordability data...
const affordabilityCheck = async (id, dti, loanTenure, authorization, averageMonthlyTotalExpenses, averageMonthlyLoanRepaymentAmount) => {
  try {
    const config = {
      method: "post",
      url: INSIGHTS_URL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authorization}`,
      },
      data: {
        dti: dti,
        statementKey: id, //
        loanTenure: loanTenure,
        averageMonthlyTotalExpenses: averageMonthlyTotalExpenses ?? null,
        averageMonthlyLoanRepaymentAmount: averageMonthlyLoanRepaymentAmount ?? null
      },
    };

    const response = await axios(config)
      .then(function (response) {
        if (response.status === 200) {
          return {
            status: true,
            data: response.data,
          };
        }

        // other kind of response...
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

    return response;
  } catch (error) {
    return {
      status: false,
      data: error,
    };
  }
};
