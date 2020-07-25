import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
import ChatWindow from '../ChatWindow/ChatWindow';
import './Chat.scss';

class Chat extends Component {
  state = {
    userVideo: 1,
    userAudio: 1,
    localPeerId: 123,
    peers: [
      {
        peerId: 123,
        name: 'Sam',
        mute: 0,
      },
      {
        peerId: 265,
        name: 'Max',
        mute: 0,
      },
    ],
    chatContainerStyle: {},
  };

  userVideoToggle = () => {
    this.setState((prevState) => ({ userVideo: !prevState.userVideo }));
  };

  userAudioToggle = () => {
    this.setState((prevState) => ({ userAudio: !prevState.userAudio }));
  };

  remoteAudioToggle = (peerId) => {
    let peers = [...this.state.peers];
    peers = peers.map((peer) => {
      if (peer.peerId === peerId) {
        peer.mute = !peer.mute;
      }
      return peer;
    });
    this.setState({ peers });
  };

  generateChatContainerStyles() {
    let style = {};

    switch (this.state.peers.length) {
      case 1:
        style = {
          gridTemplateColumns: '1fr',
          gridAutoRows: '60%',
          alignContent: 'center',
          justifyItems: 'center',
          padding: '0 25%',
        };
        break;
      case 2:
        style = {
          gridTemplateColumns: '1fr 1fr',
          gridAutoRows: '60%',
          alignContent: 'center',
          justifyItems: 'center',
          columnGap: '50px',
          padding: '0 5%',
        };
        break;
      case 3:
        style = {
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '45%',
          gridAutoRows: '45%',
          gridAutoColumns: '1fr 1fr 1fr',
          alignContent: 'center',
          justifyItems: 'center',
          columnGap: '40px',
          rowGap: '20px',
          padding: '0 10%',
        };
        break;
      case 4:
        style = {
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '45% 45%',
          alignContent: 'center',
          justifyItems: 'center',
          columnGap: '40px',
          rowGap: '20px',
          padding: '0 10%',
        };
        break;
      case 5:
        style = {
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: '40% 40%',
          alignContent: 'center',
          justifyItems: 'center',
          columnGap: '40px',
          rowGap: '20px',
          padding: '0 10%',
        };
        break;
      default:
        style = {
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gridTemplateRows: '30% 30%',
          gridAutoRows: '30%',
          gridAutoColumns: '1fr 1fr 1fr 1fr',
          alignContent: 'center',
          justifyItems: 'center',
          columnGap: '30px',
          rowGap: '20px',
          padding: '0 10%',
        };
        break;
    }

    this.setState({ chatContainerStyle: style });
  }

  endCallHandler = () => {
    this.props.history.push('/');
  };

  componentDidMount() {
    this.generateChatContainerStyles();
  }

  render() {
    const { userAudio, userVideo, localPeerId } = this.state;

    return (
      <div className="Chat">
        <Row style={{ height: '100%' }}>
          <Col
            span={24}
            className="chat-container"
            style={{ ...this.state.chatContainerStyle }}
          >
            {this.state.peers.map((peer) => (
              <ChatWindow
                {...peer}
                localPeerId={localPeerId}
                key={peer.peerId}
                remoteAudioToggle={this.remoteAudioToggle}
              ></ChatWindow>
            ))}
          </Col>
          <Col span={24} className="user-controls">
            <Row justify="center" align="middle">
              <Col className="user-audio">
                {userAudio ? (
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<i className="fas fa-microphone"></i>}
                    size={'large'}
                    className="microphone"
                    onClick={this.userAudioToggle}
                  ></Button>
                ) : (
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<i className="fas fa-microphone-slash"></i>}
                    size={'large'}
                    className="microphone"
                    onClick={this.userAudioToggle}
                  />
                )}
              </Col>
              <Col className="user-hang-up">
                <Button
                  type="primary"
                  danger
                  shape="circle"
                  icon={<i className="fas fa-phone-slash"></i>}
                  size={'large'}
                  className="hang-up"
                  onClick={this.endCallHandler}
                ></Button>
              </Col>
              <Col className="user-video">
                {userVideo ? (
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<i className="fas fa-video"></i>}
                    size={'large'}
                    className="video"
                    onClick={this.userVideoToggle}
                  ></Button>
                ) : (
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<i className="fas fa-video-slash"></i>}
                    size={'large'}
                    className="video"
                    onClick={this.userVideoToggle}
                  />
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Chat;
