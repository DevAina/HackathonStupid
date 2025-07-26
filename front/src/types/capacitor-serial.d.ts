declare module 'capacitor-serial' {
  export interface SerialDevice {
    deviceId: string;
    name: string;
  }

  export interface SerialOpenOptions {
    deviceId: string;
    baudRate: number;
    dataBits: number;
    stopBits: number;
    parity: number;
  }

  export interface SerialWriteOptions {
    data: string;
  }

  export interface SerialPlugin {
    requestPermissions(): Promise<{ devices: SerialDevice[] }>;
    open(options: SerialOpenOptions): Promise<{ success: boolean }>;
    write(options: SerialWriteOptions): Promise<void>;
    close(): Promise<void>;
    addListener(event: 'dataReceived', listener: (data: { data: string }) => void): void;
    removeAllListeners(): void;
  }

  export const Serial: SerialPlugin;
}