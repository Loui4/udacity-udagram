import express, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  const app: Application = express();

  const port = process.env.PORT || 8082;

  app.use(bodyParser.json());

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  app.get("/filteredimage", async (req: Request, res: Response) => {
    const { image_url } = req.query;

    if (!image_url) {
      res.status(400).send("image_url param is required to filter the images");
    }

    const file = await filterImageFromURL(image_url);

    res.on("finish", () => {
      deleteLocalFiles([file]);
    });

    res.sendFile(file);
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
