import { transporter } from "@/lib/nodemailer";

export async function POST(request) {
  const body = await request.json();
  try {
    const token = jwt.sign({ userId: body.user._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });
    const url = `/token/verify?token=${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: body.user.email,
      subject: "Verify your email",
      html: `<p>Please verify your email by clicking on the following link: <a href="${url}">${url}</a></p>`,
    });
    Response.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    Response.json({ message: "Error sending email", error }, { status: 500 });
  }
}
