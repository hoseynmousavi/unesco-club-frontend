import React from "react"

const TitleSvg = (props) =>
    <svg className={props.className} viewBox="0 0 24 24">
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z"/>
    </svg>

export default TitleSvg