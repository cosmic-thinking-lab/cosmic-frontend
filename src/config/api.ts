// Centralized API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://apis-cosmic.duckdns.org/api';

export const endpoints = {
    admin: {
        login: `${API_BASE_URL}/admin/login`,
        dashboard: (tab: string) => `${API_BASE_URL}/admin/${tab}`,
        updateStatus: (id: string, tab: string) => {
            if (tab === 'contacts') return `${API_BASE_URL}/admin/contacts/${id}`;
            if (tab === 'applications') return `${API_BASE_URL}/admin/applications/${id}/status`;
            if (tab === 'jobs') return `${API_BASE_URL}/admin/jobs/${id}/status`;
            return '';
        }
    },
    public: {
        contact: `${API_BASE_URL}/solution/contact`,
        applications: `${API_BASE_URL}/applications`,
        jobs: `${API_BASE_URL}/jobs`,
        paymentSuccess: `${API_BASE_URL}/payments/success`,
        createPayment: `${API_BASE_URL}/payments/create`,
        verifyPayment: `${API_BASE_URL}/payments/verify`
    }
};
