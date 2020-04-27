import React, {PureComponent} from "react"
import Arrow from "../../Media/Svgs/Arrow"
import Material from "../Components/Material"
import TickSvg from "../../Media/Svgs/TickSvg"
import api from "../../Functions/api"
import {NotificationManager} from "react-notifications"

class UserItem extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            isOpen: false,
            height: null,
            is_deleted: false,
            is_verified: false,
        }
    }

    toggleOpen = () =>
    {
        const {isOpen} = this.state
        if (isOpen) this.setState({...this.state, isOpen: false, height: null})
        else this.setState({...this.state, isOpen: true, height: this.detail.scrollHeight + "px"})
    }

    removeItem = () =>
    {
        const {is_deleted} = this.state
        if (!is_deleted)
        {
            const {user} = this.props
            let result = window.confirm("از حذف مطمئنید؟")
            if (result)
            {
                api.del("user", {user_id: user._id})
                    .then(() => this.setState({...this.state, is_deleted: true}, () => NotificationManager.success("با موفقیت حذف شد!")))
                    .catch(() => NotificationManager.error("خطا در برقرای ارتباط!"))
            }
        }
    }

    verifyItem = () =>
    {
        const {is_deleted, is_verified} = this.state
        if (!is_deleted && !is_verified)
        {
            const {user} = this.props
            api.post("user/verify", {user_id: user._id})
                .then(() => this.setState({...this.state, is_verified: true}, () => NotificationManager.success("با موفقیت تایید شد!")))
                .catch(() => NotificationManager.error("خطا در برقرای ارتباط!"))
        }
    }

    render()
    {
        const {isOpen, height, is_deleted, is_verified} = this.state
        const {user} = this.props
        return (
            <div className={`panel-users-item-cont ${is_deleted ? "deleted" : ""}`}>
                <div className="panel-users-item">
                    <Material className="panel-users-item-name" onClick={this.toggleOpen}>{user.name}</Material>
                    <div className="panel-users-item-svg-cont">
                        <button className="panel-users-item-remove" onClick={this.removeItem}>حذف</button>
                        {
                            user.is_verified || is_verified ?
                                <TickSvg className="panel-users-item-verify"/>
                                :
                                <button className="panel-users-item-submit" onClick={this.verifyItem}>تایید</button>
                        }
                        <Arrow className="panel-users-item-svg"/>
                    </div>
                </div>
                <div ref={e => this.detail = e} className="panel-users-item-detail" style={{height: isOpen ? height : "0", padding: isOpen ? "10px 10px" : "0 10px"}}>
                    <div className="panel-users-item-detail-row">
                        <div className="panel-users-item-detail-row-title">
                            شماره تلفن
                        </div>
                        <div className="panel-users-item-detail-row-value">
                            {user.phone}
                        </div>
                    </div>
                    <div className="panel-users-item-detail-row">
                        <div className="panel-users-item-detail-row-title">
                            نام و نام خانوادگی
                        </div>
                        <div className="panel-users-item-detail-row-value">
                            {user.name}
                        </div>
                    </div>
                    <div className="panel-users-item-detail-row">
                        <div className="panel-users-item-detail-row-title">
                            ایمیل
                        </div>
                        <div className="panel-users-item-detail-row-value">
                            {user.email}
                        </div>
                    </div>
                    {
                        user.birth_date_year &&
                        <div className="panel-users-item-detail-row">
                            <div className="panel-users-item-detail-row-title">
                                سن
                            </div>
                            <div className="panel-users-item-detail-row-value">
                                {user.birth_date_year}
                            </div>
                        </div>
                    }
                    {
                        user.major &&
                        <div className="panel-users-item-detail-row">
                            <div className="panel-users-item-detail-row-title">
                                رشته
                            </div>
                            <div className="panel-users-item-detail-row-value">
                                {user.major}
                            </div>
                        </div>
                    }
                    <div className="panel-users-item-detail-row">
                        <div className="panel-users-item-detail-row-title">
                            مقطع
                        </div>
                        <div className="panel-users-item-detail-row-value">
                            {user.grade}
                        </div>
                    </div>
                    {
                        user.university &&
                        <div className="panel-users-item-detail-row">
                            <div className="panel-users-item-detail-row-title">
                                دانشگاه
                            </div>
                            <div className="panel-users-item-detail-row-value">
                                {user.university}
                            </div>
                        </div>
                    }
                    {
                        user.range_of_activity &&
                        <div className="panel-users-item-detail-row">
                            <div className="panel-users-item-detail-row-title">
                                محدوده فعالیت
                            </div>
                            <div className="panel-users-item-detail-row-value">
                                {user.range_of_activity}
                            </div>
                        </div>
                    }
                    {
                        user.specializations &&
                        <div className="panel-users-item-detail-row">
                            <div className="panel-users-item-detail-row-title">
                                تخصص ها
                            </div>
                            <div className="panel-users-item-detail-row-value">
                                {user.specializations}
                            </div>
                        </div>
                    }
                    <div className="panel-users-item-detail-row">
                        <div className="panel-users-item-detail-row-title">
                            آشنایی با زبان
                        </div>
                        <div className="panel-users-item-detail-row-value">
                            {user.familiarity_with_language === "high" ? "زیاد" : user.familiarity_with_language === "low" ? "کم" : "متوسط"}
                        </div>
                    </div>
                    <div className="panel-users-item-detail-row">
                        <div className="panel-users-item-detail-row-title">
                            آشنایی با منطقه
                        </div>
                        <div className="panel-users-item-detail-row-value">
                            {user.familiarity_with_area === "high" ? "زیاد" : user.familiarity_with_area === "low" ? "کم" : "متوسط"}
                        </div>
                    </div>
                    <div className="panel-users-item-detail-row">
                        <div className="panel-users-item-detail-row-title">
                            آشنایی با گردشگری
                        </div>
                        <div className="panel-users-item-detail-row-value">
                            {user.familiarity_with_tourism === "high" ? "زیاد" : user.familiarity_with_tourism === "low" ? "کم" : "متوسط"}
                        </div>
                    </div>
                    {
                        user.experience &&
                        <div className="panel-users-item-detail-row">
                            <div className="panel-users-item-detail-row-title">
                                سابقه فعالیت
                            </div>
                            <div className="panel-users-item-detail-row-value">
                                {user.experience}
                            </div>
                        </div>
                    }
                    {
                        user.current_organ &&
                        <div className="panel-users-item-detail-row">
                            <div className="panel-users-item-detail-row-title">
                                مجموعه فعلی
                            </div>
                            <div className="panel-users-item-detail-row-value">
                                {user.current_organ}
                            </div>
                        </div>
                    }
                    <div className="panel-users-item-detail-row">
                        <div className="panel-users-item-detail-row-title">
                            توضیحات
                        </div>
                        <div className="panel-users-item-detail-row-value">
                            {user.description}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserItem