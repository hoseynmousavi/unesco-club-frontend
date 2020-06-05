import React, {PureComponent} from "react"
import api from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import UserItem from "./UserItem"

class Users extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            users: {},
            getLoading: true,
        }
        this.activeScrollHeight = 0
        this.page = 2
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        api.get("user", `?limit=20&page=1`)
            .then(data => this.setState({...this.state, getLoading: false, users: data.reduce((sum, user) => ({...sum, [user._id]: user}), {})}))

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
                this.setState({...this.state, getLoading: true}, () =>
                {
                    this.activeScrollHeight = scrollHeight
                    api.get("user", `?limit=20&page=${this.page}`)
                        .then(data =>
                        {
                            this.page += 1
                            this.setState({...this.state, getLoading: false, users: {...users, ...data.reduce((sum, user) => ({...sum, [user._id]: user}), {})}})
                        })
                })
            }
        }, 20)
    }

    render()
    {
        const {users, getLoading} = this.state
        return (
            <div className="panel-section">
                <div className="panel-page-section-title">ثبت‌نام‌ها</div>
                {
                    Object.values(users).length > 0 ?
                        Object.values(users).map(user =>
                            <UserItem user={user} key={user._id}/>,
                        )
                        :
                        Object.values(users).length === 0 && !getLoading && <div className="panel-section-loading-cont">فعّالی یافت نشد!</div>
                }
                <div className="loading-section-cont">
                    {
                        getLoading && <div className="panel-section-loading-cont"><ClipLoader size={20} color="var(--primary-color)"/></div>
                    }
                </div>
            </div>
        )
    }
}

export default Users