import React, {PureComponent} from "react"
import {REST_URL} from "../../Functions/api"
import ImageShow from "./ImageShow"
import ZoomSvg from "../../Media/Svgs/ZoomSvg"
import {Link} from "react-router-dom"

class RouteItem extends PureComponent
{
    render()
    {
        const {route, lang} = this.props
        return (
            <div className="route-item-cont">
                <div className="route-item-img-effect" onClick={() => document.getElementById(route.thumbnail).click()}>
                    <ZoomSvg className="route-item-img-effect-svg"/>
                </div>
                <ImageShow id={route.thumbnail} className="route-item-img" src={REST_URL + route.thumbnail} alt=""/>
                <Link to={`/routes/${route._id}`} className={`route-item-text ${lang}`}>
                    <div className="route-item-text-title">{lang === "fa" ? route.title : route.title_en}</div>
                    <div className="route-item-text-summary">{lang === "fa" ? route.summary : route.summary_en}</div>
                </Link>
            </div>
        )
    }
}

export default RouteItem