import React, { Component } from 'react';
import { Row, Col, Button, Input } from 'antd';
import { connect } from 'react-redux';
import {
  showCopyUrlSection_,
  copyUrlClicked,
} from '../../redux/home/homeActions';
import axios from 'axios';
import { FETCH_MEET_URL, SERVER_URL } from '../../config';
import './Home.scss';

class Home extends Component {
  createMeetingBtnHandler = async () => {
    const { showCopyUrlSection_ } = this.props;
    try {
      let data = await axios.get(FETCH_MEET_URL);
      if (data && data.data && data.data.data) {
        showCopyUrlSection_({
          meetUrl: SERVER_URL + '/' + data.data.data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  copyUrlClickedHandler = () => {
    const { copyUrlClicked, meetUrl } = this.props;
    navigator.clipboard.writeText(meetUrl).then(
      function () {
        copyUrlClicked();
      },
      function (err) {
        console.error(err);
      }
    );
  };

  render() {
    const { urlCopied, showCopyUrlSection, meetUrl } = this.props;

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

const mapStateToProps = (state) => ({
  meetUrl: state.home.meetUrl,
  urlCopied: state.home.urlCopied,
  showCopyUrlSection: state.home.showCopyUrlSection,
});

const mapDispatchToProps = (dispatch) => ({
  showCopyUrlSection_: (data) => dispatch(showCopyUrlSection_(data)),
  copyUrlClicked: () => dispatch(copyUrlClicked()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
