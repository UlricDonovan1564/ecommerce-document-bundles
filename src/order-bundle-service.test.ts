import test from "node:test";
import assert from "node:assert/strict";
import { orderBundleRequest } from "./order-bundle-service.ts";

test("an order bundle requires all four learning-friendly document stages", () => {
  const parsed = orderBundleRequest.safeParse({ orderId: "o-1", checkoutPdf: "a", fulfillmentPdf: "b", receiptPdf: "c", updatePdf: "d" });
  assert.equal(parsed.success, true);
  const missing = orderBundleRequest.safeParse({ orderId: "o-1", checkoutPdf: "a", fulfillmentPdf: "b", receiptPdf: "c" });
  assert.equal(missing.success, false);
});
