import React, {PureComponent} from "react"
import api from "../../Functions/api"
import {Route, Switch} from "react-router-dom"
import {ClipLoader} from "react-spinners"
import ShowUserPage from "./ShowUserPage"
import VerifiedUserSvg from "../../Media/Svgs/VerifiedUserSvg"
import User from "../Components/User"

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
        const {path, lang} = this.props
        return (
            <Switch>
                <Route path={`${path}/:id`} render={(route) => <ShowUserPage id={route.match.params.id}/>}/>

                <React.Fragment>
                    <div className="doc-page-cont">
                        <div className={`home-page-documents ${Object.values(users).length === 0 && usersLoading ? "" : "loaded"}`}>
                            <div className={`home-page-docs-title page ${lang}`}>
                                <VerifiedUserSvg className="home-page-docs-title-svg"/>
                                <div className={`home-page-docs-title-text ${lang}`}>{lang === "fa" ? "فعالین" : "users"}</div>
                            </div>
                            <div className="panel-document-cont home">
                                {Object.values(users).map(user => <User user={user} key={user._id}/>)}
                            </div>
                            <div className="loading-section-cont">
                                {
                                    usersLoading ?
                                        <div className="panel-section-loading-cont"><ClipLoader size={20} color="var(--primary-color)"/></div>
                                        :
                                        Object.values(users).length === 0 && <div className="panel-section-loading-cont">{lang === "fa" ? "کاربری یافت نشد!" : "no user found!"}</div>
                                }
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            </Switch>
        )
    }
}

export default UsersPage