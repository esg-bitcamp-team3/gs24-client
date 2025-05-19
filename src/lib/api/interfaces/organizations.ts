export interface Company {
  id: string
  companyCode: string
  companyName: string
}

export interface OrganizationWithInterest {
  organization: Company
  interested: boolean
}

export interface OrganizationWithInterestPage {
  organizationWithInterestDTOList: OrganizationWithInterest[]
  hasMore: boolean
}
