# AWS Amplify Lex V2 Provider

## Dependencies

### Peer Dependencies

- Your project must provide `@aws-amplify/core@^4.0.0`

```sh
    yarn add @aws-amplify/core@^4.0.0
```

## Config

### Bot config

Must provide bot configuration with:

- `botId: string` Lex V2 bot's id
- `botAliasId: string` Lex V2 bot's alias id
- `localeId: string` Lex V2 bot's locale id
- `region: string` Lex V2 bot's region
- `providerName: 'AWSLex2Provider'` Must always be `AWSLex2Provider` 


### Add the provider to Amplify

```ts
import { Interactions } from '@aws-amplify/interactions';

Interactions.addPluggable(new AWSLex2Provider());
```

### Config Example

```ts
// index.tsx
import { Amplify } from '@aws-amplify/core';
import { Interactions } from '@aws-amplify/interactions';
import { AWSLex2Provider } from './service/interactions/Providers/AWSLex2Provider';
import awsmobile from 'aws-exports'

Interactions.addPluggable(new AWSLex2Provider());

Amplify.Logger.LOG_LEVEL = 'DEBUG';
Amplify.configure({
  ...awsmobile,
  bots: {
    ['myBotName']: {
      botId: 'myBotId',
      botAliasId: 'myBotAliasId',
      localeId: 'myBotLocaleId',
      region: 'us-east-1',
      providerName: 'AWSLex2Provider',
    },
  },
});
```

## Usage

Now you can use `Interactions.send()` with your Lex V2 bot

`Interactions.send()` will return either `RecognizeTextCommandOutput` or `RecognizeUtteranceCommandOutput` from [@aws-sdk/client-lex-runtime-v2](https://www.npmjs.com/package/@aws-sdk/client-lex-runtime-v2)

### Example
```ts
await Interactions.send('myBot', 'User input text') // will return RecognizeTextCommandOutput

await Interactions.send('myBot',{ content: 'User input text', options: { messageType: 'text' } }); // will return RecognizeUtteranceCommandOutput

const voiceData: Blob | ReadableStream = getUserVoiceInput(); // voice data must be either Blob or ReadableStream
await Interactions.send(voiceData ,{ content: text, options: { messageType: 'voice' } }); // will return RecognizeUtteranceCommandOutput
```

## React

For React component example see examples folder