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
export const analytics = async (authorization, reference, mobile, bvn) => {
  const analyticsInfo = new Promise(async (resolve, reject) => {
    try {
      // check authorization...
      if (!authorization) {
        const ata = {
          status: false,
          msg: 'Please enter access token!',
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
      const smsData = await getSmsData()
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

// affordability

export const affordability = async (
  authorization,
  statementKey,
  dti,
  loanTenure,
  averageMonthlyTotalExpenses,
  averageMonthlyLoanRepaymentAmount,
) => {
  const analyticsInfo = new Promise(async (resolve, reject) => {
    try {
      // check authorization...
      if (!authorization) {
        const ata = {
          status: false,
          msg: 'Please enter access token!',
        };
        return reject(ata);
      }

      // check reference...
      if (!statementKey) {
        const data = {
          status: false,
          msg: 'Please enter unique statement reference!',
        };
        return reject(data);
      }

      // check mobile...
      if (!dti) {
        const data = {
          status: false,
          msg: 'Please enter affordability DTI!',
        };
        return reject(data);
      }

      // check bvn
      if (!loanTenure) {
        const data = {
          status: false,
          msg: 'Please enter affordability loan tenure!',
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
        averageMonthlyLoanRepaymentAmount,
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
        msg: 'Failed to get statement affordability details.',
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

// const affordability data...
const affordabilityCheck = async (
  id,
  dti,
  loanTenure,
  authorization,
  averageMonthlyTotalExpenses,
  averageMonthlyLoanRepaymentAmount,
) => {
  try {
    const config = {
      method: 'post',
      url: API + '/affordability',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authorization}`,
      },
      data: {
        dti: dti,
        statementKey: id, //
        loanTenure: loanTenure,
        averageMonthlyTotalExpenses: averageMonthlyTotalExpenses ?? null,
        averageMonthlyLoanRepaymentAmount:
          averageMonthlyLoanRepaymentAmount ?? null,
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

// push analytics data...
const analyticsHttpRequest = async (data, authorization) => {
  try {
    const config = {
      method: 'post',
      url: API + '/mobile/analytics',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
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

export const getStatementTransactions = async (authorization, statementKey) => {
  if (!statementKey) {
    throw {status: false, msg: 'Please include a statement key'};
  } else {
    try {
      const response = await fetchRequest({
        authorization,
        path: `/statements/${statementKey}/transactions`,
        method: 'GET',
      });

      return {status: true, data: response};
    } catch (error) {
      throw {status: false, msg: error?.msg || error};
    }
  }
};

export const getExistingStatementAnalytics = async (
  authorization,
  statementKey,
) => {
  if (!statementKey) {
    throw {status: false, msg: 'Please include a statement key'};
  } else {
    try {
      const response = await fetchRequest({
        authorization,
        path: `/statements/${statementKey}`,
        method: 'GET',
      });

      return {status: true, data: response};
    } catch (error) {
      throw {status: false, msg: error?.msg || error};
    }
  }
};

export const generateCreditScoreForAStatement = async (
  authorization,
  statementKey,
) => {
  if (!statementKey) {
    throw {status: false, msg: 'Please include a statement key'};
  } else {
    try {
      const response = await fetchRequest({
        authorization,
        path: `/creditscore/${statementKey}`,
        method: 'POST',
      });

      return {status: true, data: response};
    } catch (error) {
      throw {status: false, msg: error?.msg || error};
    }
  }
};

export const getAnExistingCreditScore = async (authorization, statementKey) => {
  if (!statementKey) {
    throw {status: false, msg: 'Please include a statement key'};
  } else {
    try {
      const response = await fetchRequest({
        authorization,
        path: `/creditscore/${statementKey}`,
        method: 'GET',
      });

      return {status: true, data: response};
    } catch (error) {
      throw {status: false, msg: error?.msg || error};
    }
  }
};

export const getExistingStatementAffordabilityAnalysis = async (
  authorization,
  statementKey,
) => {
  if (!statementKey) {
    throw {status: false, msg: 'Please include a statement key'};
  } else {
    try {
      const response = await fetchRequest({
        authorization,
        path: `/affordability/${statementKey}`,
        method: 'GET',
      });

      return {status: true, data: response};
    } catch (error) {
      throw {status: false, msg: error?.msg || error};
    }
  }
};

export const attachCustomerIdentificationInformationToAStatement = async (
  authorization,
  statementKey,
  identificationData,
) => {
  if (validateIdentificationData(identificationData)) {
    if (!statementKey) {
      throw {status: false, msg: 'Please include a statement key'};
    } else {
      try {
        await fetchRequest({
          authorization,
          path: `/statements/identification`,
          method: 'PATCH',
          data: {statementKey, identificationData},
        });

        return {status: true};
      } catch (error) {
        throw {status: false, msg: error?.msg || error};
      }
    }
  }
};
