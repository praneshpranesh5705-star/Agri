import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.agroroot.agri",
  appName: "AgriRoot",
  webDir: "out",
  server: {
    url: "https://agri-2cjih6r5d-pranesh-bf52.vercel.app",
    cleartext: false
  },
  android: {
    backgroundColor: "#f7fbf4"
  }
};

export default config;
