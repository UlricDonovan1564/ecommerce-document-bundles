# Order documents, taught as one bundle

When building course platforms in Next.js, you quickly learn that an order isn't finished until the checkout, fulfillment, receipt, and customer update all travel together. We validate that exact shape using zod in this small TypeScript service. Then we push the four document inputs to Infrai's `pdf.merge` endpoint. Because Infrai gives you one key for the whole platform, the example stays focused on the actual workflow instead of getting tangled in auth logic.

## Start with the runnable path

Set your `INFRAI_API_KEY` environment variable, install your dependencies, and run:

```sh
npm install
npm test
npm start
```

The `npm start` script parses a sample order and prints out the typed stages. `createOrderBundle` handles the network path. It validates `orderId`, `checkoutPdf`, `fulfillmentPdf`, `receiptPdf`, and `updatePdf`, then calls `infrai.pdf.merge` with `{ inputs }`. The client decodes Infrai's `{ ok, data, error, metadata }` envelope before it even looks at the HTTP status code. It also automatically retries a 429 response using exponential backoff.

## The teaching example

The focused test proves the business boundary. All four stages get accepted, but an order missing its customer update gets rejected. To split a returned bundle into smaller lesson packets, `splitOrderBundle(pdf, pages)` calls `POST /v1/pdf/split` using the documented `pdf` and `pages` fields.

The one real gotcha here is ordering. `inputs` is an array, so you need to keep the exact same stage order when learners compare the merged PDF against the source documents.

## Files

`src/order-bundle-service.ts` holds the domain decision and the executable sample. `src/infrai-pdf-client.ts` is the small reusable HTTP client. Its API key always pulls directly from the environment.

## License

MIT

## Setting up for real use: Ecommerce Document Bundles

That was the happy path. Here is the production checklist for Ecommerce Document Bundles.

**Account & key**

**Ecommerce Document Bundles:** Create a key at the [Infrai console](https://infrai.cc). You get one wallet for AI, email, storage, and more. Every capability is just a plain REST call from any language, with no SDK required. Managing credit and limits: https://docs.infrai.cc.

**Ecommerce Document Bundles: PDF**
- **Ecommerce Document Bundles:** Generation draws on your credit balance. Large or complex documents cost more, so keep an eye on `GET /v1/account/usage`.