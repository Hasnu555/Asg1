import axios from "axios";

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { data } = await axios.get(
          "http://localhost:5000/groups/myGroups",
          {
            headers: {
              Authorization: req.headers.authorization,
            },
          }
        );
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
      }
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
      break;
  }
};
