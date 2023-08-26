'use client'

import { FC } from 'react'
import { useParams } from 'next/navigation'
import { useOrigin } from '@/hooks/useOrigin'

import ApiAlert from './api-alert'

interface ApiListProps {
  entityName: string
  entityIdName: string
}

const ApiList: FC<ApiListProps> = ({ entityName, entityIdName }) => {
  const { storeId } = useParams()
  const origin = useOrigin()

  const baseUrl = `${origin}/api/${storeId}`

  return (
    <>
      <ApiAlert
        title="GET"
        variant="public"
        desc={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title="GET"
        variant="public"
        desc={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title="POST"
        variant="admin"
        desc={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title="PATCH"
        variant="admin"
        desc={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title="DELETE"
        variant="admin"
        desc={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
    </>
  )
}

export default ApiList
