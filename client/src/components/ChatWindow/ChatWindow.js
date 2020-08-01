import React, { Component } from 'react';
import { Button } from 'antd';
import './ChatWindow.scss';

class ChatWindow extends Component {
  constructor() {
    super();
    this.videoRef = React.createRef();
  }

  componentDidMount() {
    this.videoRef.current.srcObject = this.props.stream;
  }

  componentDidUpdate() {
    this.videoRef.current.srcObject = this.props.stream;
  }

  render() {
    let style = {
      borderRadius: '10px',
    };

    if (this.props.localPeerId === this.props.peerId) {
      style = {
        border: '3px solid #536DFE',
        borderRadius: '10px',
      };
    }

    return (
      <div className="Peer" style={{ ...style }}>
        <video autoPlay ref={this.videoRef} className="video-element"></video>

        {this.props.localPeerId !== this.props.peerId ? (
          <div className="user-mute">
            {!this.props.mute ? (
              <Button
                shape="circle"
                icon={<i className="fas fa-microphone"></i>}
                size={'large'}
                className="microphone"
                onClick={() => this.props.remoteAudioToggle(this.props.peerId)}
              ></Button>
            ) : (
              <Button
                shape="circle"
                icon={<i className="fas fa-microphone-slash"></i>}
                size={'large'}
                className="microphone"
                onClick={() => this.props.remoteAudioToggle(this.props.peerId)}
              />
            )}
          </div>
        ) : null}

        {this.props.localPeerId === this.props.peerId ? (
          <div className="user-mute">
            {!this.props.mute ? (
              <Button
                shape="circle"
                icon={<i className="fas fa-microphone"></i>}
                size={'large'}
                className="microphone"
                style={{ pointerEvents: 'none' }}
              ></Button>
            ) : (
              <Button
                shape="circle"
                icon={<i className="fas fa-microphone-slash"></i>}
                size={'large'}
                className="microphone"
                style={{ pointerEvents: 'none' }}
              />
            )}
          </div>
        ) : null}

        {!this.props.video ? (
          <div className="video-disabled">
            <i className="fas fa-video-slash"></i>
          </div>
        ) : null}
      </div>
    );
  }
}

export default ChatWindow;
