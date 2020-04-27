import React, {PureComponent} from "react"
import MaterialInput from "../Components/MaterialInput"
import Material from "../Components/Material"
import {NotificationManager} from "react-notifications"
import CameraSvg from "../../Media/Svgs/Camera"
import CancelSvg from "../../Media/Svgs/CancelSvg"
import compressImage from "../../Helpers/compressImage"
import api from "../../Functions/api"

class SignUpPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            familiarity_with_language: "average",
            familiarity_with_area: "average",
            familiarity_with_tourism: "average",
            loadingPercent: 0,
            loading: false,
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})
    }

    setLanguage(familiarity_with_language)
    {
        this.setState({...this.state, familiarity_with_language})
    }

    setArea(familiarity_with_area)
    {
        this.setState({...this.state, familiarity_with_area})
    }

    setTourism(familiarity_with_tourism)
    {
        this.setState({...this.state, familiarity_with_tourism})
    }

    setValue = (e) =>
    {
        const {name, value} = e.target
        this[name] = value
    }

    removeImage = () =>
    {
        this.setState({...this.state, selectedImagePreview: undefined}, () =>
            this.avatar = undefined,
        )
    }

    selectImage = (e) =>
    {
        const img = e.target.files[0]
        this.avatar = img
        const reader = new FileReader()
        reader.readAsDataURL(img)
        reader.onload = () => this.setState({...this.state, selectedImagePreview: reader.result})
        e.target.value = ""
    }

    submit = () =>
    {
        const {phone, name, email, birth_date_year, major, grade, university, range_of_activity, specializations, experience, current_organ, description, avatar} = this
        const {familiarity_with_language, familiarity_with_area, familiarity_with_tourism} = this.state
        if (
            (phone && phone.length === 11 && !isNaN(phone)) &&
            name && email && grade && description &&
            (!birth_date_year || (!isNaN(birth_date_year) && parseInt(birth_date_year) < 1400 && parseInt(birth_date_year) > 1300))
        )
        {
            this.setState({...this.state, loading: true, loadingPercent: 0}, () =>
            {
                let form = new FormData()
                form.append("phone", phone)
                form.append("name", name)
                form.append("email", email)
                form.append("grade", grade)
                form.append("description", description)
                form.append("familiarity_with_language", familiarity_with_language)
                form.append("familiarity_with_area", familiarity_with_area)
                form.append("familiarity_with_tourism", familiarity_with_tourism)
                if (birth_date_year) form.append("birth_date_year", birth_date_year)
                if (major) form.append("major", major)
                if (university) form.append("university", university)
                if (range_of_activity) form.append("range_of_activity", range_of_activity)
                if (specializations) form.append("specializations", specializations)
                if (experience) form.append("experience", experience)
                if (current_organ) form.append("current_organ", current_organ)
                if (avatar)
                {
                    compressImage(avatar)
                        .then(avatar =>
                        {
                            form.append("avatar", avatar)
                            this.postData(form)
                        })
                }
                else this.postData(form)
            })
        }
        else
        {
            if (!(phone && phone.length === 11 && !isNaN(phone))) NotificationManager.error("لطفا یک شماره تلفن معتبر وارد کنید!")
            if (!name) NotificationManager.error("لطفا نام و نام خانوادگی را وارد کنید!")
            if (!email) NotificationManager.error("لطفا ایمیل را وارد کنید!")
            if (!grade) NotificationManager.error("لطفا مقطع تحصیلی را وارد کنید!")
            if (!description) NotificationManager.error("لطفا توضیحات را وارد کنید!")
            if (!(!birth_date_year || (!isNaN(birth_date_year) && parseInt(birth_date_year) < 1400 && parseInt(birth_date_year) > 1300))) if (!description) NotificationManager.error("سال تولد وارد شده معتبر نیست!")
        }
    }

    postData(form)
    {
        api.post("user", form, "", (e) => this.setState({...this.state, loadingPercent: Math.floor((e.loaded * 100) / e.total)}))
            .then((result) =>
                this.setState({...this.state, loading: false}, () =>
                    NotificationManager.success("ثبت نام با موفقیت انجام شد!"),
                ),
            )
            .catch((err) => this.setState({...this.state, loading: false}, () =>
            {
                if (err?.response?.data?.keyPattern?.phone) NotificationManager.error("شماره تلفن وارد شده تکراری است!")
                else if (err?.response?.data?.keyPattern?.email) NotificationManager.error("ایمیل وارد شده تکراری است!")
                else NotificationManager.error("سیستم با خطا مواجه شد!")
            }))
    }

    render()
    {
        const {familiarity_with_language, familiarity_with_area, familiarity_with_tourism, selectedImagePreview, loading, loadingPercent} = this.state
        return (
            <div className="sign-up-page-cont">

                {
                    loading &&
                    <div className="sign-up-page-loading">
                        <div className="sign-up-page-loading-percent">{loadingPercent}</div>
                    </div>
                }

                <div className="sign-up-page-form">
                    <div className="sign-up-page-title">ثبت نام</div>
                    <div className="sign-up-page-section">مشخصات فردی</div>
                    <Material className="sign-up-page-avatar-cont-material" backgroundColor="var(--transparent-second)">
                        <label className="sign-up-page-avatar-cont">
                            {
                                selectedImagePreview ?
                                    <React.Fragment>
                                        <img src={selectedImagePreview} className="sign-up-page-avatar-img" alt=""/>
                                        <CancelSvg className="sign-up-page-avatar-edit" onClick={this.removeImage}/>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <CameraSvg className="sign-up-page-avatar-svg"/>
                                        <input type="file" hidden accept="image/*" onChange={this.selectImage}/>
                                    </React.Fragment>
                            }
                        </label>
                    </Material>
                    <MaterialInput className="sign-up-page-input" name="phone" backgroundColor="white" maxLength={11} label={<span>شماره همراه <span className="sign-up-page-required">*</span></span>} getValue={this.setValue}/>
                    <MaterialInput className="sign-up-page-input" name="name" backgroundColor="white" maxLength={50} label={<span>نام و نام خانوادگی <span className="sign-up-page-required">*</span></span>} getValue={this.setValue}/>
                    <MaterialInput className="sign-up-page-input" name="email" backgroundColor="white" maxLength={100} label={<span>ایمیل <span className="sign-up-page-required">*</span></span>} getValue={this.setValue}/>
                    <MaterialInput className="sign-up-page-input" name="birth_date_year" maxLength={4} backgroundColor="white" label="سال تولد" getValue={this.setValue}/>
                    <div className="sign-up-page-section">تحصیلات</div>
                    <MaterialInput className="sign-up-page-input" name="major" backgroundColor="white" label="رشته" getValue={this.setValue}/>
                    <MaterialInput className="sign-up-page-input" name="grade" backgroundColor="white" label={<span>مقطع <span className="sign-up-page-required">*</span></span>} getValue={this.setValue}/>
                    <MaterialInput className="sign-up-page-input" name="university" backgroundColor="white" label="دانشگاه" getValue={this.setValue}/>
                    <div className="sign-up-page-section">فعالیت‌ها</div>
                    <MaterialInput className="sign-up-page-input" name="range_of_activity" backgroundColor="white" label="محدوده شهر و استان مورد فعالیت" getValue={this.setValue}/>
                    <MaterialInput className="sign-up-page-input" name="specializations" backgroundColor="white" label="تخصص‌ها" getValue={this.setValue}/>
                    <div className="sign-up-page-level-section">
                        <div className="sign-up-page-level-section-title">میزان آشنایی با زبان <span className="sign-up-page-required">*</span></div>
                        <Material backgroundColor="var(--transparent-second)" className="seyed-radio-cont" onClick={() => this.setLanguage("low")}>
                            <div className={`seyed-radio ${familiarity_with_language === "low" ? "selected" : ""} `}/>
                            <div className="seyed-radio-label">کم</div>
                        </Material>
                        <Material backgroundColor="var(--transparent-second)" className="seyed-radio-cont" onClick={() => this.setLanguage("average")}>
                            <div className={`seyed-radio ${familiarity_with_language === "average" ? "selected" : ""} `}/>
                            <div className="seyed-radio-label">متوسط</div>
                        </Material>
                        <Material backgroundColor="var(--transparent-second)" className="seyed-radio-cont" onClick={() => this.setLanguage("high")}>
                            <div className={`seyed-radio ${familiarity_with_language === "high" ? "selected" : ""} `}/>
                            <div className="seyed-radio-label">زیاد</div>
                        </Material>
                    </div>
                    <div className="sign-up-page-level-section">
                        <div className="sign-up-page-level-section-title">میزان آشنایی با منطقه <span className="sign-up-page-required">*</span></div>
                        <Material backgroundColor="var(--transparent-second)" className="seyed-radio-cont" onClick={() => this.setArea("low")}>
                            <div className={`seyed-radio ${familiarity_with_area === "low" ? "selected" : ""} `}/>
                            <div className="seyed-radio-label">کم</div>
                        </Material>
                        <Material backgroundColor="var(--transparent-second)" className="seyed-radio-cont" onClick={() => this.setArea("average")}>
                            <div className={`seyed-radio ${familiarity_with_area === "average" ? "selected" : ""} `}/>
                            <div className="seyed-radio-label">متوسط</div>
                        </Material>
                        <Material backgroundColor="var(--transparent-second)" className="seyed-radio-cont" onClick={() => this.setArea("high")}>
                            <div className={`seyed-radio ${familiarity_with_area === "high" ? "selected" : ""} `}/>
                            <div className="seyed-radio-label">زیاد</div>
                        </Material>
                    </div>
                    <div className="sign-up-page-level-section">
                        <div className="sign-up-page-level-section-title">میزان آشنایی با تخصص گردشگری <span className="sign-up-page-required">*</span></div>
                        <Material backgroundColor="var(--transparent-second)" className="seyed-radio-cont" onClick={() => this.setTourism("low")}>
                            <div className={`seyed-radio ${familiarity_with_tourism === "low" ? "selected" : ""} `}/>
                            <div className="seyed-radio-label">کم</div>
                        </Material>
                        <Material backgroundColor="var(--transparent-second)" className="seyed-radio-cont" onClick={() => this.setTourism("average")}>
                            <div className={`seyed-radio ${familiarity_with_tourism === "average" ? "selected" : ""} `}/>
                            <div className="seyed-radio-label">متوسط</div>
                        </Material>
                        <Material backgroundColor="var(--transparent-second)" className="seyed-radio-cont" onClick={() => this.setTourism("high")}>
                            <div className={`seyed-radio ${familiarity_with_tourism === "high" ? "selected" : ""} `}/>
                            <div className="seyed-radio-label">زیاد</div>
                        </Material>
                    </div>
                    <MaterialInput className="sign-up-page-input" name="experience" backgroundColor="white" label="سابقه فعالیت" getValue={this.setValue}/>
                    <MaterialInput className="sign-up-page-input" name="current_organ" backgroundColor="white" label="مجموعه درحال فعالیت" getValue={this.setValue}/>
                    <MaterialInput className="sign-up-page-input" name="description" backgroundColor="white" label={<span>توضیحات <span className="sign-up-page-required">*</span></span>} getValue={this.setValue}/>
                    <Material className="sign-up-page-submit" backgroundColor="rgba(255,255,255,0.3)" onClick={this.submit}>ثبت</Material>
                </div>
            </div>
        )
    }
}

export default SignUpPage