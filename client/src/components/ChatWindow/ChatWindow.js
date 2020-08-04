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

        <div className="user-mute">
          <Button
            shape="circle"
            icon={
              <i
                className={`${
                  this.props.mute
                    ? 'fas fa-microphone-slash'
                    : 'fas fa-microphone'
                }`}
              ></i>
            }
            size={'large'}
            className="microphone"
            style={{ pointerEvents: 'none' }}
          ></Button>
          <span className="uname">{this.props.name}</span>
        </div>

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
