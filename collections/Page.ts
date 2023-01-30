// Author: Hung Vu
// This blog article collections notifies newsletter
// subscribers whenever a new article is released.

import { CollectionConfig } from "payload/types";
import { MediaType } from "./Media";
import formatSlug from "../utilities/formatSlug";
import { Image, Type as ImageType } from "../blocks/Image";
import { CallToAction, Type as CallToActionType } from "../blocks/CallToAction";
import { Content, Type as ContentType } from "../blocks/Content";
import payload from "payload";
import { Novu } from "@novu/node";

const novu = new Novu(process.env.NOVU_API_KEY);

export type Layout = CallToActionType | ContentType | ImageType;

export type Type = {
  title: string;
  slug: string;
  image?: MediaType;
  layout: Layout[];
  meta: {
    title?: string;
    description?: string;
    keywords?: string;
  };
};

export const Page: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
  },
  access: {
    read: (): boolean => true, // Everyone can read Pages
  },
  fields: [
    {
      name: "author",
      label: "Author name",
      type: "text",
      required: true,
    },
    {
      name: "title",
      label: "Page Title",
      type: "text",
      required: true,
    },
    {
      name: "image",
      label: "Featured Image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "layout",
      label: "Page Layout",
      type: "blocks",
      minRows: 1,
      blocks: [CallToAction, Content, Image],
    },
    {
      name: "meta",
      label: "Page Meta",
      type: "group",
      fields: [
        {
          name: "title",
          label: "Title",
          type: "text",
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
        },
        {
          name: "keywords",
          label: "Keywords",
          type: "text",
        },
      ],
    },
    {
      name: "slug",
      label: "Page Slug",
      type: "text",
      admin: {
        position: "sidebar",
      },
      hooks: {
        beforeValidate: [formatSlug("title")],
      },
    },
  ],
  hooks: {
    afterChange: [
      async (args) => {
        const author = args.doc.author;
        const urlSlug = args.doc.slug;
        const operation = args.operation;
        try {
          // Using local API bypasses the access control rules.
          // This is a way to retrieve records from other collections internally.
          // Also, async/await can be used in hooks
          // Source: https://payloadcms.com/docs/local-api/overview
          const newsletterSubscriberList = (
            await payload.find({
              collection: "newsletter-subscribers",
            })
          ).docs;
          // This triggers only on "create"
          if (operation === "create") {
            newsletterSubscriberList.forEach((subcriber) => {
              const email = subcriber.email;
              const internalId = subcriber.id;
              novu.trigger("email-new-article", {
                to: {
                  subscriberId: internalId,
                  email: email,
                },
                payload: {
                  author: author,
                  // The url is hard-coded only for demonstration purpose
                  article_url: `http://localhost:3000/${urlSlug}`,
                },
              });
            });
          }
        } catch (err) {
          console.error(err);
        }
      },
    ],
  },
};

export default Page;
