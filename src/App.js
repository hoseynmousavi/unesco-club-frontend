import React, {lazy, PureComponent, Suspense} from "react"
import {Route, Switch} from "react-router-dom"
import {NotificationContainer} from "react-notifications"
import Header from "./View/Components/Header"
import api from "./Functions/api"

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
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        const {location} = this.props
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

    render()
    {
        const {admin} = this.state
        return (
            <main className="main">
                <Header admin={admin}/>
                <Suspense fallback={null}>
                    <Switch>
                        <Route path="/sign-up" render={() => <SignUpPage/>}/>
                        <Route path="/documents" render={() => <DocumentsPage/>}/>
                        <Route path="/routes" render={() => <RoutesPage/>}/>
                        <Route path="/users" render={() => <UsersPage/>}/>
                        <Route path="/about-us" render={() => <AboutPage/>}/>
                        <Route path="/panel" render={() => <PanelPage admin={admin} setAdmin={this.setAdmin}/>}/>
                        <Route exact path="/" render={() => <HomePage/>}/>
                        <Route path="*" status={404} render={() => <NotFoundPage/>}/>
                    </Switch>
                </Suspense>
                <NotificationContainer/>
            </main>
        )
    }
}

export default App