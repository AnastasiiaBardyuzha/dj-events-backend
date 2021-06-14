'use strict';
const { sanitizeEntity, parseMultipartData } = require('strapi-utils')

const { default: createStrapi } = require("strapi");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  // Create events with owner user only

  async create(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      data.user = ctx.state.user.id;
      entity = await strapi.services.events.create(data, { files });
    } else {
      ctx.request.body.user = ctx.state.user.id;
      entity = await strapi.services.events.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.events });
  },

  // Update events with owner user only

  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const [events] = await strapi.services.events.find({
      id: ctx.params.id,
      'user.id': ctx.state.user.id,
    });

    if (!events) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.events.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.events.update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.events });
  },

  // Delete events with owner user only

  async delete(ctx) {
    const { id } = ctx.params;

    const [events] = await strapi.services.events.find({
      id: ctx.params.id,
      "user.id": ctx.state.user.id,
    });

    if (!events) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    const entity = await strapi.services.events.delete({ id });
    return sanitizeEntity(entity, { model: strapi.models.events });
  },

  //  Get Logged in users 

  async me(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.badRequest(null, [
        { massages: [{id: 'No authorization heder was found'}] },
      ])
    }

    const data = await strapi.services.events.find({user: user.id});

    if (!data) {
      return ctx.notFound();
    }

    return sanitizeEntity(data, {model: strapi.models.events})
  }
};
