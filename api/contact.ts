import express, { Request, Response } from "express";

const app = express();
// Needed for JSON body parsing
app.use(express.json());

// Minimal POST endpoint (Route)
app.post("/contact", (req: Request, res: Response) => {
    const { name, email, businessType, message } = req.body;

    // Basic validation (just initial / will be extended later)
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            error: "Missing required fields."
        });
    }

    return res.status(200).json({
        success: true,
        message: "Contact form received."
    });
});

// Vercel compatible handler
export default function handler(req: any, res: any) {
  return app(req, res);
}