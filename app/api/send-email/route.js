import { transporter } from "@/lib/nodemailer";

export async function POST(request) {
  const body = await request.json();
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      ...body,
    });

    Response.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    Response.json({ message: "Error sending email", error }, { status: 500 });
  }
}
