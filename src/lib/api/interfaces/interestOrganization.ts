import {User} from './auth'
import {Organization} from './organization'

export interface OrganizationInfo {
  id: string
  organization: Organization
  checkTime: string
}

export interface OrganizationInfoResponse {
  user: User
  organizationList: OrganizationInfo[]
}

export interface OrganizationRank {
  organizationName: string
  esgGrade: string
  esgScore: number
}

export interface interestOrganization {
  id: string
  userId: string
  organizationId: string
  checkTime: string
}

export interface InterestButtonProps {
  orgId: string
}
