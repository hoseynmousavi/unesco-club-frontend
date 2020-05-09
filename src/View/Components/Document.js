import Material from "./Material"
import {REST_URL} from "../../Functions/api"
import PdfSvg from "../../Media/Svgs/PdfSvg"
import {Link} from "react-router-dom"
import React from "react"

const Document = props =>
{
    const {document} = props
    return (
        <Link className="home-page-docs-item" to={`/documents/${document._id}`}>
            <Material className="panel-document-item">
                {
                    document.thumbnail ?
                        <img className="panel-document-thumb" src={REST_URL + document.thumbnail} alt={document.title}/>
                        :
                        <PdfSvg className="panel-document-thumb-default"/>
                }
                <div className="panel-document-item-title">{document.title}</div>
                {document.summary && <div className="panel-document-item-summary">{document.summary}</div>}
            </Material>
        </Link>
    )
}

export default Document