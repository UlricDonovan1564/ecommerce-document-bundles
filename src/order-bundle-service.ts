import { z } from "zod";
import { mergePdfs, splitPdf } from "./infrai-pdf-client.ts";

export const orderBundleRequest = z.object({ orderId: z.string().min(1), checkoutPdf: z.string().min(1), fulfillmentPdf: z.string().min(1), receiptPdf: z.string().min(1), updatePdf: z.string().min(1) });
export type OrderBundleRequest = z.infer<typeof orderBundleRequest>;

export async function createOrderBundle(input: OrderBundleRequest) {
  const request = orderBundleRequest.parse(input);
  const merged = await mergePdfs([request.checkoutPdf, request.fulfillmentPdf, request.receiptPdf, request.updatePdf]);
  return { orderId: request.orderId, document: merged, sections: ["checkout", "fulfillment", "receipt", "customer-order-update"] };
}

export async function splitOrderBundle(pdf: string, pages: number[]) { return splitPdf(pdf, pages); }

if (import.meta.url === `file://${process.argv[1]}`) {
  const sample = { orderId: "order-1042", checkoutPdf: "checkout.pdf", fulfillmentPdf: "fulfillment.pdf", receiptPdf: "receipt.pdf", updatePdf: "update.pdf" };
  console.log(orderBundleRequest.parse(sample));
}
