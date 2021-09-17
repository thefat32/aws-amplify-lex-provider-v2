import {
  LexRuntimeV2Client,
  RecognizeTextCommand,
  RecognizeTextCommandInput,
  RecognizeUtteranceCommand,
  RecognizeUtteranceCommandInput,
  SessionState,
} from '@aws-sdk/client-lex-runtime-v2';
import {
  ConsoleLogger as Logger,
  Credentials,
  getAmplifyUserAgent,
  // @ts-ignore
} from '@aws-amplify/core';
import { convert } from './helpers/convert';
import {
  InteractionsMessage,
  InteractionsOptions,
  InteractionsResponse,
  // @ts-ignore
} from '@aws-amplify/interactions';
import { AbstractInteractionsProvider } from './AbstractInteractionsProvider';
import { unGzipBase64AsJson } from './helpers/gzip';

const logger = new Logger('AWSLex2Provider');

export class AWSLex2Provider extends AbstractInteractionsProvider {
  // @ts-ignore
  private lex2RuntimeServiceClient: LexRuntimeV2Client;
  private _botsCompleteCallback: object;

  constructor(options: InteractionsOptions = {}) {
    super(options);
    this._botsCompleteCallback = {};
  }

  getProviderName() {
    return 'AWSLex2Provider';
  }

  reportBotStatus(botname: string, sessionState?: SessionState) {
    // Check if state is fulfilled to resolve onFullfilment promise
    logger.debug('postContent state', sessionState?.intent?.state);
    if (
      sessionState?.intent?.state === 'ReadyForFulfillment' ||
      sessionState?.intent?.state === 'Fulfilled'
    ) {
      // @ts-ignore
      if (typeof this._botsCompleteCallback[botname] === 'function') {
        setTimeout(
          () =>
            // @ts-ignore
            this._botsCompleteCallback[botname](null, {
              slots: sessionState?.intent?.slots,
            }),
          0
        );
      }

      if (
        this._config &&
        typeof this._config[botname].onComplete === 'function'
      ) {
        setTimeout(
          () =>
            this._config[botname].onComplete(null, {
              slots: sessionState?.intent?.slots,
            }),
          0
        );
      }
    }

    if (sessionState?.intent?.state === 'Failed') {
      // @ts-ignore
      if (typeof this._botsCompleteCallback[botname] === 'function') {
        setTimeout(
          // @ts-ignore
          () => this._botsCompleteCallback[botname]('Bot conversation failed'),
          0
        );
      }

      if (
        this._config &&
        typeof this._config[botname].onComplete === 'function'
      ) {
        setTimeout(
          () => this._config[botname].onComplete('Bot conversation failed'),
          0
        );
      }
    }
  }

  async sendMessage(
    botname: string,
    message: string | InteractionsMessage
  ): Promise<InteractionsResponse> {
    if (!this._config[botname]) {
      return Promise.reject('Bot ' + botname + ' does not exist');
    }
    const credentials = await Credentials.get();
    if (!credentials) {
      return Promise.reject('No credentials');
    }
    this.lex2RuntimeServiceClient = new LexRuntimeV2Client({
      region: this._config[botname].region,
      credentials,
      customUserAgent: getAmplifyUserAgent(),
    });
    let params: RecognizeTextCommandInput | RecognizeUtteranceCommandInput;
    if (typeof message === 'string') {
      params = {
        botAliasId: this._config[botname].botAliasId,
        botId: this._config[botname].botId,
        localeId: this._config[botname].localeId,
        text: message,
        sessionId: credentials.identityId,
      };

      logger.debug('postText to lex2', message);

      try {
        const postTextCommand = new RecognizeTextCommand(params);
        const data = await this.lex2RuntimeServiceClient.send(postTextCommand);
        this.reportBotStatus(botname, data.sessionState);
        return data;
      } catch (err) {
        return Promise.reject(err);
      }
    } else {
      const {
        content,
        options: { messageType },
      } = message;

      if (messageType === 'voice') {
        params = {
          botAliasId: this._config[botname].botAliasId,
          botId: this._config[botname].botId,
          localeId: this._config[botname].localeId,
          sessionId: credentials.identityId,
          requestContentType: 'audio/x-l16; sample-rate=16000; channel-count=1',
          inputStream: await convert(content as Blob),
        } as RecognizeUtteranceCommandInput;
      } else {
        params = {
          botAliasId: this._config[botname].botAliasId,
          botId: this._config[botname].botId,
          localeId: this._config[botname].localeId,
          sessionId: credentials.identityId,
          requestContentType: 'text/plain; charset=utf-8',
          inputStream: content as string,
        } as RecognizeUtteranceCommandInput;
      }
      logger.debug('postContent to lex2', message);
      try {
        // @ts-ignore
        const postContentCommand = new RecognizeUtteranceCommand(params);
        const data = await this.lex2RuntimeServiceClient.send(
          postContentCommand
        );
        // @ts-ignore
        const audioArray = await convert(data.audioStream);
        this.reportBotStatus(
          botname,
          data.sessionState
            ? unGzipBase64AsJson<SessionState>(data.sessionState)
            : undefined
        );
        return { ...data, ...{ audioStream: audioArray } };
      } catch (err) {
        return Promise.reject(err);
      }
    }
  }

  // @ts-ignore
  onComplete(botname: string, callback) {
    if (!this._config[botname]) {
      throw new ErrorEvent('Bot ' + botname + ' does not exist');
    }
    // @ts-ignore
    this._botsCompleteCallback[botname] = callback;
  }
}
