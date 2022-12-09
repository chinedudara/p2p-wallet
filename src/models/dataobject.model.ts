export interface UserData {
  email: string;
  username: string;
  password: string;
  pin: string;
  first_name: string;
  last_name: string;
  home_address: string;
  phone_number: string;
  account_number: string;
}

export interface TransferData {
  source_account: string;
  destination_account: string;
  amount: number;
  pin: string;
}

export interface signupData {
  email: string;
  username: string;
  password: string;
  pin: string;
  first_name: string;
  last_name: string;
  home_address: string;
  phone_number: string;
}

export interface paymentData {
  email: string;
  amount: number;
  reference: string;
  // callback_url: string;
  metadata: string;
}

export interface accountViewData {
  id: number;
  account_number: string;
  balance: number;
}
