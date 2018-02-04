import React, {Component} from 'react';
import TimeAgo from 'react-timeago';

class UserProfile extends Component {
    state = {};

    componentWillMount() {
        const {match, fetchUserData} = this.props;
        fetchUserData(match.params.userId).then(res => {
            this.setState({user: res});
        });
    }

    render() {
        const {user} = this.state;
        return (
            <div className="UserProfile">
                {user && (<div>
                    <h3>{user.id}</h3>
                    <dl>
                        <dt>Created:</dt>
                        <dd><TimeAgo date={user.created * 1000} /></dd>
                        <dt>Karma:</dt>
                        <dd>{user.karma}</dd>
                        <dt>About:</dt>
                        <dd><div dangerouslySetInnerHTML={{__html: user.about}} /></dd>
                    </dl>
                </div>)}
            </div>
        )
    }
}

export default UserProfile;