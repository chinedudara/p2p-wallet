import axios from "axios";
import https from "https";
import { paymentData } from "../models/dataobject.model";
import { payment_integration } from "../config/app.config";

class PaymentService {
  async initiatePayment(paymentData: paymentData): Promise<any> {
    const koboAmount = (paymentData.amount * 100).toString();

    const payload = {
      email: paymentData.email,
      amount: koboAmount,
      reference: paymentData.reference,
      // callback_url: paymentData.callback_url,
      metadata: paymentData.metadata,
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
