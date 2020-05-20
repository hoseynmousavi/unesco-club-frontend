import React, {PureComponent} from "react"
import api, {REST_URL} from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import ImageShow from "../Components/ImageShow"
import TitleSvg from "../../Media/Svgs/TitleSvg"
import DescriptionSvg from "../../Media/Svgs/DescriptionSvg"
import LocationSvg from "../../Media/Svgs/LocationSvg"
import Profile from "../../Media/Svgs/Profile"
import numberCorrection from "../../Helpers/numberCorrection"
import MajorSvg from "../../Media/Svgs/MajorSvg"
import GradeSvg from "../../Media/Svgs/GradeSvg"
import UniversitySvg from "../../Media/Svgs/UniversitySvg"
import CalendarSvg from "../../Media/Svgs/CalendarSvg"
import BuildSvg from "../../Media/Svgs/BuildSvg"
import EmailSvg from "../../Media/Svgs/EmailSvg"
import LanguageSvg from "../../Media/Svgs/LanguageSvg"
import AreaSvg from "../../Media/Svgs/AreaSvg"
import TourismSvg from "../../Media/Svgs/TourismSvg"
import ExperienceSvg from "../../Media/Svgs/ExperienceSvg"
import OfficialTickSvg from "../../Media/Svgs/OfficialTickSvg"
import InstaSvg from "../../Media/Svgs/InstaSvg"

class ShowUserPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            isLoading: true,
            user: null,
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        const {id} = this.props
        api.get("users", id)
            .then(user => this.setState({...this.state, user, isLoading: false}))
            .catch(err =>
            {
                if (err?.response?.status === 404) this.setState({...this.state, notFound: true})
                else this.setState({...this.state, error: true})
            })
    }

    render()
    {
        const {notFound, error, user, isLoading} = this.state
        return (
            <div className="document-page-cont user">
                {
                    error ?
                        <div className="document-page-err">خطایی رخ داد؛ دوباره تلاش کنید!</div>
                        :
                        notFound ?
                            <div className="document-page-err">کاربر مورد نظر یافت نشد!</div>
                            :
                            user ?
                                <React.Fragment>
                                    {
                                        user.avatar ?
                                            <ImageShow className="user-page-thumb" src={REST_URL + user.avatar} alt={user.name}/>
                                            :
                                            <Profile className="user-page-thumb"/>
                                    }
                                    <div className="document-page-field-cont">
                                        <div className="document-page-field">
                                            <TitleSvg className="document-page-field-svg"/>
                                            <div className="document-page-field-dialog">نام</div>
                                            <div className="document-page-field-text name">
                                                {user.name}
                                                {user.have_tick && <OfficialTickSvg className="panel-document-item-official big"/>}
                                            </div>
                                        </div>
                                        {
                                            user.description &&
                                            <div className="document-page-field">
                                                <DescriptionSvg className="document-page-field-svg"/>
                                                <div className="document-page-field-dialog">توضیحات</div>
                                                <div className="document-page-field-text">{user.description}</div>
                                            </div>
                                        }
                                        {
                                            user.email &&
                                            <div className="document-page-field">
                                                <EmailSvg className="document-page-field-svg"/>
                                                <div className="document-page-field-dialog">ایمیل</div>
                                                <div className="document-page-field-text">{user.email}</div>
                                            </div>
                                        }
                                        {
                                            user.birth_date_year &&
                                            <div className="document-page-field">
                                                <CalendarSvg className="document-page-field-svg"/>
                                                <div className="document-page-field-dialog">سن</div>
                                                <div className="document-page-field-text">
                                                    {parseInt(numberCorrection(new Date().toLocaleDateString("fa-ir").slice(0, 4))) - parseInt(user.birth_date_year)}
                                                    <span> </span>
                                                    <span>ساله</span>
                                                </div>
                                            </div>
                                        }
                                        <div className="document-page-field">
                                            <GradeSvg className="document-page-field-svg"/>
                                            <div className="document-page-field-dialog">تحصیلات</div>
                                            <div className="document-page-field-text left">{user.grade}</div>
                                            {
                                                user.major &&
                                                <React.Fragment>
                                                    <MajorSvg className="document-page-field-svg"/>
                                                    <div className="document-page-field-text left">{user.major}</div>
                                                </React.Fragment>
                                            }
                                            {
                                                user.university &&
                                                <React.Fragment>
                                                    <UniversitySvg className="document-page-field-svg"/>
                                                    <div className="document-page-field-text">{user.university}</div>
                                                </React.Fragment>
                                            }
                                        </div>
                                        {
                                            user.range_of_activity &&
                                            <div className="document-page-field">
                                                <LocationSvg className="document-page-field-svg"/>
                                                <div className="document-page-field-dialog">محدوده فعالیت</div>
                                                <div className="document-page-field-text">{user.range_of_activity}</div>
                                            </div>
                                        }
                                        {
                                            user.specializations &&
                                            <div className="document-page-field">
                                                <BuildSvg className="document-page-field-svg"/>
                                                <div className="document-page-field-dialog">تخصص‌ها</div>
                                                <div className="document-page-field-text">{user.specializations}</div>
                                            </div>
                                        }
                                        <div className="document-page-field">
                                            <LanguageSvg className="document-page-field-svg"/>
                                            <div className="document-page-field-text">
                                                آشنایی {user.familiarity_with_language === "high" ? "زیاد" : user.familiarity_with_language === "low" ? "کم" : "متوسط"} با زبان
                                            </div>
                                        </div>
                                        <div className="document-page-field">
                                            <AreaSvg className="document-page-field-svg"/>
                                            <div className="document-page-field-text">
                                                آشنایی {user.familiarity_with_area === "high" ? "زیاد" : user.familiarity_with_area === "low" ? "کم" : "متوسط"} با منطقه
                                            </div>
                                        </div>
                                        <div className="document-page-field">
                                            <TourismSvg className="document-page-field-svg"/>
                                            <div className="document-page-field-text">
                                                آشنایی {user.familiarity_with_tourism === "high" ? "زیاد" : user.familiarity_with_tourism === "low" ? "کم" : "متوسط"} با تخصص گردشگری
                                            </div>
                                        </div>
                                        {
                                            user.experience &&
                                            <div className="document-page-field">
                                                <ExperienceSvg className="document-page-field-svg"/>
                                                <div className="document-page-field-dialog">سابقه فعالیت</div>
                                                <div className="document-page-field-text">{user.experience}</div>
                                            </div>
                                        }
                                        {
                                            user.instagram &&
                                            <a href={`https://www.instagram.com/${user.instagram}`} target="_blank" rel="noopener noreferrer" className="document-page-field">
                                                <InstaSvg className="document-page-field-svg insta"/>
                                                <div className="document-page-field-dialog">اینستاگرام</div>
                                                <div className="document-page-field-text">{user.instagram}</div>
                                            </a>
                                        }
                                    </div>
                                </React.Fragment>
                                :
                                isLoading && <div className="panel-section-loading-cont"><ClipLoader size={20} color="var(--primary-color)"/></div>
                }
            </div>
        )
    }
}

export default ShowUserPage