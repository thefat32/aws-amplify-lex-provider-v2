import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Lex2ChatBot from './components/Lex2ChatBot';
import { AmplifyTheme } from 'aws-amplify-react';

const useStyles = makeStyles({
  chatBotContainer: {
    margin: '40px 0',
    display: 'flex',
    justifyContent: 'center',
    position: 'fixed',
    right: '40px',
    bottom: '15px',
    zIndex: 9999,
    boxShadow: '5px 5px 13px rgba(91, 81, 81, 0.4)',
    borderRadius: '5px',
  },
});

// Imported default theme can be customized by overloading attributes
const myTheme = {
  ...AmplifyTheme,
  sectionHeader: {
    ...AmplifyTheme.sectionHeader,
    backgroundColor: '#ff6600',
  },
};

function App() {
  const classes = useStyles();
  const handleComplete = useCallback(() => {
    console.log('HANDLE COMPLETE');
  }, []);
  return (
    <div>
      <div className={classes.chatBotContainer}>
            <Lex2ChatBot
              title="Lex V2 Bot"
              theme={myTheme}
              botName={process.env.REACT_APP_BOT_ID}
              onComplete={handleComplete}
              clearOnComplete={false}
              conversationModeOn={false}
              voiceEnabled={false}
              initialMessage={'Hi'}
        />
      </div>
    </div>
  );
}

export default App;
