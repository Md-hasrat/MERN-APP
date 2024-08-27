import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import cloudinary from "cloudinary";


export const postApplication = catchAsyncErrors(async (req, res, next) => {
  if (!req.user) {
      return next(new ErrorHandler("Not authenticated. Please login first.", 401));
  }

  const { role } = req.user;
  if (role === "Employer") {
      return next(new ErrorHandler("Employer not allowed to access this resource.", 403));
  }

  if (!req.files || Object.keys(req.files).length === 0) {
      return next(new ErrorHandler("Resume File Required!", 400));
  }

  const { resume } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
  if (!allowedFormats.includes(resume.mimetype)) {
      return next(new ErrorHandler("Invalid file type. Please upload a PDF, PNG, JPEG, or WEBP file.", 400));
  }

  let cloudinaryResponse;
  try {
      cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath, {
          resource_type: "auto",
      });
  } catch (error) {
      console.error("Cloudinary Error:", error);
      return next(new ErrorHandler("Failed to upload Resume to Cloudinary", 500));
  }

  const { name, email, coverLetter, phone, address, jobId } = req.body;

  if (!name || !email || !coverLetter || !phone || !address || !jobId) {
      return next(new ErrorHandler("Please fill all fields.", 400));
  }

  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
      return next(new ErrorHandler("Job not found!", 404));
  }

  const applicantID = {
      user: req.user._id,
      role: "Job Seeker",
  };

  const employerID = {
      user: jobDetails.postedBy,
      role: "Employer",
  };

  const application = await Application.create({
      name,
      email,
      coverLetter,
      phone,
      address,
      applicantID,
      employerID,
      resume: {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
      },
  });

  res.status(200).json({
      success: true,
      message: "Application Submitted!",
      application,
  });
});

export const employerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "employerID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "applicantID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerDeleteApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("Application not found!", 404));
    }
    await application.deleteOne();
    res.status(200).json({
      success: true,
      message: "Application Deleted!",
    });
  }
);