// Author: Hung Vu
import { buildConfig } from "payload/config";
import dotenv from "dotenv";
import Page from "./collections/Page";
import Media from "./collections/Media";
import NewsletterSubscriber from "./collections/NewsletterSubscriber";

dotenv.config();

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  collections: [
    Page,
    Media,
    // Make Payload CMS aware of the new collection.
    NewsletterSubscriber,
  ],
});
