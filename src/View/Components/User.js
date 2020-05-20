import Material from "./Material"
import {REST_URL} from "../../Functions/api"
import Profile from "../../Media/Svgs/Profile"
import {Link} from "react-router-dom"
import React from "react"
import OfficialTickSvg from "../../Media/Svgs/OfficialTickSvg"
import numberCorrection from "../../Helpers/numberCorrection"
import TitleSvg from "../../Media/Svgs/TitleSvg"
import DescriptionSvg from "../../Media/Svgs/DescriptionSvg"
import CalendarSvg from "../../Media/Svgs/CalendarSvg"

const User = props =>
{
    const {user} = props
    return (
        <Link className="user-item" to={`/users/${user._id}`}>
            <Material className="user-item-content">
                {
                    user.avatar ?
                        <img className="home-avatar-user" src={REST_URL + user.avatar} alt={user.name}/>
                        :
                        <Profile className="home-avatar-user default"/>
                }
                <div className="user-item-content-field title">
                    <TitleSvg className="user-item-content-field-svg"/>
                    <div className="user-item-content-field-text">{user.name}</div>
                    {user.have_tick && <OfficialTickSvg className="panel-document-item-official"/>}
                </div>
                {
                    user.description &&
                    <div className="user-item-content-field">
                        <DescriptionSvg className="user-item-content-field-svg"/>
                        <div className="user-item-content-field-text">{user.description}</div>
                    </div>
                }
                {
                    user.birth_date_year &&
                    <div className="user-item-content-field">
                        <CalendarSvg className="user-item-content-field-svg cal"/>
                        {parseInt(numberCorrection(new Date().toLocaleDateString("fa-ir").slice(0, 4))) - parseInt(user.birth_date_year)}
                        <span> </span>
                        <span>ساله</span>
                    </div>
                }
            </Material>
        </Link>
    )
}

export default User