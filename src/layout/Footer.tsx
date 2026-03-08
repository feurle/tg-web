import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div>
        <div className="footer-brand">{t('app.name')}</div>
        <div className="footer-copy">© {new Date().getFullYear()} {t('app.name')} GmbH</div>
      </div>
      <div className="footer-links">
        <span className="footer-link">{t('footer.privacy')}</span>
        <span className="footer-link">{t('footer.imprint')}</span>
        <span className="footer-link">{t('footer.contact')}</span>
      </div>
    </footer>
  );
}
