import React, {PureComponent} from "react"
import {MoonLoader} from "react-spinners"
import MaterialInput from "../Components/MaterialInput"
import Material from "../Components/Material"
import {NotificationManager} from "react-notifications"
import api from "../../Functions/api"

class Login extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            loading: false,
        }
    }

    setValue = (e) =>
    {
        const {name, value} = e.target
        this[name] = value
    }

    submitOnEnter = (e) => e.keyCode === 13 && this.submit()

    submit = () =>
    {
        const {username, password} = this
        const {setAdmin, lang} = this.props
        if (username && password && password.length > 5)
        {
            this.setState({...this.state, loading: true}, () =>
            {
                api.post("admin/login", {username, password})
                    .then(admin =>
                    {
                        this.setState({...this.state, loading: false}, () =>
                            setAdmin(admin),
                        )
                    })
                    .catch(err =>
                    {
                        this.setState({...this.state, loading: false}, () =>
                        {
                            if (err?.response?.status === 404) NotificationManager.error(lang === "fa" ? "کاربری با این اطلاعات یافت نشد!" : "no user found with this information!")
                            else NotificationManager.error(lang === "fa" ? "خطا در برقراری ارتباط!" : "error communicating")
                        })
                    })
            })
        }
        else
        {
            if (!username) NotificationManager.error(lang === "fa" ? "نام کاربری خود را وارد کنید!" : "enter your username!")
            if (!password) NotificationManager.error(lang === "fa" ? "رمز عبور خود را وارد کنید!" : "enter your password!")
            else if (password.length < 6) NotificationManager.error(lang === "fa" ? "رمز عبور وارد شده معتبر نیست!" : "entered password is not even valid!")
        }
    }

    render()
    {
        const {loading} = this.state
        const {lang} = this.props
        return (
            <div className="sign-up-page-cont admin">

                {
                    loading &&
                    <div className="sign-up-page-loading">
                        <MoonLoader size={50} color="var(--primary-color)"/>
                    </div>
                }

                <div className="sign-up-page-form admin">
                    <div className="sign-up-page-title">{lang === "fa" ? "ورود" : "login"}</div>
                    <MaterialInput onKeyDown={this.submitOnEnter} className={`sign-up-page-input ${lang}`} name="username" backgroundColor="white" label={<span>{lang === "fa" ? "نام کاربری" : "username"}</span>} getValue={this.setValue}/>
                    <MaterialInput onKeyDown={this.submitOnEnter} className={`sign-up-page-input ${lang}`} name="password" type="password" backgroundColor="white" label={<span>{lang === "fa" ? "رمز عبور" : "password"}</span>} getValue={this.setValue}/>
                    <Material className={`sign-up-page-submit ${lang}`} backgroundColor="rgba(255,255,255,0.3)" onClick={this.submit}>{lang === "fa" ? "ثبت" : "submit"}</Material>
                </div>
            </div>
        )
    }
}

export default Login