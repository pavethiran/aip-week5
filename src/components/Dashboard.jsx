import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Card from './Card';
import CustomPropTypes from '../utils/custom-prop-types';
import './Dashboard.scss';

/**
 * Component class for Dashboard
 */
class Dashboard extends Component {
  /**
   * get all lists of users with tasks
   */
  getUserLists() {
    return this.props.users.map(user => (
      <div key={user.id} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
        <h3>{user.name.length > 0 ? user.name : user.username}</h3>
        {this.props.tasks.map((task) => {
          if (user.id !== task.userid) {
            return false;
          }
          return (
            <Link key={task.id} to={`/task/${task.id}`}>
              <Card title={task.title}>{task.description}</Card>
            </Link>
          );
        })}
        <Link to={`/task/create?${user.id}`}>
          <button className="btn btn-primary btn-block btn-create">Create Task</button>
        </Link>
      </div>
    ));
  }

  render() {
    return (
      <div className="row content-wrapper">
        <div className="col-12">
          <div className="view-menu float-right">
            <button className="btn btn-outline-primary oi oi-magnifying-glass" />
            <button className="btn btn-outline-primary oi oi-list" />
            <button className="btn btn-outline-primary oi oi-grid-two-up" />
          </div>
          <h2>Dashboard</h2>
        </div>
        <div className="col-12">
          <div className="row">
            {this.getUserLists()}
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  users: CustomPropTypes.users.isRequired,
  tasks: CustomPropTypes.tasks.isRequired,
};

/**
 * Connect Redux with Component
 */
export default connect(
  state => ({
    users: state.users,
    tasks: state.tasks,
  }),
)(Dashboard);
