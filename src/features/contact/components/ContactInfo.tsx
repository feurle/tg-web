import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {contactApi} from '../api';
import type {ContactInfoResponse} from '../types';

export default function ContactInfo() {
    const {t} = useTranslation();
    const [info, setInfo] = useState<ContactInfoResponse | null>(null);

    useEffect(() => {
        contactApi.getInfo()
            .then(setInfo)
            .catch(() => setInfo(null));
    }, []);

    if (!info) return null;

    return (
        <div className="section">
            <div className="section-header">
                <span className="section-title">{t('home.contact.title')}</span>
                <span className="section-sub">{t('home.contact.sub')}</span>
            </div>
            <div className="contact-info-grid">
                <div className="contact-info-col">
                    <span className="contact-info-label">{t('contactInfo.phone')}</span>
                    <a className="contact-info-value contact-info-link" href={`tel:${info.phone}`}>
                        {info.phone}
                    </a>
                </div>
                <div className="contact-info-col">
                    <span className="contact-info-label">{t('contactInfo.email')}</span>
                    <a className="contact-info-value contact-info-link" href={`mailto:${info.email}`}>
                        {info.email}
                    </a>
                </div>
                <div className="contact-info-col">
                    <span className="contact-info-label">{t('contactInfo.address')}</span>
                    <span className="contact-info-value">{info.street}</span>
                    <span className="contact-info-value">{info.zip} {info.city}</span>
                </div>
                <div className="contact-info-col">
                    <span className="contact-info-label">{t('contactInfo.officeHours')}</span>
                    {info.officeHours.map((oh) => (
                        <div key={oh.label} className="contact-info-hours-row">
                            <span className="contact-info-hours-day">{oh.label}</span>
                            <span className="contact-info-value">{oh.hours}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
