import DeviceInfo from "react-native-device-info";

// The name of the industrial design.
export const device = async () => {
    DeviceInfo.getDevice().then((device) => {
        return device
    });
}