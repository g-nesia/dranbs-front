import React from 'react'
import Link from 'next/link'
import PropTypes from "prop-types";
import config from "../config";
import styles from './board.module.scss'

class Board extends React.Component {
    render() {
        const board = this.props.board
        return (
            <div className="blog-media" style={{
                width: this.props.width
            }}>
                <Link href={this.props.isMine ? `/my-boards/${board.name}` : `/boards/${board.username}/${board.name}`}>
                    <a className="thumb-hover">
                        <img
                            onLoad={this.props.onLoad}
                            style={{objectFit: 'contain', width: '100%', borderRadius: '10px'}}
                            src={`${config.domain}/images/${board.image_filename}`}
                            alt=""/>
                    </a>
                </Link>
                <div className="blog-info">
                    <Link href={this.props.isMine ? `/my-boards/${board.name}` : `/boards/${board.username}/${board.name}`}>
                        <a>
                            <p className={styles.name}>{board.name}</p>
                        </a>
                    </Link>
                    {this.props.showAuthor && (
                        <Link href={`/boards/${board.username}`}>
                            <a>
                                <p className={styles.creator}>by <strong>{board.username}</strong></p>
                            </a>
                        </Link>
                    )}
                    <p className={styles.followers}>{board.followers} followers</p>
                </div>
            </div>
        )
    }
}

Board.propTypes = {
    width: PropTypes.any.isRequired,
    board: PropTypes.object.isRequired,
    onLoad: PropTypes.func.isRequired,
    showAuthor: PropTypes.bool.isRequired,
    isMine: PropTypes.bool.isRequired
}

export default Board