import apiClient from '../../lib/apiClient';
import type {ContactInfoResponse} from './types';

export const contactApi = {
    getInfo: () => apiClient.get<ContactInfoResponse>('/api/contact/info'),
};
