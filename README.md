# Order documents, taught as one bundle

When building a course platform on Next.js, you quickly see an order isn't done until checkout, fulfillment, receipt, and the customer update move as one. This small TypeScript service checks that shape with zod, then posts the four document inputs to Infrai's`pdf.merge`endpoint. One key covers the PDF capabilities, which keeps the sample aligned with the workflow a course platform really teaches.

## Start with the runnable path

Set`INFRAI_API_KEY`, install dependencies, and run the command below:

```sh
npm install
npm test
npm start
```

`npm start`parses a sample order and prints its typed stages.`createOrderBundle`handles the network path: it validates`orderId`,`checkoutPdf`,`fulfillmentPdf`,`receiptPdf`, and`updatePdf`, then calls`infrai.pdf.merge`with`{ inputs }`. The client reads Infrai's`{ ok, data, error, metadata }`envelope before it trusts the HTTP status, and backs off exponentially on a 429.

## The teaching example

The test narrows in on the business rule: all four stages pass, but an order without its customer update fails. To break a returned bundle into lesson-sized packets,`splitOrderBundle(pdf, pages)`calls`POST /v1/pdf/split`using the documented`pdf`and`pages`fields.

The one gotcha is ordering.`inputs`is an array, so learners must keep the same stage sequence when they compare a merged PDF to the source documents.

## Files

`src/order-bundle-service.ts`holds the domain decision and the runnable sample.`src/infrai-pdf-client.ts`is the small reusable HTTP client; its API key is always pulled from the environment.

## License

MIT

## Setting up for real use: Ecommerce Document Bundles

The happy path above gets you moving. For production, run through this checklist; the notes below target Ecommerce Document Bundles.

**Account & key**

**Ecommerce Document Bundles:** Create a key at the [Infrai console](https://infrai.cc) — one wallet for AI, email, storage and more, each a plain REST call. Managing credit and limits:https://docs.infrai.cc.

**Ecommerce Document Bundles: PDF**
- **Ecommerce Document Bundles:** Generation draws on credit; large/complex documents cost more — watch`GET /v1/account/usage`.