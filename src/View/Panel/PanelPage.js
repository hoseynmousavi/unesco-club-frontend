import React, {PureComponent} from "react"
import {Route, Switch} from "react-router-dom"
import PanelSidebar from "./PanelSidebar"
import Login from "./Login"
import Users from "./Users"
import Categories from "./Categories"
import Documents from "./Documents"

class PanelPage extends PureComponent
{
    componentDidMount()
    {
        window.scroll({top: 0})
    }

    render()
    {
        const {admin, setAdmin, lang, route} = this.props
        const {path} = route.match
        if (admin)
            return (
                <div className="panel-page-container">
                    <PanelSidebar route={route}/>
                    <div className="panel-page-content">
                        <Switch>
                            <Route path={`${path}/panel/users`} render={() => <Users/>}/>
                            <Route path={`${path}/panel/documents`} render={() => <Documents/>}/>
                            <Route path={`${path}/panel/categories`} render={() => <Categories/>}/>
                            <Route path="*" render={() => <div className="panel-welcome">خوش اومدی ادمین :)</div>}/>
                        </Switch>
                    </div>
                </div>
            )
        else return <Login lang={lang} setAdmin={setAdmin}/>
    }
}

export default PanelPage