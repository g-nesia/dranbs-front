import React from 'react'
import Link from 'next/link'
import {connect} from "react-redux";
import {withRouter} from "next/router";
import {setAuth, setExploreType, setGender, setPeriod, setSiteType} from "../../redux/actions";
import Sticky from "react-stickynode";
import {Dashboard, Favorite} from "@material-ui/icons";
import BoardModal from "../BoardModal";
import {getBoardInfo, toggleFollowBoard} from "../../services";

class Boards extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stickyNav: true,
            followers: 0,
            isFollowing: false
        }
    }

    async componentDidMount() {
        if (this.props.name) {
            try {
                const data = await getBoardInfo(this.props.auth.meta.token, this.props.name)
                this.setState({
                    followers: data.followers,
                    isFollowing: data.is_following,
                })
            } catch (e) {
                this.props.setAuth(false)
                await this.props.router.push("/login")
            }
        }
    }

    toggleFollow = async (boardName) => {
        try {
            const data = await toggleFollowBoard(this.props.auth.meta.token, boardName)
            this.setState({
                followers: data.followers,
                isFollowing: data.is_following
            })
        } catch (e) {
            this.props.setAuth(false)
            await this.props.router.push('/login')
        }
    }

    handleLogout = async () => {
        this.props.setAuth(false)
        await this.props.router.push('/login')
    }

    render() {
        const router = this.props.router
        return (
            <>
                <Sticky enabled={this.state.stickyNav} top={0} bottomBoundary={0} innerZ={1500}
                        activeClass={'sticky-active'} releasedClass={'sticky-released'}>
                    <header>
                        <nav className="navbar">
                            <div className="navbar-menu">
                                <div className="navbar-start is-flex-direction-column">
                                    <Link href={"/"}>
                                        <h1 className="brand">DRANBS<small>/ inspire your styles</small></h1>
                                    </Link>
                                    <div className="is-flex">
                                        <a className={`navbar-item p-0 mx-2 ${this.props.siteType == 1 ? 'is-active' : ''}`}
                                           onClick={() => this.props.setSiteType(1)}>
                                            new arrivals
                                        </a>
                                        <a className={`navbar-item p-0 mx-2 ${this.props.siteType == 2 ? 'is-active' : ''}`}
                                           onClick={() => this.props.setSiteType(2)}>sale</a>
                                        <Link href="/boards">
                                            <a className={`navbar-item p-0 mx-2 ${router.pathname == '/boards' ? 'is-active' : ''}`}>boards</a>
                                        </Link>
                                    </div>
                                </div>
                                <div className="navbar-end">
                                    <div className="navbar-item">
                                        <div className="field">
                                            <p className="control has-icons-right">
                                                <input className="input" type="text" placeholder="Search"/>
                                                <span className="icon is-small is-right">
                                            <i className="fa fa-search"/>
                                        </span>
                                            </p>
                                        </div>
                                    </div>
                                    {this.props.auth ? (
                                        <>
                                            <Link href="/my-loves">
                                                <a className="navbar-item">
                                                    <Favorite
                                                        style={{color: '#FF3366', fontSize: 16, marginRight: '8px'}}/>
                                                    I love
                                                </a>
                                            </Link>
                                            <Link href="/my-following">
                                                <a className="navbar-item">
                                                    <Dashboard
                                                        style={{fontSize: 16, marginRight: '8px', color: '#FA9805'}}/>
                                                    I follow
                                                </a>
                                            </Link>
                                            <div className="navbar-item has-dropdown is-hoverable">
                                                <a className="navbar-link">
                                                    {this.props.auth.user.username}
                                                </a>

                                                <div className="navbar-dropdown">
                                                    <a className="navbar-item">
                                                        My boards
                                                    </a>
                                                    <Link href="/my-profile">
                                                        <a className="navbar-item">
                                                            my profile
                                                        </a>
                                                    </Link>
                                                    <Link href="/contact">
                                                        <a className="navbar-item">
                                                            contact us
                                                        </a>
                                                    </Link>
                                                    <a className="navbar-item" onClick={this.handleLogout}>
                                                        log out
                                                    </a>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <Link href="/login">
                                            <a className="navbar-item">login / sign up</a>
                                        </Link>
                                    )}

                                </div>
                            </div>
                        </nav>
                    </header>
                    <section className="board-breadcrumb">
                        {this.props.creator ? (
                            <>
                                <ul>
                                    <li>
                                        <Link href="/boards">
                                            <a>boards</a>
                                        </Link>
                                    </li>
                                    {this.props.name ? (
                                        <>
                                            <li>
                                                <Link href={`/boards/${this.props.creator}`}>
                                                    <a>{this.props.creator}</a>
                                                </Link>
                                            </li>
                                            <li className="is-active">
                                                <a>{this.props.name}</a>
                                            </li>
                                        </>
                                    ) : (
                                        <li className="is-active">
                                            <a>{this.props.creator}</a>
                                        </li>
                                    )}
                                </ul>
                                {this.props.name && (
                                    <>
                                        <p>
                                            Suscipit purus dignissim quaerat magnis molestie minima eiusmod nunc, nulla
                                            maxime proin
                                        </p>
                                        <div className="follow-piece">
                                            <button
                                                className={this.state.isFollowing ? 'unfollow' : 'follow'}
                                                onClick={() => this.toggleFollow(this.props.name)}
                                            >
                                                {this.state.isFollowing ? 'unfollow' : 'follow'}
                                            </button>
                                            <span className="followers">{this.state.followers} followers</span>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <h3>all boards</h3>
                                <p>
                                    Suscipit purus dignissim quaerat magnis molestie minima eiusmod nunc, nulla maxime
                                    proin
                                </p>
                            </>
                        )}
                    </section>
                </Sticky>
                {this.props.children}
                <BoardModal/>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
        siteType: state.homeFilter.siteType,
        exploreType: state.homeFilter.exploreType,
        gender: state.homeFilter.gender,
        period: state.homeFilter.period
    }
}

export default connect(mapStateToProps, {
    setAuth,
    setSiteType,
    setExploreType,
    setGender,
    setPeriod
})(withRouter(Boards))
