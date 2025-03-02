import { getFunctions, httpsCallable } from "firebase/functions"

const functions = getFunctions()

const generateUploadUrlFunction = httpsCallable(functions, "generateUploadUrl")

export async function uploadVideo(file: File) {
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
