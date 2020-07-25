import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
import './Chat.scss';

class Chat extends Component {
  state = {
    userVideo: 1,
    userAudio: 1,
  };

  userVideoToggle = () => {
    this.setState((prevState) => ({ userVideo: !prevState.userVideo }));
  };

  userAudioToggle = () => {
    this.setState((prevState) => ({ userAudio: !prevState.userAudio }));
  };

  render() {
    const { userAudio, userVideo } = this.state;

    return (
      <div className="Chat">
        <Row style={{ height: '100%' }}>
          <Col span={24} className="chat-container"></Col>
          <Col span={24} className="user-controls">
            <Row justify="center" align="middle" style={{ height: 100 }}>
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
