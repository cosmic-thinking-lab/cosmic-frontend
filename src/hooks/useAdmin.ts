import { useState, useCallback } from 'react';
import { endpoints } from '../config/api';
import { AdminApi, JobsApi, Configuration } from '../api/generated';

interface DashboardItem {
    _id: string;
    name?: string;
    role?: string;
    email?: string;
    message?: string;
    about?: string;
    resumeLink?: string;
    status: string;
    createdAt: string;
}

export const useAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAuthHeaders = useCallback(() => {
        const token = localStorage.getItem('adminToken');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }, []);

    const login = async (credentials: any) => {
        setLoading(true);
        setError(null);
        try {
            const api = new AdminApi(new Configuration({ basePath: 'http://64.227.146.144:3003/api' }));
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
                basePath: 'http://64.227.146.144:3003/api',
                accessToken: token || ''
            });
            const api = new AdminApi(config);

            let response;
            if (tab === 'contacts') {
                response = await api.adminContactsGet();
            } else if (tab === 'applications') {
                response = await api.adminApplicationsGet();
            } else if (tab === 'jobs') {
                response = await api.adminJobsGet();
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
                basePath: 'http://64.227.146.144:3003/api',
                accessToken: token || ''
            });
            const api = new AdminApi(config);
            
            if (tab === 'contacts') {
                await api.adminContactsIdPatch(id, { status });
            } else if (tab === 'applications') {
                await api.adminApplicationsAppIdStatusPatch(id, { status });
            } else if (tab === 'jobs') {
                // The API expects a boolean isActive, but our hook receives a string status
                await api.adminJobsIdStatusPatch(id, { isActive: status === 'true' });
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
                basePath: 'http://64.227.146.144:3003/api',
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
                basePath: 'http://64.227.146.144:3003/api',
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
                basePath: 'http://64.227.146.144:3003/api',
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
    }

    return { 
        login, 
        fetchDashboardData, 
        updateItemStatus, 
        createJob, 
        updateJob, 
        deleteJob, 
        loading, 
        error 
    };
};
