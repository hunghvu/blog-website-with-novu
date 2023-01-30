// Author: Hung Vu
// This components allows readers to subscribe to newsletter.
import React from "react";

const NewsletterRegistration: React.FC = () => {
  const [readerEmail, setReaderEmail] = React.useState<string>();
  const submit = async () => {
    try {
      // Remember to handle exceptions and status code in the production code.
      await fetch("http://localhost:3000/api/newsletter-subscribers/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: readerEmail,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        marginBottom: "32px",
      }}
      onSubmit={(event) => {
        // There is "TypeError: NetworkError when attempting to fetch resource." without the preventDefault() statement.
        event.preventDefault();
        submit();
      }}
    >
      <label htmlFor="newsletter">Subscribe to newsletter</label>
      <input
        id="newsletter"
        type="text"
        placeholder="Enter your email"
        onChange={(event) => setReaderEmail(event.target.value)}
      />
      <input type="submit" value="Subscribe" />
    </form>
  );
};

export default NewsletterRegistration;
