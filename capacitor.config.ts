import type { CapacitorConfig } from "@capacitor/cli";

const webUrl = process.env.AGRI_WEB_URL || "https://example.com";

const config: CapacitorConfig = {
  appId: "com.agroroot.agri",
  appName: "AgriRoot",
  webDir: "out",
  server: {
    url: webUrl,
    cleartext: false
  },
  android: {
    backgroundColor: "#f7fbf4"
  }
};

export default config;
