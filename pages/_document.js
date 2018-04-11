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
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1,user-scalable=no"
          />
          <meta
            name="google-site-verification"
            content="UdR6JMfwUEVrwQjIAKWfZZxpVaWeONAKgv0vyuHASQw"
          />
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
          <script src="/static/fullstory.js" />
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
          <footer>
            <span>
              Created by Luke Artnak, Grant Eaton, and Brennan Hoeting
            </span>
            <a href="https://github.com/HilariousAtlantic/miami-scheduler">
              <i className="fab fa-github" /> View Source
            </a>
          </footer>
        </body>
      </html>
    );
  }
}
