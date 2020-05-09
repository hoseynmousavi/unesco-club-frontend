import React from "react"

const Hamburger = (props) =>
{
    const {className, collapse, onClick} = props
    return (
        <div className={className} onClick={onClick}>
            <div className={`${collapse ? "" : "hamburger-one-rotate open"} hamburger-line line-one`}/>
            <div className={`${collapse ? "" : "hamburger-line-out open"} hamburger-line line-two`}/>
            <div className={`${collapse ? "" : "hamburger-three-rotate open"} hamburger-line line-three`}/>
        </div>
    )
}

export default Hamburger