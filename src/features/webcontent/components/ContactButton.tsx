import {useTranslation} from 'react-i18next';

export default function ContactButton() {
    const {t} = useTranslation();
    return (
        <div className="hero-actions">
            <button className="btn-primary">{t('contact.appointment')}</button>
            <button className="btn-secondary">{t('contact.message')}</button>
        </div>
    );
}
