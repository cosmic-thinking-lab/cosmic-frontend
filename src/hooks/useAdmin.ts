import { useState, useCallback } from 'react';
import { API_BASE_URL } from '../config/api';
import { AdminApi, JobsApi, Configuration } from '../api/generated';

interface DashboardItem {
    _id: string;
    name?: string;
    role?: string;
    email?: string;
    phone?: string;
    message?: string;
    about?: string;
    resumeLink?: string;
    jobId?: { _id: string; title: string } | string;
    
    // Job Listing fields
    title?: string;
    department?: string;
    location?: string;
    type?: string;
    isActive?: boolean;
    salary?: string;
    description?: string;
    
    // Payments
    firstName?: string;
    lastName?: string;
    mobile?: string;
    serviceName?: string;
    amount?: number;
    orderId?: string;
    paymentId?: string;
    isManual?: boolean;

    status: string;
    createdAt: string;
}

export const useAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (credentials: any) => {
        setLoading(true);
        setError(null);
        try {
            const api = new AdminApi(new Configuration({ basePath: API_BASE_URL }));
            const response = await api.adminLoginPost(credentials);
            return response.data;
        } catch (err: any) {
            setError(err.message || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchDashboardData = useCallback(async (tab: string) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const config = new Configuration({
                basePath: API_BASE_URL,
                accessToken: token || ''
            });
            const api = new AdminApi(config);

            let response;
            if (tab === 'contacts') {
                response = await api.adminContactsGet();
            } else if (tab === 'applications') {
                response = await api.adminApplicationsGet();
            } else if (tab === 'jobs') {
                // Fetch manually so we can pass showAll=true to see inactive jobs too
                const res = await fetch(`${API_BASE_URL}/admin/jobs?showAll=true`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) {
                    if (res.status === 401) throw new Error('Unauthorized');
                    throw new Error('Failed to fetch jobs');
                }
                const result = await res.json();
                return result.success ? result.data as DashboardItem[] : [];
            } else if (tab === 'payments') {
                const res = await fetch(`${API_BASE_URL}/payments/admin/all`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) {
                    if (res.status === 401) throw new Error('Unauthorized');
                    throw new Error('Failed to fetch payments');
                }
                const result = await res.json();
                return result.success ? result.data as DashboardItem[] : [];
            } else {
                return [];
            }

            // Axios response.data IS the body. 
            // Previous code expected result.data.
            // Swagger response assumes 200 OK returns the list directly or { success, data }?
            // My swagger said "List of contacts" -> schema? 
            // My annotated routes return `res.status(200).json({ success: true, data: ... })` (standard controller pattern)
            // But my Swagger annotation just said "List of contacts". 
            // If the controller returns { success, data }, then response.data will have .data.

            const result: any = response.data;
            return result.success ? result.data as DashboardItem[] : [];
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateItemStatus = async (id: string, tab: string, status: string) => {
        try {
            const token = localStorage.getItem('adminToken');
            const config = new Configuration({
                basePath: API_BASE_URL,
                accessToken: token || ''
            });
            const api = new AdminApi(config);

            if (tab === 'contacts') {
                await api.adminContactsIdPatch(id, { status });
            } else if (tab === 'applications') {
                await api.adminApplicationsAppIdStatusPatch(id, { status });
            } else if (tab === 'jobs') {
                // Convert 'active' / 'inactive' dropdown values to boolean
                const isActive = status === 'active';
                await api.adminJobsIdStatusPatch(id, { isActive });
            } else if (tab === 'payments') {
                const res = await fetch(`${API_BASE_URL}/payments/admin/${id}/status`, {
                    method: 'PATCH',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify({ status })
                });
                if (!res.ok) {
                    if (res.status === 401) throw new Error('Unauthorized');
                    throw new Error('Failed to update payment status');
                }
            }

            return true;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const createJob = async (jobData: any) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const config = new Configuration({
                basePath: API_BASE_URL,
                accessToken: token || ''
            });
            const api = new JobsApi(config);
            // In JobsApi, the method for POST /jobs is jobsPost
            const response = await api.jobsPost(jobData);
            return response.data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateJob = async (id: string, jobData: any) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const config = new Configuration({
                basePath: API_BASE_URL,
                accessToken: token || ''
            });
            const api = new AdminApi(config);
            const response = await api.adminJobsIdPatch(id, jobData);
            return response.data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteJob = async (id: string) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const config = new Configuration({
                basePath: API_BASE_URL,
                accessToken: token || ''
            });
            const api = new AdminApi(config);
            // Delete is in AdminApi because I added it to adminRoutes
            await api.adminJobsIdDelete(id);
            return true;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchJobApplications = useCallback(async (jobId: string, jobTitle?: string): Promise<DashboardItem[]> => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');

            // Use the reliable /admin/applications endpoint (always deployed).
            // Filter client-side by jobId or role title.
            const res = await fetch(`${API_BASE_URL}/admin/applications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 401) throw new Error('Unauthorized');
            if (!res.ok) throw new Error('Failed to fetch applications');

            const result = await res.json();
            const all: DashboardItem[] = result.success ? result.data : [];

            return all.filter(app => {
                // Match by jobId (for applications submitted with a linked job id)
                const jobIdMatch = typeof app.jobId === 'object' && app.jobId !== null
                    ? (app.jobId as { _id: string })._id === jobId
                    : app.jobId === jobId;

                // Match by role title (for older applications stored without jobId)
                const roleMatch = jobTitle
                    ? app.role?.trim().toLowerCase() === jobTitle.trim().toLowerCase()
                    : false;

                return jobIdMatch || roleMatch;
            });

        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createManualPayment = async (paymentData: {
        serviceName: string;
        amount: number;
        email: string;
        mobile: string;
        firstName: string;
        lastName?: string;
        notes?: string;
        status?: 'pending' | 'success' | 'failed';
    }) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_BASE_URL}/payments/admin/manual`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(paymentData)
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Failed to create manual payment');
            }
            const result = await res.json();
            return result.data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        login,
        fetchDashboardData,
        fetchJobApplications,
        updateItemStatus,
        createJob,
        updateJob,
        deleteJob,
        createManualPayment,
        loading,
        error
    };
};
