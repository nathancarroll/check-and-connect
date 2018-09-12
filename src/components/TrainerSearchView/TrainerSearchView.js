import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { LOCAL_TRAINERS_ACTIONS } from '../../redux/actions/localTrainerActions';
import { COHORT_ACTIONS } from '../../redux/actions/cohortActions';

import TrainerSearchSidebar from '../TrainerSearchSidebar/TrainerSearchSidebar';
import TrainerTableSearch from '../TrainerTableSearch/TrainerTableSearch';

import { withStyles, Button, Paper, TextField } from "@material-ui/core";
import { Table, TableBody, TableHead, TableRow, TableCell } from '@material-ui/core';

const styles = {
    mainComponent: {
      display: "Grid",
      gridTemplateColumns: "1fr 4fr"
    },
    leftPanel: {
      display: "Grid",
      gridTemplateRows: "0.3fr 8fr",
    },
    rightPanel: {
      display : "Grid",
      gridTemplateRows: "0.3fr 8fr",
      margin: "0em 1em"
    },
    tableCell: {
        padding: 0,
        textAlign: "center",
        fontSize: "0.8em"
      },
      buttonInCell: {
        fontSize: "0.8em",
        textDecoration: 'none',
      },
      textField : {
        margin : '0em 0em 0.5em 1em',
      },
      searchAndExport: {
        display: "Grid",
        gridTemplateColumns: "7fr 1fr"
      },
      export: {
        marginTop: "1em",
        textAlign: "center"
      }

  };

class TrainerSearchView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            localTrainers: [],
            trainersBeforeSearch: [],
            searchKey: '',
            // Using sets instead of arrays for the selections, since they are limited to 
            // unique values by default.
            selections: {
                state_name: new Set(),
                state_level_organization_name: new Set(),
                cohort_name: new Set(),
                status: new Set()
            },
            checkboxesDisplayed: null
        }
    }

    componentDidMount = () => {
        this.props.dispatch({
            type: LOCAL_TRAINERS_ACTIONS.FETCH_LOCAL_TRAINERS
        })
    }

    componentDidUpdate = (prevProps) => {
            if (!this.props.user.isLoading && this.props.user.userName === null) {
              this.props.history.push("home");
            }
          

        if (prevProps.localTrainerReducer.allLocalTrainers !== this.props.localTrainerReducer.allLocalTrainers) {

            let newDisplayedCheckboxes = {
                state_name: new Set(),
                state_level_organization_name: new Set(),
                cohort_name: new Set(),
                status: new Set()
            }
            this.props.localTrainerReducer.allLocalTrainers.map((trainer) => {
                newDisplayedCheckboxes.state_name.add(trainer.state)
                newDisplayedCheckboxes.state_level_organization_name.add(trainer.state_level_organization.state_level_organization_name)
                newDisplayedCheckboxes.cohort_name.add(trainer.cohort.cohort_name)
            })

            this.setState({
                localTrainers: this.props.localTrainerReducer.allLocalTrainers,
                trainersBeforeSearch: this.props.localTrainerReducer.allLocalTrainers,
                checkboxesDisplayed: newDisplayedCheckboxes,
                selections: newDisplayedCheckboxes
            })
        }
    }

    handleExport = () => {
        console.log('export function called');
    }

    handleSearchInputChange = (e) => {
        this.setState({
            searchInput: e.target.value
        })
    }

    handleStateCheckbox = (e) => {
        console.log('handling state checkbox');
        let newSet = new Set(this.state.selections.state_name);
        let sloSet = new Set();
        let cohortSet= new Set();
        if (newSet.has(e.target.value)){
            newSet.delete(e.target.value)
        } else {
            newSet.add(e.target.value)
        }

        this.setState({
            selections: {
                ...this.state.selections,
                state_name: newSet
            }
        })

        let filteredTrainersList = [];
        this.props.localTrainerReducer.allLocalTrainers.forEach((trainer) => {
            if (newSet.has(trainer.state)){
                sloSet.add(trainer.state_level_organization.state_level_organization_name);
                cohortSet.add(trainer.cohort.cohort_name);
                filteredTrainersList.push(trainer)
            }
        })

        console.log(sloSet);

        this.setState({
            localTrainers: filteredTrainersList,
            checkboxesDisplayed: {
                ...this.state.checkboxesDisplayed,
                state_level_organization_name: sloSet,
                cohort_name: cohortSet
            }
        })
    }

    handleSloCheckbox = (e) => {
        console.log('handling slo checkbox');
        let newSet = new Set(this.state.selections.state_level_organization_name);
        let cohortSet= new Set();
        if (newSet.has(e.target.value)){
            newSet.delete(e.target.value)
        } else {
            newSet.add(e.target.value)
        }

        this.setState({
            selections: {
                ...this.state.selections,
                state_level_organization_name: newSet
            }
        })

        let filteredTrainersList = [];
        this.props.localTrainerReducer.allLocalTrainers.forEach((trainer) => {
            if (newSet.has(trainer.state_level_organization.state_level_organization_name)){
                cohortSet.add(trainer.cohort.cohort_name);
                filteredTrainersList.push(trainer)
            }
        })

        this.setState({
            localTrainers: filteredTrainersList,
            checkboxesDisplayed: {
                ...this.state.checkboxesDisplayed,
                cohort_name: cohortSet
            }
        })
    }

    handleCohortCheckbox = (e) => {
        console.log('handling cohort checkbox');
        let newSet = new Set(this.state.selections.cohort_name);
        if (newSet.has(e.target.value)){
            newSet.delete(e.target.value)
        } else {
            newSet.add(e.target.value)
        }

        this.setState({
            selections: {
                ...this.state.selections,
                cohort_name: newSet
            }
        })

        let filteredTrainersList = [];
        this.props.localTrainerReducer.allLocalTrainers.forEach((trainer) => {
            if (newSet.has(trainer.cohort.cohort_name)){
                filteredTrainersList.push(trainer)
            }
        })

        this.setState({
            localTrainers: filteredTrainersList
        })
    }

    handleStatusCheckbox = (e) => {
        console.log('handling status checkbox');
    }

    handleSearchTable = searchKey => {
        if (this.state.searchKey === "") {
          this.setState({
            trainersBeforeSearch: this.state.localTrainers
          });
        }
    
        this.setState(
          {
            searchKey: searchKey
          },
          () => {
            this.handleSearchTableWithKey();
          }
        );
      };

    handleSearchTableWithKey = () => {
        let flag = false;
        console.log(this.state.trainersBeforeSearch);
    
        let filteredTrainers = this.state.trainersBeforeSearch.filter(
          localTrainer => {
            flag = false;
            let checkStringEquality = object => {
              Object.keys(object).forEach(key => {
                if (typeof object[key] === "string" || typeof object[key] === 'number') {

                  if (object[key].toString().toLowerCase().includes(this.state.searchKey.toLowerCase())) {
                    // console.log(object[key].toString().toLowerCase() + ' includes ' + this.state.searchKey);
                    
                    flag = true;
                    
                  }
                } else if (Array.isArray(object[key])) {
    
                  object[key].forEach(objectInKey => {
                    checkStringEquality(objectInKey);
                  });
                } else if (typeof object[key] === "object" && object[key] !== null) {
    
                  checkStringEquality(object[key]);
                }
              });
            };
    
            checkStringEquality(localTrainer);
            
            return flag;
          }
        );
    
        this.setState({
          localTrainers : filteredTrainers
        })
      };

    getLastNext = (requirementsArray) => {
        let lastNext = [null, null, null];
        requirementsArray.sort((a, b) => {
            return a.requirement_id - b.requirement_id
        })
        for (let i=0; i<requirementsArray.length; i++){
            if (requirementsArray[i].completed === null){
                lastNext[1] = requirementsArray[i].requirement_name;
                lastNext[2] = moment(requirementsArray[i].requirement_due_date).format("MM-DD-YYYY");
                if (i === 0){
                    lastNext[0] = 'n/a';
                    return lastNext
                } else {
                    lastNext[0] = requirementsArray[i-1].requirement_name;
                    return lastNext;
                }
            }
        }
    }


    render() {
        let { classes } = this.props;
        let trainersTableBody = null;

        if (this.state.localTrainers) {
            trainersTableBody = this.state.localTrainers.map((trainer) => {
                let lastNext = this.getLastNext(trainer.requirements)
                return (
                    <TableRow key={trainer.local_trainers_id}>
                        <TableCell className={classes.tableCell}>
                            <Link 
                                to={"/cohort" + trainer.cohort.cohort_id}
                                className={classes.buttonInCell}
                            >
                                <Button>{trainer.cohort.cohort_name}</Button>
                            </Link>
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                            <Link 
                                to={"/trainerdetails/" + trainer.local_trainers_id}
                                className={classes.buttonInCell}
                            >
                                <Button>{trainer.first_name}</Button>
                            </Link>
                        </TableCell>
                        <TableCell className={classes.tableCell} >
                            <Link 
                                to={"/trainerdetails/" + trainer.local_trainers_id}
                                className={classes.buttonInCell}
                            >
                                <Button>{trainer.last_name}</Button>
                            </Link>
                        </TableCell>
                        <TableCell className={classes.tableCell} >{trainer.state}</TableCell>
                        <TableCell className={classes.tableCell} >{trainer.state_level_organization.state_level_organization_name}</TableCell>
                        <TableCell className={classes.tableCell} >{lastNext[0]}</TableCell>
                        <TableCell className={classes.tableCell} >{lastNext[1]}</TableCell>
                        <TableCell className={classes.tableCell} >{lastNext[2]}</TableCell>
                    </TableRow>
                )
            })
        }

        return (
            <React.Fragment>
            <div className={classes.mainComponent}>
                 <div className={classes.leftPanel} >
                    <TrainerSearchSidebar 
                        {...this.state.checkboxesDisplayed} 
                        handleCheckboxClick={this.handleCheckboxClick} 
                        handleStateCheckbox={this.handleStateCheckbox}
                        handleSloCheckbox={this.handleSloCheckbox}
                        handleCohortCheckbox={this.handleCohortCheckbox}
                    />                 
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.searchAndExport}>
                        <TrainerTableSearch 
                            search={this.handleSearchTable}
                            searchKey={this.state.searchKey} 
                        />
                            <div>
                                <Button className={classes.export}>Export</Button>
                            </div>
                    </div>
                <Paper>
                <Table id="trainer-search-table">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableCell} >Cohort</TableCell>
                            <TableCell className={classes.tableCell} >First Name</TableCell>
                            <TableCell className={classes.tableCell} >Last Name</TableCell>
                            <TableCell className={classes.tableCell} >State</TableCell>
                            <TableCell className={classes.tableCell} >State-Level Org.</TableCell>
                            <TableCell className={classes.tableCell} >Last Completed Req.</TableCell>
                            <TableCell className={classes.tableCell} >Upcoming Req.</TableCell>
                            <TableCell className={classes.tableCell} >Due Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trainersTableBody}
                    </TableBody>
                </Table>
                </Paper>
                </div>
            </div>
            </React.Fragment>
        )
    }
};

const mapStateToProps = (state) => state;


const componentWithStyle = withStyles(styles)(TrainerSearchView);
export default connect(mapStateToProps)(componentWithStyle);