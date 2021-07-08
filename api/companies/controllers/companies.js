"use strict";
const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findOne(ctx) {
    const { id } = ctx.params;

    if (parseInt(id) !== ctx.state.user.company) {
      return null;
    }

    const entity = await strapi.services.companies.findOne({
      id,
    });
    return sanitizeEntity(entity, { model: strapi.models.companies });
  },

  async create(ctx) {
    // você não pode se vincular a outra empresa
    if (ctx.state.user.company) {
      return ctx.throw(400, "Você já está vinculado a uma empresa.");
    }

    // uma empresa só pode ser criada vinculada ao usuário logado
    ctx.request.body.users = [ctx.state.user.id];

    const entity = await strapi.services.companies.create(ctx.request.body);
    return sanitizeEntity(entity, { model: strapi.models.companies });
  },

  async update(ctx) {
    const { id } = ctx.params;

    // você não pode atualizar uma empresa que não está vinculada a você
    if (ctx.state.user.company !== parseInt(id)) {
      return ctx.throw(
        400,
        "Você não pode atualizar uma empresa que não está vinculada a seu usuário."
      );
    }

    if (ctx.request.body.users) {
      const usersIds = [...ctx.request.body.users];

      // removendo o usuario logado da lista
      usersIds.splice(usersIds.indexOf(ctx.state.user.id), 1);

      //você não pode vincular um usuario que está vinculado a outra empresa
      const users = await strapi
        .query("user", "users-permissions")
        .find({ id_in: usersIds, company_null: false });

      if (users && users.length > 0) {
        const usersWithoutCompany = users.map((user) => user.id);
        return ctx.throw(
          400,
          `O usuário selecionado já está vinculado a uma empresa. Usuarios: ${usersWithoutCompany}`
        );
      }
    }

    const entity = await strapi.services.companies.update(
      { id },
      ctx.request.body
    );

    return sanitizeEntity(entity, { model: strapi.models.companies });
  },

  async delete(ctx) {
    return ctx.throw(400, "Não é possível deletar uma empresa.");
  },
};
