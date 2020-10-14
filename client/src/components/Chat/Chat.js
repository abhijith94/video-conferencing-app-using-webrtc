import React, { Component } from 'react';
import { Row, Col, Button, Spin, message, Input } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import ChatWindow from '../ChatWindow/ChatWindow';
import Socket from '../../lib/socket';
import Peer from 'peerjs';
import shortid from 'shortid';
import { PEERJS_URL } from '../../config';

import './Chat.scss';

class Chat extends Component {
  state = {
    peers: [],
    userAudioMute: false,
    userVideo: true,
    localPeerId: null,
    chatContainerStyle: {},
    initializing: true,
    interval: null,
    modalVisible: false,
    username: '',
  };

  constructor() {
    super();
    shortid.characters(
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ()'
    );

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

        //when remote peer sends back the stream.
        //NOTE: this is called twice if both audio & video is set to true in getUserMedia. if-else block handles this issue in call.on('stream') below
        call.on('stream', async (stream) => {
          let peers = [...this.state.peers];

          if (peers.find((peer) => peer.peerId === peerId)) {
            peers = peers.map((peer) => {
              if (peer.peerId === peerId) {
                peer.stream = stream;
              }
              return peer;
            });

            this.setState({
              peers,
            });
          } else {
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
              () => this.sendUsernameToPeers()
            );
          }
        });
      }
    });

    this.socket.on('peer-disconnected', ({ peerId }) => {
      let peers = [...this.state.peers];

      let peerToBeRemoved = peers.find((peer) => peer.peerId === peerId);

      peers = peers.filter((peer) => peer.peerId !== peerId);

      this.setState(
        {
          peers,
          chatContainerStyle: this.generateChatContainerStyles(peers.length),
        },
        () => {
          if (peerToBeRemoved) {
            message.info(`${peerToBeRemoved.name} left`);
          }
        }
      );
    });

    this.socket.on('peer-mute', ({ peerId, muteState }) => {
      this.remoteAudioToggle(peerId, muteState);
    });

    this.socket.on('peer-video', ({ peerId, videoState }) => {
      this.remoteVideoToggle(peerId, videoState);
    });

    this.socket.on('share-username', ({ peerId, username }) => {
      let peers = [...this.state.peers];
      let changed = false;

      peers = peers.map((peer) => {
        if (peer.peerId === peerId) {
          if (peer.name !== username) {
            peer.name = username;
            changed = true;
          }
        }
        return peer;
      });

      if (changed) {
        this.setState({ peers }, () => {
          message.info(`${username} joined`);
        });
      }
    });
  }

  userVideoToggle = () => {
    this.setState(
      (prevState) => {
        let peers = [...prevState.peers];

        peers = peers.map((peer) => {
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
      },
      () =>
        this.socket.emit('peer-video', {
          peerId: this.state.localPeerId,
          videoState: this.state.userVideo,
        })
    );
  };

  remoteVideoToggle = (peerId, videoState) => {
    let peers = [...this.state.peers];
    peers = peers.map((peer) => {
      if (peer.peerId === peerId) {
        peer.video = videoState;
      }
      return peer;
    });

    this.setState({ peers });
  };

  userAudioMuteToggle = () => {
    this.setState(
      (prevState) => {
        let peers = [...prevState.peers];

        peers = peers.map((peer) => {
          if (peer.peerId === this.state.localPeerId) {
            if (peer.stream) {
              peer.stream.muted = !prevState.userAudioMute;
            }
            peer.mute = !prevState.userAudioMute;
          }
          return peer;
        });

        return { userAudioMute: !prevState.userAudioMute, peers };
      },
      () =>
        this.socket.emit('peer-mute', {
          peerId: this.state.localPeerId,
          muteState: this.state.userAudioMute,
        })
    );
  };

  remoteAudioToggle = (peerId, muteState) => {
    let peers = [...this.state.peers];
    peers = peers.map((peer) => {
      if (peer.peerId === peerId) {
        peer.mute = muteState;
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
          audio: true,
        });

        const peerjs = new Peer(shortid.generate(), {
          host: PEERJS_URL,
          port: 9000,
          path: '/myapp',
        });

        peerjs.on('open', (id) => {
          let peer = {
            peerId: id,
            mute: false,
            video: true,
            stream,
            peerjs,
            name: localStorage.getItem('username') || '',
          };

          peer.peerjs.on('call', (call) => {
            call.answer(peer.stream);

            call.on('stream', (stream) => {
              let peers = [...this.state.peers];

              if (peers.find((peer) => peer.peerId === call.peer)) {
                peers = peers.map((peer) => {
                  if (peer.peerId === call.peer) {
                    peer.stream = stream;
                  }
                  return peer;
                });

                this.setState({
                  peers,
                });
              } else {
                peers.push({
                  peerId: call.peer,
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
                  () => this.sendUsernameToPeers()
                );
              }
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
          message.error('Somthing went wrong!');
          setTimeout(() => this.props.history.push('/'), 2000);
        });
      } catch (error) {
        message.error(error.message);
        setTimeout(() => this.props.history.push('/'), 2000);
      } finally {
        this.setState({ initializing: false });
      }
    }
  };

  sendUsernameToPeers = () => {
    this.setState({
      interval: setInterval(() => {
        let peerId = this.state.localPeerId;
        let username = localStorage.getItem('username');

        if (peerId && username) {
          this.socket.emit('share-username', {
            peerId,
            username,
          });
        }
      }, 2000),
    });
  };

  componentDidMount() {
    this.socket.on('connect', async () => {
      if (localStorage.getItem('username')) {
        let style = this.generateChatContainerStyles();

        this.setState({ chatContainerStyle: style }, () => {
          this.setupLocalUserStream();
        });
      } else {
        this.setState({ modalVisible: true });
      }
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
              ></ChatWindow>
            ))}
          </Col>
          <Col span={24} className="user-controls">
            <Row justify="center" align="middle">
              <Col className="user-audio">
                <Button
                  type="primary"
                  shape="circle"
                  icon={
                    <i
                      className={`${
                        userAudioMute
                          ? 'fas fa-microphone-slash'
                          : 'fas fa-microphone'
                      }`}
                    ></i>
                  }
                  size={'large'}
                  className="microphone"
                  onClick={this.userAudioMuteToggle}
                />
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
                <Button
                  type="primary"
                  shape="circle"
                  icon={
                    <i
                      className={`${
                        userVideo ? 'fas fa-video' : 'fas fa-video-slash'
                      }`}
                    ></i>
                  }
                  size={'large'}
                  className="video"
                  onClick={this.userVideoToggle}
                ></Button>
              </Col>
            </Row>
          </Col>
        </Row>
        {this.state.initializing ? (
          <div className="spinner">
            <Spin size="large" />
          </div>
        ) : null}

        <Modal
          title="Please enter a friendly name"
          centered
          visible={this.state.modalVisible}
          onOk={() => {
            console.log(this.state.username);
            if (this.state.username.trim() !== '') {
              localStorage.setItem('username', this.state.username);
              let style = this.generateChatContainerStyles();

              this.setState(
                { chatContainerStyle: style, modalVisible: false },
                () => {
                  this.setupLocalUserStream();
                }
              );
            } else {
              message.error('Please enter a friendly name!');
            }
          }}
          onCancel={() => {
            this.setState({ modalVisible: false }, () => {
              this.props.history.push('/');
            });
          }}
        >
          <Input
            type="text"
            placeholder="Friendly name..."
            value={this.state.username}
            onChange={(e) => {
              let username = e.target.value;
              this.setState({ username });
            }}
          />
        </Modal>
      </div>
    );
  }

  componentWillUnmount() {
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
  }
}

export default Chat;
