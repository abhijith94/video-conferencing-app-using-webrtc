import React, { Component } from 'react';
import { Row, Col, Button, Input } from 'antd';
import { FETCH_MEET_URL, SERVER_URL } from '../../config';
import axios from 'axios';
import './Home.scss';

class Home extends Component {
  state = {
    joinUrl: '',
    meetUrl: '',
    urlCopied: false,
    showCopyUrlSection: false,
  };

  createMeetingBtnHandler = async () => {
    try {
      let data = await axios.get(FETCH_MEET_URL);
      if (data && data.data && data.data.data) {
        this.setState({
          meetUrl: SERVER_URL + '/' + data.data.data,
          showCopyUrlSection: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  copyUrlClickedHandler = async () => {
    try {
      await navigator.clipboard.writeText(this.state.meetUrl);
      this.setState({
        urlCopied: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  joinMeetingHandler = () => {
    this.props.history.push(this.state.joinUrl);
  };

  joinUrlChangedHandler = (e) => {
    this.setState({ joinUrl: e.target.value });
  };

  render() {
    const { urlCopied, showCopyUrlSection, meetUrl } = this.state;

    return (
      <Row className="home">
        <Col span={12} className="create-video-chat">
          <Row align="middle" className="create-meeting-container">
            <Col span={24} style={{ textAlign: 'center' }}>
              <div className="title">
                Host a conference call with just one link.
              </div>
              <Button
                type="primary"
                shape="round"
                className="create-chat-btn"
                onClick={this.createMeetingBtnHandler}
              >
                Create Meeting
              </Button>

              {showCopyUrlSection ? (
                <Row justify="center" className="meeting-url-copy-container">
                  <Col span={10} className="url">
                    {meetUrl}
                  </Col>
                  {urlCopied ? (
                    <Col span={4} className="url-copied">
                      <Button type="primary">Copied</Button>
                    </Col>
                  ) : (
                    <Col span={4} className="url-copy-btn">
                      <Button
                        type="primary"
                        onClick={this.copyUrlClickedHandler}
                      >
                        Copy
                      </Button>
                    </Col>
                  )}
                </Row>
              ) : null}
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
                  <Input
                    type="text"
                    placeholder="paste url here..."
                    value={this.state.joinUrl}
                    onChange={this.joinUrlChangedHandler}
                  />
                </Col>
                <Col span={4} className="join-chat-btn">
                  <Button type="primary" onClick={this.joinMeetingHandler}>
                    Join
                  </Button>
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
