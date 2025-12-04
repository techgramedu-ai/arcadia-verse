import { supabase } from '@/lib/supabase'
import type { Job, Company } from '@/types/database.types'

export interface CreateCompanyData {
    name: string
    handle?: string
    description?: string
    website?: string
    logoMediaId?: string
}

export interface CreateJobData {
    companyId?: string
    title: string
    description?: string
    location?: string
    employmentType?: string
    salaryRange?: { min?: number; max?: number; currency?: string }
    requirements?: string[]
    expiresAt?: string
}

export interface JobSearchFilters {
    location?: string
    employmentType?: string
    companyId?: string
}

export const jobsService = {
    /**
     * Create a company
     */
    async createCompany(data: CreateCompanyData) {
        const { data: company, error } = await supabase
            .from('companies')
            .insert({
                name: data.name,
                handle: data.handle,
                description: data.description,
                website: data.website,
                logo_media_id: data.logoMediaId,
            })
            .select()
            .single()

        if (error) throw error
        return company
    },

    /**
     * Get company by ID
     */
    async getCompanyById(companyId: string) {
        const { data, error } = await supabase
            .from('companies')
            .select('*')
            .eq('id', companyId)
            .single()

        if (error) {
            if (error.code === 'PGRST116') return null
            throw error
        }
        return data
    },

    /**
     * Get company by handle
     */
    async getCompanyByHandle(handle: string) {
        const { data, error } = await supabase
            .from('companies')
            .select('*')
            .ilike('handle', handle)
            .single()

        if (error) {
            if (error.code === 'PGRST116') return null
            throw error
        }
        return data
    },

    /**
     * Update company
     */
    async updateCompany(companyId: string, data: Partial<CreateCompanyData>) {
        const { data: company, error } = await supabase
            .from('companies')
            .update(data)
            .eq('id', companyId)
            .select()
            .single()

        if (error) throw error
        return company
    },

    /**
     * Create a job posting
     */
    async createJob(userId: string, data: CreateJobData) {
        const { data: job, error } = await supabase
            .from('jobs')
            .insert({
                company_id: data.companyId,
                poster_id: userId,
                title: data.title,
                description: data.description,
                location: data.location,
                employment_type: data.employmentType,
                salary_range: data.salaryRange,
                requirements: data.requirements,
                expires_at: data.expiresAt,
            })
            .select()
            .single()

        if (error) throw error
        return job
    },

    /**
     * Get job by ID
     */
    async getJobById(jobId: string) {
        const { data, error } = await supabase
            .from('jobs')
            .select(`
        *,
        company:companies!jobs_company_id_fkey(*),
        poster:users!jobs_poster_id_fkey(id, handle, display_name, avatar_url)
      `)
            .eq('id', jobId)
            .single()

        if (error) {
            if (error.code === 'PGRST116') return null
            throw error
        }
        return data
    },

    /**
     * Search jobs with filters
     */
    async searchJobs(query?: string, filters?: JobSearchFilters, page = 0, limit = 20) {
        const from = page * limit
        const to = from + limit - 1

        let queryBuilder = supabase
            .from('jobs')
            .select(`
        *,
        company:companies!jobs_company_id_fkey(*)
      `, { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to)

        // Filter by search query
        if (query) {
            queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        }

        // Filter by location
        if (filters?.location) {
            queryBuilder = queryBuilder.ilike('location', `%${filters.location}%`)
        }

        // Filter by employment type
        if (filters?.employmentType) {
            queryBuilder = queryBuilder.eq('employment_type', filters.employmentType)
        }

        // Filter by company
        if (filters?.companyId) {
            queryBuilder = queryBuilder.eq('company_id', filters.companyId)
        }

        // Only show non-expired jobs
        queryBuilder = queryBuilder.or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())

        const { data, error, count } = await queryBuilder

        if (error) throw error

        return {
            jobs: data || [],
            total: count || 0,
            hasMore: (count || 0) > to + 1,
        }
    },

    /**
     * Get jobs by company
     */
    async getCompanyJobs(companyId: string, limit = 20) {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('company_id', companyId)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) throw error
        return data
    },

    /**
     * Get jobs posted by user
     */
    async getUserJobs(userId: string, limit = 20) {
        const { data, error } = await supabase
            .from('jobs')
            .select(`
        *,
        company:companies!jobs_company_id_fkey(*)
      `)
            .eq('poster_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) throw error
        return data
    },

    /**
     * Update job
     */
    async updateJob(jobId: string, userId: string, data: Partial<CreateJobData>) {
        const { data: job, error } = await supabase
            .from('jobs')
            .update(data)
            .eq('id', jobId)
            .eq('poster_id', userId)
            .select()
            .single()

        if (error) throw error
        return job
    },

    /**
     * Delete job
     */
    async deleteJob(jobId: string, userId: string) {
        const { error } = await supabase
            .from('jobs')
            .delete()
            .eq('id', jobId)
            .eq('poster_id', userId)

        if (error) throw error
    },

    /**
     * Search companies
     */
    async searchCompanies(query: string, limit = 20) {
        const { data, error } = await supabase
            .from('companies')
            .select('*')
            .or(`name.ilike.%${query}%,handle.ilike.%${query}%`)
            .limit(limit)

        if (error) throw error
        return data
    },
}
