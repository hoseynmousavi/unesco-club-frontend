import React, {lazy, PureComponent, Suspense} from "react"
import {NotificationContainer} from "react-notifications"
import {Route, Switch, Redirect} from "react-router-dom"
import api from "./Functions/api"
import Header from "./View/Components/Header"
import Footer from "./View/Components/Footer"

const SignUpPage = lazy(() => import("./View/Pages/SignUpPage"))
const DocumentsPage = lazy(() => import("./View/Pages/DocumentsPage"))
const RoutesPage = lazy(() => import("./View/Pages/RoutesPage"))
const UsersPage = lazy(() => import("./View/Pages/UsersPage"))
const HomePage = lazy(() => import("./View/Pages/HomePage"))
const PanelPage = lazy(() => import("./View/Panel/PanelPage"))
const AboutPage = lazy(() => import("./View/Pages/AboutPage"))
const NotFoundPage = lazy(() => import("./View/Pages/NotFoundPage"))

class App extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            admin: null,
            lang: "fa",
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        const {location} = this.props

        if (location.pathname.slice(0, 3) === "/en") this.setState({...this.state, lang: "en"}, () => localStorage.setItem("language", "en"))
        else localStorage.removeItem("language")

        if (
            location.pathname.includes("/add") || location.pathname.includes("/show-picture")
        )
        {
            let currentPath = location.pathname
                .replace("/add", "")
                .replace("/show-picture", "")
            window.history.replaceState("", "", currentPath ? currentPath : "/")
            document.location.reload()
        }

        let admin = null

        setTimeout(() =>
        {
            if (localStorage.hasOwnProperty("admin"))
            {
                admin = JSON.parse(localStorage.getItem("admin"))
                this.setState({...this.state, admin}, () =>
                {
                    api.post("admin/verify-token")
                        .then((data) => this.setAdmin(data))
                        .catch((e) =>
                        {
                            if (e?.response?.status === 403)
                            {
                                this.logout()
                            }
                        })
                })
            }
        }, 100)
    }

    setAdmin = (admin) =>
    {
        if (!admin.token)
        {
            const token = JSON.parse(localStorage.getItem("admin")).token
            const adminJWT = {...admin, token}
            localStorage.setItem("admin", JSON.stringify(adminJWT))
            this.setState({...this.state, admin: adminJWT})
        }
        else
        {
            localStorage.setItem("admin", JSON.stringify(admin))
            this.setState({...this.state, admin})
        }
    }

    logout()
    {
        this.setState({...this.state, admin: null}, () =>
            localStorage.removeItem("admin"),
        )
    }

    switchLanguage = () =>
    {
        const {location} = this.props
        let lang
        if (this.state.lang === "fa") lang = "en"
        else lang = "fa"
        this.setState({...this.state, lang}, () =>
        {
            window.history.replaceState("", "", `/${lang}${location.pathname.replace("/en", "").replace("/fa", "")}`)
            if (lang === "en") localStorage.setItem("language", "en")
            else localStorage.removeItem("language")
        })
    }

    render()
    {
        const {admin, lang} = this.state
        const {location} = this.props
        return (
            <div className={`body ${lang}`}>
                <Header admin={admin} lang={lang} switchLanguage={this.switchLanguage}/>
                <main className="main">
                    <Suspense fallback={null}>
                        <Switch>
                            <Route path="/:lang(fa|en)" render={route =>
                                <Switch>
                                    <Route path={`${route.match.path}/sign-up`} render={() => <SignUpPage lang={lang}/>}/>
                                    <Route path={`${route.match.path}/documents`} render={route => <DocumentsPage lang={lang} path={route.match.path}/>}/>
                                    <Route path={`${route.match.path}/routes`} render={route => <RoutesPage lang={lang} path={route.match.path}/>}/>
                                    <Route path={`${route.match.path}/users`} render={route => <UsersPage lang={lang} path={route.match.path}/>}/>
                                    <Route path={`${route.match.path}/about-us`} render={() => <AboutPage lang={lang}/>}/>
                                    <Route path={`${route.match.path}/panel`} render={() => <PanelPage lang={lang} admin={admin} setAdmin={this.setAdmin} route={route}/>}/>
                                    <Route exact path={`${route.match.path}`} render={() => <HomePage lang={lang}/>}/>
                                    <Route path="*" status={404} render={() => <NotFoundPage lang={lang}/>}/>
                                </Switch>
                            }/>
                            <Redirect to={`/${lang}${location.pathname === "/" ? "" : location.pathname}`}/>
                        </Switch>
                    </Suspense>
                </main>
                <Footer lang={lang}/>
                <NotificationContainer/>
            </div>
        )
    }
}

export default App