import React, { Component } from 'react';
import { Row, Col, Button, Input } from 'antd';
import './Home.scss';

class Home extends Component {
  state = {
    copied: false,
  };

  render() {
    return (
      <Row className="home">
        <Col span={12} className="create-video-chat">
          <Row align="middle" className="create-meeting-container">
            <Col span={24} style={{ textAlign: 'center' }}>
              <div className="title">
                Host a conference call with just one link.
              </div>
              <Button type="primary" shape="round" className="create-chat-btn">
                Create Meeting
              </Button>

              <Row justify="center" className="meeting-url-copy-container">
                <Col span={10} className="url">
                  http://google.com/dpaslpalcpsa
                </Col>
                {this.state.copied ? (
                  <Col span={4} className="url-copied">
                    <Button type="primary">Copied</Button>
                  </Col>
                ) : (
                  <Col span={4} className="url-copy-btn">
                    <Button
                      type="primary"
                      onClick={() => this.setState({ copied: true })}
                    >
                      Copy
                    </Button>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        </Col>
        <Col span={12} className="start-video-chat">
          <Row align="middle" className="join-meeting-container">
            <Col span={24} style={{ textAlign: 'center' }}>
              <div className="title">
                Paste the link below to join the meeting.
              </div>
              <Row justify="center" className="meeting-url-join-container">
                <Col span={10} className="url">
                  <Input type="text" placeholder="paste url here..." />
                </Col>
                <Col span={4} className="join-chat-btn">
                  <Button type="primary">Join</Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default Home;
