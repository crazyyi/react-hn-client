import React, { Component } from 'react';
import List from './components/List';
import {Route, NavLink, Link, Switch } from 'react-router-dom';
import api from './network/api';
import UserProfile from './components/UserProfile';
import Story from './components/Story';
import _ from 'underscore';
import {parse} from 'qs';
import {fetchFromURL, fetchItemDetail, getUserProfile} from './HNService'
import { AMOUNT_TO_ADD } from './utils/Constants';

class Container extends Component {
  state = {startIndex: 0, endIndex: 15, page: 1, rowsData: [], isLoading: true};

  getTopics(apiQuery, page, startIndex) {
    fetchFromURL(apiQuery, page, startIndex, (rowsData) => {
      this.setState(() => {
        return {
          startIndex: startIndex,
          endIndex: startIndex + AMOUNT_TO_ADD,
          rowsData: rowsData, 
          isLoading: false,
          page: page
        }
      })
    });
  }

  componentDidMount() {
    const {startIndex, page} = this.state;
    this.getTopics(this.props.url, page, startIndex);
  }

  componentWillReceiveProps(nextProps) {
    const query = parse(this.props.history.location.search.substr(1));
    let startIndex = this.state.startIndex;
    let page = this.state.page;

    if (_.isEmpty(query)) {
      startIndex = 0;
      page = 1;
    } else {
      if (this.state.page < query.p) {
        startIndex = this.state.endIndex;
        page = this.state.page + 1;
      } else if (this.state.page > query.p) {
        startIndex = this.state.startIndex - 15;
        page = this.state.page - 1;
      }
    }

    this.setState({isLoading: true});
    this.getTopics(nextProps.url, page, startIndex);
  }

  render() {
    const {rowsData, startIndex, page, isLoading} = this.state;
    const {match} = this.props;

    let prev, separator;

    if (page > 1) {
      prev = (<div><div className="less"><Link to={{
        pathname: `${match.url}`,
        search: `?p=${page - 1}`
      }} >less</Link></div></div>)
      separator = <div>{"|"}</div>
    }

    return (
      <div>
      {this.state.rowsData.length > 0 && 
        <div>
          <List rows = {rowsData} startIndex={startIndex} isLoading={isLoading}/>
          <div className="pagination-link">
          {prev}{separator}
          <div className="more"><Link to={{
            pathname: `${match.url}`,
            search: `?p=${page + 1}`
          }} >more</Link></div>
          </div>
        </div>
      }
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <NavLink to="/" className="homeLink"><i className="fa fa-header" aria-hidden="true"></i> Hacker News</NavLink>
          <NavLink to="/new" className="navLink" activeClassName="active">new</NavLink>
          {/* <NavLink to="/newcomments" className="navLink" activeClassName="active">comments</NavLink> */}
          <NavLink to="/show" className="navLink" activeClassName="active">show</NavLink>
          <NavLink to="/ask" className="navLink" activeClassName="active">ask</NavLink>
          <NavLink to="/jobs" className="navLink" activeClassName="active">jobs</NavLink>
        </header>
        <Switch>
          <Route exact path="/" render={(props) => <Container url={api.HN_TOP_STORIES_ENDPOINT} {...props}/>} />
          <Route path="/new" render={(props) => <Container url={api.HN_NEW_STORIES_ENDPOINT} {...props}/>} />
          {/* <Route path="/newcomments" component={CommentsContainer} /> */}
          <Route path="/show" render={(props) => <Container url={api.HN_SHOW_STORIES_ENDPOINT} {...props} />} />
          <Route path="/ask" render={(props) => <Container url={api.HN_ASK_STORIES_ENDPOINT} {...props} />} />
          <Route path="/jobs" render={(props) => <Container url={api.HN_JOB_STORIES_ENDPOINT} {...props}/>} />
          <Route path="/user/:userId" render={(props) => <UserProfile fetchUserData={(id) => getUserProfile(id)} {...props} /> } />
          <Route path="/story/:id" render={(props) => <Story fetchData={(id, cb) => fetchItemDetail(id, cb)} {...props} /> } />
          <Route path="*" render={() => <div>Not Found</div>} />
        </Switch>
        <div id="footer" />
      </div>
    )
  }
}

export default App;
