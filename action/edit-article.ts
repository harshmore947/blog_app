"use server"

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import {z} from 'zod';
import {v2 as cloudinary, UploadApiResponse} from "cloudinary" 
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,
})

const createArticleSchema = z.object({
  title:z.string().min(3).max(100),
  category:z.string().min(3).max(50),
  content:z.string().min(10)
});


//return type
type createArticleFormState ={
  errors:{
    title?:string[],
    category?:string[],
    featuredImage?:string[],
    content?:string[],
    formErrors?:string[]
  }
}

export const editArticle = async (articleId:string,prevState:createArticleFormState,formData:FormData) : Promise<createArticleFormState>=>{
  const result = createArticleSchema.safeParse({
    title:formData.get('title'),
    category:formData.get('category'),
    content:formData.get('content')
  });

  if(!result.success){
    return {
      errors:result.error.flatten().fieldErrors
    }
  }

  const {userId} = await auth();
  if(!userId){
    return {
      errors:{
        formErrors:["you are not logged in"]
      }
    }
  } 

  const existingUser = await prisma.user.findUnique({
    where:{
      clerkUserId:userId
    }
  })

  if(!existingUser){
    return{
      errors:{
        formErrors:["User not found"]
      }
    }
  }

  const existingArticle = await prisma.article.findUnique({
    where:{
      id:articleId
    }
  })

  if(!existingArticle){
    return{
      errors:{
        formErrors:["Article not found"]
      }
    }
  }
  //start creating article

  const imageFile = formData.get('featuredImage') as File | null;
  let imageUrl = existingArticle.featureImage;  // Use existing image if no new one uploaded
  
  if(imageFile && imageFile.name !== "undefined"){
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse:UploadApiResponse |undefined = await new Promise((resolve, reject)=>{
      const uploadStream = cloudinary.uploader.upload_stream(
        {resource_type:"auto"},
        (error, result)=>{
          if(error){
            reject(error)
          }else{
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    })

    if(uploadResponse?.secure_url){
      imageUrl = uploadResponse.secure_url
    } else {
      return {
        errors:{
          featuredImage:['Failed to upload image. please try again']
        }
      }
    }
  }

  if(!imageUrl) {
    return {
      errors:{
        featuredImage:['Image is required']
      }
    }
  }

  try {
    await prisma.article.update({
      where:{
        id:articleId
      },
      data:{
        title:result.data.title,
        category:result.data.category,
        content:result.data.content,
        featureImage:imageUrl,
        authorId:existingUser?.id
      }
    })
  } catch (error:unknown) {
    if(error instanceof Error){
      return{
        errors:{
          formErrors:[error.message]
        }
      }
    }else{
      return{
        errors:{
          formErrors:["Some internal server error occrued"]
        }
      }
    }
  }
  revalidatePath('/dashboard');
  redirect('/dashboard')
}