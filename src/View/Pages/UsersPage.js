import React, {PureComponent} from "react"
import api, {REST_URL} from "../../Functions/api"
import {Link, Route, Switch} from "react-router-dom"
import Material from "../Components/Material"
import {ClipLoader} from "react-spinners"
import ShowUserPage from "./ShowUserPage"
import Profile from "../../Media/Svgs/Profile"
import VerifiedUserSvg from "../../Media/Svgs/VerifiedUserSvg"

class UsersPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            users: [],
            usersLoading: true,
        }

        this.activeScrollHeight = 0
        this.page = 2
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        api.get("users", `?limit=20&page=1`)
            .then(users => this.setState({...this.state, users: users.reduce((sum, doc) => ({...sum, [doc._id]: doc}), {}), usersLoading: false}))

        document.addEventListener("scroll", this.onScroll)
    }

    componentWillUnmount()
    {
        document.removeEventListener("scroll", this.onScroll)
    }

    onScroll = () =>
    {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() =>
        {
            const {users} = this.state
            const scrollHeight = document.body ? document.body.scrollHeight : 0
            if (Object.values(users).length > 0 && window.innerHeight + window.scrollY >= scrollHeight - 200 && scrollHeight > this.activeScrollHeight)
            {
                this.setState({...this.state, documentsLoading: true}, () =>
                {
                    this.activeScrollHeight = scrollHeight
                    api.get("users", `?limit=20&page=${this.page}`)
                        .then(data =>
                        {
                            this.page += 1
                            this.setState({...this.state, usersLoading: false, users: {...users, ...data.reduce((sum, user) => ({...sum, [user._id]: user}), {})}})
                        })
                })
            }
        }, 20)
    }

    render()
    {
        const {usersLoading, users} = this.state
        return (
            <Switch>
                <Route path="/users/:id" render={(route) => <ShowUserPage id={route.match.params.id}/>}/>

                <React.Fragment>
                    <div className="home-page-cont">
                        <div className={`home-page-documents ${Object.values(users).length === 0 ? "" : "loaded"}`}>
                            <div className="home-page-docs-title page">
                                <VerifiedUserSvg className="home-page-docs-title-svg"/>
                                <div className="home-page-docs-title-text">فعالین</div>
                            </div>
                            <div className="panel-document-cont home">
                                {
                                    Object.values(users).map(user =>
                                        <Link key={user._id} className="home-page-docs-item" to={`/users/${user._id}`}>
                                            <Material className="panel-document-item">
                                                {
                                                    user.avatar ?
                                                        <img className="home-avatar-user" src={REST_URL + user.avatar} alt={user.name}/>
                                                        :
                                                        <Profile className="home-avatar-user"/>
                                                }
                                                <div className="panel-document-item-title">{user.name}</div>
                                                {user.description && <div className="panel-document-item-summary">{user.description}</div>}
                                            </Material>
                                        </Link>,
                                    )
                                }
                                <div className="home-page-docs-item-hide"/>
                                <div className="home-page-docs-item-hide"/>
                                <div className="home-page-docs-item-hide"/>
                                <div className="home-page-docs-item-hide"/>
                                <div className="home-page-docs-item-hide"/>
                            </div>
                            {
                                usersLoading ?
                                    <div className="panel-section-loading-cont"><ClipLoader size={20} color="var(--primary-color)"/></div>
                                    :
                                    Object.values(users).length === 0 && <div className="panel-section-loading-cont">کاربری یافت نشد!</div>
                            }
                        </div>
                    </div>
                </React.Fragment>
            </Switch>
        )
    }
}

export default UsersPage