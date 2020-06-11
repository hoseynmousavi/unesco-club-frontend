import React, {PureComponent} from "react"

class AboutPage extends PureComponent
{
    componentDidMount()
    {
        window.scroll({top: 0})
    }

    render()
    {
        const {lang} = this.props
        return (
            <div className="about-page-cont">
                <div className={`about-page-text ${lang}`}>
                    {
                        lang === "fa" ?
                            <React.Fragment>
                                باشگاه گردشگری و محیط زیست یونسکو در ایران به محوریت گردشگری پایدار و خلاق فعالیت خود را از سال نود و هشت شروع کرده است.
                                <br/>
                                این باشگاه با توجه به سیاست های کلان سازمان جهانی یونسکو محفلی برای طرفداران گردشگری و محیط زیست و آماده برای همکاری با مجموعه های مردم نهاد است.
                                <br/>

                                راههای ارتباط با ما:
                                <br/>
                                آدرس: خیابان سپهبد قرنی خیابان شاداب غربی کوچه شهریور بن بست دوم غربی پلاک دو
                                <br/>
                                شماره تلفن: <a href="tel:+982188924411" className="about-page-text-phone">+982188924411</a>
                                <br/>
                                واتساپ: <a href="tel:+989381908500" className="about-page-text-phone">+989381908500</a>
                                <br/>
                                اینستاگرام: <a href="https://www.instagram.com/unescotec" className="about-page-text-phone">unescotec</a>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                UNESCO Tourism and Environment Club in Iran, with its focus on sustainable and creative tourism, has been operating since 1990.
                                <br/>
                                The club is a forum for tourism and environmentalists and ready to work with non-governmental organizations, in line with UNESCO's macro-policies.
                                <br/>

                                Ways to contact us:
                                <br/>
                                Address: Iran, Tehran, Sepahbod Gharani St., Shadab Gharbi St., Shahrivar Alley, West Second Dead End, No. 2
                                <br/>
                                phone: <a href="tel:+982188924411" className="about-page-text-phone">+982188924411</a>
                                <br/>
                                whatsapp: <a href="tel:+989381908500" className="about-page-text-phone">+989381908500</a>
                                <br/>
                                instagram: <a href="https://www.instagram.com/unescotec" className="about-page-text-phone">unescotec</a>
                            </React.Fragment>
                    }
                </div>
            </div>
        )
    }
}

export default AboutPage