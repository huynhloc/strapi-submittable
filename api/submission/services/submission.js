"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

const axios = require("axios");

const submittableApi = axios.create({
  baseURL: `${process.env.SUBMITTABLE_API_URL}`,
});

submittableApi.interceptors.request.use((config) => {
  config = {
    ...config,
    auth: {
      username: "",
      password: process.env.SUBMITTABLE_API_KEY,
    },
  };
  return config;
});

submittableApi.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

module.exports = {
  async syncSubmissionsFromSubmittable(projectId) {
    await strapi.services.submission.delete();

    const { items } = await submittableApi.get("/submissions", {
      params: {
        pageSize: 50,
        page: 1,
        "Projects.Include": projectId,
      },
    });
    const promises = items?.map(
      ({
        submissionId,
        projectId,
        submitterId,
        submitterFirstName,
        submitterLastName,
        submitterEmail,
        submissionTitle,
      }) =>
        strapi.services.submission.create({
          submittableMetaData: {
            submissionId,
            projectId,
            submitterId,
            submitterFirstName,
            submitterLastName,
            submitterEmail,
            submissionTitle,
          },
        })
    );
    return Promise.all(promises).then((response) => response.length);
  },

  async findSubmissionDetailFromSubmittable(submissionId) {
    return submittableApi.get(`/submissions/${submissionId}`);
  },
};
