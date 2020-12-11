'use strict';
const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async create(ctx) {        
        // você não pode se vincular a outra empresa
        if (ctx.state.user.company) {
            return ctx.throw(400, 'Você já está vinculado a uma empresa.');
        }

        // uma empresa só pode ser criada vinculada ao usuário logado
        ctx.request.body.users = [ctx.state.user.id];

        //você não pode vincular um usuario que está vinculado a outra empresa        
        // const user = await strapi.query('user', 'users-permissions').findOne({ id: userId});
        // if (user.company) {
        //     return ctx.throw(400, 'Este usuário já está vinculado a uma empresa.');
        // }
        
        const entity = await strapi.services.companies.create(ctx.request.body);
        return sanitizeEntity(entity, { model: strapi.models.companies });
    },

    // implementar o update
};
