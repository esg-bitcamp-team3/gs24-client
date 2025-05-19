import { Company } from "./organizations"

export interface EsgRating {
    id: string
    organizationId: string
    no: number
    esgGrade: string
    environment: string
    social: string
    governance: string
    year: number
}

export interface EsgRatingResponse {
    organization : Company
    ratings : EsgRating[]
}
