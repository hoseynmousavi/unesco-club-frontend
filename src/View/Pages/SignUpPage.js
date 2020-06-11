import React, {PureComponent} from "react"
import MaterialInput from "../Components/MaterialInput"
import Material from "../Components/Material"
import {NotificationManager} from "react-notifications"
import CameraSvg from "../../Media/Svgs/Camera"
import CancelSvg from "../../Media/Svgs/CancelSvg"
import compressImage from "../../Helpers/compressImage"
import api from "../../Functions/api"
import {ClipLoader} from "react-spinners"

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
        const {phone, name, email, birth_date_year, major, grade, university, range_of_activity, specializations, experience, current_organ, description, avatar, instagram} = this
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
                if (instagram) form.append("instagram", instagram)
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
            const {lang} = this.props
            if (!(phone && phone.length === 11 && !isNaN(phone))) NotificationManager.error(lang === "fa" ? "لطفا یک شماره تلفن معتبر وارد کنید!" : "please enter a valid phone!")
            if (!name) NotificationManager.error(lang === "fa" ? "لطفا نام و نام خانوادگی را وارد کنید!" : "please enter your full name!")
            if (!email) NotificationManager.error(lang === "fa" ? "لطفا ایمیل را وارد کنید!" : "please enter your email!")
            if (!grade) NotificationManager.error(lang === "fa" ? "لطفا مقطع تحصیلی را وارد کنید!" : "please enter your grade!")
            if (!description) NotificationManager.error(lang === "fa" ? "لطفا توضیحات را وارد کنید!" : "please enter description!")
            if (!(!birth_date_year || (!isNaN(birth_date_year) && parseInt(birth_date_year) < 1400 && parseInt(birth_date_year) > 1300))) NotificationManager.error(lang === "fa" ? "سال تولد وارد شده معتبر نیست!" : "entered birth date is not valid!")
        }
    }

    postData(form)
    {
        api.post("user", form, "", (e) => this.setState({...this.state, loadingPercent: Math.floor((e.loaded * 100) / e.total)}))
            .then(() =>
                this.setState({...this.state, loading: false}, () =>
                    NotificationManager.success(this.props.lang === "fa" ? "ثبت نام با موفقیت انجام شد!" : "registration was successful!"),
                ),
            )
            .catch((err) => this.setState({...this.state, loading: false}, () =>
            {
                const {lang} = this.props
                if (err?.response?.data?.keyPattern?.phone) NotificationManager.error(lang === "fa" ? "شماره تلفن وارد شده تکراری است!" : "the phone number entered is duplicate!")
                else if (err?.response?.data?.keyPattern?.email) NotificationManager.error(lang === "fa" ? "ایمیل وارد شده تکراری است!" : "the email entered is duplicate!")
                else NotificationManager.error(lang === "fa" ? "سیستم با خطا مواجه شد!" : "the system crashed!")
            }))
    }

    render()
    {
        const {familiarity_with_language, familiarity_with_area, familiarity_with_tourism, selectedImagePreview, loading, loadingPercent} = this.state
        const {lang} = this.props
        return (
            <div className="sign-up-page-cont">

                {
                    loading &&
                    <div className="sign-up-page-loading">
                        <div className="sign-up-page-loading-percent">
                            {loadingPercent === 0 || loadingPercent === 100 ? <div className="panel-section-loading-cont clip"><ClipLoader size={20} color="var(--primary-color)"/></div> : <span>{loadingPercent} %</span>}
                        </div>
                    </div>
                }

                <div className="sign-up-page-form">
                    <div className="sign-up-page-title">{lang === "fa" ? "ثبت نام" : "sign up"}</div>
                    <div className="sign-up-page-section">{lang === "fa" ? "مشخصات فردی" : "personal info"}</div>
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
                    <MaterialInput className={`sign-up-page-input ${lang}`} name="phone" backgroundColor="white" maxLength={11} label={<span>{lang === "fa" ? "شماره همراه" : "phone"} <span className="sign-up-page-required">*</span></span>} getValue={this.setValue}/>
                    <MaterialInput className={`sign-up-page-input ${lang}`} name="name" backgroundColor="white" maxLength={50} label={<span>{lang === "fa" ? "نام و نام خانوادگی" : "full name"} <span className="sign-up-page-required">*</span></span>} getValue={this.setValue}/>
                    <MaterialInput className={`sign-up-page-input ${lang}`} name="email" backgroundColor="white" maxLength={100} label={<span>{lang === "fa" ? "ایمیل" : "email"} <span className="sign-up-page-required">*</span></span>} getValue={this.setValue}/>
                    <MaterialInput className={`sign-up-page-input ${lang}`} name="birth_date_year" maxLength={4} backgroundColor="white" label={lang === "fa" ? "سال تولد" : "birth date"} getValue={this.setValue}/>
                    <div className="sign-up-page-section">{lang === "fa" ? "تحصیلات" : "education"}</div>
                    <MaterialInput className={`sign-up-page-input ${lang}`} name="major" backgroundColor="white" label={lang === "fa" ? "رشته" : "major"} getValue={this.setValue}/>
                    <MaterialInput className={`sign-up-page-input ${lang}`} name="grade" backgroundColor="white" label={<span>{lang === "fa" ? "مقطع" : "grade"} <span className="sign-up-page-required">*</span></span>} getValue={this.setValue}/>
                    <MaterialInput className={`sign-up-page-input ${lang}`} name="university" backgroundColor="white" label={lang === "fa" ? "دانشگاه" : "university"} getValue={this.setValue}/>
                    <div className="sign-up-page-section">{lang === "fa" ? "فعالیت‌ها" : "activities"}</div>
                    <MaterialInput className={`sign-up-page-input ${lang}`} name="range_of_activity" backgroundColor="white" label={lang === "fa" ? "محدوده شهر و استان مورد فعالیت" : "activity range"} getValue={this.setValue}/>
                    <MaterialInput className={`sign-up-page-input ${lang}`} name="specializations" backgroundColor="white" label={lang === "fa" ? "تخصص‌ها" : "specializations"} getValue={this.setValue}/>
                    <div className="sign-up-page-level-section">
                        <div className="sign-up-page-level-section-title">{lang === "fa" ? "میزان آشنایی با زبان" : "familiarity with english"} <span className="sign-up-page-required">*</span></div>
                        <Material backgroundColor="var(--transparent-second)" className="seyed-radio-cont" onClick={() => this.setLanguage("low")}>
                            <div className={`seyed-radio ${familiarity_with_language === "low" ? "selected" : ""} `}/>
                            <div className={`seyed-radio-label ${lang}`}>{lang === "fa" ? "کم" : "low"}</div>
                        </Material>
                        <Material backgroundColor="var(--transparent-second)" className="seyed-radio-cont" onClick={() => this.setLanguage("average")}>
                            <div className={`seyed-radio ${familiarity_with_language === "average" ? "selected" : ""} `}/>
                            <div className={`seyed-radio-label ${lang}`}>{lang === "fa" ? "متوسط" : "average"}</div>
                        </Material>
                        <Material backgroundColor="var(--transparent-second)" className="seyed-radio-cont" onClick={() => this.setLanguage("high")}>
                            <div className={`seyed-radio ${familiarity_with_language === "high" ? "selected" : ""} `}/>
                            <div className={`seyed-radio-label ${lang}`}>{lang === "fa" ? "زیاد" : "high"}</div>
                        </Material>
                    </div>
                    <div className="sign-up-page-level-section">
                        <div className="sign-up-page-level-section-title">{lang === "fa" ? "میزان آشنایی با منطقه" : "familiarity with area"} <span className="sign-up-page-required">*</span></div>
                        <Material backgroundColor="var(--transparent-second)" className="seyed-radio-cont" onClick={() => this.setArea("low")}>
                            <div className={`seyed-radio ${familiarity_with_area === "low" ? "selected" : ""} `}/>
                            <div className={`seyed-radio-label ${lang}`}>{lang === "fa" ? "کم" : "low"}</div>
                        </Material>
                        <Material backgroundColor="var(--transparent-second)" className="seyed-radio-cont" onClick={() => this.setArea("average")}>
                            <div className={`seyed-radio ${familiarity_with_area === "average" ? "selected" : ""} `}/>
                            <div className={`seyed-radio-label ${lang}`}>{lang === "fa" ? "متوسط" : "average"}</div>
                        </Material>
                        <Material backgroundColor="var(--transparent-second)" className="seyed-radio-cont" onClick={() => this.setArea("high")}>
                            <div className={`seyed-radio ${familiarity_with_area === "high" ? "selected" : ""} `}/>
                            <div className={`seyed-radio-label ${lang}`}>{lang === "fa" ? "زیاد" : "high"}</div>
                        </Material>
                    </div>
                    <div className="sign-up-page-level-section">
                        <div className="sign-up-page-level-section-title">{lang === "fa" ? "میزان آشنایی با تخصص گردشگری" : "familiarity with tourism"} <span className="sign-up-page-required">*</span></div>
                        <Material backgroundColor="var(--transparent-second)" className="seyed-radio-cont" onClick={() => this.setTourism("low")}>
                            <div className={`seyed-radio ${familiarity_with_tourism === "low" ? "selected" : ""} `}/>
                            <div className={`seyed-radio-label ${lang}`}>{lang === "fa" ? "کم" : "low"}</div>
                        </Material>
                        <Material backgroundColor="var(--transparent-second)" className="seyed-radio-cont" onClick={() => this.setTourism("average")}>
                            <div className={`seyed-radio ${familiarity_with_tourism === "average" ? "selected" : ""} `}/>
                            <div className={`seyed-radio-label ${lang}`}>{lang === "fa" ? "متوسط" : "average"}</div>
                        </Material>
                        <Material backgroundColor="var(--transparent-second)" className="seyed-radio-cont" onClick={() => this.setTourism("high")}>
                            <div className={`seyed-radio ${familiarity_with_tourism === "high" ? "selected" : ""} `}/>
                            <div className={`seyed-radio-label ${lang}`}>{lang === "fa" ? "زیاد" : "high"}</div>
                        </Material>
                    </div>
                    <MaterialInput className={`sign-up-page-input ${lang}`} name="experience" backgroundColor="white" label={lang === "fa" ? "سابقه فعالیت" : "experience"} getValue={this.setValue}/>
                    <MaterialInput className={`sign-up-page-input ${lang}`} name="current_organ" backgroundColor="white" label={lang === "fa" ? "مجموعه درحال فعالیت" : "current organ"} getValue={this.setValue}/>
                    <MaterialInput className={`sign-up-page-input ${lang}`} name="description" backgroundColor="white" label={<span>{lang === "fa" ? "توضیحات" : "description"} <span className="sign-up-page-required">*</span></span>} getValue={this.setValue}/>
                    <MaterialInput className={`sign-up-page-input ltr ${lang}`} name="instagram" backgroundColor="white" label={<span>{lang === "fa" ? "آیدی اینستاگرام" : "instagram"}</span>} getValue={this.setValue}/>
                    <Material className={`sign-up-page-submit ${lang}`} backgroundColor="rgba(255,255,255,0.3)" onClick={this.submit}>{lang === "fa" ? "ثبت" : "submit"}</Material>
                </div>
            </div>
        )
    }
}

export default SignUpPage