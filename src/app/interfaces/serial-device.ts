export interface SerialDevice {
  id: number;
  name: string;
  manufacturer?: string;
  vendorId?: string;
  productId?: string;
  isConnected: boolean;
  isCommunicationOn: boolean;
}
