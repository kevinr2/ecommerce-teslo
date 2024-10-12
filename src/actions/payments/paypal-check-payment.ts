"use server";

import { PaypalOrderStatusResponse } from "@/interfaces";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export const paypalCheckPayment = async (
  PaypalTransactionId: string 
) => {
  const authToken = await getPaypalBearerToken();
  if (!authToken) {
    return {
      ok: false,
      message: "no se pudo obtener el token",
    };
  }
  const resp = await verifyPaypalPayment(PaypalTransactionId,authToken)

  if (!resp) {
    return{
      ok:false,
      message:"Error a verificar el pago"
    }
  }
  const { status, purchase_units} = resp
   const {invoice_id:orderId} = purchase_units[0] 
 if (status !== 'COMPLETED') {
  return {
    ok:false,
    message:"no se a completado el pago"
  }
  
 }
 try {

  await prisma.order.update({
    where:{id:orderId},
    data:{
      isPaid:true,
      paidAt: new Date()
    }
  })
  revalidatePath(`/orders/${orderId}`)

  return{
    ok:true
  }
 } catch (error) {
   console.log(error)
   return{
    ok:false,
    message:"el pago no se pudo realizar"
   }
 }
};


const getPaypalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
  const oauthToken = process.env.PAYPAL_OAUTH_URL ?? "";

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT}:${PAYPAL_SECRET}`,
    "utf-8"
  ).toString("base64");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Basic ${base64Token}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };

  try {
    const result = await fetch(oauthToken,{...requestOptions,cache:"no-store"}).then((r) =>
      r.json()
    );
    return result.access_token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const verifyPaypalPayment = async (
  paypalTransictionId: string,
  bearerToken: string
):Promise<PaypalOrderStatusResponse | null> => {
  const paypalOrderUrl = `${process.env.PAYPAL_ORDERS_URL}/${paypalTransictionId}`;

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${bearerToken}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };
  try {
  const resp = await  fetch(paypalOrderUrl, {...requestOptions,cache:"no-store"}).then(r=>r.json())
  return resp
  } catch (error) {
    console.log(error)
    throw new Error("no se pudo ejecutar")
  }
  

};
