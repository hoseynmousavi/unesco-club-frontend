import Material from "./Material"
import {REST_URL} from "../../Functions/api"
import PdfSvg from "../../Media/Svgs/PdfSvg"
import {Link} from "react-router-dom"
import React from "react"
import HyperLinkSvg from "../../Media/Svgs/HyperlinkSvg"

const Document = props =>
{
    const {document, noBorder} = props
    return (
        <Link className="home-page-docs-item" to={`/documents/${document._id}`}>
            <Material className={`panel-document-item ${noBorder ? "border-none" : ""}`}>
                {
                    document.thumbnail ?
                        <img className="panel-document-thumb" src={REST_URL + document.thumbnail} alt={document.title}/>
                        :
                        <div className="panel-document-thumb-default-cont"><PdfSvg className="panel-document-thumb-default"/></div>
                }
                <div className="panel-document-thumb-effect"><HyperLinkSvg className="panel-document-thumb-effect-svg"/></div>
                <div className="panel-document-item-title">{document.title}</div>
                {document.summary && <div className="panel-document-item-summary">{document.summary}</div>}
            </Material>
        </Link>
    )
}

export default Document