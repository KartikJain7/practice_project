import { Html, Head, Main, NextScript } from "next/document";
import { frontUrl } from "../config/config";

export default function Document() {
  return (
    <Html lang="en" style={{ backgroundColor: "whitesmoke" }}>
      <Head>
        <meta name="robots" content="noindex,nofollow" />

        <link
          href={`${frontUrl}images/Phone_icon.png`}
          type="image/x-icon"
          rel="icon"
        />
        <link
          rel="stylesheet"
          href={`${frontUrl}plugins/fontawesome-free/css/all.min.css`}
        />
        <link rel="stylesheet" href={`${frontUrl}css/custom.css`} />

        <link rel="stylesheet" href={`${frontUrl}css/adminlte.min.css`} />
      </Head>
      <body className="hold-transition sidebar-mini layout-fixed sidebar-mini layout-footer-fixed  ">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
