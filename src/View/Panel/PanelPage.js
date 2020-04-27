import React, {PureComponent} from "react"
import {Route, Switch} from "react-router-dom"
import PanelSidebar from "./PanelSidebar"
import Login from "./Login"
import Users from "./Users"

class PanelPage extends PureComponent
{
    componentDidMount()
    {
        window.scroll({top: 0})
    }

    render()
    {
        const {admin, setAdmin} = this.props
        if (admin)
            return (
                <div className="panel-page-container">
                    <PanelSidebar/>
                    <div className="panel-page-content">
                        <Switch>
                            <Route path="/panel/users" render={() => <Users/>}/>
                            <Route path="/panel/documents" render={() => <div className="panel-welcome">به زودی :)</div>}/>
                            <Route path="*" render={() => <div className="panel-welcome">خوش اومدی ادمین :)</div>}/>
                        </Switch>
                    </div>
                </div>
            )
        else return <Login setAdmin={setAdmin}/>
    }
}

export default PanelPage