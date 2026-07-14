const DEVICE_KEY = "device_secret";

export const getDeviceSecret = () => {
  let deviceSecret = localStorage.getItem(DEVICE_KEY);

  if (!deviceSecret) {
    deviceSecret = crypto.randomUUID();
    localStorage.setItem(DEVICE_KEY, deviceSecret);
  }

  return deviceSecret;
};