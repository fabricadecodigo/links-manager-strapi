"use strict";
const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    // você só pode buscar os links vinculados a sua empresa
    const company = ctx.state.user.company;

    let entities;
    ctx.query["company"] = company;
    if (ctx.query._q) {
      entities = await strapi.services.links.search(ctx.query);
    } else {
      entities = await strapi.services.links.find(ctx.query);
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.links })
    );
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.links.findOne({
      id,
      company: ctx.state.user.company,
    });

    return sanitizeEntity(entity, { model: strapi.models.companies });
  },

  async create(ctx) {
    // você só pode criar um link na sua propria empresa
    ctx.request.body.company = ctx.state.user.company;
    const entity = await strapi.services.links.create(ctx.request.body);
    return sanitizeEntity(entity, { model: strapi.models.links });
  },

  async update(ctx) {
    const { id } = ctx.params;

    ctx.request.body.company = ctx.state.user.company;

    const [link] = await strapi.services.links.find({
      id: ctx.params.id,
      "company.id": ctx.state.user.company,
    });

    if (!link) {
      return ctx.unauthorized(`Você não pode atualizar esse link`);
    }

    const entity = await strapi.services.links.update({ id }, ctx.request.body);

    return sanitizeEntity(entity, { model: strapi.models.links });
  },

  async delete(ctx) {
    const { id } = ctx.params;

    const [link] = await strapi.services.links.find({
      id: ctx.params.id,
      "company.id": ctx.state.user.company,
    });

    if (!link) {
      return ctx.unauthorized(`Você não pode deletar esse link`);
    }

    const entity = await strapi.services.links.delete({ id });
    return sanitizeEntity(entity, { model: strapi.models.links });
  },
};
