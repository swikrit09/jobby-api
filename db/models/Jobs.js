const mongoose = require("mongoose");

const jobsSchema = new mongoose.Schema({
    "_id": {
      "$oid": String
    },
    "job_details": {
      "id": String,
      "title": String,
      "company_logo_url": String,
      "company_website_url": String,
      "rating": Number,
      "location": String,
      "package_per_annum": String,
      "job_description": String,
      "skills": [
        {
          "name": String,
          "image_url": String
        }
      ],
      "life_at_company": {
        "description": String,
        "image_url": String
      },
      "employment_type": String
    },
    "similar_jobs": [
      {
        "id": String,
        "title": String,
        "company_logo_url": String,
        "location": String,
        "employment_type": String,
        "job_description": String,
        "rating": Number
      }
    ]
  }
)  

const Jobs = new mongoose.model("job", jobsSchema);

module.exports = Jobs;