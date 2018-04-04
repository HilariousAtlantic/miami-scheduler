import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const page = renderPage(Page => props =>
      sheet.collectStyles(<Page {...props} />)
    );
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }

  render() {
    return (
      <html>
        <Head>
          <meta name="viewport" content="width=device-width" />
          <title>Miami Scheduler</title>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:100,200,300,400,500,600,700,800,900"
          />
          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.0.9/css/all.css"
          />
          <link rel="stylesheet" href="/static/style.css" />
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=UA-93847501-1"
          />
          <script src="/static/analytics.js" />
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
