import "../css/Footer.css";

function FooterLogin() {
    return (
        <footer className="ux4g-footer">

            {/* =====================================================
                MAIN FOOTER
            ===================================================== */}

            <div className="ux4g-footer-wrapper">



            {/* =====================================================
                BOTTOM STRIP
            ===================================================== */}

            <div className="ux4g-fbs-t1">

                <div className="ux4g-fbs-links">

                    <div className="ux4g-copyright">

                        © 2026 - Copyright TEST PROJECT.
                        All rights reserved.

                    </div>


                    <div className="ux4g-powered">

                        Powered by
                        <strong>
                            NIC
                        </strong>

                    </div>


                    <div className="ux4g-bottom-links">

                        <a href="#">
                            English
                        </a>

                        <a href="#">
                            Feedback
                        </a>

                        <a href="#">
                            FAQs
                        </a>

                        <a href="#">
                            Privacy Policy
                        </a>

                        <a href="#">
                            Contact Us
                        </a>

                    </div>

                </div>

            </div>
        </div>
        </footer>
    );
}

export default FooterLogin;