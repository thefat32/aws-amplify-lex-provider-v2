import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from '@aws-amplify/core';
import { Interactions } from '@aws-amplify/interactions';
import AWSLex2Provider from '@thefat32/aws-amplify-lex-provider-v2';

Interactions.addPluggable(new AWSLex2Provider());

Amplify.Logger.LOG_LEVEL = 'DEBUG';
Amplify.configure({
  // This Cognito instance should have unauthenticated identities enabled and AmazonLexRunBotsOnly policy attached to UnAuthenticatedRole
  Auth: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID,
    // REQUIRED - Amazon Cognito Region
    region: process.env.REACT_APP_COGNITO_REGION,
  },
  bots: {
    [process.env.REACT_APP_BOT_ID as string]: {
      botId: process.env.REACT_APP_BOT_ID,
      botAliasId: process.env.REACT_APP_BOT_ALIAS_ID,
      localeId: process.env.REACT_APP_BOT_LOCALE_ID,
      region: process.env.REACT_APP_BOT_REGION,
      providerName: 'AWSLex2Provider',
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
