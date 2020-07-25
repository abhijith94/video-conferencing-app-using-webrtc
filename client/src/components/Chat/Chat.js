import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
import ChatWindow from '../ChatWindow/ChatWindow';
import Socket from '../../lib/socket';
import Peer from 'peerjs';

import './Chat.scss';

class Chat extends Component {
  state = {
    userVideo: 1,
    userAudio: 1,
    localPeerId: 123,
    peers: [],
    chatContainerStyle: {},
  };

    constructor() {
    super();
    let socketInstance = new Socket();
    this.socket = socketInstance.socket;

    this.socket.on('newPeer', ({ peerId }) => {
      console.log('newPeer');

      let peerjs = null;
      let localStream = null;
      this.state.peers.forEach((peer) => {
        if (peer.peerId === this.state.localPeerId) {
          peerjs = peer.peerjs;
          localStream = peer.stream;
        }
      });

      if (peerjs && localStream) {
        var call = peerjs.call(peerId, localStream); //call the remote peer

        //when remote peer sends back the stream
        call.on('stream', async (stream) => {
          let peers = [...this.state.peers];

          peers.push({
            peerId: peerId,
            name: 'Max2',
            mute: 0,
            stream,
          });

          this.setState(
            {
              peers,
              chatContainerStyle: this.generateChatContainerStyles(
                peers.length
              ),
            },
            () => {
              this.remoteAudioToggle(peerId, 0); //add due bug where remote stream is not visible unless state updated again
            }
          );
        });
      }
    });
  }
  
  userVideoToggle = () => {
    this.setState((prevState) => ({ userVideo: !prevState.userVideo }));
  };

  userAudioToggle = () => {
    this.setState((prevState) => ({ userAudio: !prevState.userAudio }));
  };

  remoteAudioToggle = (peerId, status = null) => {
    let peers = [...this.state.peers];
    peers = peers.map((peer) => {
      if (peer.peerId === peerId) {
        peer.mute = status === null ? !peer.mute : status;
      }
      return peer;
    });
    this.setState({ peers });
  };

  generateChatContainerStyles(size = null) {
    let style = {};

    switch (size || this.state.peers.length) {
      case 0:
        style = {
          gridTemplateColumns: '1fr',
          gridAutoRows: '70%',
          alignContent: 'center',
          justifyItems: 'center',
          padding: '0 30%',
        };
        break;
      case 1:
        style = {
          gridTemplateColumns: '1fr',
          gridAutoRows: '70%',
          alignContent: 'center',
          justifyItems: 'center',
          padding: '0 30%',
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

    return style;
  }

  endCallHandler = () => {
    this.props.history.push('/');
  };

  setupLocalUserStream = async () => {
    if (navigator.mediaDevices.getUserMedia) {
      try {
        let stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          //audio: true,
        });

        let peers = [...this.state.peers];

        peers = peers.map((peer) => {
          if (peer.peerId === this.state.localPeerId) {
            peer.stream = stream;

            peer.peerjs.on('call', (call) => {
              call.answer(peer.stream);

              let peers = [...this.state.peers];
              peers.push({
                peerId: call.peer,
                name: 'Max2',
                mute: 0,
                stream: call.localStream,
              });

              this.setState(
                {
                  peers,
                  chatContainerStyle: this.generateChatContainerStyles(
                    peers.length
                  ),
                },
                () => {
                  this.remoteAudioToggle(call.peer, 0);
                }
              );
            });
          }
          return peer;
        });

        await this.setState({ peers });

        this.socket.emit('peerjsInitialized', {
          peerId: this.state.localPeerId,
          roomId: this.props.match.params[0],
        });
      } catch (error) {
        console.log('Something went wrong!', error);
      }
    }
  };

  async componentDidMount() {
    let generateChatContainerStyles = this.generateChatContainerStyles.bind(
      this
    );
    let setupLocalUserStream = this.setupLocalUserStream.bind(this);
    let setState = this.setState.bind(this);

    this.socket.on('connect', async () => {
      let style = generateChatContainerStyles();
      const peerjs = new Peer(this.socket.id, {
        host: 'peerjs.92k.de',
        secure: true,
      });

      peerjs.on('open', function (id) {
        console.log('My peer ID is: ' + id);
      });

      peerjs.on('error', function (err) {
        console.log('Error: ', err);
      });

      await setState({
        localPeerId: this.socket.id,
        peers: [
          {
            peerId: this.socket.id,
            name: 'Max',
            mute: 0,
            stream: null,
            peerjs,
          },
        ],
        chatContainerStyle: style,
      });

      setupLocalUserStream();
    });
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
