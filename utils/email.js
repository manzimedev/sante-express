import nodemailer from "nodemailer";
import pug from "pug";
import htmlToText from "html-to-text";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

class Email {
  constructor(email, subject, name, data) {
    this.email = email;
    this.subject = subject;
    this.data = data;
    this.name = name;
  }

  transporter() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "assistdgrk@gmail.com",
        pass: "trmvvwkhcttlfvgv",
      },
    });
  }

  send(template) {
    try {
      const html = pug.renderFile(
        `${__dirname}/../views/email/${template}.pug`,
        {
          name: this.name,
          data: this.data,
          subject: this.subject,
        }
      );

      const mailOptions = {
        from: "RDC:SANTE",
        to: this.email,
        subject: this.subject,
        html,
        text: htmlToText.fromString(html),
      };
      this.transporter().sendMail(mailOptions);
    } catch (err) {
      console.log(err);
    }
  }
}

export default Email;
