// Jobs service - placeholder since jobs table doesn't exist yet

export interface CreateJobData {
    title: string
    description: string
    company_name: string
    location?: string
    salary_range?: string
}

export interface CreateCompanyData {
    name: string
    description?: string
    logo_url?: string
}

export const jobsService = {
    async getJobs() {
        return []
    },

    async getJobById(_jobId: string) {
        return null
    },

    async createJob(_userId: string, _data: CreateJobData) {
        throw new Error('Jobs feature not implemented yet')
    },

    async searchJobs(_query: string) {
        return []
    },
}
