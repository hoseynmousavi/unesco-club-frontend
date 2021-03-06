import React from "react"

const SummarySvg = (props) =>
    <svg className={props.className} viewBox="0 0 24 24">
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M16 4H4c-1.1 0-2 .9-2 2v12.01c0 1.1.9 1.99 2 1.99h16c1.1 0 2-.9 2-2v-8l-6-6zM4 18.01V6h11v5h5v7.01H4z"/>
    </svg>

export default SummarySvg