// Author: Hung Vu
// This collections represents a list of subscriber information.
// The list is intended to be used for newsletter email.
import { CollectionConfig } from "payload/types";
import { Novu } from "@novu/node";
const novu = new Novu(process.env.NOVU_API_KEY);
export const NewsletterSubscriber: CollectionConfig = {
  slug: "newsletter-subscribers",
  admin: {
    useAsTitle: "title",
  },
  access: {
      create: () => true // Public user can subscribe
  },
  fields: [
    {
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
        const internal_id = args.doc.id;
        // Create and update subscriber
        operation === "create"
          ? novu.subscribers.identify(internal_id, { email }).catch(err => console.error(err))
          : operation === "update"
          ? novu.subscribers.update(internal_id, { email }).catch(err => console.error(err))
          : null;
      },
    ],
    afterDelete: [
      (args) => {
        // Delete subscriber
        const internal_id = args.doc.id;
        novu.subscribers.delete(internal_id).catch(err => console.error(err));
      },
    ],
  },
};

export default NewsletterSubscriber;
