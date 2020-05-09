import Material from "./Material"
import {REST_URL} from "../../Functions/api"
import Profile from "../../Media/Svgs/Profile"
import {Link} from "react-router-dom"
import React from "react"
import OfficialTickSvg from "../../Media/Svgs/OfficialTickSvg"

const User = props =>
{
    const {user} = props
    return (
        <Link className="home-page-docs-item" to={`/users/${user._id}`}>
            <Material className="user-item-cont">
                {
                    user.avatar ?
                        <img className="home-avatar-user" src={REST_URL + user.avatar} alt={user.name}/>
                        :
                        <Profile className="home-avatar-user"/>
                }
                <div className="panel-document-item-title">{user.name}{user.have_tick && <OfficialTickSvg className="panel-document-item-official"/>}</div>
                {user.description && <div className="panel-document-item-summary">{user.description}</div>}
            </Material>
        </Link>
    )
}

export default User