import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// 👤 Foydalanuvchini ro‘yxatdan o‘tkazish (demo uchun)
app.post("/register", (req, res) => {
  const { name, email } = req.body;
  if (!email || !name) {
    return res.status(400).json({ message: "Ism va email kiritish shart!" });
  }
  const userId = uuidv4();
  res.json({
    message: "Ro‘yxatdan o‘tish muvaffaqiyatli yakunlandi!",
    user: { id: userId, name, email },
  });
});

// 💌 Email yuborish (test uchun)
app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ message: "Email yuborish uchun barcha maydonlarni to‘ldiring!" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    res.json({ message: "Email muvaffaqiyatli yuborildi ✅" });
  } catch (err) {
    res.status(500).json({ message: "Xatolik: " + err.message });
  }
});

app.get("/", (req, res) => {
  res.send("🌐 KhamGPT Bank Backend ishlayapti!");
});

app.listen(PORT, () => {
  console.log(`✅ Server ${PORT}-portda ishga tushdi`);
});
