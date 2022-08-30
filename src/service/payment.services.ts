import axios from "axios";
import https from "https";
import { payment_integration } from "../config/app.config";

class PaymentService {
  async initiatePayment(email: string, amount: number): Promise<any> {
    const koboAmount = (amount * 100).toString();
    
    const payload = {
      email,
      amount: koboAmount,
    };
    return axios
      .post(payment_integration.payment_url, payload, {
        headers: {
          Authorization: `Bearer ${payment_integration.secret_key}`,
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        // console.log(response.data);
        return {
          success: true,
          data: response.data,
        };
      })
      .catch(function (error) {
        console.log(error);
        return {
          success: false,
          data: null,
        };
      });
  }
}

export default new PaymentService();
