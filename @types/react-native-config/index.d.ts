declare module 'react-native-config' {
    interface Env {
        BASE_URL: string;
        API_KEY: string;
    }
  
    const Config: Env;
    export default Config;
  }
  