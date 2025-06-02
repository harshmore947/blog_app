import EditArticlePage from '@/components/articles/EditArticlePage'
import { prisma } from '@/lib/prisma';
import React from 'react'

type EditArticleParams = {
  params:Promise<{id:string}>
}

async function page({params}:EditArticleParams) {
  const id = (await params).id;
  const article = await prisma.article.findUnique({
    where:{
      id
    }
  })

  if(!article) return <h1>Article not found for this {id}</h1>
  return (
    <div>
      <EditArticlePage article={article}/>
    </div>
  )
}

export default page
