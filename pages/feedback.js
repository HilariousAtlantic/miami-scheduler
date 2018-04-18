import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { Form, Text, TextArea } from 'react-form';
import axios from 'axios';
import Head from 'next/head';

import { Navbar } from '../components';

const FeedbackWrapper = styled.div`
  min-height: 100vh;
`;

const FeedbackForm = styled.form`
  width: 90%;
  max-width: 400px;
  margin: 64px auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  input,
  textarea {
    width: 400px;
    margin-bottom: 16px;
    padding: 8px;
    background: #ffffff;
    color: #4a4a4a;
    border: 1px solid #ddd;
    font-size: 16px;
    border-radius: 3px;
  }
`;

const Label = styled.label`
  font-weight: 500;
  margin-bottom: 8px;
`;

const SubmitButton = styled.button`
  background: #4caf50;
  color: #ffffff;
  border: none;
  border-radius: 3px;
  padding: 12px 32px;

  &[disabled] {
    opacity: 0.5;
  }
`;

const SubmitMessage = styled.div`
  text-align: center;
  margin-top: 128px;
  font-size: 18px;
  font-weight: 500;
  color: #4a4a4a;
`;

export default class extends Component {
  state = {
    submitting: false,
    submitted: false
  };

  handleSubmit = async (values, event, form) => {
    this.setState({ submitting: true, submitted: false });
    await axios.post('/api/feedback', values);
    this.setState({ submitting: false, submitted: true });
    form.resetAll();
  };

  render() {
    return (
      <FeedbackWrapper>
        <Head>
          <meta
            name="description"
            content="Help us improve your experience by reporting any issues and offering suggestions for new features."
          />
        </Head>
        <Navbar activeLink="feedback" />

        {this.state.submitted ? (
          <SubmitMessage>Thanks for the feedback!</SubmitMessage>
        ) : (
          <Form onSubmit={this.handleSubmit}>
            {form => (
              <FeedbackForm onSubmit={form.submitForm}>
                <Label>Miami Email</Label>
                <Text field="email" type="email" required />
                <Label>Report an issue</Label>
                <TextArea field="issue" rows="5" />
                <Label>Suggest a feature</Label>
                <TextArea field="feature" rows="5" />
                <SubmitButton disabled={this.state.submitting} type="submit">
                  Submit Feedback
                </SubmitButton>
              </FeedbackForm>
            )}
          </Form>
        )}
      </FeedbackWrapper>
    );
  }
}
