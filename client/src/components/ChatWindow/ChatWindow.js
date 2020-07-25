import React from 'react';
import { Button } from 'antd';
import './ChatWindow.scss';

function ChatWindow(props) {
  let style = {
    borderRadius: '10px',
  };

  if (props.localPeerId === props.peerId) {
    style = {
      border: '3px solid #536DFE',
      borderRadius: '10px',
    };
  }
  return (
    <div className="Peer" style={{ ...style }}>
      {props.localPeerId !== props.peerId ? (
        <div className="user-mute">
          {!props.mute ? (
            <Button
              shape="circle"
              icon={<i className="fas fa-microphone"></i>}
              size={'large'}
              className="microphone"
              onClick={() => props.remoteAudioToggle(props.peerId)}
            ></Button>
          ) : (
            <Button
              shape="circle"
              icon={<i className="fas fa-microphone-slash"></i>}
              size={'large'}
              className="microphone"
              onClick={() => props.remoteAudioToggle(props.peerId)}
            />
          )}
        </div>
      ) : null}
    </div>
  );
}

export default ChatWindow;
