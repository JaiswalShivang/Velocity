import nodemailer from "nodemailer";
import axios from "axios";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter on startup
transporter.verify()
  .then(() => console.log('✅ Email service ready'))
  .catch(err => console.error('❌ Email service error:', err.message));

export const sendJobApplicationEmail = async ({
  recruiterEmail,
  recruiterName = 'Hiring Manager',
  jobTitle,
  companyName,
  applicantName,
  applicantEmail,
  applicantPhone,
  resumeUrl,
  message = ''
}) => {
  try {
    let resumeAttachment;

    if (resumeUrl) {
      const response = await axios.get(resumeUrl, { responseType: 'arraybuffer' });
      resumeAttachment = {
        filename: `${applicantName.replace(/\s+/g, '_')}_Resume.pdf`,
        content: Buffer.from(response.data),
        contentType: 'application/pdf'
      };
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recruiterEmail,
      subject: `Job Application for ${jobTitle} - ${applicantName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-row { margin: 15px 0; padding: 10px; background: white; border-left: 4px solid #667eea; }
            .label { font-weight: bold; color: #667eea; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Job Application</h1>
              <p>${jobTitle} at ${companyName}</p>
            </div>
            <div class="content">
              <p>Dear ${recruiterName},</p>
              <p>You have received a new job application for the position of <strong>${jobTitle}</strong>.</p>
              
              <h3>Applicant Details:</h3>
              <div class="info-row">
                <span class="label">Name:</span> ${applicantName}
              </div>
              <div class="info-row">
                <span class="label">Email:</span> <a href="mailto:${applicantEmail}">${applicantEmail}</a>
              </div>
              ${applicantPhone ? `
              <div class="info-row">
                <span class="label">Phone:</span> ${applicantPhone}
              </div>
              ` : ''}
              
              ${message ? `
              <h3>Cover Message:</h3>
              <div class="info-row">
                ${message}
              </div>
              ` : ''}
              
              <p style="margin-top: 30px;">
                <strong>Resume attached:</strong> Please find the applicant's resume attached to this email.
              </p>
              
              <p>Best regards,<br>Velocity Job Platform</p>
            </div>
            <div class="footer">
              <p>This is an automated email from Velocity Job Application Platform</p>
              <p>Please do not reply to this email</p>
            </div>
          </div>
        </body>
        </html>
      `,
      attachments: resumeAttachment ? [resumeAttachment] : []
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Application email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending job application email:', error);
    throw new Error(`Failed to send application email: ${error.message}`);
  }
};

export const sendMatchingJobMail = async ({
  userEmail,
  userName,
  jobTitle,
  companyName,
  jobDescription,
  jobLocation,
  jobType,
  salary,
  applyLink,
  postedDate
}) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `🎯 New Job Match: ${jobTitle} at ${companyName}`,
      html: `
        hello world
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Job matching email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending job matching email:', error);
    throw new Error(`Failed to send job matching email: ${error.message}`);
  }
};

/**
 * Send job alert email with multiple jobs
 * @param {Object} params
 * @param {string} params.userEmail - Recipient email
 * @param {string} params.userName - Recipient name
 * @param {string} params.alertTitle - Alert name/title
 * @param {Array} params.jobs - Array of job objects to include
 */
export const sendJobAlertEmail = async ({
  userEmail,
  userName = 'there',
  alertTitle,
  jobs = []
}) => {
  try {
    console.log(`\n📧 Mail Service: Preparing to send email`);
    console.log(`   To: ${userEmail}`);
    console.log(`   User: ${userName}`);
    console.log(`   Alert: ${alertTitle}`);
    console.log(`   Jobs: ${jobs.length}`);
    
    if (!userEmail) {
      throw new Error('No recipient email address provided!');
    }
    
    if (!jobs.length) {
      throw new Error('No jobs to send');
    }

    // Format salary display
    const formatSalary = (salary) => {
      if (!salary || (!salary.min && !salary.max)) return null;
      const currency = salary.currency || 'USD';
      if (salary.min && salary.max) {
        return `${currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
      }
      return `${currency} ${(salary.min || salary.max).toLocaleString()}`;
    };

    // Generate clean job list HTML
    const jobListHtml = jobs.map((job, index) => {
      const salary = formatSalary(job.salary);
      return `
        <tr>
          <td style="padding: 20px 0; border-bottom: 1px solid #e5e5e5;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <h3 style="margin: 0 0 4px 0; color: #333; font-size: 16px; font-weight: 600;">${job.title}</h3>
                  <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${job.company}${job.location ? ` • ${job.location}` : ''}</p>
                  <p style="margin: 0; color: #888; font-size: 13px;">
                    ${job.employmentType || 'Full-time'}${salary ? ` • ${salary}` : ''}${job.isRemote ? ' • Remote' : ''}
                  </p>
                </td>
                <td style="text-align: right; vertical-align: middle; width: 100px;">
                  <a href="${job.applyLink}" target="_blank" style="display: inline-block; background: #2563eb; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 500;">Apply</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;
    }).join('');

    const mailOptions = {
      from: `"Velocity Jobs" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `${jobs.length} new job${jobs.length > 1 ? 's' : ''} for "${alertTitle}"`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; line-height: 1.5;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="padding: 32px 40px; border-bottom: 1px solid #e5e5e5;">
                      <h1 style="margin: 0; color: #333; font-size: 20px; font-weight: 600;">Velocity</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 32px 40px;">
                      <p style="margin: 0 0 20px 0; color: #333; font-size: 15px;">Hi ${userName},</p>
                      <p style="margin: 0 0 24px 0; color: #333; font-size: 15px;">
                        We found <strong>${jobs.length} new job${jobs.length > 1 ? 's' : ''}</strong> matching your alert for <strong>"${alertTitle}"</strong>.
                      </p>
                      
                      <!-- Jobs List -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        ${jobListHtml}
                      </table>
                      
                      <p style="margin: 32px 0 0 0; color: #666; font-size: 14px;">
                        Good luck with your job search!
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 40px; background-color: #f9f9f9; border-top: 1px solid #e5e5e5;">
                      <p style="margin: 0; color: #888; font-size: 12px;">
                        You're receiving this email because you set up a job alert on Velocity.<br>
                        To manage your alerts, visit your dashboard.
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      // Plain text version for email clients that don't support HTML
      text: `
Hi ${userName},

We found ${jobs.length} new job${jobs.length > 1 ? 's' : ''} matching your alert for "${alertTitle}":

${jobs.map((job, i) => `${i + 1}. ${job.title} at ${job.company}${job.location ? ` (${job.location})` : ''}\n   Apply: ${job.applyLink}`).join('\n\n')}

Good luck with your job search!

---
Velocity - Job Search Made Simple
      `.trim()
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Job alert email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending job alert email:', error);
    throw new Error(`Failed to send job alert email: ${error.message}`);
  }
};