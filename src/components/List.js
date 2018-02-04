import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import TimeAgo from 'react-timeago';
import withSpinner from './WithSpinner';

class Item extends Component {
    render() {
        const {linkComponent, row} = this.props;
        const {id, url, title, score, time, type, by, descendants} = row;
        
        return (
            <div>
                <div className="itemTitle">
                    <a href={url}>{title}</a>
                    <span className="itemHost">({linkComponent.hostname})</span>
                </div>
                {type === "job" ? <TimeAgo date={time * 1000} />:
                <div className="itemMeta">
                    <span>{score} points</span> 
                    {" - by "} 
                    <Link className="item_user" to={`/user/${by}`}>{by}{" "}</Link>
                    <TimeAgo date={time * 1000} /> | 
                    <Link className="item_comments" to={`/story/${id}`}>{descendants} comments</Link>
                </div>}
            </div>
        )
    }
}

const ItemWithSpinner = withSpinner(Item);

const List = ({rows, startIndex, isLoading}) => {
    const linkComponent = document.createElement('a');
    const rowList = rows && rows.length > 0 ? rows.map((row, i) => {
        linkComponent.href = row.url;
        return (
            <li className="athing" key={row.id}>
                <ItemWithSpinner isLoading={isLoading} linkComponent={linkComponent} row={row}/>
            </li>
        )
    }) : null;

    return (
        <div className="items">
            <ol className="itemList" start={startIndex + 1}>
            {rowList}
            </ol>
        </div>
    )
}

export default List;