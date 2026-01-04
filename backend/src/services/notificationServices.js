import { getJobs } from "../controllers/jobFetch.js";
import { sendMatchingJobMail } from "./mailService.js";

export const Agent_24_7_Jobs = async (req, res) => {
  const user = req.user;
  try {
    const similarJobs = async () => {
      const jobs = await getJobs(user.jobRole);
      console.log("Similar Jobs for", user.username, ":", jobs.data);
      
      if (jobs.data && jobs.data.length > 0) {
        const job = jobs.data[0];
        await sendMatchingJobMail({
          userEmail: user.email,
          userName: user.username,
          jobTitle: job.title,
          companyName: job.companyName,
          jobDescription: job.description,
          jobLocation: job.location,
          jobType: job.jobType,
          salary: job.salary,
          applyLink: job.applyLink || job.link,
          postedDate: job.postedDate
        });
      }
    };
    const interval = 10000; 
    setInterval(similarJobs, interval);
  } catch (error) {}
};
