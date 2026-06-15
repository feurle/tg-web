import apiClient from '../../lib/apiClient';
import type {ContactInfoResponse, ContactInfoFormData} from './types';

export const contactApi = {
    getInfo: () => apiClient.get<ContactInfoResponse>('/api/contact/info'),
    getAll: () => apiClient.get<ContactInfoResponse[]>('/api/contact/info'),
    create: (data: ContactInfoFormData) => apiClient.post<ContactInfoResponse>('/api/contact/info', data),
    update: (id: number, data: ContactInfoFormData) => apiClient.put<ContactInfoResponse>(`/api/contact/info/${id}`, data),
    delete: (id: number) => apiClient.delete<void>(`/api/contact/info/${id}`),
};
