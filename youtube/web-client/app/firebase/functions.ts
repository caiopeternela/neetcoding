import { httpsCallable } from "firebase/functions"
import { functions } from "./firebase"

const generateUploadUrlFunction = httpsCallable(functions, "generateUploadUrl")
const getVideosFunction = httpsCallable(functions, "getVideos")

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: 'processing' | 'processed',
  title?: string,
  description?: string  
}

export async function uploadVideo(file: File) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const response: any = await generateUploadUrlFunction({
    fileExtension: file.name.split(".").pop()
  })

  // upload the file via the signed url
  const uploadResult = await fetch(response?.data?.url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type
    }
  })

  return uploadResult
}

export async function getVideos() {
  const response = await getVideosFunction()
  return response.data as Video[]
}
