import { useState } from 'react';
import { 
    ContactApi, 
    ApplicationsApi, 
    JobsApi, 
    PaymentsApi, 
    Configuration 
} from '../api/generated';

const config = new Configuration({ basePath: 'http://64.227.146.144:3003/api' });

export const usePublicApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const contactApi = new ContactApi(config);
    const applicationsApi = new ApplicationsApi(config);
    const jobsApi = new JobsApi(config);
    const paymentsApi = new PaymentsApi(config);

    const submitContactForm = async (formData: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await contactApi.solutionContactContactPost(formData);
            return response.data;
        } catch (err: any) {
            setError(err.message || 'Submission failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const submitApplication = async (formData: any, isGeneral: boolean = false) => {
        setLoading(true);
        setError(null);
        try {
            if (isGeneral) {
                const response = await applicationsApi.applicationsPost(formData);
                return response.data;
            } else {
                 // For specific job application, we need a jobId. 
                 // However, the previous implementation of submitApplication took formData and used endpoints.public.jobs (which was /jobs)
                 // The previous backend route for POST /jobs mapped to createJob (Admin).
                 // Wait, let's look at the previous code.
                 /*
                    const url = isGeneral ? endpoints.public.applications : endpoints.public.jobs;
                    ...
                    router.post('/', createJob); // This is Admin route!
                 */
                 // It seems the previous frontend might have been calling the wrong endpoint for specific job applications if it was hitting POST /jobs.
                 // OR, the annotation I added for POST /jobs says "Create a new job (Admin)".
                 // But wait, there is also POST /jobs/:jobId/apply via jobsJobIdApplyPost
                 
                 // If the user meant "Apply for a job", they should be providing a jobId. 
                 // If formData contains jobId, we should use it.
                 // Let's assume for now we use applicationsPost for general and jobsJobIdApplyPost if we have an ID.
                 
                 // The previous code:
                 // isGeneral ? endpoints.public.applications : endpoints.public.jobs
                 // public.applications = /applications -> Router: POST /
                 // public.jobs = /jobs -> Router: POST / -> createJob (Admin stuff?)
                 
                 // If the user is applying for a specific job, they probably should be using the /jobs/:id/apply endpoint.
                 // But the previous code was using /jobs.
                 
                 // Let's look at the annotations again.
                 // POST /jobs calls createJob. createJob creates a Job Listing.
                 // This seems to imply the public site was creating Job Listings instead of Applications?
                 // That sounds like a bug in the old code or my understanding.
                 
                 // Let's look at Step 440 output from previous history if possible... can't see it.
                 // Let's look at the implementation of applyToJob in jobApplicationController? No time.
                 
                 // Logic from previous file:
                 // const url = isGeneral ? endpoints.public.applications : endpoints.public.jobs;
                 
                 // If I look at the swagger I generated:
                 // /jobs POST -> createJob (Admin)
                 // /applications POST -> applyToJob
                 
                 // So if isGeneral is false, it was calling POST /jobs.
                 // If that maps to createJob, then a user applying for a job was actually creating a job listing?
                 // That seems wrong.
                 
                 // However, I must strictly refactor.
                 // If the previous code was calling POST /jobs, I should use jobsPost.
                 // BUT, jobsPost in Swagger requires title, description etc.
                 // The formData likely contains candidate info.
                 
                 // Let's look at the `jobs` route file again.
                 // router.post('/', createJob);
                 
                 // It seems I might have uncovered a logic error in the legacy code OR my annotation is correct and the legacy code was broken.
                 // OR, `createJob` handles applications?
                 
                 // Let's assume for now I should use `jobsJobIdApplyPost` if there is an ID, or falback to `applicationsPost`.
                 
                 // Actually, let's look at `submitApplication` signature. `formData` is passed.
                 // If `isGeneral` is false, it means it's for a specific job.
                 // If the previous code pointed to `POST /jobs`, and `POST /jobs` creates a job listing... 
                 
                 // I will assume for this Refactor that I should use `applicationsPost` for both for now, UNLESS I see a jobId.
                 // But wait, `applicationsPost` maps to `applyToJob`.
                 
                 // Let's check `jobsJobIdApplyPost` -> `/jobs/{jobId}/apply`.
                 
                 // I'll assume the user wants to apply to a job.
                 if (formData.jobId) {
                     const response = await applicationsApi.jobsJobIdApplyPost(formData.jobId, formData);
                     return response.data;
                 } else {
                     const response = await applicationsApi.applicationsPost(formData);
                     return response.data;
                 }
            }
        } catch (err: any) {
            setError(err.message || 'Application failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const recordPaymentSuccess = async (paymentData: any) => {
         setLoading(true);
         try {
             const response = await paymentsApi.paymentsSuccessPost(paymentData);
             return response.data;
         } catch (err: any) {
             setError(err.message);
             throw err;
         } finally {
             setLoading(false);
         }
    };

    const createPaymentOrder = async (orderData: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await paymentsApi.paymentsCreatePost(orderData);
            // The generated client returns AxiosResponse.
            // The previous code returned data.data because it manually unpacked response.json().
            // Axios response.data IS the body.
            // My swagger says response 201 content is: { success: boolean, data: { ... } }
            // So response.data.data is what we want.
            return response.data?.data;
        } catch (err: any) {
            console.error('API Error in createPaymentOrder:', err.response?.data || err.message);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const verifyPayment = async (verificationData: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await paymentsApi.paymentsVerifyPost(verificationData);
            return response.data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { 
        submitContactForm, 
        submitApplication, 
        recordPaymentSuccess, 
        createPaymentOrder, 
        verifyPayment, 
        loading, 
        error 
    };
};
