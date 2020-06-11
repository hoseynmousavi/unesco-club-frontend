import React, {PureComponent} from "react"

class NotFoundPage extends PureComponent
{
    componentDidMount()
    {
        window.scroll({top: 0})
    }

    render()
    {
        const {lang} = this.props
        return (
            <div className="not-found-page-cont">
                {lang === "fa" ? "صفحه مورد نظر پیدا نشد!" : "Page Not Found!"}
            </div>
        )
    }
}

export default NotFoundPage