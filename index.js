import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { request, PERMISSIONS } from "react-native-permissions";
import shortid from "shortid";
import DeviceInfo from "react-native-device-info";
import GetLocation from "react-native-get-location";
import SmsAndroid from "react-native-get-sms-android";
import axios from "axios";

// import helpers
import { analytics } from "./helpers.js";

const ANALYTICS_URL = "https://api.insights-periculum.com/mobile/analytics";
const INSIGHTS_URL = "https://api.insights-periculum.com/affordability";

const Periculum = ({ authorization, options, btnStyles, btnText, btnTextStyle, callback }) => {
  const [isLoading, setisLoading] = useState(false); // is loading....

  // variables...
  const [device, setDevice] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [firstInstallTime, setFirstInstallTime] = useState("");
  const [apiLevel, setApiLevel] = useState("");
  const [androidId, setAndroidId] = useState("");
  const [fingerprint, setfingerprint] = useState("");
  const [manufacturer, setmanufacturer] = useState("");
  const [maxMemory, setmaxMemory] = useState("");
  const [isCameraPresent, setisCameraPresent] = useState(false);

  // Network
  const [carrier, setcarrier] = useState("");
  const [ip, setip] = useState("");
  const [macAddress, setmacAddress] = useState("");

  // location
  const [location, setlocation] = useState({});

  // SMS
  const [sms, setsms] = useState([]);
  const [smsCount, setsmscount] = useState([]);

  // check for permissions
  const permissions = async () => {
    // request permissions for sms
    request(PERMISSIONS.ANDROID.READ_SMS).then((result) => {
      if (result !== "granted") {
        onError({
          status: false,
          msg: "Permission to read sms was not granted",
        });
      }
    });

    request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
      if (result !== "granted") {
        onError({
          status: false,
          msg: "Permission not granted get location information!",
        });
      }
    });

    request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then((result) => {
      if (result !== "granted") {
        onError({
          status: false,
          msg: "Permission not granted get location information!",
        });
      }
    });
  };

  const getLocation = async () => {
    // location...
    await GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((location) => {
        setlocation(location);
        // console.log({ location });
      })
      .catch((error) => {
        const { code, message } = error;
        // console.warn(code, message);
      });
  };

  const filter = {
    box: "inbox",
  };
  // sms data...
  const smsData = async () => {
    SmsAndroid.list(
      JSON.stringify(filter),
      (fail) => {
        console.log("Failed with this error: " + fail);
      },
      (count, smsList) => {
        console.log("Count: ", count);
        // console.log("List: ", smsList);
        setsmscount(count);
        setsms(smsList);
        var arr = JSON.parse(smsList);
      }
    );
  };

  useEffect(() => {
    // get sms data
    smsData();

    // get location...
    getLocation();

    // The name of the industrial design.
    DeviceInfo.getDevice().then((device) => {
      setDevice(device);
    });

    // Gets the device name.
    DeviceInfo.getDeviceName().then((deviceName) => {
      setDeviceName(deviceName);
    });

    // Gets the time at which the app was first installed, in milliseconds.
    DeviceInfo.getFirstInstallTime().then((firstInstallTime) => {
      setFirstInstallTime(firstInstallTime);
    });

    // Gets the API level.
    DeviceInfo.getApiLevel().then((apiLevel) => {
      setApiLevel(apiLevel);
    });

    DeviceInfo.getAndroidId().then((androidId) => {
      setAndroidId(androidId);
    });

    DeviceInfo.getFingerprint().then((fingerprint) => {
      // "google/walleye/walleye:8.1.0/OPM2.171026.006.G1/4820017:user/release-keys"
      setfingerprint(fingerprint.toString());
    });

    DeviceInfo.getManufacturer().then((manufacturer) => {
      setmanufacturer(manufacturer);
    });

    DeviceInfo.getMaxMemory().then((maxMemory) => {
      setmaxMemory(maxMemory);
    });

    DeviceInfo.isCameraPresent()
      .then((isCameraPresent) => {
        setisCameraPresent(isCameraPresent);
      })
      .catch((cameraAccessException) => {});

    // Network
    DeviceInfo.getCarrier().then((carrier) => {
      setcarrier(carrier);
    });

    DeviceInfo.getIpAddress().then((ip) => {
      setip(ip);
    });

    DeviceInfo.getMacAddress().then((mac) => {
      setmacAddress(mac);
    });
  }, []);

  // push analytics data...
  const analytics = async (data) => {
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
          // console.log({ response.data });
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
  const affordabilityCheck = async (id) => {
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
          dti: options.dti,
          statementKey: id, //
          loanTenure: options.loanTenure,
        },
      };

      const response = await axios(config)
        .then(function (response) {
          if (response.status === 200) {
            return { 
              status: true, 
              data: response.data
            };
          }
          
          // other kind of response...
          return { 
            status: true, 
            data: response.data
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

  const start = async () => {
    // check permissions first...
    permissions();

    try {
      // align the data......
      const data = {
        statementName: options.reference,
        appName: DeviceInfo.getApplicationName(),
        bundleId: DeviceInfo.getBundleId(),
        version: DeviceInfo.getVersion(),
        device: {
          device: device,
          deviceId: DeviceInfo.getDeviceId(),
          deviceName: deviceName,
          firstInstallTime: firstInstallTime,
          baseOs: "Android",
          apiLevel: apiLevel,
          androidId: androidId,
          brand: DeviceInfo.getBrand(),
          buildNumber: DeviceInfo.getBuildNumber(),
          fingerprint: fingerprint,
          manufacturer: manufacturer,
          maxMemory: maxMemory,
          readableVersion: DeviceInfo.getReadableVersion(),
          uniqueId: DeviceInfo.getUniqueId(),
          isTablet: DeviceInfo.isTablet(),
          camera: {
            isCameraPresent: isCameraPresent,
          },
          network: {
            carrier: carrier,
            ip: ip,
            macAddress: macAddress,
          },
        },
        sms: {
          data: JSON.parse(sms),
          count: smsCount,
        },
        metadata: {
          customer: {
            phoneNumber: options.customer.mobile,
            bvn: options.customer.bvn,
          },
        },
        location: location,
      };

      // run analytics...
      const analyticsData = await analytics(data); // run analytics...
      // console.log({analyticsData});

      // check the analytics data...
      if (analyticsData.status === true) {
        const statementKey = analyticsData.data.key; // get the statement key
        const affordability = await affordabilityCheck(statementKey);

        if(affordability.status === true) {
          return callback({
            status: true,
            data: affordability.data
          });
        }
      }

      callback({
        status: false,
        msg: 'Failed to analyse customer details.',
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <TouchableOpacity style={btnStyles} onPress={start}>
        <Text style={btnTextStyle}>{ btnText ?? 'Start processing'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Periculum;
