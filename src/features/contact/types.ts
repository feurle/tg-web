export interface OfficeHour {
    label: string;
    hours: string;
}

export interface ContactInfoResponse {
    id: number;
    name: string;
    primary: boolean;
    phone: string;
    email: string;
    street: string;
    city: string;
    zip: string;
    officeHours: OfficeHour[];
    updatedAt: string;
}

export interface ContactInfoFormData {
    name: string;
    primary: boolean;
    phone: string;
    email: string;
    street: string;
    city: string;
    zip: string;
    officeHours: OfficeHour[];
}
