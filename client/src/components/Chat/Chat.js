import React, { Component } from 'react';
import { Row, Col, Button, Spin, message } from 'antd';
import ChatWindow from '../ChatWindow/ChatWindow';
import Socket from '../../lib/socket';
import Peer from 'peerjs';

import './Chat.scss';

class Chat extends Component {
  state = {
    peers: [],
    userAudioMute: false,
    userVideo: true,
    localPeerId: null,
    chatContainerStyle: {},
    initializing: true,
  };

  constructor() {
    super();

    let socketInstance = new Socket();
    this.socket = socketInstance.socket;

    this.socket.on('new-peer-connected', ({ peerId }) => {
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
            peerId,
            mute: false,
            video: true,
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

    this.socket.on('peer-disconnected', ({ peerId }) => {
      let peers = this.state.peers.filter((peer) => peer.peerId !== peerId);

      this.setState({
        peers,
        chatContainerStyle: this.generateChatContainerStyles(peers.length),
      });
    });
  }

  userVideoToggle = () => {
    this.setState((prevState) => {
      let peers = [];

      peers = prevState.peers.map((peer) => {
        if (peer.peerId === this.state.localPeerId) {
          if (peer.stream) {
            if (prevState.userVideo) {
              peer.stream.getTracks().forEach((track) => {
                track.enabled = false;
              });
            } else {
              peer.stream.getTracks().forEach((track) => {
                track.enabled = true;
              });
            }
            peer.video = !prevState.userVideo;
          }
        }
        return peer;
      });

      return { userVideo: !prevState.userVideo, peers };
    });
  };

  userAudioMuteToggle = () => {
    this.setState((prevState) => {
      let peers = [];

      peers = prevState.peers.map((peer) => {
        if (peer.peerId === this.state.localPeerId) {
          if (peer.stream) {
            peer.stream.muted = !prevState.userAudioMute;
          }
          peer.mute = !prevState.userAudioMute;
        }
        return peer;
      });

      return { userAudioMute: !prevState.userAudioMute, peers };
    });
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
    this.state.peers.forEach(async (peer) => {
      if (peer.peerId === this.state.localPeerId) {
        peer.peerjs.destroy();

        if (peer.stream) {
          peer.stream.getTracks().forEach((track) => {
            track.stop();
          });
        }

        let socketInstance = new Socket();
        socketInstance.destroy();
        this.socket.disconnect();
      }
    });
    this.props.history.push('/');
  };

  setupLocalUserStream = async () => {
    if (navigator.mediaDevices.getUserMedia) {
      try {
        let stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          //audio: true,
        });

        const peerjs = new Peer();

        peerjs.on('open', (id) => {
          let peer = {
            peerId: id,
            mute: false,
            video: true,
            stream,
            peerjs,
          };

          peer.peerjs.on('call', (call) => {
            call.answer(peer.stream);

            call.on('stream', (stream) => {
              let peers = [...this.state.peers];

              peers.push({
                peerId: call.peer,
                mute: false,
                video: true,
                stream,
              });

              this.setState({
                peers,
                chatContainerStyle: this.generateChatContainerStyles(
                  peers.length
                ),
              });
            });
          });

          this.setState({ peers: [peer], localPeerId: id }, () => {
            this.socket.emit('join-room', {
              peerId: this.state.localPeerId,
              roomId: this.props.match.params[0],
            });
          });
        });

        peerjs.on('error', function (err) {
          console.log('Error: ', err);
        });
      } catch (error) {
        message.error('Somthing went wrong!');
      } finally {
        this.setState({ initializing: false });
      }
    }
  };

  componentDidMount() {
    this.socket.on('connect', async () => {
      let style = this.generateChatContainerStyles();

      this.setState({ chatContainerStyle: style }, () => {
        this.setupLocalUserStream();
      });
    });
  }

  render() {
    const { userAudioMute, userVideo, localPeerId } = this.state;

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
                {userAudioMute ? (
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<i className="fas fa-microphone-slash"></i>}
                    size={'large'}
                    className="microphone"
                    onClick={this.userAudioMuteToggle}
                  />
                ) : (
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<i className="fas fa-microphone"></i>}
                    size={'large'}
                    className="microphone"
                    onClick={this.userAudioMuteToggle}
                  ></Button>
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
        {this.state.initializing ? (
          <div className="spinner">
            <Spin size="large" />
          </div>
        ) : null}
      </div>
    );
  }
}

export default Chat;
