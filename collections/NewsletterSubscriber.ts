// Author: Hung Vu
// This collections represents a list of subscriber information.
// The list is intended to be used for newsletter email.
import { CollectionConfig } from "payload/types";
import { Novu } from "@novu/node";

const novu = new Novu(process.env.NOVU_API_KEY);

export const NewsletterSubscriber: CollectionConfig = {
  slug: "newsletter-subscribers",
  admin: {
    useAsTitle: "email",
  },
  access: {
    // Public user can subscribe.
    // By default, all other operations like "read", "update", etc. are restricted
    // to only authorized users.
    create: () => true,
  },
  fields: [
    {
      // Payload CMS also allows field validation,
      // This should be done in production code to avoid spam.
      name: "email",
      label: "Subscriber Email",
      type: "text",
      required: true,
      unique: true,
    },
  ],
  hooks: {
    // It is the best to move these to "utilities",
    // and have an appropriate error handler in production code.
    afterChange: [
      (args) => {
        const operation = args.operation;
        const email = args.doc.email;
        const internalId = args.doc.id;
        // Create and update subscriber, Novu recommends the use of internal id.
        // Source: https://docs.novu.co/platform/subscribers
        operation === "create"
          ? novu.subscribers
              .identify(internalId, { email })
              .catch((err) => console.error(err))
          : operation === "update"
          ? novu.subscribers
              .update(internalId, { email })
              .catch((err) => console.error(err))
          : null;
      },
    ],
    afterDelete: [
      (args) => {
        // Delete subscriber
        const internalId = args.doc.id;
        novu.subscribers.delete(internalId).catch((err) => console.error(err));
      },
    ],
  },
};

export default NewsletterSubscriber;
