import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    width: '90%',
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
});

function getStepContent(step) {
  switch (step) {
    case 0:
      return `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`;
    case 1:
      return 'An ad group contains one or more ads which target a shared set of keywords.';
    case 2:
      return `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`;
    default:
      return 'Unknown step';
  }
}

class VerticalLinearStepper extends React.Component {
  state = {
    activeStep: 0,
  };

  handleClick = (e) => {
    console.log('click');
    console.log(e.target);
    this.setState({
      activeStep: e.target.key
    })
  }

  render() {
    const { classes } = this.props;
    const { activeStep } = this.state;

    let requirementHistory = null;

    if (this.props.requirements !== null){
      requirementHistory = this.props.requirements.map((req, index) => {
        let stepContent = <span><p>Completed: {req.completed}</p><p>Notes: {req.notes}</p></span>
        return (
          <Step key={index} onClick={this.handleClick}>
            <StepLabel>{req.name}</StepLabel>
            <StepContent>{stepContent}</StepContent>
          </Step>
        );
      })
    }
    return (
      <div className={classes.root}>
        <Stepper activeStep={4} nonLinear={true} orientation="vertical">
          {requirementHistory}
        </Stepper>
        {JSON.stringify(this.props.requirements)}
      </div>
    );
  }
}

export default withStyles(styles)(VerticalLinearStepper);