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
        const {setAdmin} = this.props
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
                            if (err?.response?.status === 404) NotificationManager.error("کاربری با این اطلاعات یافت نشد!")
                            else NotificationManager.error("خطا در برقراری ارتباط!")
                        })
                    })
            })
        }
        else
        {
            if (!username) NotificationManager.error("نام کاربری خود را وارد کنید!")
            if (!password) NotificationManager.error("رمز عبور خود را وارد کنید!")
            else if (password.length < 6) NotificationManager.error("رمز عبور وارد شده معتبر نیست!")
        }
    }

    render()
    {
        const {loading} = this.state
        return (
            <div className="sign-up-page-cont admin">

                {
                    loading &&
                    <div className="sign-up-page-loading">
                        <MoonLoader size={50} color="var(--primary-color)"/>
                    </div>
                }

                <div className="sign-up-page-form admin">
                    <div className="sign-up-page-title">ورود</div>
                    <MaterialInput onKeyDown={this.submitOnEnter} className="sign-up-page-input" name="username" backgroundColor="white" maxLength={11} label={<span>نام کاربری</span>} getValue={this.setValue}/>
                    <MaterialInput onKeyDown={this.submitOnEnter} className="sign-up-page-input" name="password" type="password" backgroundColor="white" maxLength={50} label={<span>رمز عبور</span>} getValue={this.setValue}/>
                    <Material className="sign-up-page-submit" backgroundColor="rgba(255,255,255,0.3)" onClick={this.submit}>ثبت</Material>
                </div>
            </div>
        )
    }
}

export default Login