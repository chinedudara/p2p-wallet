export interface UserData {
  email: string;
  username: string;
  password: string;
  pin: string;
  first_name: string;
  last_name: string;
  home_address: string;
  phone_number: string;
  account_number: string
}

export interface TransferData {
  source_account: string
  destination_account: string
  amount: number
}
