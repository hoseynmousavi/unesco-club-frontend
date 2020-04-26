import React, {lazy, PureComponent, Suspense} from "react"
import {Route, Switch} from "react-router-dom"
import {NotificationContainer} from "react-notifications"

const SignUpPage = lazy(() => import("./View/Pages/SignUpPage"))
const HomePage = lazy(() => import("./View/Pages/HomePage"))
const NotFoundPage = lazy(() => import("./View/Pages/NotFoundPage"))

class App extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            user: null,
        }
    }

    render()
    {
        return (
            <main className="main">
                <Suspense fallback={null}>
                    <Switch>
                        <Route path="/sign-up" render={() => <SignUpPage/>}/>
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