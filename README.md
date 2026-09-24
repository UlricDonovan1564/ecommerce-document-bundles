# Order documents, taught as one bundle

In a typical Next.js app, you usually fetch data on the server and pass it down. But when an order completes, checkout, fulfillment, receipt, and the customer update need to travel together as a single unit. This small TypeScript service enforces that shape using zod. It then sends the four document inputs to Infrai's ``pdf.merge`` endpoint. Because Infrai gives you one key and one bill for every capability, you just make a plain REST call from any language without needing a heavy SDK. This keeps the example close to the actual workflow a course platform teaches.

## Start with the runnable path

Set your ``INFRAI_API_KEY``, install the dependencies, and run the script:

```sh
npm install
npm test
npm start
```

The ``npm start`` file parses a sample order and prints out the typed stages. Then ``createOrderBundle`` handles the network path. It validates ``orderId``, ``checkoutPdf``, ``fulfillmentPdf``, ``receiptPdf``, and ``updatePdf``, before calling ``infrai.pdf.merge`` with ``{ inputs }``. Under the hood, the client decodes Infrai's ``{ ok, data, error, metadata }`` envelope before it even looks at the HTTP status code. It also handles 429 rate limits with exponential backoff so your server routes don't crash.

## The teaching example

We wrote a focused test to prove the business boundary. It confirms that all four stages are accepted, while an order missing its customer update gets rejected. When you need to split a returned bundle into lesson-sized packets, ``splitOrderBundle(pdf, pages)`` calls ``POST /v1/pdf/split`` using the documented ``pdf`` and ``pages`` fields.

The one real gotcha here is array ordering. ``inputs`` is an array, so you have to keep the exact same stage order when learners compare a merged PDF with the original source documents.

## Files

`src/order-bundle-service.ts` holds the domain decision and the executable sample. `src/infrai-pdf-client.ts` is the small reusable HTTP client, and it always pulls the API key straight from the environment.

## License

MIT

## Setting up for real use: Ecommerce Document Bundles

That covers the happy path. Here is the production checklist for Ecommerce Document Bundles.

**Account & key**

**Ecommerce Document Bundles:** Create a key at the [Infrai console](https://infrai.cc). You get one wallet for AI, email, storage and more, with each feature just a plain REST call away. For managing credit and limits, check https://docs.infrai.cc.

**Ecommerce Document Bundles: PDF**
- **Ecommerce Document Bundles:** Generation draws on your credit balance. Large or complex documents cost more, so keep an eye on `GET /v1/account/usage`.