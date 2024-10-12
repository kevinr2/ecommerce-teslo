"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
} from "@paypal/paypal-js";
import { setTransactionId } from "../../actions/payments/set-transaction-id";
import { paypalCheckPayment } from "@/actions/payments/paypal-check-payment";

interface Props {
  orderId: string;
  amount: number;
}

export const PaypalButton = ({ orderId, amount }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const rountedAmount = Math.round(amount * 100) / 100; // 122.33

  if (isPending) {
    return (
      <div className="animate-pulse ">
        <div className=" h-10 bg-gray-300 rounded" />
        <div className=" h-10 bg-gray-300 rounded mt-2" />
      </div>
    );
  }
  const creatreOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> => {
    const transactionId = await actions.order.create({
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            value: `${rountedAmount}`,
            currency_code: "USD",
          },
        },
      ],
      intent: "CAPTURE",
    });
    //setTransactionId
    const { ok } = await setTransactionId(orderId, transactionId);

    if (!ok) {
      throw new Error("No se pudo actualizar la orden");
    }

    return transactionId;
  };

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    console.log("onApprove");
    const details = await actions.order?.capture();
    if (!details) return;
    await paypalCheckPayment(details.id ?? "");
  };

  return (
    <div className="relative z-0">
      <PayPalButtons createOrder={creatreOrder} onApprove={onApprove} />
    </div>
  );
};
