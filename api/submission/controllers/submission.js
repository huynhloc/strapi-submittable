"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  /**
   * handle zapier
   *
   */
  async submitSubmission(ctx) {
    const {
      submissionId,
      projectId,
      submitterId,
      submitterFirstName,
      submitterLastName,
      submitterEmail,
      submissionTitle,
    } = ctx.request.body;

    const entity = await strapi.services.submission.create({
      submissionId,
      projectId,
      submitterId,
      submitterFirstName,
      submitterLastName,
      submitterEmail,
      submissionTitle,
    });
    return sanitizeEntity(entity, { model: strapi.models.submission });
  },

  /**
   * sync submission
   *
   */
  async syncSubmissionsFromSubmittable() {
    const numOfSubmission =
      await strapi.services.submission.syncSubmissionsFromSubmittable(
        process.env.SUBMITTABLE_PROJECTS
      );
    return numOfSubmission;
  },

  /**
   * Override default
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.submission.findOne({ id });
    const result = sanitizeEntity(entity, { model: strapi.models.submission });
    if (result.submittableMetaData?.submissionId) {
      const detail =
        await strapi.services.submission.findSubmissionDetailFromSubmittable(
          result.submittableMetaData?.submissionId
        );
      result.submittableDetailData = detail;
    }
    return result;
  },
};
