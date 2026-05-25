import { Link } from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import { ROUTES } from '../router/routes';

export default function Footer() {
    const {t} = useTranslation();

    return (
        <footer className="footer">
            <div className="footer-left">
                <div className="footer-copy">© {new Date().getFullYear()} {t('app.name')}</div>
                <div className="footer-version"></div>
            </div>
            <div className="footer-right">
                <Link className="footer-link" to={ROUTES.PRIVACY}>{t('footer.privacy')}</Link>
                <Link className="footer-link" to={ROUTES.IMPRESS}>{t('footer.imprint')}</Link>
                <Link className="footer-link" to={ROUTES.CONTACT}>{t('footer.contact')}</Link>
            </div>
        </footer>
    );
}
