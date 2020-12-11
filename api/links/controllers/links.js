'use strict';
const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {

    async create(ctx) {
        // você só pode criar um link na sua propria empresa
        ctx.request.body.company = ctx.state.user.company;
        const entity = await strapi.services.links.create(ctx.request.body);
        return sanitizeEntity(entity, { model: strapi.models.links });
    },

    async find(ctx) {
        // você só pode buscar os links vinculados a sua empresa
        const company = ctx.state.user.company;        
        
        let entities;
        ctx.query['company'] = company;
        if (ctx.query._q) {
          console.log('Entrou aqui: search');
          entities = await strapi.services.links.search(ctx.query);
        } else {
          console.log('Entrou aqui: find');
          entities = await strapi.services.links.find(ctx.query);
        }
    
        return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.links }));
    },
    
};
