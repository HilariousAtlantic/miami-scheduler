import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { Form, Text, RadioGroup, Radio, TextArea } from 'react-form';
import axios from 'axios';

import { Navbar } from '../components';

const FeedbackWrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;

const FeedbackForm = styled.form`
  width: 90%;
  max-width: 400px;
  margin: 64px auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  input[type='text'],
  input[type='email'],
  input[type='number'],
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

const RadioWrapper = styled.div`
  display: flex;
  margin-bottom: 8px;

  input {
    margin-right: 8px;
  }
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

const types = {
  issue: (
    <Fragment>
      <Label>What happened?</Label>
      <TextArea rows="5" field="issue_description" required />
      <Label>What courses did you have selected when it happened?</Label>
      <Text type="text" field="issue_courses" required />
      <Label>What did you do to cause the issue?</Label>
      <TextArea rows="5" field="issue_replication" required />
    </Fragment>
  ),
  suggestion: (
    <Fragment>
      <Label>Suggestion Name</Label>
      <Text type="text" field="suggestion_name" required />
      <Label>Suggestion Description</Label>
      <TextArea rows="5" field="suggestion_description" required />
    </Fragment>
  ),
  review: (
    <Fragment>
      <Label>What would you rate the website out of 5?</Label>
      <Text type="number" field="review_rating" required />
      <Label>How was your experience using the website?</Label>
      <TextArea rows="5" field="review_description" required />
    </Fragment>
  )
};

const initialValues = {
  type: 'issue'
};

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
        <Navbar activeLink="feedback" />

        {this.state.submitted ? (
          <SubmitMessage>Thanks for the feedback!</SubmitMessage>
        ) : (
          <Form onSubmit={this.handleSubmit} defaultValues={initialValues}>
            {form => (
              <FeedbackForm onSubmit={form.submitForm}>
                <Label>Name</Label>
                <Text type="text" field="name" required />
                <Label>Email</Label>
                <Text field="email" type="email" required />
                <Label>Feedback Type</Label>
                <RadioGroup field="type">
                  <RadioWrapper>
                    <Radio value="issue" />
                    <label>Report Issue</label>
                  </RadioWrapper>
                  <RadioWrapper>
                    <Radio value="suggestion" />
                    <label>Suggest Feature</label>
                  </RadioWrapper>
                  <RadioWrapper>
                    <Radio value="review" />
                    <label>Leave Review</label>
                  </RadioWrapper>
                </RadioGroup>
                <br />
                {types[form.values.type]}
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
