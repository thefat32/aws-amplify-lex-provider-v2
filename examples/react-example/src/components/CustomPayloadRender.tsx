import React from 'react';
import { Message } from '@aws-sdk/client-lex-runtime-v2';
import Typography from '@material-ui/core/Typography';

interface Props {
  message: Message;
}

const CustomPayloadRender = ({ message }: Props): React.ReactElement => {
  // Here you should parse and generate content based on your custom payload
  return <Typography variant={'body1'} > {message.content} </Typography>;
};

export default CustomPayloadRender;
