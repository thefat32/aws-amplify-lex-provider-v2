import React from 'react';
import { Message, MessageContentType } from '@aws-sdk/client-lex-runtime-v2';
import ImageResponseCardRender from './ImageResponseCardRender';
import CustomPayloadRender from './CustomPayloadRender';
import Typography from '@material-ui/core/Typography';

interface Props {
  message: Message;
  enabled: boolean;
  sendMessage: (message: string) => void;
}

const MessageRender = ({
  message,
  enabled,
  sendMessage,
}: Props): React.ReactElement => {
  switch (message.contentType) {
    case MessageContentType.CUSTOM_PAYLOAD:
      return <CustomPayloadRender message={message} />;
    case MessageContentType.IMAGE_RESPONSE_CARD:
      return (
        <ImageResponseCardRender
          message={message}
          enabled={enabled}
          sendMessage={sendMessage}
        />
      );
    case MessageContentType.PLAIN_TEXT:
      return <Typography variant={'body1'}>{message.content}</Typography>;
  }
  return <></>;
};

export default MessageRender;
