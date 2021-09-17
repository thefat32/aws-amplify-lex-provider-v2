// @ts-ignore
import { ConsoleLogger as Logger } from '@aws-amplify/core';
import {
  InteractionsOptions,
  InteractionsProvider,
  InteractionsResponse,
  // @ts-ignore
} from '@aws-amplify/interactions';

const logger = new Logger('AbstractInteractionsProvider');

export abstract class AbstractInteractionsProvider
  implements InteractionsProvider
{
  protected _config: InteractionsOptions;

  constructor(options: InteractionsOptions = {}) {
    this._config = options;
  }

  configure(config: InteractionsOptions = {}): InteractionsOptions {
    this._config = { ...this._config, ...config };

    logger.debug(`configure ${this.getProviderName()}`, this._config);

    return this.options;
  }

  getCategory() {
    return 'Interactions';
  }

  abstract getProviderName(): string;

  protected get options(): InteractionsOptions {
    return { ...this._config };
  }

  public abstract sendMessage(
    botname: string,
    message: string | Object
  ): Promise<object>;

  public abstract onComplete(
    botname: string,
    callback: (err: any, confirmation: InteractionsResponse) => void
  ): void;
}
