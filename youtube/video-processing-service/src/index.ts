import express from "express"
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from "./storage"
import { isVideoNew, setVideo } from "./firestore"

setupDirectories()

const app = express()
app.use(express.json())

app.post("/process-video", async (req, res): Promise<any> => {
  // get the bucket and filename from the cloud pub/sub message
  let data
  try {
    const message = Buffer.from(req.body.message.data, "base64").toString("utf-8")
    data = JSON.parse(message)
    if (!data.name) {
      throw new Error("Invalid message payload received")
    }
  } catch (error) {
    console.log(error)
    return res.status(400).send("Bad Request: missing filename")
  }

  const inputFileName = data.name
  const outputFileName = `processed-${inputFileName}`
  const videoId = inputFileName.split(".")[0]

  if (!isVideoNew(videoId)) {
    return res.status(400).send("Bad Request: video already processing or processed")
  } else {
    await setVideo(videoId, {
      id: videoId,
      uid: videoId.split("-")[0],
      status: "processing"
    })
  }

  // download the raw video from cloud storage
  await downloadRawVideo(inputFileName)

  // convert the video to 360p
  try {
    await convertVideo(inputFileName, outputFileName)
  } catch (err) {
    await Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName)
    ])
    console.log(err)
    return res.status(500).send("Internal Server Error: video processing failed")
  }

  // upload the processed video to cloud storage
  await uploadProcessedVideo(outputFileName)

  await setVideo(videoId, {
    status: "processed",
    filename: outputFileName
  })

  await Promise.all([
    deleteRawVideo(inputFileName),
    deleteProcessedVideo(outputFileName)
  ])

  return res.status(200).send("Processing finished successfully")
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Video processing service listening at http://localhost:${port}`)
})
