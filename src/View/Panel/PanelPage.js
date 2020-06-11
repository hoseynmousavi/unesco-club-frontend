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
        const {admin, setAdmin, lang} = this.props
        if (admin)
            return (
                <div className="panel-page-container">
                    <PanelSidebar/>
                    <div className="panel-page-content">
                        <Switch>
                            <Route path="/panel/users" render={() => <Users/>}/>
                            <Route path="/panel/documents" render={() => <Documents/>}/>
                            <Route path="/panel/categories" render={() => <Categories/>}/>
                            <Route path="*" render={() => <div className="panel-welcome">خوش اومدی ادمین :)</div>}/>
                        </Switch>
                    </div>
                </div>
            )
        else return <Login lang={lang} setAdmin={setAdmin}/>
    }
}

export default PanelPage