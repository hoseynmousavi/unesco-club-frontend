import React from "react"
import InstaSvg from "../../Media/Svgs/InstaSvg"
import EmailSvg from "../../Media/Svgs/EmailSvg"
import {Link} from "react-router-dom"
import Android from "../../Media/Images/Android.png"
import DescriptionSvg from "../../Media/Svgs/DescriptionSvg"
import LocationSvg from "../../Media/Svgs/LocationSvg"
import VerifiedUserSvg from "../../Media/Svgs/VerifiedUserSvg"
import WhatsappSvg from "../../Media/Svgs/WhatsappSvg"
import PhoneSvg from "../../Media/Svgs/PhoneSvg"
import AddressSvg from "../../Media/Svgs/AddressSvg"

const goUp = () => window.scroll({top: 0, behavior: "smooth"})

const Footer = () =>
    <div className="footer-container" id="footer">
        <div className="footer-logo-cont">
            <Link to="/" className="footer-logo-section" onClick={goUp}>
                <img src="/logo512.png" alt="باشگاه گردشگری و محیط زیست یونسکو" className="footer-logo logo"/>
                <div className="footer-desc main-text">باشگاه گردشگری و محیط زیست یونسکو</div>
            </Link>
            <a href="/TEUC.apk" className="footer-logo-section app" download>
                <img src={Android} className="footer-logo" alt="irteuc android application"/>
                <div className="footer-desc app">اپلیکیشن ما رو دانلود کن!</div>
            </a>
        </div>
        <div className="footer-parts">
            <div className="footer-part">
                <div className="footer-part-title">بخش‌های برنامه</div>
                <Link to="/documents" className="footer-part-text">
                    <DescriptionSvg className="footer-part-svg"/>
                    پرونده‌ها
                </Link>
                <Link to="/routes" className="footer-part-text">
                    <LocationSvg className="footer-part-svg"/>
                    مسیرها
                </Link>
                <Link to="/users" className="footer-part-text">
                    <VerifiedUserSvg className="footer-part-svg"/>
                    فعالین
                </Link>
            </div>
            <div className="footer-part second">
                <div className="footer-part-title">ارتباط با ما</div>
                <a href="mailto://health.in.touch.co@gmail.com" className="footer-part-text">
                    <EmailSvg className="footer-part-svg"/>
                    info@irteuc.com
                </a>
                <a href="https://instagram.com/unescotec" target="_blank" rel="noopener noreferrer" className="footer-part-text">
                    <InstaSvg className="footer-part-svg"/>
                    unescotec
                </a>
                <a href="tel://health.in.touch.co@gmail.com" className="footer-part-text">
                    <PhoneSvg className="footer-part-svg"/>
                    02188924411
                </a>
                <a href="tel://health.in.touch.co@gmail.com" className="footer-part-text">
                    <WhatsappSvg className="footer-part-svg"/>
                    09381908500
                </a>
                <div className="footer-part-text">
                    <AddressSvg className="footer-part-svg"/>
                    <div className="footer-part-address">خیابان سپهبد قرنی خیابان شاداب غربی کوچه شهریور بن بست دوم غربی پلاک دو</div>
                </div>
            </div>
            {/*<div className="footer-part last">*/}
            {/*    یس بیب...*/}
            {/*</div>*/}
        </div>
        <div className="footer-last-line">تمامی حقوق این شبکه متعلق به irteuc.com می‌باشد.</div>
    </div>

export default Footer