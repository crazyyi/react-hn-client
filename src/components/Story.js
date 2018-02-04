import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import api from '../network/api';
import TimeAgo from 'react-timeago';
import PropTypes from 'prop-types';

class Comment extends Component {
    state={};

    onClick(e) {
        e.preventDefault();
        this.setState((prevState, props) => {
            return {isToggled: !prevState.isToggled}
        });
    }

    render() {
        const {row, comments} = this.props;
        const {isToggled} = this.state;
        let content = null;
        let flagged = "";

        if (!isToggled) {
            let htmlText = row.text;
            if (row.dead) {
                htmlText = "[flagged]";
                flagged += " flagged";
            } 
            
            content = <div className={`comment_text${flagged}`} dangerouslySetInnerHTML={{__html: htmlText}}></div>;
        }
        

        return (
            <div className="comment_content" >
                <div className="comment_meta">
                    <span><Link className="item_user" to={`/user/${row.by}`}>{row.by}</Link></span>{" "}
                    <TimeAgo date={row.time * 1000} />{" "}{row.id}{" | "}
                    <span><a className="toggle" onClick={(e) => this.onClick(e)}>[{isToggled?"+" + row.childCount:"–"}]</a></span>
                </div>
                {content}
                {!isToggled && <div><p><a className="reply" href={`https://news.ycombinator.com/reply?id=${row.id}`}>reply</a></p></div>}
                
                {!isToggled && comments && (
                    <div className="child_comments">
                        {comments.map((comment, i) => {
                            if (!comment) {
                                return null;
                            }

                            if (!comment.hasOwnProperty('deleted')) {
                                return <Comment key={comment.id} row={comment} comments={comment.subComments}/>
                            } else {
                                return null;
                            }
                        })}
                    </div>
                )}
            </div>
        )
        
    }
}

Comment.propTypes = {
    row: PropTypes.object
}

Comment.defautProps = {
    row: {}
}

class Story extends Component {
    state = {story: {}, comments: []};

    componentDidMount() {
        const {match, fetchData} = this.props;
        fetchData(match.params.id, (response) => {
            this.setState({story: response});
        }).then(comments => {
            Promise.all(comments.map(row => {
                // console.log(row);
                return this.getChildComments(row.id)
            }))
            .then(values => {
                // console.log(values);
                this.setState({comments: values})
            });
        });
    }

    getChildComments(id) {
        return fetch(api.HN_ITEM_ENDPOINT + id + '.json')
        .then(res => res.json())
        .then (data => {
            if (!data) {
                return;
            }
            data.childCount = 0;
            if (data.hasOwnProperty('kids')) {
                return Promise.all(data.kids.map(kidId => {
                    return this.getChildComments(kidId);
                })).then(children => {
                    let flaggedCount = 0;

                    data.childCount = children.map(child => {
                        if (child.dead) flaggedCount++;
                        return child.deleted? 0 : child.childCount;
                    }).reduce((prev, next) => {
                        return prev + next;
                    }, data.childCount) + 1 - flaggedCount;

                    data.subComments = children;
                    return data;
                });
            } else {
                data.childCount = 1;
                return data;
            }
        });
    }

    render() {
        const {story, comments} = this.state;
        
        const {id, url, title, by, score, time, descendants} = story;
        const linkComponent = document.createElement('a');
        linkComponent.href = url;

        return (
            <div className="story_content">
                <div className="itemTitle">
                    <a href={url}>{title}</a>
                    {url && <span className="itemHost">({linkComponent.hostname})</span>}
                </div>
                <div className="itemMeta">
                    <span>{score} points</span> 
                    {" - by "} 
                    <Link className="item_user" to={`/user/${by}`}>{by}</Link>{" "}
                    <TimeAgo date={time * 1000} /> | 
                    <Link className="item_comments" to={`/story/${id}`}>{descendants} comments</Link>
                </div>
                <div>
                    {comments && comments.length > 0 && comments.map((row, i) => {
                        if (!row.hasOwnProperty('deleted')) {
                            return <Comment key={row.id} row={row} comments={row.subComments}/>
                        } else {
                            return null;
                        }
                    })}
                </div>
            </div>
        )
    }
}

export default Story;