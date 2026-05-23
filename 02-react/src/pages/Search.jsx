import {  useEffect, useState } from 'react'

import { SearchFormSection } from '../components/SearchFormSection.jsx'
import { JobListing } from '../components/JobListing.jsx'
import { Pagination } from '../components/Pagination.jsx'
import { useRouter } from '../hooks/useRouter.jsx'
import { useSearchParams } from 'react-router'


const jobsPerPage = 5

const useFilters=() => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { navigateTo } = useRouter()
  const [currentPage, setCurrentPage] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search)
    return parseInt(urlParams.get('page')) || 1
  })
  const [filters, setFilters] = useState(() => {
    
    return {
      technology: searchParams.get('technology') || '',
      location: searchParams.get('type') || searchParams.get('location') || '',
      experienceLevel: searchParams.get('level') || searchParams.get('experienceLevel') || ''
    }
  })
  const [textToFilter, setTextToFilter] = useState(() => searchParams.get('text') || '')

  const [jobs,setJobs] = useState([])
  const [total,setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchJobs() {
      try{
        setLoading(true)
        const params=new URLSearchParams()
        if(filters.technology) params.append('technology',filters.technology)
        if(filters.location) params.append('type',filters.location)
        if(filters.experienceLevel) params.append('level',filters.experienceLevel)
        if(textToFilter) params.append('text',textToFilter)
        const offset = (currentPage - 1) * jobsPerPage
        params.append('offset', offset)  
        params.append('page',currentPage)
        params.append('limit',jobsPerPage)
        const queryParams = params.toString()
        const response = await fetch(`https://jscamp-api.vercel.app/api/jobs?${queryParams}`)
        const json = await response.json()
        setJobs(json.data)
        setTotal(json.total)
      } catch (error) {
        console.error('Error fetching jobs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [filters, textToFilter, currentPage])

  useEffect(() => {
    setSearchParams((params) => {
      if (filters.technology) params.set('technology', filters.technology)
      if(filters.location) params.set('type',filters.location)
      if(filters.experienceLevel) params.set('level',filters.experienceLevel)
      if (textToFilter) params.set('text', textToFilter)
      params.set('page', currentPage)
      return params
      

    })
  

  }, 


[filters, textToFilter, currentPage,setSearchParams])


  const totalPages = Math.ceil(total / jobsPerPage)
  

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleSearch = (filters) => {
    setFilters(filters)
    setCurrentPage(1)
  }

  const handleTextFilter = (newTextToFilter) => {
    setTextToFilter(newTextToFilter)
    setCurrentPage(1)
  }

  return {
  
    jobs,
    total,
    loading,
    totalPages,
    currentPage,
    handlePageChange,
    handleSearch,
    handleTextFilter,
    textToFilter
  }

}


export function SearchPage() {

  const {
    jobs,
    totalPages,
    currentPage,
    handlePageChange,
    handleSearch,
    handleTextFilter,
    textToFilter
  } = useFilters()
  
  

  return (
    
      

      <main>
        <SearchFormSection

          initialtextToFilter={textToFilter}
          
          onSearch={handleSearch}
          onTextFilter={handleTextFilter}
        />

        <section>
          <JobListing jobs={jobs} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </section>
      </main>

      
    
  )
}


