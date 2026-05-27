import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../router/routes';
import logoImg from '../assets/logo.png';

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="footer">
            <div className="footer-brand-col">
                <Link to={ROUTES.HOME} className="footer-brand-name">
                    <img src={logoImg} alt="Tier Gesund" className="footer-brand-img" />
                    {t('app.name')}
                </Link>
                <p className="footer-tagline">{t('home.tagline')}</p>
                <div className="footer-copy">© {new Date().getFullYear()} {t('app.name')}</div>
            </div>

            <div className="footer-col">
                <div className="footer-col-label">Navigation</div>
                <Link className="footer-link" to={ROUTES.HOME}>{t('nav.home')}</Link>
                <Link className="footer-link" to={ROUTES.NEWS}>{t('nav.news')}</Link>
                <Link className="footer-link" to={ROUTES.ABOUT}>{t('pages.about')}</Link>
            </div>

            <div className="footer-col">
                <div className="footer-col-label">Info</div>
                <Link className="footer-link" to={ROUTES.PRIVACY}>{t('footer.privacy')}</Link>
                <Link className="footer-link" to={ROUTES.IMPRESS}>{t('footer.imprint')}</Link>
                <Link className="footer-link" to={ROUTES.CONTACT}>{t('footer.contact')}</Link>
            </div>
        </footer>
    );
}
